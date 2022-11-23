import jwt from 'jsonwebtoken';

const createToken = (id) => {
    return jwt.sign({ _id: id }, process.env.SECRET, { expiresIn: '6h' });
}

// login
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        //const user = await User.login(email, password);

        //const token = createToken(user._id);

        //res.status(200).json({ email, token });
        res.status(200).json({ email, token: 123 });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// signup
export const signupUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        //const user = await User.signup(email, password);

        //const token = createToken(user._id);

        //res.status(200).json({ email, token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}