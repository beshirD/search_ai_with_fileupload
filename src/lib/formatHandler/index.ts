import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import fs from 'fs'
export const txtFile = async (file:any) =>{
    const text = file?.buffer?.toString('utf-8');
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 200,
      chunkOverlap: 50,
    });
    const docs = await textSplitter.createDocuments([text]);
    return docs
}
export const pdfFile = async (file:any)=>{
    console.log(file?.buffer?.toString('utf-8'),"test 3")
    console.log(file,"to check")
    // fs.readFile(file.tempFilePath,'utf-8',(err,data)=>{
    //     if(err){
    //         console.log("error reading file")
    //     }
    //     console.log('content',data)
    // })  
    // const text = file?.data?.toString('utf-8');

    // const textSplitter = new RecursiveCharacterTextSplitter({
    //   chunkSize: 200,
    //   chunkOverlap: 50,
    // });
    // const docs = await textSplitter.createDocuments([text]);
    // return docs
}