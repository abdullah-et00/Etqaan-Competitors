import express from "express";
import { store, index } from "../controllers/TypesController.js";
import { smallTextValidation } from "../utils/constants.js";

const TypesRouter = express.Router();

TypesRouter.get("/all", index);
TypesRouter.post("/", smallTextValidation("name","Name must be a text!","Name must be not empty!"), store);

export default TypesRouter;
