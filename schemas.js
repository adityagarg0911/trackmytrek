// IT CONTAINS SCHEMA FOR VALIDATION OF DATA FOR POST AND PUT REQUEST WITH THE HELP OF JOI
const Joi = require('joi'); // JOI is a schema description language and data validator for JavaScript

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
});