import React, { useState } from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';


const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  // Create and configure your Cloudinary instance.
  const cld = new Cloudinary({
    cloud: {
      cloudName: 'dl1braci9'
    }
  }); 

  // Use the image with public ID, 'front_face'.
  const myImage = cld.image('club_for_cubs/vmbpsf99rek8botfcwm0');

  const previewFiles = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      console.log(imageUrl);
      setImageUrl(reader.result);
    };
  };

  const handleChange = (event) => {
    const selectedFile = event.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']; // Specify allowed file types
    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      previewFiles(selectedFile);
      setError(null);
    } else {
      setFile(null);
      setError('Please select a valid image file (JPEG, PNG, GIF)');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('image', imageUrl); 

    const jsonData = {};
    formData.forEach((value, key) => {
      jsonData[key] = value;
    });
    const jsonString = JSON.stringify(jsonData);

    fetch('http://localhost:3001/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Set content type to JSON
      },
      body: jsonString
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error uploading file:', error));
  };

  return (
    <>
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleChange} />
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button type="submit">Upload</button>
    </form>

    <AdvancedImage cldImg={myImage} />
    </>
  );
};

export default UploadForm;
