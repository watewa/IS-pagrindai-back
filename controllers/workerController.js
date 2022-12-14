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
            throw Error("Vardas negali b??ti tus??ias");
        }
        if (!id) {
            throw Error("Vartotojas negali b??ti tus??ias");
        }
        if (!pavarde) {
            throw Error("Pavard?? negali b??ti tus??ia");
        }
        if (!pastas) {
            throw Error("El. pa??tas negali b??ti tus??ias");
        }
        if (!pastoKodas) {
            throw Error("Pa??to kodas negali b??ti tus??ias");
        }
        if (!adresas) {
            throw Error("Adresas negali b??ti tus??ias");
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
            throw Error("Vardas negali b??ti tus??ias");
        }
        if (!id) {
            throw Error("Vartotojas negali b??ti tus??ias");
        }
        if (!pavarde) {
            throw Error("Pavard?? negali b??ti tus??ia");
        }
        if (!pastas) {
            throw Error("El. pa??tas negali b??ti tus??ias");
        }
        if (!pastoKodas) {
            throw Error("Pa??to kodas negali b??ti tus??ias");
        }
        if (!adresas) {
            throw Error("Adresas negali b??ti tus??ias");
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
    {title: "Palaistymas", description: "Palaistyti visas g??les", from: 10, to: 30},
    {title: "??lavimas", description: "Pasipyl?? ??em??s reikia su??luoti ir sutvarkyti viet??", from: 20, to: 50},
    {title: "Perk??limas", description: "Visos raudonos tulp??s turi b??ti perkeltos i?? sand??lio ?? parduotuv??.", from: 30, to: 60},
    {title: "Paruo??imas", description: "Bus i??ve??ama 21 pakuot??s alyv??. Reikia pakrauti ve??im??.", from: 32, to: 49},
    {title: "Prie??i??ra", description: "G??l??s aptvarkyti taip, kad jos b??t?? gra??esn??s.", from: 25, to: 40},
    {title: "Persodinimas", description: "Reikia alyvas persodinti ?? kitus vazonus.", from: 20, to: 50},
    {title: "I??pakavimas", description: "Atve??ta nauj?? alyv?? reikia jas pad??ti ?? vietas.", from: 30, to: 60},
    {title: "Pakeitimas", description: "Pakeisti parduotuv??je raudonas tulpes su sand??lyje esan??iomis alyvomis.", from: 32, to: 49},

    {title: "Palaistymas", description: "Palaistyti alyvas sand??lyje ir parduotuv??je.", from: 16, to: 36},
    {title: "Tvarkymas", description: "Nuvyto raudonos tulp??s reikia jas sutvarkyti.", from: 20, to: 50},
    {title: "Perk??limas", description: "Visos alyvos turi b??ti perkeltos i?? sand??lio ?? parduotuv??.", from: 30, to: 60},
    {title: "Paruo??imas", description: "Bus i??ve??ama 34 pakuot??s alyv??. Reikia pakrauti ve??im??.", from: 34, to: 60},
    {title: "Prie??i??ra", description: "Cinerijas aptvarkyti taip, kad jos b??t?? gra??esn??s.", from: 25, to: 40},
    {title: "Persodinimas", description: "Reikia Chrizantemas persodinti ?? kitus vazonus.", from: 20, to: 50},
    {title: "I??pakavimas", description: "Atve??ta nauj?? Erem??r?? reikia juos pad??ti ?? sand??l??.", from: 30, to: 60},
    {title: "Pakeitimas", description: "Pakeisti parduotuv??je alyvas su sand??lyje esan??iomis Eustomomis.", from: 32, to: 49},

    {title: "Palaistymas", description: "Palaistyti Eustomas sand??lyje.", from: 8, to: 19},
    {title: "Tvarkymas", description: "Nuvyto E??iuol??s reikia jas sutvarkyti.", from: 20, to: 50},
    {title: "Perk??limas", description: "65 Felicijos turi b??ti perkeltos i?? sand??lio ?? parduotuv??.", from: 30, to: 60},
    {title: "Paruo??imas", description: "Bus i??ve??ama 21 pakuot??s alyv??. Reikia pakrauti ve??im??.", from: 32, to: 49},
    {title: "Prie??i??ra", description: "Flioksus aptvarkyti taip, kad jie b??t?? gra??esni.", from: 25, to: 40},
    {title: "Persodinimas", description: "Reikia Fuksijus persodinti ?? kitus vazonus.", from: 20, to: 50},
    {title: "I??pakavimas", description: "Atve??ta Kalpoki?? reikia juos pad??ti ?? sand??l??.", from: 30, to: 60},
    {title: "Pakeitimas", description: "Pakeisti parduotuv??je Ro??es su sand??lyje Gloksinijomis.", from: 32, to: 49},

    {title: "Palaistymas", description: "Palaistyti Gloriozas parduotuv??je.", from: 16, to: 36},
    {title: "Tvarkymas", description: "Nuvyto Gumbin??s begonijos reikia jas sutvarkyti.", from: 20, to: 50},
    {title: "Perk??limas", description: "Gvazd??n??s turi b??ti perkeltos i?? sand??lio ?? parduotuv??.", from: 30, to: 60},
    {title: "Paruo??imas", description: "Bus i??ve??ama 13 Gvazdik?? pakuo??i??. Reikia pakrauti ve??im??.", from: 32, to: 49},
    {title: "Prie??i??ra", description: "Hiacintus aptvarkyti taip, kad jos b??t?? gra??esn??s.", from: 25, to: 40},
    {title: "Persodinimas", description: "Reikia Iksorus persodinti ?? kitus vazonus.", from: 20, to: 50},
    {title: "I??pakavimas", description: "Atve??ta Kosm??j?? reikia jas pad??ti ?? vietas.", from: 30, to: 60},
    {title: "Pakeitimas", description: "Pakeisti parduotuv??je Krinus su sand??lyje esan??iais Lamprantais.", from: 22, to: 49}
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