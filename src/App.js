import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

function App() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoURL, setVideoURL] = useState('');
  const [result, setResult] = useState('');
  const webcamRef = useRef(null);
  const [isWebcam, setIsWebcam] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Your deployed backend URL (no slash at end)
  const BACKEND_URL = 'https://bad-posture-backend-production-8f0e.up.railway.app';

  // ✅ Handle video selection
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsWebcam(false);
      setSelectedVideo(file);
      setVideoURL(URL.createObjectURL(file));
      setResult('');
    }
  };

  // ✅ Handle video upload to backend
  const handleUpload = async () => {
    if (!selectedVideo) {
      alert('Please select a video first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedVideo);  // ✅ Correct key

    try {
      setLoading(true);
      const response = await axios.post(`${BACKEND_URL}/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data.result || 'No feedback received.');
    } catch (error) {
      console.error(error);
      setResult('Error analyzing video.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle webcam capture and upload
  const handleWebcamCapture = async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();

    if (!imageSrc) {
      alert('Unable to capture image. Please try again.');
      return;
    }

    const res = await fetch(imageSrc);
    const blob = await res.blob();
    const file = new File([blob], 'frame.jpg', { type: 'image/jpeg' });

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await axios.post(`${BACKEND_URL}/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data.result || 'No feedback.');
    } catch (error) {
      console.error(error);
      setResult('Error analyzing posture.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <h1>Posture Detection App</h1>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => {
            setIsWebcam(false);
            setSelectedVideo(null);
            setVideoURL('');
            setResult('');
          }}
          style={{ marginRight: '10px' }}
        >
          Upload Video
        </button>

        <button
          onClick={() => {
            setIsWebcam(true);
            setSelectedVideo(null);
            setVideoURL('');
            setResult('');
          }}
        >
          Use Webcam
        </button>
      </div>

      {!isWebcam && (
        <>
          <input type="file" accept="video/*" onChange={handleVideoChange} />
          {videoURL && (
            <div style={{ marginTop: '20px' }}>
              <video width="400" controls src={videoURL}></video>
            </div>
          )}
          <button
            onClick={handleUpload}
            style={{ padding: '10px 20px', fontSize: '16px', marginTop: '20px' }}
          >
            Analyze Posture
          </button>
        </>
      )}

      {isWebcam && (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={400}
            height={300}
            videoConstraints={{ facingMode: 'user' }}
          />
          <br />
          <button
            onClick={handleWebcamCapture}
            style={{ padding: '10px 20px', fontSize: '16px', marginTop: '20px' }}
          >
            Capture & Analyze
          </button>
        </>
      )}

      {loading && <p style={{ marginTop: '20px' }}>Analyzing...</p>}

      {result && (
        <p style={{ marginTop: '20px', fontSize: '18px', fontWeight: 'bold' }}>
          {result}
        </p>
      )}
    </div>
  );
}

export default App;
