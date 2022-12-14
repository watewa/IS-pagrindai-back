import mysql from 'mysql2/promise';

export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);
        const connection = await mysql.createConnection(process.env.DATABASE_URL);
        const query = `SELECT * FROM Uzsakymas WHERE id_Uzsakymas='${id}'`;
        const [rows] = await connection.query(query);
        if (rows.length == 0) {
            connection.end();
            throw Error("Užsakymas neegzistuoja");
        }
        await connection.query(`DELETE FROM Uzsakymas WHERE id_Uzsakymas = '${id}'`);
        connection.end();

        res.status(200).json({
            success: true
        });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
}

export const getAllOrders = async (req, res) => {
    try {
        const connection = await mysql.createConnection(process.env.DATABASE_URL);
        const query = "SELECT * FROM Uzsakymas";
        const [rows] = await connection.query(query);
        connection.end();
        res.status(200).json({
            orders: rows
        });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
}

export const getOrdersByUserId = async (req, res) => {
    try {
        const { uid } = req.params;
        const connection = await mysql.createConnection(process.env.DATABASE_URL);
        const query = `SELECT * FROM Uzsakymas WHERE fk_Klientasid_Klientas='${uid}'`;
        const [rows] = await connection.query(query);
        connection.end();
        res.status(200).json({
            orders: rows
        });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
}

export const updateOrder = async (req, res) => {
    try {
        const { oid, busena } = req.body;
        console.log(req.body);
        if (!busena) {
            throw Error("Busena negali būti tuščia");
        }
        const connection = await mysql.createConnection(process.env.DATABASE_URL);
        const [rows] = await connection.query(`SELECT * FROM Uzsakymas WHERE id_Uzsakymas='${oid}'`);
        if (rows.length == 0) throw Error("Užsakymas neegzistuoja");
        const query = `UPDATE Uzsakymas SET 
            busena='${busena}'
            WHERE id_Uzsakymas='${oid}'`;
        await connection.query(query);
        connection.end();
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export const createOrder = async (req, res) => {
    try {
        const { data, busena, klientas } = req.body;
        if (!data) {
            throw Error("Data negali būti tuščia");
        }
        if (!busena) {
            throw Error("Būsena negali būti tuščia");
        }
        if (!klientas) {
            throw Error("Klientas negali būti tuščias");
        }
        const connection = await mysql.createConnection(process.env.DATABASE_URL);
        const query = `INSERT INTO Uzsakymas (nr, sukurimo_data, busena, fk_Klientasid_Klientas) VALUES (
            '${0}',
            '${data}',
            '${busena}',
            '${klientas}'
        )`;
        await connection.query(query);
        await connection.query(`UPDATE Uzsakymas SET nr = id_Uzsakymas`);
        connection.end();
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}