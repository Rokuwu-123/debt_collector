import express from "express";
import { dataDebitur } from "../controller/debitur.js";

const router = express.Router()

router.get('/debitur/data',dataDebitur)

export default router