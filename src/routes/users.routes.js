import { Router } from "express";
import { getUsers, getUser, createUser, deleteUser, editUser } from "../controllers/user.controllers.js";

const router = Router();

router.get('/users', getUsers);

router.get('/users/:userID', getUser);

router.post('/users', createUser);

router.delete('/users/:userID', deleteUser);

router.put('/users/:userID', editUser);

export default router;