const s3 = require("./config/s3");
const { ListBucketsCommand } = require("@aws-sdk/client-s3");

(async () => {
  try {
    const { Buckets } = await s3.send(new ListBucketsCommand({}));
    console.log("Buckets disponibles :", Buckets);
  } catch (err) {
    console.error("Erreur S3 :", err);
  }
})();
