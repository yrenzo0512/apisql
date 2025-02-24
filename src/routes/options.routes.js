import { Router } from "express";
import { createOption, deleteOption, editOption, getOption, getOptions } from "../controllers/options.controller.js";

const router = Router();

router.get('/option',getOptions);

router.get('/option/:option_id', getOption);

router.post('/option', createOption);

router.delete('/option/:option_id', deleteOption);

router.put('/option/:option_id', editOption);

export default router;