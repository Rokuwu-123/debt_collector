import express from "express";
import { dataDebitur, payment } from "../controller/debitur.js";

const router = express.Router()

router.get('/debitur/data',dataDebitur)
router.post('/debitur/payment',payment)

export default router