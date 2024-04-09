import { Router } from "express";
import authorsRouter from './routes/authors';
import booksRouter from './routes/books';
import borrowsRouter from './routes/borrows';
const router = Router();


// Routes
router.use('/books', booksRouter);
router.use('/authors', authorsRouter);
router.use('/borrows', borrowsRouter);

export default router;