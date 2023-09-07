// components/FileUpload.js
import { useState } from 'react';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

import { SupabaseVectorStore } from 'langchain/vectorstores/supabase';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
// import * as fs from 'fs';

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_BASE_URL;
// console.log(supabaseUrl,"supabase url")
// const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;
// const supabase = createClient(supabaseUrl, supabaseServiceKey);

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [question, setQuestion] = useState('');
  const [response,setResponse] = useState('');
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  
  // const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;
  // if (!supabaseKey) throw new Error(`Expected SUPABASE_SERVICE_ROLE_KEY`);
  
  // const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // if (!url) throw new Error(`Expected env var SUPABASE_URL`);
  // const openaikey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  // const client = createClient(url, supabaseKey);

  const createEmbeddings = async (input:any) => {
    // const fileBuffer = input.buffer;
    console.log(input,"the input")
    const text = input?.buffer?.toString('utf-8');
    // const text = fs.readFileSync('pizzareview.txt', 'utf8');
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 200,
      chunkOverlap: 50,
    });
    const docs = await textSplitter.createDocuments([text]);
    // const vectorStore = await SupabaseVectorStore.fromDocuments(docs, new OpenAIEmbeddings(), {
    //   client,
    //   tableName: 'documents',
    //   queryName: 'match_documents',
    // });
    console.log(docs,"the docs things")
  };

  const run = async () => {
    //the upload part
    const vectorStore = await SupabaseVectorStore.fromTexts(
      ['Hello world', 'Bye bye', "What's this?"],
      [{ id: 2 }, { id: 1 }, { id: 3 }],
      new OpenAIEmbeddings({ openAIApiKey: openaikey }),
      {
        client,
        tableName: 'documents',
        queryName: 'match_documents',
      },
    );
    console.log('ezi dersual');
    const resultOne = await vectorStore.similaritySearch('Hello');

    console.log(resultOne, 'the result is here');
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    console.log(formData,"the form data");
    // createEmbeddings(formData)
    try {
      await axios.post('/api/testupload/embedding', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // run();
      console.log('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  const handleSearch = async () => {
    console.log(question, 'the query here');
    // let { data, error } = await supabase.rpc('search_ai_data', {
    //   question,
    // });

    // if (error) console.error(error, 'the error');
    // else console.log(data, 'the answer');
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
