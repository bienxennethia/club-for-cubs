const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgres://default:F1fIsVLuHK9r@ep-young-wave-a4ncn299-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require",
})

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

module.exports = pool;
