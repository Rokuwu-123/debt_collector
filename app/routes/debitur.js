import express from "express";
import { dataDebitur, payment, histori } from "../controller/debitur.js";

const router = express.Router()

router.get('/debitur/data',dataDebitur)
router.post('/debitur/payment',payment)
router.get('/histori',histori)

export default router