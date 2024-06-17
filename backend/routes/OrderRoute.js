import express from "express";
import {
    getOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    getRentalTemplate,
    getClientSurname
} from "../controllers/Orders.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/orders', verifyUser, getOrders);
router.get('/orders/:id', verifyUser, getOrderById);
router.post('/orders', verifyUser, createOrder);
router.patch('/orders/:id', verifyUser, updateOrder);
router.delete('/orders/:id', verifyUser, deleteOrder);
router.get('/orders/:id/rental-template', verifyUser, getRentalTemplate)
router.get('/orders/:id/client-surname', verifyUser, getClientSurname)

export default router;