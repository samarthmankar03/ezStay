const Joi = require('joi');

const listingschema = Joi.object({
    listing : Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0), // Ensure price is a non-negative number
        location: Joi.string().required(),
        country: Joi.string().required(),
        image: Joi.string().allow("", null), // Allow empty string or null for image
    }).required()
});

const reviewSchema = Joi.object({
    review : Joi.object({
        rating : Joi.number().required().min(0).max(5),
        comment : Joi.string().required()
    }).required()
});

module.exports = {
  listingschema,
  reviewSchema
};