import { Router } from "express";
import { deleteanswerchos, editanswerchoi, getanswercho, getanswerchos } from "../controllers/answer_choice.controller.js";

const router = Router();

router.get('/answer_choices',getanswerchos);

router.get('/answer_choices/:answer_choices_id',getanswercho);

router.delete('/answer_choices/:answer_choices_id',deleteanswerchos);

router.put('/answer_choices/:answer_choices_id',editanswerchoi);

export default router;