import mysql from 'mysql2/promise';

export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
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
        const query = "select nr, sukurimo_data	, busena, id_Uzsakymas, CONCAT(Vardas, ' ', Pavarde) as VarPav from Uzsakymas inner join Klientas on Uzsakymas.fk_Klientasid_Klientas=Klientas.id_Klientas";
        
        const [rows] = await connection.query(query);
        var subQuery = ``;
        for (let i = 0; i<rows.length; i++){
            subQuery = `SELECT * FROM Uzsakymo_preke
                        INNER JOIN Preke ON Uzsakymo_preke.fk_Prekeid_Preke=Preke.id_Preke
                        WHERE fk_Uzsakymasid_Uzsakymas='${rows[i].id_Uzsakymas}';`;
            const [rows2] = await connection.query(subQuery);
            rows[i].products = rows2;
        }
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
        const { data, busena, klientas, prekes, kiekiai } = req.body;
        for(let i = 0; i<prekes.length; i++){
            if(prekes[i] == 'x' ){
                prekes.splice(i, 1)
                i--;
            }
        }
        for(let i = 0; i<prekes.length; i++){
            if(kiekiai[i] == 'x' ){
                kiekiai.splice(i, 1)
                i--;
            }
        }
        if(kiekiai.length !== prekes.length){
            throw Error("Netinkamas kiekių ir prekių skaičius");
        }
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
        var id = await (await connection.query(`select max(id_Uzsakymas) as result from Uzsakymas`));
        for (let i = 0; i<prekes.length; i++){
            var query2 = `INSERT INTO Uzsakymo_preke (Kiekis, fk_Prekeid_Preke, fk_Uzsakymasid_Uzsakymas) VALUES (
                '${kiekiai[i]}',
                '${prekes[i]}',
                '${id[0][0].result}'
            )`;
            await connection.query(query2);
        }

        connection.end();
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}