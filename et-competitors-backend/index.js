import express from "express";
import dotenv from "dotenv";
import TestRouter from "./routes/TestRouter.js";
import PostsRouter from "./routes/PostsRouter.js";
import TypesRouter from "./routes/TypesRouter.js";
import SubTypesRouter from "./routes/SubTypesRouter.js";
import CompaniesRouter from "./routes/CompaniesRouter.js";
import SocialMediaAppsRouter from "./routes/SocialMediaAppsRouter.js";
import SocialMediaAccountsRouter from "./routes/SocialMediaAccountsRouter.js";
dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT,"0.0.0.0",() => {
  console.log(`Server run successfully on port ${PORT}`);
});

app.use("/api/v1/test", TestRouter);
app.use("/api/v1/posts", PostsRouter);
app.use("/api/v1/types", TypesRouter);
app.use("/api/v1/sub-types", SubTypesRouter);
app.use("/api/v1/companies", CompaniesRouter);
app.use("/api/v1/social-media-apps", SocialMediaAppsRouter);
app.use("/api/v1/social-media-accounts", SocialMediaAccountsRouter);
