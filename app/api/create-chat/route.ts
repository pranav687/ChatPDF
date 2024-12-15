import { downloadFromS3 } from "@/lib/db/s3-server";
import { loadS3IntoPinecone } from "@/lib/pincone";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { file_key, file_name } = body;
        // await loadS3IntoPinecone(file_key);
        // console.log(pages)
        const fileName = await downloadFromS3(file_key);
        console.log("Download completed. File path is:", fileName);
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
