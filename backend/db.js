const { spawnSync } = require('child_process');
const { createClient } = require('@libsql/client');

let client;
if (process.env.TURSO_URL && process.env.TURSO_AUTH_TOKEN) {
  client = createClient({
    url: process.env.TURSO_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
}

async function run(sql, params = []) {
  if (client) {
    try {
      const result = await client.execute({ sql, args: params });
      return result.rows.map(row => {
        const obj = {};
        for (const key of Object.keys(row)) {
          obj[key] = row[key];
        }
        return obj;
      });
    } catch (error) {
      console.error('Turso Database error executing:', sql);
      console.error(error.message);
      throw error;
    }
  } else {
    // Fallback to team-db CLI for local environment
    // Note: team-db CLI doesn't easily support params this way, 
    // so we'll just keep it simple for local dev and assume no params for now 
    // or just interpolate (not ideal but consistent with original code)
    return new Promise((resolve, reject) => {
      try {
        const result = spawnSync('team-db', [sql], { encoding: 'utf8' });
        if (result.error) throw result.error;
        if (result.status !== 0) {
          console.error('team-db failed:', result.stderr);
          throw new Error(result.stderr);
        }
        resolve(JSON.parse(result.stdout));
      } catch (error) {
        console.error('team-db Database error executing:', sql);
        console.error(error.message);
        reject(error);
      }
    });
  }
}

module.exports = { run };
