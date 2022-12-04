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
        if (rows.length == 0) {
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

const tasks = [
    {title: "Palaistymas", description: "Palaistyti visas gėles", from: 10, to: 30},
    {title: "Šlavimas", description: "Pasipylė žemės reikia sušluoti ir sutvarkyti vietą", from: 20, to: 50},
    {title: "Perkėlimas", description: "Visos raudonos tulpės turi būti perkeltos iš sandėlio į parduotuvę.", from: 30, to: 60},
    {title: "Paruošimas", description: "Bus išvežama 21 pakuotės alyvų. Reikia pakrauti vežimą.", from: 32, to: 49},
    {title: "Priežiūra", description: "Gėlės aptvarkyti taip, kad jos būtų gražesnės.", from: 25, to: 40},
    {title: "Persodinimas", description: "Reikia alyvas persodinti į kitus vazonus.", from: 20, to: 50},
    {title: "Išpakavimas", description: "Atvežta naujų alyvų reikia jas padėti į vietas.", from: 30, to: 60},
    {title: "Pakeitimas", description: "Pakeisti parduotuvėje raudonas tulpes su sandėlyje esančiomis alyvomis.", from: 32, to: 49},

    {title: "Palaistymas", description: "Palaistyti alyvas sandėlyje ir parduotuvėje.", from: 16, to: 36},
    {title: "Tvarkymas", description: "Nuvyto raudonos tulpės reikia jas sutvarkyti.", from: 20, to: 50},
    {title: "Perkėlimas", description: "Visos alyvos turi būti perkeltos iš sandėlio į parduotuvę.", from: 30, to: 60},
    {title: "Paruošimas", description: "Bus išvežama 34 pakuotės alyvų. Reikia pakrauti vežimą.", from: 34, to: 60},
    {title: "Priežiūra", description: "Cinerijas aptvarkyti taip, kad jos būtų gražesnės.", from: 25, to: 40},
    {title: "Persodinimas", description: "Reikia Chrizantemas persodinti į kitus vazonus.", from: 20, to: 50},
    {title: "Išpakavimas", description: "Atvežta naujų Eremūrų reikia juos padėti į sandėlį.", from: 30, to: 60},
    {title: "Pakeitimas", description: "Pakeisti parduotuvėje alyvas su sandėlyje esančiomis Eustomomis.", from: 32, to: 49},

    {title: "Palaistymas", description: "Palaistyti Eustomas sandėlyje.", from: 8, to: 19},
    {title: "Tvarkymas", description: "Nuvyto Ežiuolės reikia jas sutvarkyti.", from: 20, to: 50},
    {title: "Perkėlimas", description: "65 Felicijos turi būti perkeltos iš sandėlio į parduotuvę.", from: 30, to: 60},
    {title: "Paruošimas", description: "Bus išvežama 21 pakuotės alyvų. Reikia pakrauti vežimą.", from: 32, to: 49},
    {title: "Priežiūra", description: "Flioksus aptvarkyti taip, kad jie būtų gražesni.", from: 25, to: 40},
    {title: "Persodinimas", description: "Reikia Fuksijus persodinti į kitus vazonus.", from: 20, to: 50},
    {title: "Išpakavimas", description: "Atvežta Kalpokių reikia juos padėti į sandėlį.", from: 30, to: 60},
    {title: "Pakeitimas", description: "Pakeisti parduotuvėje Rožes su sandėlyje Gloksinijomis.", from: 32, to: 49},

    {title: "Palaistymas", description: "Palaistyti Gloriozas parduotuvėje.", from: 16, to: 36},
    {title: "Tvarkymas", description: "Nuvyto Gumbinės begonijos reikia jas sutvarkyti.", from: 20, to: 50},
    {title: "Perkėlimas", description: "Gvazdūnės turi būti perkeltos iš sandėlio į parduotuvę.", from: 30, to: 60},
    {title: "Paruošimas", description: "Bus išvežama 13 Gvazdikų pakuočių. Reikia pakrauti vežimą.", from: 32, to: 49},
    {title: "Priežiūra", description: "Hiacintus aptvarkyti taip, kad jos būtų gražesnės.", from: 25, to: 40},
    {title: "Persodinimas", description: "Reikia Iksorus persodinti į kitus vazonus.", from: 20, to: 50},
    {title: "Išpakavimas", description: "Atvežta Kosmėjų reikia jas padėti į vietas.", from: 30, to: 60},
    {title: "Pakeitimas", description: "Pakeisti parduotuvėje Krinus su sandėlyje esančiais Lamprantais.", from: 22, to: 49}
];

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const createTasks = async (conn, id) => {
    const taskAmount = Math.floor(Math.random() * 10 + 3);
    let taskIds = [];
    for(let i = 0; i < taskAmount; i++){
        const id = Math.floor(Math.random() * tasks.length);
        if(taskIds.includes(id)){
            i--;
            continue;
        }
        taskIds.push(id);
    }
    const curr = new Date();
    const fromTime = new Date(`${curr.getFullYear()}-${curr.getMonth()+1}-${curr.getDate()} 11:00:00`);
    const toTime = new Date(`${curr.getFullYear()}-${curr.getMonth()+1}-${curr.getDate()} 13:00:00`);
    let startTime = randomDate(fromTime, toTime);

    for(let i = 0; i < taskAmount; i++){
        const currTime = new Date().toJSON().slice(0, 19).replace('T', ' ');
        const task = tasks[taskIds[i]];
        const duration = Math.floor(Math.random() * (task.to - task.from) + task.from);
        
        conn.query(
            `INSERT INTO Uzduotis 
            (sukurimo_data, pavadinimas, pradzios_laikas, trukme, paaiskinimas, fk_Dienos_grafikasid_Dienos_grafikas) VALUES (
                '${currTime}',
                '${task.title}',
                '${startTime.toJSON().slice(0, 19).replace('T', ' ')}',
                '${duration}',
                '${task.description}',
                '${id}'
            )`);
        
        startTime = new Date(startTime.getTime() + Math.floor(Math.random() * 20 + 10 + duration) * 1000 * 60);
    }
}

const createSchedule = async (conn, id) => {
    const currTime = new Date().toJSON().slice(0, 19).replace('T', ' ');
    const rs = await conn.query(`INSERT INTO Dienos_grafikas (sukurimo_data, diena, fk_Darbuotojasid_Darbuotojas) VALUES ('${currTime}', '${new Date().toISOString().split('T')[0]}', '${id}')`);
    const [rows] = await conn.query(`SELECT * FROM Dienos_grafikas WHERE id_Dienos_grafikas='${rs[0].insertId}'`);
    await createTasks(conn, rs[0].insertId);
    return rows;
}

export const getSchedule = async (req, res) => {
    try {
        const { id_Vartotojas } = req.user;
        const connection = await mysql.createConnection(process.env.DATABASE_URL);
        let [rows] = await connection.query(`SELECT * FROM Dienos_grafikas WHERE fk_Darbuotojasid_Darbuotojas='${id_Vartotojas}' AND diena='${new Date().toISOString().split('T')[0]}'`);

        if (rows.length == 0) {
            rows = await createSchedule(connection, id_Vartotojas);
        }
        const [uzd] = await  connection.query(`SELECT * FROM Uzduotis WHERE fk_Dienos_grafikasid_Dienos_grafikas=${rows[0].id_Dienos_grafikas}`)
        connection.end();
        console.log(uzd);
        res.status(200).json({ uzd });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}