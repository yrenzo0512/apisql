import { Router } from "express";
import { createResponse, deleteResponse, editResponse, getResponse, getResponses } from "../controllers/responses.controller.js";

const router = Router();

router.get('/response', getResponses);

router.get('/response/:response_id', getResponse);

router.post('/response', createResponse);

router.delete('/response/:response_id', deleteResponse);

router.put('/response/:response_id', editResponse);

export default router;