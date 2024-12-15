import { Pinecone } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./db/s3-server";
import "pdf-parse";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import fs from 'fs'

export const getPineconeClient = () => {
    return new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!,
    });
};

export async function loadS3IntoPinecone(filekey: string) {
    console.log("downloading s3 in to file sysytem")
    const file_name = await downloadFromS3(filekey)
    console.log(file_name)
    if (!file_name) {
        throw new Error('could not download from S3')
    }
    // const loader = new PDFLoader(file_name)
    // const pages = await loader.load();
    // console.log(pages)
    return {};

}