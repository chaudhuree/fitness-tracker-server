const express = require('express');

const router = express.Router();

const {
  addForum,
    getAllForums,
    getForum,
    updateForum,
    deleteForum,
    voteForum,
    getForumByAuthorId
} = require('../controllers/forumController');

router.post('/forum/add', addForum);
router.get('/forums', getAllForums);
router.get('/forum/:id', getForum);
router.put('/forum/update/:id', updateForum);
router.delete('/forum/delete/:id', deleteForum);
router.put('/forum/vote/:id', voteForum);
router.get('/forum/author/:authorId', getForumByAuthorId);

module.exports = router;