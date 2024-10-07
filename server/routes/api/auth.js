import express from 'express'
import {register,login, logout, refresh,user} from "../../controllers/auth.js";
const router = express.Router();
import auth from "../../middleware/auth.js";
router.post('/register',register);

router.post('/login',login);

router.post('/logout',logout);

router.post('/refresh',refresh);

router.get('/user',auth,user);

export default router;
