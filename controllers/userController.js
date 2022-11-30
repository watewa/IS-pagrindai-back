import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import validator from 'validator';

const createToken = (id) => {
    return jwt.sign({ _id: id }, process.env.SECRET, { expiresIn: '6h' });
}

// login
export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            throw Error("Užpildykite visus laukus");
        }
        const connection = await mysql.createConnection(process.env.DATABASE_URL);
        const query = `SELECT * FROM Vartotojas WHERE Prisijungimo_vardas = '${username}'`;
        const [rows] = await connection.query(query);
        if (rows.length == 0) {
            connection.end();
            throw Error("Tokio vartotojo nėra");
        }

        const match = await bcrypt.compare(password, rows[0].Slaptazodis);
        if (!match) {
            connection.end();
            throw Error("Neteisingas slaptažodis");
        }

        const token = createToken(rows[0].id_Vartotojas);
        let wid = null; // worker id
        if(rows[0].tipas == 2){
            const [rws] = await connection.query(`SELECT * FROM Darbuotojas WHERE fk_Vartotojas=${rows[0].id_Vartotojas}`)
            if(rws.length == 0){
                throw Error("Nera tokio darbuotojo");
            }
            wid = rws[0].id_Darbuotojas;
        }
        connection.end();

        res.status(200).json({
            wid,
            username, 
            token, 
            tipas: rows[0].tipas, 
            _id: rows[0].id_Vartotojas 
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// signup
export const signupUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            throw Error("Užpildykite visus laukus");
        }
        if (!validator.matches(username, "^[a-zA-Z0-9_\.\-]*$")) {
            console.log('Slapyvardis netinkamas');
        }
        if (!validator.isStrongPassword(password, { minLowercase: 0, minUppercase: 0, minNumbers: 0, minSymbols: 0 })) {
            throw Error("Slaptazodis per trumpas");
        }
        // sql injection still is possible :( whatever

        const connection = await mysql.createConnection(process.env.DATABASE_URL);
        const query = `SELECT * FROM Vartotojas WHERE Prisijungimo_vardas = '${username}'`;
        const [rows] = await connection.query(query);
        if (rows.length != 0) {
            throw Error("Vartotojas egzistuoja");
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const rs = await connection.query(`INSERT INTO Vartotojas (Prisijungimo_vardas, Slaptazodis, tipas) VALUES ('${username}', '${hash}', 0)`);
        const token = createToken(rs[0].insertId);
        connection.end();

        res.status(200).json({
            wid: null,
            username,
            tipas: 0,
            token,
            _id: rs[0].insertId
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}