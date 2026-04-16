const postgres = require('postgres');

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error(
    'Missing POSTGRES_URL. Create `.env.local` from your Vercel Secret Snippet before running this test.',
  );
}

const sql = postgres(connectionString, { ssl: 'require' });

async function main() {
  try {
    const result = await sql`
      SELECT
        current_database() AS database_name,
        current_user AS db_user,
        NOW() AS connected_at,
        version() AS postgres_version
    `;

    const row = result[0];

    console.log('Database connection successful.');
    console.log(`Database : ${row.database_name}`);
    console.log(`User     : ${row.db_user}`);
    console.log(`Connected: ${row.connected_at}`);
    console.log(`Version  : ${row.postgres_version}`);
  } catch (error) {
    console.error('Database connection failed.');
    console.error(error);
    process.exitCode = 1;
  } finally {
    await sql.end();
  }
}

main();
