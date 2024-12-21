const express = require('express');
const router = express.Router();
const {
  getPostById,
  createPost,
  updatePost,
  updatePostPage,
  deletePost,
  updateVisibility,
} = require('../controllers/postController');
const upload = require('../middlewares/multer');



router.get('/:id', getPostById); 

router.post('/', upload.single('image'), createPost); 

router.get('/update/:id', updatePostPage); 
router.post('/update/:id', upload.single('image'), updatePost); 

router.delete('/:id', deletePost);

router.patch('/:id/visibility', updateVisibility); 

module.exports = router;
