import { Router } from "express";
const router = Router();

/* GET users listing. */
router.get('/', function (req, res) {
	res.send('books');
});

export default router; 
