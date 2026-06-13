import amqp from 'amqplib';
import { v4 as uuidv4 } from 'uuid';

let connection: amqp.Connection | null = null;
let channel: amqp.Channel | null = null;

const host = process.env.RABBITMQ_HOST || 'localhost';
const RABBIT_URL = process.env.RABBIT_URL || `amqp://nexus:nexus123@${host}:5672`;
const EXCHANGE = 'nexus.events';
const QUEUE_PREFIX = 'nexus.';

export async function connectAmqp() {
  if (connection && channel) return { channel, connection };
  try {
    connection = await amqp.connect(RABBIT_URL);
    channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE, 'topic', { durable: true });
    console.log(`✅ Connected to RabbitMQ at ${RABBIT_URL}`);
    return { channel, connection };
  } catch (error) {
    console.error(`❌ RabbitMQ Connection Failed:`, error);
    throw error;
  }
}

export async function publishEvent(eventType: string, data: any, correlationId: string | null = null) {
  const { channel } = await connectAmqp();
  const cId = correlationId || uuidv4();
  const message = Buffer.from(JSON.stringify({
    eventType,
    timestamp: new Date().toISOString(),
    correlationId: cId,
    data
  }));
  channel!.publish(EXCHANGE, eventType, message, { persistent: true });
  console.log(`[PUBLISH] ${eventType} (ID: ${cId})`);
  return cId;
}

export async function subscribeEvent(eventType: string, serviceName: string, callback: (event: any) => Promise<void>) {
  const { channel } = await connectAmqp();
  const queueName = `${QUEUE_PREFIX}${serviceName}.${eventType.replace(/\./g, '_')}`;
  await channel!.assertQueue(queueName, { durable: true });
  await channel!.bindQueue(queueName, EXCHANGE, eventType);
  
  channel!.consume(queueName, async (msg) => {
    if (!msg) return;
    const content = JSON.parse(msg.content.toString());
    try {
      await callback(content);
      channel!.ack(msg);
    } catch (err) {
      console.error(`Error processing ${eventType}:`, err);
      // Requeue on failure
      channel!.nack(msg, false, true);
    }
  });
  console.log(`[SUBSCRIBE] ${serviceName} listening to ${eventType} on queue ${queueName}`);
}
