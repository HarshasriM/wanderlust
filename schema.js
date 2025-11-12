const Joi = require('joi');

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),          // Use required() instead of required
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("", null),      // Allow empty strings and null
        //image: Joi.string().required(),
        category: Joi.string().valid('Trending', 'Room', 'Iconic Cities', 'Mountains', 'Castles', 'Amazing Pools', 'Camping', "Farms", "Arctic", "Domes", "Boats", "Others").required(),
        }).required(),                                // Ensure listing object itself is required

    });
    const reviewSchema = Joi.object({
        review: Joi.object({
            rating: Joi.number().required().min(1).max(5),
            comment: Joi.string().required(),
        }).required()
    });
    module.exports = {
        listingSchema,
        reviewSchema,
    };