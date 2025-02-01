import express from "express";
import {
  index,
  store,
  show,
} from "../controllers/SocialMediaAccountsController.js";
import {
  urlValidation,
  uuIdBodyValidation,
  uuIdParamsValidation,
} from "../utils/constants.js";

const SocialMediaAccountsRouter = express.Router();

SocialMediaAccountsRouter.get("/all", index);
SocialMediaAccountsRouter.get(
  "/:uuId",
  uuIdParamsValidation(
    "uuId",
    "Must select the company to retrieve the social media accounts!"
  ),
  show
);

SocialMediaAccountsRouter.post(
  "/",
  [
    urlValidation("profileUrl",'Must provide a valid URL!'),
    uuIdBodyValidation("companyId", "Must select the company!"),
    uuIdBodyValidation(
      "socialMediaAppId",
      "Must select the social media apps!"
    ),
  ],
  store
);

export default SocialMediaAccountsRouter;
