import express from "express";
import { index, store } from "../controllers/SocialMediaAppsController.js";
import { smallTextValidation,logoValidation } from "../utils/constants.js";

const SocialMediaAppsRouter = express.Router();

SocialMediaAppsRouter.get("/all",index)
SocialMediaAppsRouter.post("/",[smallTextValidation("name","Name must be a text!","Name must be not empty!"),logoValidation],store)

export default SocialMediaAppsRouter;
