import express from "express";
import { getSearch } from "../controllers/Search.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/search', verifyUser, getSearch);

export default router;