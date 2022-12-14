import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';

export const requireAuth = async (req, res, next) => {
    // verify authentication
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: "Authorization token is missing" });
    }

    const token = authorization.split(' ')[1];

    try {
        const { _id } = jwt.verify(token, process.env.SECRET);
        const connection = await mysql.createConnection(process.env.DATABASE_URL);
        const query = `SELECT * FROM Vartotojas WHERE id_Vartotojas = '${_id}'`;
        const [rows] = await connection.query(query);
        connection.end();
        req.user = rows[0];

        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({ error: "Neturite teisių" });
    }
}

const allowedTypes = [2, 42];
export const requireWorker = (req, res, next) => {
    if (!allowedTypes.includes(req.user.tipas)) {
        return res.status(401).json({ error: "Neturite teisių šiai operacijai" });
    }
    next();
}
export const requireStore = (req, res, next) => {
    if (!allowedTypes.includes(req.user.tipas)) {
        return res.status(401).json({ error: "Neturite teisių šiai operacijai" });
    }
    next();
}