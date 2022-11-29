import mysql from 'mysql2/promise';

export const getAllWorkers = async (req, res) => {
    try {
        const connection = await mysql.createConnection(process.env.DATABASE_URL);
        const query = "SELECT * FROM Darbuotojas";
        const [rows] = await connection.query(query);
        connection.end();
        res.status(200).json({
            rows: rows
        });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
}

export const getWorkerById = async (req, res) => {
    try {
        const { id } = req.body;
        const connection = await mysql.createConnection(process.env.DATABASE_URL);
        const query = `SELECT * FROM Darbuotojas WHERE id_Vartotojas = '${id}`;
        const [rows] = await connection.query(query);
        connection.end();
        res.status(200).json({
            rows: rows
        });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
}

export const createWorker = async (req, res) => {
    try {
        console.log(req.user);
        const { id, vardas, pavarde, data, pastas, pastoKodas, adresas } = req.body;
        const connection = await mysql.createConnection(process.env.DATABASE_URL);
        const query = `INSERT INTO Darbuotojas (vardas, pavarde, gimimo_data, el_pastas, pasto_kodas, adresas, sukurimo_data, fk_Vartotojas) VALUES (
            '${vardas}',
            '${pavarde}',
            '${data}',
            '${pastas}',
            '${pastoKodas}',
            '${adresas}',
            '${new Date().toISOString()}',
            '${id}'
        )`;
        const [rows] = await connection.query(query);
        connection.end();
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}