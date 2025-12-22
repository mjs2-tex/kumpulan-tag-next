import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false, // ubah true jika pakai cloud (Supabase, RDS, dll)
});

export default pool;
