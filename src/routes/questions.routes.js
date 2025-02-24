import { Router } from "express";
import { createQuestion, deleteQuestion, editQuestion, getQuestion, getQuestions } from "../controllers/questions.controller.js";

const router = Router();

router.get('/question',getQuestions);

router.get('/question/:question_id', getQuestion);

router.post('/question', createQuestion);

router.delete('/question/:question_id', deleteQuestion);

router.put('/question/:question_id', editQuestion);

export default router;