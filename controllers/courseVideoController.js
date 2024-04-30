const CourseVideo = require('../models/couseVIdeoModel');
const Enrollment = require('../models/enrollmentModel');

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

    // If the video is free, return it without checking payment status
    if (video.isFree) {
      res.json(video);
      return;
    }

    // Check enrollment and payment status for paid videos
    const enrollment = await Enrollment.findOne({ user: req.userId, course: video.courseId });
    if (enrollment && enrollment.paymentStatus === 'Paid') {
      res.json(video);
    } else {
      res.status(403).json({ message: 'Access denied. Please ensure you have paid for the course.' });
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
   
    if (!req.params.id) {
      return res.status(404).json({ message: 'Video not found' });
    }
     await CourseVideo.findByIdAndDelete(req.params.id);

    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to get all videos for a specific course
exports.getVideosByCourseId = async (req, res) => {
  try {
    const videos = await CourseVideo.find({ courseId: req.params.courseId });
    if (!videos || videos.length == 0) {
      return res.status(404).json({ message: 'No videos found for this course' });
    }

    let isPaidUser = false;
    if (req.userId) {
      const enrollment = await Enrollment.findOne({ user: req.userId, course: req.params.courseId });
      isPaidUser = enrollment && enrollment.paymentStatus === 'Paid';
    }

    const videosWithAccessInfo = videos.map(video => ({
      _id: video._id,
      courseId: video.courseId,
      title: video.title,
      description: video.description,
      duration: video.duration,
      isFree: video.isFree,
      thumbnailUrl: video.thumbnailUrl,
      videoUrl: video.isFree || isPaidUser ? video.videoUrl : null,
      isAccessible: video.isFree || isPaidUser
    }));

    // Include whether the user is a paid user in the response
    res.json({ videos: videosWithAccessInfo, isPaidUser: isPaidUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
