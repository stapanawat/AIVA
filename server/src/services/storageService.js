const fs = require('fs');
const path = require('path');

let s3Client = null;
let PutObjectCommand = null;

const bucketName = process.env.AWS_S3_BUCKET;
const region = process.env.AWS_REGION;

// Try to initialize AWS S3 if credentials are provided in env
if (
  process.env.AWS_ACCESS_KEY_ID &&
  process.env.AWS_SECRET_ACCESS_KEY &&
  region &&
  bucketName
) {
  try {
    const { S3Client, PutObjectCommand: PutCmd } = require('@aws-sdk/client-s3');
    s3Client = new S3Client({
      region: region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    PutObjectCommand = PutCmd;
    console.log('[Storage Service] Initialized Amazon S3 storage provider.');
  } catch (err) {
    console.error('[Storage Service] Failed to load S3 SDK, falling back to local storage:', err.message);
  }
} else {
  console.warn('[Storage Service] AWS credentials or S3 bucket not specified. Using local file storage fallback.');
}

/**
 * Uploads a file to Amazon S3 or local directory.
 * @param {Buffer} fileBuffer - The file content buffer
 * @param {string} originalName - Original filename
 * @param {string} mimeType - File mimetype
 * @returns {Promise<object>} - Object containing { url: string, key: string, storageType: 'S3' | 'LOCAL' }
 */
const uploadFile = async (fileBuffer, originalName, mimeType) => {
  const fileExt = path.extname(originalName);
  const uniqueId = Date.now() + '-' + Math.floor(Math.random() * 1000000);
  const uniqueFilename = `${uniqueId}${fileExt}`;

  // 1. AWS S3 Upload Flow
  if (s3Client && PutObjectCommand) {
    try {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: uniqueFilename,
        Body: fileBuffer,
        ContentType: mimeType,
      });

      await s3Client.send(command);
      const url = `https://${bucketName}.s3.${region}.amazonaws.com/${uniqueFilename}`;
      
      console.log(`[Storage Service] Uploaded file ${originalName} to S3: ${url}`);
      return {
        url,
        key: uniqueFilename,
        storageType: 'S3',
      };
    } catch (s3Error) {
      console.error('[Storage Service] S3 upload error, falling back to local:', s3Error.message);
    }
  }

  // 2. Local File Storage Fallback
  const uploadsDir = path.resolve(__dirname, '../../../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const localPath = path.join(uploadsDir, uniqueFilename);
  await fs.promises.writeFile(localPath, fileBuffer);

  const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
  const url = `${backendUrl}/uploads/${uniqueFilename}`;

  console.log(`[Storage Service] Saved file ${originalName} locally: ${url}`);
  return {
    url,
    key: uniqueFilename,
    storageType: 'LOCAL',
    localPath
  };
};

/**
 * Downloads/Reads a file buffer from local path or S3.
 * @param {object} storageObj - The object returned by uploadFile
 * @returns {Promise<Buffer>} - File buffer
 */
const getFileBuffer = async (storageObj) => {
  if (storageObj.storageType === 'S3') {
    if (!s3Client) {
      throw new Error('S3 Client is not initialized.');
    }
    const { GetObjectCommand } = require('@aws-sdk/client-s3');
    const getCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: storageObj.key
    });
    const response = await s3Client.send(getCommand);
    // Convert readable stream to buffer
    const streamToBuffer = (stream) =>
      new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks)));
      });
    return await streamToBuffer(response.Body);
  } else {
    // Local storage
    const localPath = storageObj.localPath || path.resolve(__dirname, '../../../uploads', storageObj.key);
    return await fs.promises.readFile(localPath);
  }
};

module.exports = {
  uploadFile,
  getFileBuffer
};
