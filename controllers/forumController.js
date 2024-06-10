const { StatusCodes } = require("http-status-codes");
const Forum = require("../models/Forum");

// add a new forum
const addForum = async (req, res) => {
  try {
    console.log('req.body', req.body);
    
    const forumInstance = await Forum.create(req.body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      data: forumInstance,
      message: "Forum added successfully",
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};

// get all forums with pagination and sorting
const getAllForums = async (req, res) => {
  const { page = 1, limit = 6 } = req.query;
  try {
    const forums = await Forum.find()
      .populate("author")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const count = await Forum.countDocuments();
    res.status(StatusCodes.OK).json({
      success: true,
      data: { forums, total: count },
      message: "Forums retrieved successfully",
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};

// get a forum by id
const getForum = async (req, res) => {
  const { id } = req.params;
  try {
    const forum = await Forum.findById(id).populate("author");
    if (!forum) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: `No forum with id: ${id}` });
    }
    res.status(StatusCodes.OK).json({ success: true, data: forum });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};

// update a forum
const updateForum = async (req, res) => {
  const { id } = req.params;
  try {
    const forum = await Forum.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!forum) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: `No forum with id: ${id}` });
    }
    res
      .status(StatusCodes.OK)
      .json({
        success: true,
        data: forum,
        message: "Forum updated successfully",
      });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};

// delete a forum
const deleteForum = async (req, res) => {
  const { id } = req.params;
  try {
    const forum = await Forum.findByIdAndDelete(id);
    if (!forum) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: `No forum with id: ${id}` });
    }
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Forum deleted successfully" });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};

// upvote a forum
const voteForum = async (req, res) => {
  const { id } = req.params;
  const{userId,vote} = req.body;
  try {
    const forum = await Forum.findById(id);
    if (!forum) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: `No forum with id: ${id}` });
    }
    const upvotesIndex = forum.upvotes.indexOf(userId);
    const downvotesIndex = forum.downvotes.indexOf(userId);

    if(vote === 'upvote'){
        if(upvotesIndex === -1){
            forum.upvotes.push(userId);
            if(downvotesIndex !== -1){
            forum.downvotes.splice(downvotesIndex,1);
            }
        }
    }else if(vote === 'downvote'){
        if(downvotesIndex === -1){
            forum.downvotes.push(userId);
            if(upvotesIndex !== -1){
            forum.upvotes.splice(upvotesIndex,1);
            }
        }
    }
    await forum.save();
    res
      .status(StatusCodes.OK)
      .json({
        success: true,
        data: forum,
        message: `Forum ${vote}d successfully`,
      });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};


// forum by author id
const getForumByAuthorId = async (req, res) => {
  const { authorId } = req.params;
  try {
    const forums = await Forum.find({ author: authorId });
    res.status(StatusCodes.OK).json({ success: true, data: forums });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};



module.exports = {
  addForum,
  getAllForums,
  getForum,
  updateForum,
  deleteForum,
  voteForum,
  getForumByAuthorId,
};
