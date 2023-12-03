import React from 'react';
import cloudIcon from '../images/cloudicon.png';
import { useState } from 'react';

const Hero = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [showUploadScreen, setShowUploadScreen] = useState(true);
    const [result, setResult] = useState(null);
  
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      setSelectedFile(file);
      handleImageDetection(file);
    };
  
    const handleDrop = (event) => {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      setSelectedFile(file);
      handleImageDetection(file);
    };
  
    const handleDragOver = (event) => {
      event.preventDefault();
    };
  
    const handleImageDetection = (file) => {
      if (!file) return;
  
      const formData = new FormData();
      formData.append('file', file);
  
      fetch('http://127.0.0.1:5500/detect-image', {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          console.log('Result: ', data.result);
          setResult(data.result);
        })
        .catch(error => {
          console.error('Error: ', error);
        });
  
      setShowUploadScreen(false);
    };

    const handleUploadAnother = () => {
      setSelectedFile(null);
      setShowUploadScreen(true);
      setResult(null);
    };

    return (
        <div className="flex h-screen justify-center items-center bg-gray-200">
            {showUploadScreen ? (
                <div className="flex justify-center items-center" style={{ height: "450px", width: "800px", border: "4px dashed gray" }}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    <div className="flex flex-col items-center">
                        <img className="w-36 h-36 mb-5" src={cloudIcon} alt="cloud" style={{ display: 'none' }}></img>
                        <h1 className="text-4xl text-gray-400 font-light">Drag&Drop files here</h1>
                        <p className="text-2xl text-gray-400 font-light m-8">or</p>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                            id="fileInput"
                        />
                        <label htmlFor="fileInput" className="text-2xl text-blue-400 font-light pt-2 pb-2 pl-4 pr-4 border-2 border-blue-400 rounded-lg cursor-pointer">
                            Browse Files
                        </label>
                    </div>
                </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="relative mb-5 overflow-hidden">
                  {selectedFile && (
                    <div style={{ width: '800px', height: '450px' }}>
                      <img
                        className="w-full h-full"
                        src={URL.createObjectURL(selectedFile)}
                        alt="selected"
                      />
                    </div>
                  )}
                </div>
                {result && <p className="text-3xl text-green-500 font-light mb-4">Result: <span className="text-3xl font-light text-gray-500">{result}</span></p>}
                <button
                  onClick={handleUploadAnother}
                  className="text-xl text-blue-400 font-light pt-2 pb-2 pl-4 pr-4 border-2 border-blue-400 rounded-lg cursor-pointer"
                >
                New file
                </button>
              </div>
            )}
          </div>
    );
}

export default Hero;

