import { loadS3IntoPinecone } from "@/lib/pincone";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { file_key, file_name } = body;
        const pages = await loadS3IntoPinecone(file_key);
        console.log(pages)
        console.log(file_key, file_name);

        return NextResponse.json({
            message: "File uploaded and chat created successfully",
            file_key,
            file_name,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
