import express from "express";
import {
  store,
  index,
  show,
  companyReport,
  companyPosts,
} from "../controllers/CompaniesController.js";
import {
  smallTextValidation,
  descriptionValidation,
  uuIdParamsValidation,
  logoValidation,
  dateValidation,
  uuIdBodyValidation,
} from "../utils/constants.js";

const CompaniesRouter = express.Router();
const companiesValidation = [
  smallTextValidation(
    "name",
    "Name must be a text!",
    "Name must be not empty!"
  ),
  descriptionValidation(
    "description",
    "Description must be not empty!",
    "Description must be between 10 and 1000 characters!"
  ),
  logoValidation,
];

const companyReportValidation = [
  uuIdParamsValidation("uuId", "Must select a company to retrieve it!"),
  dateValidation("fromDate","",true),
  dateValidation("toDate","",true),
  uuIdBodyValidation("typeId","",true),
];

const companyPostsValidation = [
  uuIdParamsValidation("uuId", "Must select a company to retrieve it!"),
  uuIdParamsValidation("typeId", "Must select a type to retrieve it!"),
  dateValidation("fromDate","",true),
  dateValidation("toDate","",true),
];

CompaniesRouter.get("/all", index);

CompaniesRouter.get("/c-posts/:id/:typeId", companyPostsValidation,companyPosts);
CompaniesRouter.get("/report/:uuId", companyReportValidation, companyReport);
CompaniesRouter.post("/", companiesValidation, store);

/************************************ NOT USED ********************************************/
CompaniesRouter.get(
  "/:uuId",
  uuIdParamsValidation("uuId", "Must select a company to retrieve it!"),
  show
);

export default CompaniesRouter;
