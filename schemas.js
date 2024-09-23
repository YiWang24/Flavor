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
    description: Joi.string().required().allow("").escapeHTML(),
    date: Joi.date().default(Date.now), // Default to current date if not provided
  }).required(),
  type: Joi.object({
    typeCode: Joi.string().required(),
  }),
  deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    content: Joi.string().required().escapeHTML(),
    date: Joi.date().default(Date.now), // Default to current date if not provided
  }).required(),
});
