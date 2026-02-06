import express from "express";
import { log } from "../controller/log.js";

const router = express.Router()

router.get('/log',log)

export default router