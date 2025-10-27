import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import ws from 'ws';

async function runMigrations() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  // Configure WebSocket for Neon database connection
  if (process.env.NODE_ENV !== 'production') {
    neonConfig.webSocketConstructor = ws;
  }

  console.log('⏳ Running migrations...');
  
  const pool = new Pool({ connectionString });
  const db = drizzle({ client: pool });

  await migrate(db, { migrationsFolder: './migrations' });
  
  console.log('✅ Migrations completed successfully!');
  
  await pool.end();
  process.exit(0);
}

runMigrations().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
