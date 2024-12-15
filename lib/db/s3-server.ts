import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';

export async function downloadFromS3(file_key: string) {
    try {
        // Update AWS credentials
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

        const obj = await s3.getObject(params).promise();

        const tempDir = path.join(__dirname, 'temp');
        const file_name = path.join(tempDir, `pdf-${Date.now()}.pdf`);
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        fs.writeFileSync(file_name, obj.Body as Buffer);
        return file_name;
    } catch (error) {
        console.log("Error downloading from S3:", error);
        throw new Error('Could not download the file from S3');
    }
}
