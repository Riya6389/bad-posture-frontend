import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoURL, setVideoURL] = useState('');
  const [result, setResult] = useState('');

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedVideo(file);
      setVideoURL(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedVideo) {
      alert('Please select a video first.');
      return;
    }

    const formData = new FormData();
    formData.append('video', selectedVideo);

    try {
      const response = await axios.post('http://127.0.0.1:5000/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResult(response.data.feedback);
    } catch (error) {
      console.error(error);
      setResult('Error analyzing video.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Posture Detection App</h1>

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

      {result && (
        <p style={{ marginTop: '20px', fontSize: '18px' }}>{result}</p>
      )}
    </div>
  );
}

export default App;
