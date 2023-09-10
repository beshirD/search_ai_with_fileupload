import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { getServerSession } from '@roq/nextjs';
import puppeteer from 'puppeteer';

const supabaseUrl = process.env.SUPABASE_BASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const openaikey = process.env.OPENAI_API_KEY;

const client = createClient(supabaseUrl, supabaseServiceKey);

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: any, res: any) => {
  const linkFromFrontend = req.body.link;
// const linkFromFrontend = 'https://roq-ai-search-mvp.vercel.app/'
  console.log(linkFromFrontend, 'link check');
  const { roqUserId, user } = await getServerSession(req);
  let text = '';
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 50,
  });
  text = await getTextFromLink(linkFromFrontend);
  const docs = await textSplitter.createDocuments([text]);
  const embeddings = await createEmbeddings(docs,roqUserId);

  return res.status(200).json({ message: 'File uploaded successfully' });
};

const createEmbeddings = async (docs:any,tableName:string) => {
    await SupabaseVectorStore.fromDocuments(
      docs,
      new OpenAIEmbeddings({ openAIApiKey: openaikey }),
      {
        client,
        tableName:`user_${tableName}`,
        queryName: `match_user_${tableName}`, 
      }
    );
  };
const getTextFromLink = async (url: any) => {
  const browser = await puppeteer.launch({ timeout: 60000 });
  const page = await browser.newPage();

  await page.goto(url,{timeout: 60000});

  let onlyText = await page.evaluate(() => document.body.innerText);
  const currentURL = page.url();
  const links = await page.evaluate((currentURL) => {
    // Select all <a> elements and filter out the current URL
    return Array.from(document.querySelectorAll('a'), (e) => e.href).filter((href) => href !== currentURL);
  }, currentURL);
    // comment out the loop code below to only get the first page content 

    for (const link of links) {
      const newPage = await browser.newPage();
      await newPage.goto(link);
      const linkText = await newPage.evaluate(() => document.body.innerText);
      onlyText += '\n' + linkText;
      await newPage.close();
    }

  await browser.close();
  return onlyText;
};
