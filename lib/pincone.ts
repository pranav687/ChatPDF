import { PageNumber } from './../node_modules/aws-sdk/clients/quicksight.d';
import { Pinecone } from "@pinecone-database/pinecone";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document, RecursiveCharacterTextSplitter } from '@pinecone-database/doc-splitter'
import fs from "fs";
import { downloadFromS3 } from './s3-server';


export const getPineconeClient = () => {
    return new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!,
    });
};

type PDFPage = {
    pageContent: string,
    metadata: {
        loc: { pageNumber: number }
    }
}

export async function loadS3IntoPinecone(filekey: string) {
    try {
        console.log("Downloading file from S3...");
        const file_path = await downloadFromS3(filekey);

        if (!file_path) {
            throw new Error("Could not download file from S3.");
        }
        console.log("File downloaded and saved at:", file_path);
        const loader = new PDFLoader(file_path);
        const pages = (await loader.load()) as PDFPage[];
        console.log("Pages loaded from PDF:", pages);

        const documents = await Promise.all(pages.map(prepareDocument))


        return pages;
    } catch (error) {
        console.error("Error in loadS3IntoPinecone:", error);
        throw new Error("Failed to load S3 file into Pinecone.");
    }
}
async function embeeDocument() {

}

export const truncateString = (str: string, bytes: number) => {
    const enc = new TextEncoder()
    return new TextDecoder('utf-8').decode(enc.encode(str).slice(0, bytes))
}

async function prepareDocument(page: PDFPage) {
    let { pageContent, metadata } = page
    pageContent = pageContent.replace(/\n/g, "")
    const spiltter = new RecursiveCharacterTextSplitter()
    const docs = await spiltter.splitDocuments([
        new Document({
            pageContent,
            metadata: {
                PageNumber: metadata.loc.pageNumber,
                text: truncateString(pageContent, 36000)
            }
        })
    ])
    return docs
}
