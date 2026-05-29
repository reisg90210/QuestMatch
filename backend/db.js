const { createClient } = require('@libsql/client');

let client;
// Use Turso if credentials provided, otherwise fallback to local sqlite file
const url = process.env.TURSO_URL || 'file:local.db';
const authToken = process.env.TURSO_AUTH_TOKEN || '';

client = createClient({
  url: url,
  authToken: authToken,
});

async function run(sql, params = []) {
  try {
    const result = await client.execute({ sql, args: params });
    // Normalize rows to standard JS objects
    return result.rows.map(row => {
      const obj = {};
      Object.keys(row).forEach(key => {
        obj[key] = row[key];
      });
      return obj;
    });
  } catch (error) {
    console.error('Database error executing:', sql);
    console.error(error.message);
    throw error;
  }
}

module.exports = { run };
