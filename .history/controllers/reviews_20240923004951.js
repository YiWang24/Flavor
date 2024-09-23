const Menu = require('../models/menu');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const menu = await Menu.findById(req.params.id).populate("type");
    const review = new Review(req.body.review);
    review.author = req.user._id;
    menu.reviews.push(review);
    await review.save();
    await menu.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/menus/${menu.type.typeCode}/${menu._id}`);;
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/campgrounds/${id}`);
}
