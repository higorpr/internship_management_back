import express, { json } from "express";
import cors from "cors";
import router from "./routers/index";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(json());
app.use(cors());
app.use(router);

const port = process.env.PORT || 4000;

app.listen(port, () => {
	console.log(`App running on port ${port}`);
});
