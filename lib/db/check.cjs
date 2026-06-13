const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://nexus:nexus123@localhost:5432/nexus' });

pool.query('SELECT step, status, data FROM saga_state ORDER BY updated_at DESC LIMIT 5')
  .then(res => {
    console.log(JSON.stringify(res.rows, null, 2));
    pool.end();
  })
  .catch(err => {
    console.error(err);
    pool.end();
  });
