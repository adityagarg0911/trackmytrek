const express = require('express');
const router = express.Router({mergeParams: true}); // this is needed to merge the id from router prefix from app.js as express router tends to separate it
const {validateReview, isLoggedIn ,isReviewAuthor} = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review'); 
const Campground = require('../models/campground'); 

router.post('/', isLoggedIn, validateReview, catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review); // because names are of types review[body] and review[rating]
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async(req, res) => {
    const {id, reviewId} = req.params
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}); // IT WILL REMOVE REVIEW WITH reviewId from reviews ARRAY
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/campgrounds/${id}`);
}));

router.get('/:reviewId', (req, res)=>{ // this was created to handle a problem which occured when we tried to delete a review without authentication
    const {id} = req.params;
    res.redirect(`/campgrounds/${id}`);
})

module.exports = router;