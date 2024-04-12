import cors from "cors";
import 'dotenv/config';
import express, { Express } from "express";
import morgan from "morgan";
import apiV1 from "./v1/app";


const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
const loggerMode = process.env.NODE_ENV === "production" ? "tiny" : "dev";
app.use(morgan(loggerMode));
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/v1', apiV1);



const listener = app.listen(port, function () {
	console.log("Listening on port http://localhost:" + port);
});