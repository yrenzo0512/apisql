import { Router } from "express";
import { createAnswer, deleteanswer, editanswer, getanswer, getanswers } from "../controllers/answer.controller.js";

const router = Router();

router.get('/answer',getanswers);

router.get('/answer/:answer_id',getanswer);

router.post('/answer', createAnswer);

router.delete('/answer/:answer_id',deleteanswer);

router.put('/answer/:userID', editanswer);

export default router;