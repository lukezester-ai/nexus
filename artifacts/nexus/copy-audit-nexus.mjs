import { cpSync, mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(dir, "../..");
const src = path.resolve(repoRoot, "artifacts/audit-nexus/dist/public");
const dest = path.resolve(dir, "dist/public/audit-nexus");

mkdirSync(dest, { recursive: true });
cpSync(src, dest, { recursive: true });
console.log("Copied audit-nexus dist → nexus/dist/public/audit-nexus/");
