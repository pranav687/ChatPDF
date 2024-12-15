import { Pinecone } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./db/s3-server";
import pdfParse from "pdf-parse";
import fs from 'fs'

export const getPineconeClient = () => {
    return new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!,
    });
};

export async function loadS3IntoPinecone(filekey: string) {
    console.log("downloading s3 in to file sysytem")
    const file_name = await downloadFromS3(filekey)
    if (!file_name) {
        throw new Error('could not download from S3')
    }
    if (!fs.existsSync(file_name)) {
        throw new Error(`File not found: ${file_name}`);
    }
    const pdfBuffer = fs.readFileSync(file_name);
    console.log('PDF Buffer Length:', pdfBuffer.length);
    const pdfData = await pdfParse(pdfBuffer);
    const pages = pdfData.text;
    console.log('Parsed Text:', pages);
    return pages;

}