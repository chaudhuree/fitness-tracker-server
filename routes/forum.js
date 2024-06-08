const express = require('express');

const router = express.Router();

const {
  addForum,
    getAllForums,
    getForum,
    updateForum,
    deleteForum,
    upvoteForum,
    downvoteForum,
    getForumByAuthorId
} = require('../controllers/forumController');

router.post('/forum/add', addForum);
router.get('/forums', getAllForums);
router.get('/forum/:id', getForum);
router.put('/forum/update/:id', updateForum);
router.delete('/forum/delete/:id', deleteForum);
router.put('/forum/upvote/:id', upvoteForum);
router.put('/forum/downvote/:id', downvoteForum);
router.get('/forum/author/:authorId', getForumByAuthorId);

module.exports = router;