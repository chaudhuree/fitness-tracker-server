const {StatusCodes} = require('http-status-codes');
const Review = require('../models/Review');

// add a new review
const addReview = async (req, res) => {
    try {
        const reviewInstance = await Review.create(req.body);
        res.status(StatusCodes.CREATED).json({
            success: true,
            data: reviewInstance,
            message: "Review added successfully"
        });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({success: false, message: error.message});
    }
};

// get all reviews with pagination and sorting
const getAllReviews = async (req, res) => {
    const {page = 1, limit = 9} = req.query;
    try {
        const reviews = await Review.find()
            .populate('user')
            .populate('trainer')
            .sort({createdAt: -1})
            .limit(limit * 1)
            .skip((page - 1) * limit);
        const count = await Review.countDocuments();
        res.status(StatusCodes.OK).json({
            success: true,
            data: {reviews, total: count},
            message: "Reviews retrieved successfully"
        });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({success: false, message: error.message});
    }
};

// get all reviews with pagination and sorting using trainer id
// public
const getAllReviewsByTrainerId = async (req, res) => {
    const {trainerId} = req.params;
    const {page = 1, limit = 4} = req.query;
    try {
        if (trainerId) {
            const reviews = await Review.find({trainer: trainerId})
                .populate('user')
                .populate('trainer')
                .sort({createdAt: -1})
                .limit(limit * 1)
                .skip((page - 1) * limit);
            const count = await Review.countDocuments({trainer: trainerId});
            res.status(StatusCodes.OK).json({
                success: true,
                data: {reviews, total: count},
                message: "Reviews retrieved successfully"
            });
        } else {
            const reviews = await Review.find()
                .populate('user')
                .populate('trainer')
                .sort({createdAt: -1})
                .limit(limit * 1)
                .skip((page - 1) * limit);
            const count = await Review.countDocuments();
            res.status(StatusCodes.OK).json({
                success: true,
                data: {reviews, total: count},
                message: "Reviews retrieved successfully"
            });
        }
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({success: false, message: error.message});
    }
};

module.exports = {
    addReview,
    getAllReviews,
    getAllReviewsByTrainerId
};