import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { Document, RecursiveCharacterTextSplitter } from '@pinecone-database/doc-splitter'
import fs from "fs";
import { downloadFromS3 } from './s3-server';
import { getembeddings } from './embeddings';
import md5 from "md5";
import { convertToAscii } from './utils';


const pineconeclient = new Pinecone({
    apiKey: 'pcsk_57V9Zc_Ud7cxENhrQYPw85km4mdkZiC6JrzbZTUriwddDwxxhmLgHsf7hpMhNuctPN7JNR'
});

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

        const vectors = await Promise.all(documents.flat().map(embedDocument))


        const validVectors = vectors.filter((vector) => vector !== null) as PineconeRecord[]
        const pineconeIndex = pineconeclient.Index('chatpdf')
        console.log("inserting vectors into pinecone")
        const namespace = pineconeIndex.namespace(convertToAscii(filekey));
        await namespace.upsert(validVectors);

        return documents[0];
    } catch (error) {
        console.error("Error in loadS3IntoPinecone:", error);
        throw new Error("Failed to load S3 file into Pinecone.");
    }
}

async function embedDocument(doc: Document) {
    try {
        const embeddings = await getembeddings(doc.pageContent)
        const hash = md5(doc.pageContent)
        return {
            id: hash,
            values: embeddings,
            metadata: {
                text: doc.metadata.text,
                PageNumber: doc.metadata.PageNumber
            }
        } as PineconeRecord
    } catch (error) {
        console.log(error)
        return null
    }
}

export const truncateString = (str: string, bytes: number) => {
    const enc = new TextEncoder()
    return new TextDecoder('utf-8').decode(enc.encode(str).slice(0, bytes))
}

async function prepareDocument(page: PDFPage) {
    let { pageContent, metadata } = page
    pageContent = pageContent.replace(/\n/g, ' ')
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
