const { Sequelize } = require('sequelize');
const { Post } = require('../models');
const { User } = require('../models');



const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findOne(
      { where: { id },
        include: [{ model: User, foreignKey: 'user_id' , attributes: []}],
        attributes : {
          include:[
            [Sequelize.col('User.name'),'userName']
          ]
        },
        raw: true,
      } );
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    res.render('posts/postDetails', { post , comments : []});
    // res.status(200).json({ success: true, data: post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching post' });
  }
};


const createPost = async (req, res) => {
  try {
    const { caption, visibility, user_id } = req.body;

    // Check if user_id is provided
    if (!user_id) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    // Validate visibility value
    if (!['all', 'me'].includes(visibility)) {
      return res.status(400).json({ success: false, message: 'Invalid visibility value' });
    }

    // Check if the image file is present
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image is required' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    // Create the post
    const post = await Post.create({ caption, image_url : imageUrl, visibility, user_id });

    res.redirect('/dashboard');

    // res.status(201).json({ success: true, data: post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error creating post' });
  }
};


const updatePost = async (req, res) => {
  try {
    
    const { id } = req.params;
    const { caption, visibility } = req.body;

    if (visibility && !['all', 'me'].includes(visibility)) {
      return res.status(400).json({ success: false, message: 'Invalid visibility value' });
    }

    const updateData = { caption, visibility };
    if (req.file) {
      updateData.image_url = `/uploads/${req.file.filename}`;
    }

    const [updatedRows] = await Post.update(updateData, { where: { id } });

    if (!updatedRows) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.redirect('/my-posts')
    // res.status(200).json({ success: true, message: 'Post updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error updating post' });
  }
};
const updatePostPage = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findOne({ where: { id } });

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.render('posts/updatePost', { post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error updating post' });
  }
};






const deletePost = async (req, res) => {
  try {
    
    const { id } = req.params;
    const deletedRows = await Post.destroy({ where: { id } });

    if (!deletedRows) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.status(200).json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error deleting post' });
  }
};

const updateVisibility = async (req, res) => {
  try {
    const { id } = req.params;
    const { visibility } = req.body;

    if (!['all', 'me'].includes(visibility)) {
      return res.status(400).json({ success: false, message: 'Invalid visibility value' });
    }

    const [updatedRows] = await Post.update({ visibility }, { where: { id } });

    if (!updatedRows) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.status(200).json({ success: true, message: 'Visibility updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error updating visibility' });
  }
};

module.exports = {
  getPostById,
  createPost,
  updatePost,
  deletePost,
  updateVisibility,
  updatePostPage
};
