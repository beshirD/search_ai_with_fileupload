// pages/api/upload.js
import { createClient } from '@supabase/supabase-js';
import multer from 'multer';
import { NextApiRequest, NextApiResponse } from 'next';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { RetrievalQAChain, ConversationalRetrievalQAChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models';
import { getServerSession } from '@roq/nextjs';

const supabaseUrl = process.env.SUPABASE_BASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const openaikey = process.env.OPENAI_API_KEY;

const client = createClient(supabaseUrl, supabaseServiceKey);

// eslint-disable-next-line import/no-anonymous-default-export
export default async  (req: any, res: any) => {
  const { roqUserId, user } = await getServerSession(req);
  // Use the upload middleware to process the file

  // console.log("ezi metual")
  const body = req.body;
  const result = await query(body?.query);
  return res.status(200).json({ data: result });
};
const query = async (query: any) => {
  const chat = new ChatOpenAI({
    modelName: 'gpt-3.5-turbo',
    apiKey: openaikey ,
  });

  // console.log(client)
  const vectorStore = await SupabaseVectorStore.fromExistingIndex(new OpenAIEmbeddings(), {
    client,
    tableName: 'documents',
    queryName: 'match_documents',
  });

  let chain = ConversationalRetrievalQAChain.fromLLM(chat, vectorStore.asRetriever(), { returnSourceDocuments: true });

  // console.log(chain.questionGeneratorChain.prompt.template);

  const res = await chain.call({ question: query, chat_history: [] });
  // console.log(res.text,"the response")
  return res.text;
};
