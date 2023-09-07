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
  const handleSearch = async () => {
    console.log(question, 'the query here');

    try {
      const reqeustBody ={query:question}
      const response =  await axios.post('/api/testupload/search', reqeustBody);
      console.log(response ,"the reponse haha");
      setResponse(response?.data?.data);
    } catch (error) {
      console.log("error:",error)
    }
  };

  return (
    <div>
      <input type="file" accept=".txt" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload File</button>
      <div>
        <h1 >enter the query here</h1>
        <input style={{border:"1px solid red"}} type="text" onChange={(e) => setQuestion(e.target.value)} />
        <button style={{border:"2px solid"}} onClick={handleSearch}>search </button>
        <div style={{overflow:"scroll",height:"300px"}}>
        <p style={{overflow:"scroll",height:"300px"}}>{response}</p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
