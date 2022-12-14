import mysql from 'mysql2/promise';

export const DeleteStore = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await mysql.createConnection(process.env.DATABASE_URL);
        const query = `SELECT * FROM Parduotuve WHERE id_Parduotuve='${id}'`;
        const [rows] = await connection.query(query);
        if (rows.length == 0) {
            connection.end();
            throw Error("Vartotojas neegzistuoja");
        }
        await connection.query(`DELETE FROM Parduotuve WHERE id_Parduotuve = '${id}'`);
        connection.end();

        res.status(200).json({
            success: true
        });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
}

export const GetAllStores = async (req, res) => {
    try {
        const connection = await mysql.createConnection(process.env.DATABASE_URL);
        const query = "SELECT * FROM Parduotuve";
        const [rows] = await connection.query(query);
        connection.end();
        res.status(200).json({
            Stores: rows
        });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
}

export const GetStoreById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw Error("Netinkamas ID");
        }
        const connection = await mysql.createConnection(process.env.DATABASE_URL);
        const query = `SELECT * FROM Parduotuve WHERE id_Parduotuve = '${id}'`;
        const [rows] = await connection.query(query);
        connection.end();
        if (rows.length == 0) {
            throw Error(`Parduotuve su id=${id} nerastas`);
        }
        res.status(200).json({
            Store: rows[0]
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export const EditStore = async (req, res) => {
    try {
        const { vadovas, adresas } = req.body;
        if (!vadovas) {
            throw Error("Vadovas negali būti tusčias");
        }
        if (!adresas) {
            throw Error("Adresas negali būti tusčia");
        }
        
        const connection = await mysql.createConnection(process.env.DATABASE_URL);
        
        const query = `INSERT INTO Parduotuve (vadovas, adresas, fk_Pristatymasid_Pristatymas, fk_Darbuotojasid_Darbuotojas) VALUES (
            '${vadovas}',
            '${adresas}',
            '${Math.floor(Math.random()*10000)}',
            '${Math.floor(Math.random()*10000)}'
        )`;
        await connection.query(query);
        connection.end();
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export const CreateStore = async (req, res) => {
    try {
        const { vadovas, adresas } = req.body;
        if (!vadovas) {
            throw Error("Vadovas negali būti tusčias");
        }
        if (!adresas) {
            throw Error("Adresas negali būti tusčia");
        }
        
        const connection = await mysql.createConnection(process.env.DATABASE_URL);
        
        const query = `INSERT INTO Parduotuve (vadovas, adresas, fk_Pristatymasid_Pristatymas, fk_Darbuotojasid_Darbuotojas) VALUES (
            '${vadovas}',
            '${adresas}',
            '${Math.floor(Math.random()*10000)}',
            '${Math.floor(Math.random()*10000)}'
        )`;
        await connection.query(query);
        connection.end();
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
