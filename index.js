import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config()

const app = express();
app.use(cors());
app.use(express.json());

import { workerRouter } from './routes/workerRoutes.js'
app.use("/api/workers", workerRouter);
app.get("/", (req, res) => {
    res.send({ message: "Im alive!" });
})

app.listen(process.env.PORT || 4000, () => {
    console.log(`port ${process.env.PORT || 4000}!`);
});
