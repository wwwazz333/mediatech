import { Router } from "express";
import booksRouter from './routes/books';
const router = Router();


// Routes
router.use('/books', booksRouter);

export default router;