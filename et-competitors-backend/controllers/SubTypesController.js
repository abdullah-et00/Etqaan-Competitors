import prismaClient from "../utils/prismaClient.js";
import { validationResult } from "express-validator";

export const index = async (request, response) => {
  try {
    const subTypes = await prismaClient.sub_types.findMany();
    return response.status(200).json({
      subTypes: subTypes,
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
    const { name } = request.body;
    const newSubType = await prismaClient.sub_types.create({
      data: {
        name: name,
      },
    });
    return response.status(200).json({
      subType: newSubType,
    });
  } catch (error) {
    return response.status(406).json({
      error: error,
    });
  } finally {
    await prismaClient.$disconnect();
  }
};
