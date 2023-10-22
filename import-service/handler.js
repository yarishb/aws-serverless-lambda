const AWS = require("aws-sdk");
const csv = require('csv-parser');

const bucketName = "import-project";

const defaultHeaders = {
  headers: { "Access-Control-Allow-Origin": "*" },
};

const s3 = new AWS.S3({ region: "us-east-1" });

module.exports = {
  importProductsFile: async ({ pathParameters: { name } }) => {
    const params = {
      Bucket: bucketName,
      Key: `/uploaded/${name}`,
      ContentType: 'image/jpeg'
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
  importFileParser: async (event) => {
    event.Records.forEach(record => {
      const s3Stream = s3.getObject({
          Bucket: BUCKET,
          Key: record.s3.object.key
      }).createReadStream();

      s3Stream.pipe(csv())
          .on('data', (data) => {
              console.log(data);
          })
          .on('end', async () => {
              await s3.copyObject({
                  Bucket: BUCKET,
                  CopySource: `${BUCKET}/${record.s3.object.key}`,
                  Key: record.s3.object.key.replace('uploaded', 'parsed')
              }).promise();
        })
    })
  }
}
