import express from "express";
import {
    getClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient
} from "../controllers/Clients.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/clients', verifyUser, getClients);
router.get('/clients/:id', verifyUser, getClientById);
router.post('/clients', verifyUser, createClient);
router.patch('/clients/:id', verifyUser, updateClient);
router.delete('/clients/:id', verifyUser, deleteClient);

export default router;