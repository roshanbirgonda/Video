import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Navbar from "./Navbar"; // Import Navbar component
import "./App.css";

function App() {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const [video, setVideo] = useState(null);
  const [videoURL, setVideoURL] = useState("");
  const [response, setResponse] = useState("");
  const [responseClass, setResponseClass] = useState("");

  useEffect(() => {
    const verifyUser = async () => {
      if (!cookies.jwt) {
        navigate("/login");
      } else {
        const { data } = await axios.post(
          "http://localhost:4000",
          {},
          {
            withCredentials: true,
          }
        );
        if (!data.status) {
          removeCookie("jwt");
          navigate("/login");
        } else {
          toast(`Hi ${data.user} 🦄`, {
            theme: "dark",
          });
        }
      }
    };
    verifyUser();
  }, [cookies, navigate, removeCookie]);

  const logOut = () => {
    removeCookie("jwt");
    navigate("/login");
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("video/")) {
      setVideo(file);
      setVideoURL(URL.createObjectURL(file));
      setResponse("");
    } else {
      console.error("Please upload a valid video file.");
      setResponse("Invalid file type. Please upload a video.");
      setResponseClass("error-message");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!video) {
      console.error("Please select a video file.");
      setResponse("No video selected.");
      setResponseClass("error-message");
      return;
    }

    const formData = new FormData();
    formData.append("video", video);

    try {
      const res = await axios.post("http://localhost:5000/predict", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResponse(res.data.message);
      setResponseClass(res.data.message === "Video Received" ? "success-message" : "error-message");
    } catch (error) {
      console.error("Error sending video to server:", error);
      setResponse("Failed to send video to server.");
      setResponseClass("error-message");
    }
  };

  return (
    <>
      <Navbar /> {/* Include Navbar at the top */}
      <div className="App center-container">
        <header className="Prediction">
          <h1>Automatic Cricket Analysis</h1>
          <button onClick={logOut} className="logout-button">
            Log Out
          </button>
          <form onSubmit={handleSubmit}>
            <label className="file-upload">
              <input
                type="file"
                accept="video/mp4, video/avi, video/*"
                onChange={handleVideoUpload}
                hidden
              />
            </label>
            <button type="submit">Submit</button>
          </form>
          {videoURL && (
            <div className="video-preview">
              <h2>Video Preview:</h2>
              <video key={videoURL} width="600" controls>
                <source src={videoURL} />
                Your browser does not support the video tag.
              </video>
              <p className="file-name">{video?.name}</p>
            </div>
          )}
          {response && (
            <div className={`response-message ${responseClass}`}>
              <h2>Server Response:</h2>
              <p>{response}</p>
            </div>
          )}
        </header>
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
