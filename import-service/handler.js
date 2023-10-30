const AWS = require("aws-sdk");
const csv = require("csv-parser");
const stripBom = require("strip-bom-stream");
const bucketName = "import-project";

const defaultHeaders = {
  headers: { "Access-Control-Allow-Origin": "*" },
};

const s3 = new AWS.S3({ region: "us-east-1" });
const sqs = new AWS.SQS({ region: "us-east-1", apiVersion: "2012-11-05" });
const QueueUrl =
  "https://sqs.us-east-1.amazonaws.com/206809917337/catalogItemsQueue";

module.exports = {
  importProductsFile: async ({ pathParameters: { name } }) => {
    const params = {
      Bucket: bucketName,
      Key: `/uploaded/${name}`,
      ContentType: "text/csv",
    };

    try {
      const res = await s3.getSignedUrlPromise("putObject", params);

      return {
        ...defaultHeaders,
        statusCode: 200,
        body: res,
      };
    } catch (error) {
      console.error("Error: ", error);
      return {
        ...defaultHeaders,
        statusCode: 500,
        body: error,
      };
    }
  },
  importFileParser: (event) => {
    event.Records.forEach(async (record) => {
      const s3Stream = s3
        .getObject({
          Bucket: bucketName,
          Key: record.s3.object.key,
        })
        .createReadStream();

      const csvData = [];
      s3Stream
        .pipe(stripBom())
        .pipe(csv())
        .on("data", async (data) => {
          console.log(data, "CSV DATA HERE!");
          csvData.push(data);
        })
        .on("end", async () => {
          if (csvData.length) {
            sqs.sendMessage(
              {
                QueueUrl: QueueUrl,
                MessageBody: JSON.stringify(csvData),
              },
              (err, data) => {
                console.log(err, data);
              }
            );
          }

          s3.copyObject(
            {
              Bucket: bucketName,
              CopySource: `${bucketName}/${record.s3.object.key}`,
              Key: record.s3.object.key.replace("uploaded", "parsed"),
            },
            (err, data) => {
              console.log(err, data);
            }
          );
        });
    });
  },
};
