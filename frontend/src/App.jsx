import { useRef, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
    const [Details, setDetails] = useState();
    const Url = useRef();
    const [hasSubmitted, setHasSubmitted] = useState(false);
    async function handleClick() {
        console.log(Url.current.value);
        try {
            let res = await axios.post(
                "http://127.0.0.1:5000/getVideoDetails",
                { url: Url.current.value }
            );
            console.log(res.data.videoDetails);
            setDetails(res.data.videoDetails);
        } catch {
            console.log("Error");
        }
    }
    const formatDuration = (duration) => {
        const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
        const hours = match[1] ? match[1].replace("H", "") + "h " : "";
        const minutes = match[2] ? match[2].replace("M", "") + "m " : "";
        const seconds = match[3] ? match[3].replace("S", "") + "s" : "";
        return (hours + minutes + seconds).trim();
    };

    return (
        <>
            <h1>QuickTube</h1>
            <p>
                Welcome to QuickTube! Easily retrieve detailed information about
                any YouTube video by simply entering its link. Get instant
                access to key video details like title, description, view count,
                and more, all in one place.
            </p>
            <div className="form">
                <input
                    type="text"
                    placeholder="Enter the URL "
                    // onChange={(e) => setUrl(e.target.value)}
                    ref={Url}
                />
                <button onClick={handleClick}>Get Details</button>
            </div>
            {Details ? (
                <div className="content">
                    <h2>Video Details</h2>
                    <iframe
                        width="560"
                        height="315"
                        src={`https://www.youtube.com/embed/${Details.id}`} // Using the video ID
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                    <h3>{Details.title}</h3> {/* Displaying the video title */}
                    <p>
                        <strong>Channel:</strong> {Details.channelTitle}
                    </p>{" "}
                    {/* Displaying channel title */}
                    <p>
                        <strong>Published At:</strong>{" "}
                        {new Date(Details.publishedAt).toLocaleString()}
                    </p>{" "}
                    {/* Formatting the published date */}
                    <p>
                        <strong>Views:</strong> {Details.viewCount}
                    </p>{" "}
                    {/* Displaying view count */}
                    <p>
                        <strong>Likes:</strong> {Details.likeCount}
                    </p>{" "}
                    {/* Displaying like count */}
                    <p>
                        <strong>Duration:</strong>{" "}
                        {formatDuration(Details.duration)}
                    </p>
                    <p>
                        <strong>Description:</strong>
                    </p>
                    <p>{Details.description}</p> {/* Displaying description */}
                </div>
            ) : hasSubmitted ? (
                <div>
                    <p>
                        No video details available. Please enter a valid YouTube
                        link.
                    </p>
                </div>
            ) : null // Render nothing before submission
            }
            {/* <iframe width="560" height="315" 
    src="https://www.youtube.com/embed/X8ipUgXH6jw" 
    title="YouTube video player" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen>
</iframe> */}
        </>
    );
}

export default App;
