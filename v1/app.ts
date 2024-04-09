import { Router } from "express";
import authorsRouter from './routes/authors';
import booksRouter from './routes/books';
const router = Router();


// Routes
router.use('/books', booksRouter);
router.use('/authors', authorsRouter);

export default router;