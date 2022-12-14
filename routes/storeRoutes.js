import express from 'express';
import { GetAllStores, CreateStore, GetStoreById, EditStore, DeleteStore} from '../controllers/storeController.js';
import { requireAuth, requireStore } from '../middleware/useAuth.js';

export const storeRouter = express.Router();

//require auth for all routes
storeRouter.use(requireAuth);
// must be a store or admin
storeRouter.use(requireStore);

storeRouter.get("/", GetAllStores);

storeRouter.post("/new", CreateStore);

storeRouter.get("/store/:id", GetStoreById);

storeRouter.post("/edit", EditStore);

storeRouter.delete("/:id", DeleteStore);