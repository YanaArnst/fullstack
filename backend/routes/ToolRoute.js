import express from "express";
import {
    getTools,
    getToolById,
    createTool,
    updateTool,
    deleteTool
} from "../controllers/Tools.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/tools', verifyUser, getTools);
router.get('/tools/:id', verifyUser, getToolById);
router.post('/tools', verifyUser, createTool);
router.patch('/tools/:id', verifyUser, updateTool);
router.delete('/tools/:id', verifyUser, deleteTool);

export default router;