import prismaClient from "../utils/prismaClient.js";
import { validationResult } from "express-validator";

export const index = async (request, response) => {
  try {
    const socialMediaAccounts =
      await prismaClient.social_media_accounts.findMany({
        select:{
            id:true,
            profileUrl:true,
            companies:{
                select:{
                    name:true,
                }
            },
            socialMediaApps:{
                select:{
                    name:true,
                }
            },
            createdAt:true,
            updatedAt:true,
        }
      });
    return response.status(200).json({
      socialMediaAccounts: socialMediaAccounts,
    });
  } catch (error) {
    return response.status(406).json({
      error: error,
    });
  } finally {
    await prismaClient.$disconnect();
  }
};

export const show = async (request, response) => {
  try {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({
        errors: errors.array(),
      });
    }

    const companySocialAccounts =
      await prismaClient.social_media_accounts.findMany({
        where: {
          companyId: request.params.uuId,
        },
        select: {
          id: true,
          profileUrl: true,
          socialMediaAppId: true,
          companies:{
            select:{
                name:true
            }
          },
          socialMediaApps: {
            select: {
              name: true,
            },
          },
        },
      });

    return response.status(200).json({
      companySocialAccounts: companySocialAccounts,
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

    const newSocialMediaAccount =
      await prismaClient.social_media_accounts.create({
        data: request.body,
      });

    return response.status(200).json({
      socialMediaAccount: newSocialMediaAccount,
    });
  } catch (error) {
    return response.status(406).json({
      error: error,
    });
  } finally {
    await prismaClient.$disconnect();
  }
};
