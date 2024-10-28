import React, { useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./VideoPlayer.css"; // Create a CSS file for custom styles
import { Box } from "@mui/material";

const VideoPlayer = ({ id }) => {
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);

  useEffect(() => {
    // Initialize Video.js
    const videoElement = videoRef.current;
    playerRef.current = videojs(videoElement);

    playerRef.current.on("loadedmetadata", function () {
      const total = playerRef.current.duration();
      const progressControl = playerRef.current.controlBar.progressControl;

      markers.forEach((marker) => {
        const left = (marker.time / total) * 100 + "%";
        const el = document.createElement("div");
        el.className = "vjs-marker";
        el.style.left = left;
        el.dataset.time = marker.time;
        el.innerHTML = `<span style={{backgroundColor:'red'}}>
        ${marker.headline}
        <div style={{backgroundColor:'red'}}> ${marker.gist}</div>
        </span>`;

        el.onclick = function () {
          playerRef.current.currentTime(marker.time);
        };

        progressControl.children_[0].el_.appendChild(el);
      });
    });

    return () => {
      // Clean up Video.js player
      //   if (playerRef.current) {
      //     playerRef.current.dispose();
      //   }
    };
  }, []);

  return (
    <Box sx={{width:'100%',height:'100%'}}>
      <video
        ref={videoRef}
        className="video-js"
        controls
        preload="auto"
        style={{width:'100%',height:'100%',borderRadius:10}}
        data-setup='{ "html5": { "nativeTextTracks": true },"playbackRates" : [0.25, 0.5, 0.75, 1, 1.25, 1.5,1.75]}'
      >
        <source
          src={`https://d3515ggloh2j4b.cloudfront.net/videos/${id}.mp4`}
          type="video/mp4"
        />
        <p className="vjs-no-js">
          To view this video please enable JavaScript, and consider upgrading to
          a web browser that
          <a
            href="https://videojs.com/html5-video-support/"
            target="_blank"
            rel="noopener noreferrer"
          >
            supports HTML5 video
          </a>
        </p>
      </video>
    </Box>
  );
};

export default VideoPlayer;

export const markers = [
  {
    summary:
      "This is a part of our Java tutorial series. First we will talk about objects and we will implement two programs on intellij to learn about objects. Then we will move on to classes in Java where we will see an advanced program to learn classes more in depth.",
    gist: "Objects and Classes in Java",
    headline: "This tutorial will cover objects and classes in Java",
    time: 7480 / 1000,
    end: 33962,
  },
  {
    summary:
      "An object is an instance of a class. An object has its own states and behaviors. Let us see an example how we can use multiple objects for a single class. Using Java code.",
    gist: "Java Object syntax",
    headline:
      "Object is an instance of a class. So an object has its own states and behaviors",
    time: 34066 / 1000,
    end: 444602,
  },
  {
    summary:
      "In this program, we are going to ask the users what would they like either bikes or cars. Our next program will be based on the options that the user select, not the options we give as a command. For this, we need to run the program using scanner.",
    gist: "stdio",
    headline: "Next program will be based on the options that the user select",
    time: 444746 / 1000,
    end: 901028,
  },
  {
    summary:
      "A class is a blueprint from which objects are created. We use objects of a class to use variables and functions of the class. With this, lets understand classes with a simple Java code.",
    gist: "Java Classes, Explained",
    headline: "With this, lets understand classes with a simple Java code",
    time: 901184 / 1000,
    end: 1211268,
  },
  {
    summary:
      "We learn about objects and classes in Java. To nerd up and get certified, click here. If you like this video, subscribe to the simply learn YouTube channel and click here to watch similar videos.",
    gist: "Objects and Classes in Java",
    headline: "This video teaches you about objects and classes in Java",
    time: 1211404 / 1000,
    end: 1235050,
  },
];
