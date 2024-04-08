const CourseVideo = require('../models/couseVIdeoModel');



// Controller function to get all course videos
exports.getAllVideos = async (req, res) => {
  try {
    const videos = await CourseVideo.find();
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Controller function to get video by ID
exports.getVideoById = async (req, res) => {
  try {
    const video = await CourseVideo.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
 
    // Check if the video is free or the user is paid
    if (video.isFree || req.userRole === 'Member' || req.userRole === 'Admin') {
      // Video is free or user is paid, allow access
      res.json(video);
    } else {
      // Video is not free and user is not paid, deny access
      res.status(403).json({ message: 'Access denied' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to create a new video
exports.createVideo = async (req, res) => {
  try {
    const { courseId, title, description, videoUrl, duration, thumbnailUrl, isFree } = req.body;
    const video = new CourseVideo({ courseId, title, description, videoUrl, duration, thumbnailUrl, isFree });
    await video.save();
    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to update a video
exports.updateVideo = async (req, res) => {
  try {
    const { title, description, videoUrl, duration, thumbnailUrl, isFree } = req.body;
    const video = await CourseVideo.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    video.title = title;
    video.description = description;
    video.videoUrl = videoUrl;
    video.duration = duration;
    video.thumbnailUrl = thumbnailUrl;
    video.isFree = isFree;
    await video.save();
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to delete a video
exports.deleteVideo = async (req, res) => {
  try {
    const video = await CourseVideo.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    await video.remove();
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
