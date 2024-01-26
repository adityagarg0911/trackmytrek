const express = require('express');
const router = express.Router({mergeParams: true}); // this is needed to merge the id from router prefix from app.js as express router tends to separate it
const catchAsync = require('../utils/catchAsync');
const {reviewSchema} = require('../schemas.js'); // AS OF NOW IT IMPORTS SCHEMA FOR VALIDATION THROUGH JOI
const ExpressError = require('../utils/ExpressError');
const Review = require('../models/review'); 
const Campground = require('../models/campground'); 

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(', ')
        throw new ExpressError(msg, 400);
    }
    else{
        next(); // WE HAVE TO CALL NEXT AS IT IS A MIDDLEWARE
    }
}

router.post('/', validateReview, catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.campId);
    const review = new Review(req.body.review); // because names are of types review[body] and review[rating]
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:reviewId', catchAsync(async(req, res) => {
    const {campId, reviewId} = req.params
    await Campground.findByIdAndUpdate(campId, {$pull: {reviews: reviewId}}); // IT WILL REMOVE REVIEW WITH reviewId from reviews ARRAY
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/campgrounds/${campId}`);
}));

module.exports = router;