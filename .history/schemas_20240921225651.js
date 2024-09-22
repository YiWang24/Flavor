const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

module.exports.menuSchema = Joi.object({
  menu: Joi.object({
    title: Joi.string().required().escapeHTML(),
    description: Joi.string().required().allow("")escapeHTML(),
    title: Joi.string().required(), // Assuming title is required
    description: Joi.string().allow(""), // Allow empty description
    date: Joi.date().default(Date.now), // Default to current date if not provided
    type: Joi.string().required(), // Should be a string representing ObjectId
    author: Joi.string().optional(), // Allow author to be optional
    images: Joi.array().items(Joi.string()), // Array of strings representing ObjectIds
    reviews: Joi.array().items(Joi.string()), // Array of strings representing ObjectIds
  }).required(),

  deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required().escapeHTML(),
  }).required(),
});
