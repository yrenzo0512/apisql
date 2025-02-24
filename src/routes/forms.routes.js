import { Router } from "express";
import { createForm, deleteForm, editForm, getForm, getForms } from "../controllers/forms.controllers.js";

const router = Router();

router.get('/form',getForms);

router.get('/form/:form_id', getForm);

router.post('/form', createForm);

router.delete('/form/:form_id', deleteForm);

router.put('/form/:userID', editForm);

export default router;