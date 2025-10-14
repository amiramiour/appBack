const { S3Client } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const s3 = new S3Client({
  region: process.env.AWS_REGION, // c’est ici qu’on la lit
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

module.exports = s3;
