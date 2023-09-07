// components/FileUpload.js
import { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [question, setQuestion] = useState('');
  const [response,setResponse] = useState('');
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    console.log(formData,"the form data");
    try {
      await axios.post('/api/testupload/embedding', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <input type="file"  onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload File</button>
      
    </div>
  );
};

export default FileUpload;
