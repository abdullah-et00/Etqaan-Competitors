import { body, param } from "express-validator";

export const smallTextValidation = (smallText, message, message2) =>
  body(smallText)
    .isString()
    .withMessage(message)
    .bail()
    .notEmpty()
    .withMessage(message2)
    .trim()
    .escape();

export const logoValidation = body("logo")
  .optional({ nullable: true, checkFalsy: true })
  .matches(/.(jpeg|jpg|gif|png|svg)$/i)
  .withMessage(
    "Logo must be ending with a valid image extension (jpeg, jpg, png, gif, svg)!"
  )
  .bail();

export const descriptionValidation = (desc, message, message2) =>
  body(desc)
    .notEmpty()
    .withMessage(message)
    .bail()
    .isLength({ min: 10, max: 1000 })
    .withMessage(message2)
    .trim()
    .escape();

export const uuIdParamsValidation = (uuId, message) =>
  param(uuId).isUUID().withMessage(message).bail();

export const uuIdBodyValidation = (uuId, message, isOptional = false) =>
  body(uuId)
    .optional({ nullable: isOptional, checkFalsy: isOptional })
    .isUUID()
    .withMessage(message)
    .bail();

export const urlValidation = (url, message) =>
  body(url).isURL().withMessage(message).bail();

export const optionUrlValidation = (url, message) =>
  body(url)
    .optional({ nullable: true, checkFalsy: true })
    .isURL()
    .withMessage(message)
    .bail();

export const dateValidation = (date, message, isOptional = true) =>
  body(date)
    .optional({ nullable: isOptional, checkFalsy: isOptional })
    .isISO8601()
    .withMessage(message)
    .bail();

/* .custom((value) => {
  const isUrl = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i.test(value); 
  const isImagePath = /\.(jpeg|jpg|gif|png|svg)$/i.test(value);
  
  if (!isUrl && !isImagePath) {
    throw new Error(
      "Logo must be a valid URL or a path ending with an image extension (jpeg, jpg, png, gif, svg)."
    );
  }
  
  return true;
}); */
