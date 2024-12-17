import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';

export async function downloadFromS3(file_key: string) {
    try {
        AWS.config.update({
            accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESSS_KEY,
            secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY,
        });

        const s3 = new AWS.S3({
            params: {
                Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
            },
            region: 'us-east-1',
        });

        const params = {
            Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
            Key: file_key,
        };

        console.log("Fetching file from S3...");
        const obj = await s3.getObject(params).promise();

        // Ensure the directory exists
        const tempDir = path.join(process.cwd(), 'temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const file_name = path.join(tempDir, `pdf-${Date.now()}.pdf`);

        fs.writeFileSync(file_name, obj.Body as Buffer);
        console.log("File downloaded and saved at:", file_name);
        return file_name;
    } catch (error) {
        console.error("Error while downloading from S3:", error);
        throw error;
    }
}
