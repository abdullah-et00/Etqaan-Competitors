import express from "express"
import { index } from "../controllers/TestController.js";

const TestRouter = express.Router()

TestRouter.get('/',index)

export default TestRouter;