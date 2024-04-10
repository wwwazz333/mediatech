import { Router } from "express";
import authorsRouter from './routes/authors';
import booksRouter from './routes/books';
import borrowsRouter from './routes/borrows';
import usersRouter from './routes/users';
const router = Router();


// Routes
router.use('/books', booksRouter);
router.use('/authors', authorsRouter);
router.use('/borrows', borrowsRouter);
router.use("/users", usersRouter);

export default router;