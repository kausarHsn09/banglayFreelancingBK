const CourseVideo = require('../models/couseVIdeoModel');
const Enrollment = require('../models/enrollmentModel');


exports.getAllVideos = async (req, res) => {
  try {
    const videos = await CourseVideo.find();
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



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


exports.createVideo = async (req, res) => {
  try {
    const { courseId, title, description, videoUrl, duration, thumbnailUrl, isFree, isPreview } = req.body;
    
    // Get the current highest position for the course

const maxPosition = await CourseVideo.find({ courseId }).sort({ position: -1 }).limit(1).then(videos => videos[0] ? videos[0].position : 0);

    const video = new CourseVideo({ 
      courseId, 
      title, 
      description, 
      videoUrl, 
      duration, 
      thumbnailUrl, 
      isFree, 
      isPreview, 
      position: maxPosition + 1 // Set position to max position + 1
    });
    
    await video.save();
    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateVideo = async (req, res) => {
  try {
    const { title, description, videoUrl, duration, thumbnailUrl, isFree,courseId,isPreview } = req.body;
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
    video.courseId = courseId;
    video.isPreview = isPreview;
    await video.save();
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


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


exports.getVideosByCourseId = async (req, res) => {
  try {
    const videos = await CourseVideo.find({ courseId: req.params.courseId }).sort({ position: 1 });
    if (!videos || videos.length === 0) {
      return res.status(404).json({ message: 'No videos found for this course' });
    }

    let isPaidUser = false;
    if (req.userId) {
      const enrollment = await Enrollment.findOne({ user: req.userId, course: req.params.courseId });
      isPaidUser = enrollment && enrollment.paymentStatus === 'Paid';
      if (req.userRole === 'Admin') {
        isPaidUser = true;
      }
    }

    const videosWithAccessInfo = videos.map(video => ({
      _id: video._id,
      courseId: video.courseId,
      title: video.title,
      description: video.description,
      duration: video.duration,
      isFree: video.isFree,
      thumbnailUrl: video.thumbnailUrl,
      videoUrl: video.isFree || isPaidUser || req.userRole === 'Admin' ? video.videoUrl : null,
      isAccessible: video.isFree || isPaidUser || req.userRole === 'Admin',
      isPreview: video.isPreview
    }));
    
    const previewVideo = videos.find(video => video.isPreview === true);
    res.json({ videos: videosWithAccessInfo, isPaidUser: isPaidUser, previewVideo: previewVideo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateVideoPositions = async (req, res) => {
  try {
    const { videoPositions } = req.body; // Expecting an array of { videoId, position }

    // Iterate over the video positions and update each video
    for (const videoPosition of videoPositions) {
      const video = await CourseVideo.findById(videoPosition.videoId);
      if (video) {
        video.position = videoPosition.position;
        await video.save();
      }
    }

    res.status(200).json({ message: 'Video positions updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};