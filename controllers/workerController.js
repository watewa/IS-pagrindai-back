import mysql from 'mysql2/promise';

export const getAllWorkers = async (req, res) => {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    const query = "SELECT * FROM testers";
    const [rows] = await connection.query(query);
    res.status(200).json({
        rows: rows
    });
    connection.end();
}