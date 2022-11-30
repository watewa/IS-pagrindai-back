import express from 'express';
import { getAllWorkers, createWorker, getUsers, getWorkerById, updateWorker, deleteWorker} from '../controllers/workerController.js';
import { requireAuth, requireWorker } from '../middleware/useAuth.js';

export const workerRouter = express.Router();

//require auth for all routes
workerRouter.use(requireAuth);
// must be a worker or admin
workerRouter.use(requireWorker);

workerRouter.get("/", getAllWorkers);

workerRouter.post("/new", createWorker);

workerRouter.get("/users", getUsers);

workerRouter.get("/worker/:id", getWorkerById);

workerRouter.post("/update", updateWorker);

workerRouter.delete("/:id", deleteWorker);