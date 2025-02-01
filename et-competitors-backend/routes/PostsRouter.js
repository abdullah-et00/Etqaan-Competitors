import express from "express";
import {
  store,
  index,
  postsURLs,
} from "../controllers/PostsController.js";
import {
  smallTextValidation,
  optionUrlValidation,
  descriptionValidation,
  urlValidation,
  uuIdBodyValidation,
  dateValidation,
} from "../utils/constants.js";
const postValidation = [
  smallTextValidation(
    "title",
    "Name must be a text!",
    "Title must be not empty!"
  ),
  descriptionValidation(
    "description",
    "Description must be not empty!",
    "Description must be between 10 and 1000 characters!"
  ),
  optionUrlValidation("coverImage", "Must provide a valid URL!"),
  //urlValidation("postUrl", "Must provide a valid URL!"),
  dateValidation("publishDate", "Date must be in the format YYYY-MM-DD!"),
  uuIdBodyValidation("publisherId", "Must provide a publisher company!"),
  uuIdBodyValidation(
    "socialMediaAccountId",
    "Must provide a social media account that publish the post!"
  ),
  uuIdBodyValidation(
    "socialMediaAppId",
    "Must provide a social media app to publish on it!"
  ),
  uuIdBodyValidation("typeId", "Must provide a type of post!"),
  uuIdBodyValidation("subTypeId", "Must provide a sub type of post!"),
];
const byDateValidation = [
  dateValidation("fromDate", "Date must be in the format YYYY-MM-DD!"),
  dateValidation("toDate", "Date must be in the format YYYY-MM-DD!"),
];
const filtersValidation = [
  ...byDateValidation,
  uuIdBodyValidation("type", "Must provide a type of post!", true),
];

const urlsValidation=[
  urlValidation("postUrl", "Must provide a valid URL!"),
  uuIdBodyValidation("postId", "Must provide a post!"),
  uuIdBodyValidation("socialMediaAppId", "Must provide a socialMediaApp of post!"),
];

const PostsRouter = express.Router();

PostsRouter.get("/all", index);
PostsRouter.post("/posts-urls",urlsValidation,postsURLs);
PostsRouter.post("/", postValidation, store);

//PostsRouter.post("/filters", filtersValidation, filters);
//PostsRouter.get("/date", byDateValidation, showByDate);

export default PostsRouter;
