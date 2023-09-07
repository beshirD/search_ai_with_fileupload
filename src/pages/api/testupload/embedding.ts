// pages/api/upload.js
import { createClient } from '@supabase/supabase-js';
import multer from 'multer';
import { NextApiRequest, NextApiResponse } from 'next';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import {pdfFile, txtFile} from '../../../lib/formatHandler/index'
const supabaseUrl = process.env.SUPABASE_BASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const openaikey = process.env.OPENAI_API_KEY;

const client = createClient(supabaseUrl, supabaseServiceKey);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for text files (adjust as needed)
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadMiddleware = upload.single('file');

export default async (req: any, res: any) => {
  // Use the upload middleware to process the file
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      console.error('Error uploading file:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const file = req.file;
    // console.log(file, 'the file');
    if (!file) {
      console.log('the error is here');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // console.log(file, 'the input');
    const fileParts = file.originalname.split('.');
    const fileExtension = fileParts[fileParts.length - 1];
    console.log(fileExtension, 'the extention to be');
    let docs;
    if(fileExtension == "txt"){
        docs = await txtFile(file)
        console.log(docs,"the docs")
    }
    else if(fileExtension == "pdf"){
        docs = await pdfFile(file)
        console.log(docs,"test 2")
    }
    
    // const text = file?.buffer?.toString('utf-8');
    // const textSplitter = new RecursiveCharacterTextSplitter({
    //   chunkSize: 200,
    //   chunkOverlap: 50,
    // });
    // const docs = await textSplitter.createDocuments([text]);

    // console.log(docs,"the answer");
    // const embeddings = await createEmbeddings(docs);

    return res.status(200).json({ message: 'File uploaded successfully' });
  });
};

const createEmbeddings = async (docs: any) => {
  // const fileBuffer = input.buffer;

  const vectorStore = await SupabaseVectorStore.fromDocuments(docs, new OpenAIEmbeddings({ openAIApiKey: openaikey }), {
    client,
    tableName: 'documents',
    queryName: 'match_documents',
  });
  console.log(vectorStore, 'the vector store things');
};
