import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cors());
const key =process.env.API_KEY
app.post("/getVideoDetails", async (req, res) => {
    const { url } = req.body;
    console.log("URL received:", url);

    const videoId = extractVideoId(url);
    console.log("Extracted video ID:", videoId);

    if (!videoId) {
        return res.status(400).json({ error: "Invalid YouTube URL." });
    }

    // Fetch video details using YouTube Data API
    const videoDetails = await getVideoDetails(videoId);
    videoDetails.id = videoId;

    if (videoDetails) {
        res.json({ videoDetails });
    } else {
        res.status(404).json({ error: "Video not found." });
    }
});

const extractVideoId = (url) => {
    const shortUrlPattern = /https:\/\/youtu\.be\/([a-zA-Z0-9_-]{11})/;
    const longUrlPattern =
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/;
    const shortMatch = url.match(shortUrlPattern);
    const longMatch = url.match(longUrlPattern);
    if (shortMatch) {
        return shortMatch[1];
    } else if (longMatch) {
        return longMatch[1];
    } else {
        return null;
    }
};

const getVideoDetails = async (videoId) => {
    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${key}`
        );
        const data = await response.json();

        if (data.items.length === 0) {
            console.log("No video found with the given ID.");
            return null;
        }

        const video = data.items[0];
        const videoDetails = {
            title: video.snippet.title,
            description: video.snippet.description,
            channelTitle: video.snippet.channelTitle,
            publishedAt: video.snippet.publishedAt,
            viewCount: video.statistics.viewCount,
            likeCount: video.statistics.likeCount,
            duration: video.contentDetails.duration,
        };

        console.log("Video details fetched:", videoDetails);
        return videoDetails;
    } catch (error) {
        console.error("Error fetching video details:", error);
        return null;
    }
};

// Start the server
app.listen(5000, () => console.log("Server running on port 5000"));
