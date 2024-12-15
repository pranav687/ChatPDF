import { Pinecone } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./db/s3-server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import fs from "fs";

export const getPineconeClient = () => {
    return new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!,
    });
};

export async function loadS3IntoPinecone(filekey: string) {
    try {
        console.log("Downloading file from S3...");
        const file_path = await downloadFromS3(filekey);

        if (!file_path) {
            throw new Error("Could not download file from S3.");
        }
        console.log("File downloaded and saved at:", file_path);
        const loader = new PDFLoader(file_path);
        const pages = await loader.load();
        console.log("Pages loaded from PDF:", pages);


        return pages;
    } catch (error) {
        console.error("Error in loadS3IntoPinecone:", error);
        throw new Error("Failed to load S3 file into Pinecone.");
    }
}
