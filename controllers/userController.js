import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import  bcrypt from 'bcrypt';
import validator from 'validator';

const createToken = (id) => {
    return jwt.sign({ _id: id }, process.env.SECRET, { expiresIn: '6h' });
}

// login
export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        if(!username || !password){
            throw Error("Fill in all fields");
        }
        const connection = await mysql.createConnection(process.env.DATABASE_URL);
        const query = `SELECT * FROM Vartotojas WHERE Prisijungimo_vardas = '${username}'`;
        const [rows] = await connection.query(query);
        connection.end();
        if(rows.length == 0){
            throw Error("No such user");
        }

        const token = createToken(rows[0].id_Vartotojas);

        
        res.status(200).json({ username, token, tipas: rows[0].tipas });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// signup
export const signupUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        if(!username || !password){
            throw Error("Fill in all fields");
        }
        if (!validator.matches(username, "^[a-zA-Z0-9_\.\-]*$")) {
            console.log('Username not valid');
        }
        if(!validator.isStrongPassword(password, { minLowercase: 0, minUppercase: 0, minNumbers: 0, minSymbols: 0 })){
            throw Error("Password is weak");
        }
        // sql injection still is possible :( whatever

        const connection = await mysql.createConnection(process.env.DATABASE_URL);
        const query = `SELECT * FROM Vartotojas WHERE Prisijungimo_vardas = '${username}'`;
        const [rows] = await connection.query(query);
        if(rows.length != 0){
            throw Error("User exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const rs = await connection.query(`INSERT INTO Vartotojas (Prisijungimo_vardas, Slaptazodis, tipas) VALUES ('${username}', '${hash}', 0)`);
        const token = createToken(rs[0].insertId);
        connection.end();

        res.status(200).json({
            username, 
            tipas: 0,
            token
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}