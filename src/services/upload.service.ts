import { v4 as uuid } from "uuid";
import { bucket } from "../config/bucket.config"

export const uploadFile = async (file: any) => {
    return new Promise((resolve, reject) => {
        file.originalFileName = generateUniqueFilename(file.originalname);
        const blob = bucket.file(file.originalFileName);
        
        const blobStream = blob.createWriteStream({
            resumable: false,
        });

        blobStream.on('error', (error) => {
            reject(error);
        });

        blobStream.on('finish', () => {
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            resolve(publicUrl);
        });

        blobStream.end(file.buffer);
    });
}

export const generateUniqueFilename = (fileName: string) => {
	const trimmedFilename : string = fileName.replace(/\s+/g, `-`);
	const unique : string = uuid();
	return `${unique}-${trimmedFilename}`;
};

