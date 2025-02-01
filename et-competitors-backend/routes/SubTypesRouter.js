import express from "express";
import { index, store } from "../controllers/SubTypesController.js";
import { smallTextValidation } from "../utils/constants.js";

const SubTypesRouter = express.Router();

SubTypesRouter.get("/all",index)
SubTypesRouter.post("/",smallTextValidation("name","Name must be a text!","Name must be not empty!"),store)

export default SubTypesRouter;
