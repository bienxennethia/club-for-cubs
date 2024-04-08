import React, { useState } from 'react';

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const selectedFile = event.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']; // Specify allowed file types
    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setError(null);
    } else {
      setFile(null);
      setError('Please select a valid image file (JPEG, PNG, GIF)');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('image', file); 
    fetch('http://localhost:3001/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error uploading file:', error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleChange} />
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button type="submit">Upload</button>
    </form>
  );
};

export default UploadForm;
