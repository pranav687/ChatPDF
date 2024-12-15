import { loadS3IntoPinecone } from "@/lib/pincone";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { file_key, file_name } = body;

        console.log("Starting S3 file download and Pinecone processing...");
        const pages = await loadS3IntoPinecone(file_key);

        return NextResponse.json({
            pages
        });
    } catch (error) {
        console.error("Error during POST:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
