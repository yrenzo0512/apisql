import pg from "pg";
import dotenv from "dotenv";

const {Pool} = pg;
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export default pool; // ✅ Exportar con "export default"




