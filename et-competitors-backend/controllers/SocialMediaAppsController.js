import prismaClient from "../utils/prismaClient.js";
import { validationResult } from "express-validator";

export const index = async (request, response) => {
  try {
    const socialMediaApps = await prismaClient.social_media_apps.findMany();
    return response.status(200).json({
      socialMediaApps: socialMediaApps,
    });
  } catch (error) {
    return response.status(406).json({
      error: error,
    });
  } finally {
    await prismaClient.$disconnect();
  }
};

export const store = async (request, response) => {
  try {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({
        errors: errors.array(),
      });
    }
    const newSocialMediaApp = await prismaClient.social_media_apps.create({
      data: request.body,
    });

    return response.status(200).json({
      socialMediaApp: newSocialMediaApp,
    });
  } catch (error) {
    return response.status(406).json({
      error: error,
    });
  } finally {
    await prismaClient.$disconnect();
  }
};
