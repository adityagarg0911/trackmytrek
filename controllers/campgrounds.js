const Campground = require('../models/campground'); 
const {cloudinary} = require("../cloudinary");
const opencage = require('opencage-api-client');
const geojson = require('geojson');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
};

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res, next) => {
    const coord = await opencage.geocode({ q: req.body.campground.location });
    const geoData = geojson.parse(coord.results, { Point: ['geometry.lat', 'geometry.lng'] });
    // res.send(geoData.features[0].geometry);
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    // console.log(campground);
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews', // this is to populate all reviews
        populate: {
            path: 'author'  // this is to populate author of reviews
        }
    }).populate('author'); // this is to populate author of campgrounds
    if(!campground){ 
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground});
};

module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});
};

module.exports.updateCampground = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } } );
        console.log(campground);
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
    const {id} = req.params;
    // I CANT DELETE WITH ANY OTHER METHOD AS IT IS ASSOCIATED WITH MONGO MIDDLEWARE WHICH WE USED FOR DELETE CASCADING
    await Campground.findByIdAndDelete(id); 
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
};