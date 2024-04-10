import { Router } from "express";
import authorsRouter from './routes/authors';
import booksRouter from './routes/books';
import borrowsRouter from './routes/borrows';
import usersRouter from './routes/users';
import writtenRouter from './routes/written';

const router = Router();


// Routes
router.use('/books', booksRouter);
router.use('/authors', authorsRouter);
router.use('/borrows', borrowsRouter);
router.use("/users", usersRouter);
router.use("/writtens", writtenRouter)

export default router;