import mysql from 'mysql2/promise';

export const deleteWorker = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await mysql.createConnection(process.env.DATABASE_URL);
        const query = `SELECT * FROM Darbuotojas WHERE id_Darbuotojas='${id}'`;
        const [rows] = await connection.query(query);
        if (rows.length == 0) {
            connection.end();
            throw Error("Vartotojas neegzistuoja");
        }
        await connection.query(`UPDATE Vartotojas SET tipas=0 WHERE id_Vartotojas = ${rows[0].fk_Vartotojas}`);
        await connection.query(`DELETE FROM Darbuotojas WHERE id_Darbuotojas = '${id}'`);
        connection.end();

        res.status(200).json({
            success: true
        });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
}

export const getAllWorkers = async (req, res) => {
    try {
        const connection = await mysql.createConnection(process.env.DATABASE_URL);
        const query = "SELECT * FROM Darbuotojas";
        const [rows] = await connection.query(query);
        connection.end();
        res.status(200).json({
            workers: rows
        });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
}

export const getWorkerById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw Error("Netinkamas ID");
        }
        const connection = await mysql.createConnection(process.env.DATABASE_URL);
        const query = `SELECT * FROM Darbuotojas WHERE id_Darbuotojas = '${id}'`;
        const [rows] = await connection.query(query);
        connection.end();
        if(rows.length == 0){
            throw Error(`Darbuotojas su id=${id} nerastas`);
        }
        res.status(200).json({
            worker: rows[0]
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export const updateWorker = async (req, res) => {
    try {
        const { wid, id, vardas, pavarde, data, pastas, pastoKodas, adresas } = req.body;
        console.log(req.body);
        if (!vardas) {
            throw Error("Vardas negali būti tusčias");
        }
        if (!id) {
            throw Error("Vartotojas negali būti tusčias");
        }
        if (!pavarde) {
            throw Error("Pavardė negali būti tusčia");
        }
        if (!pastas) {
            throw Error("El. paštas negali būti tusčias");
        }
        if (!pastoKodas) {
            throw Error("Pašto kodas negali būti tusčias");
        }
        if (!adresas) {
            throw Error("Adresas negali būti tusčias");
        }
        const connection = await mysql.createConnection(process.env.DATABASE_URL);
        const [rows] = await connection.query(`SELECT * FROM Darbuotojas WHERE id_Darbuotojas='${wid}'`);
        if (rows.length == 0) throw Error("Darbuotojas neegzistuoja");
        await connection.query(`UPDATE Vartotojas SET tipas = 0 WHERE id_Vartotojas = ${rows[0].fk_Vartotojas}`);
        const query = `UPDATE Darbuotojas SET 
            vardas='${vardas}', 
            pavarde='${pavarde}', 
            gimimo_data='${data}', 
            el_pastas='${pastas}', 
            pasto_kodas='${pastoKodas}', 
            adresas='${adresas}', 
            fk_Vartotojas='${id}' 
            WHERE id_Darbuotojas='${wid}'`;
            
        await connection.query(query);
        await connection.query(`UPDATE Vartotojas SET tipas = 2 WHERE id_Vartotojas = ${id}`);
        connection.end();
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export const createWorker = async (req, res) => {
    try {
        const { id, vardas, pavarde, data, pastas, pastoKodas, adresas } = req.body;
        if (!vardas) {
            throw Error("Vardas negali būti tusčias");
        }
        if (!id) {
            throw Error("Vartotojas negali būti tusčias");
        }
        if (!pavarde) {
            throw Error("Pavardė negali būti tusčia");
        }
        if (!pastas) {
            throw Error("El. paštas negali būti tusčias");
        }
        if (!pastoKodas) {
            throw Error("Pašto kodas negali būti tusčias");
        }
        if (!adresas) {
            throw Error("Adresas negali būti tusčias");
        }
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
        await connection.query(query);
        await connection.query(`UPDATE Vartotojas SET tipas = 2 WHERE id_Vartotojas = ${id}`);
        connection.end();
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export const getUsers = async (req, res) => {
    try {
        const connection = await mysql.createConnection(process.env.DATABASE_URL);
        const [rows] = await connection.query(
            "SELECT * FROM Vartotojas LEFT JOIN Darbuotojas ON fk_Vartotojas=id_Vartotojas WHERE tipas=0");
        connection.end();
        const users = rows.map(w => ({ Prisijungimo_vardas: w.Prisijungimo_vardas, id_Vartotojas: w.id_Vartotojas }));
        res.status(200).json({ users });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}