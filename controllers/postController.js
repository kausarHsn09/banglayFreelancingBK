// controllers/postController.js
const Post = require('../models/postModel');

exports.getPostsByCategory = async (req, res) => {
    try {
        const posts = await Post.find({ category: req.params.categoryId })
            .populate('category')
            .populate('caption')
            .populate('hashtags');
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createPost = async (req, res) => {
    const post = new Post({
        category: req.body.category,
        caption: req.body.caption,
        hashtags: req.body.hashtags
    });

    try {
        const newPost = await post.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
