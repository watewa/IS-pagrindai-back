import express from 'express';
import { getAllOrders, deleteOrder, getOrdersByUserId, updateOrder, createOrder} from '../controllers/orderController.js';
import { requireAuth } from '../middleware/useAuth.js';

export const orderRouter = express.Router();

//require auth for all routes
orderRouter.use(requireAuth);

orderRouter.get("/", getAllOrders);

orderRouter.delete("/:id", deleteOrder);

orderRouter.post("/new", createOrder);

orderRouter.post("/update", updateOrder);

orderRouter.get("/:uid", getOrdersByUserId);
