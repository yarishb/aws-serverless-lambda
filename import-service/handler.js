const AWS = require("aws-sdk");
const fastCSV = require('fast-csv')

const bucketName = "import-project";

const defaultHeaders = {
  headers: { "Access-Control-Allow-Origin": "*" },
};

const s3 = new AWS.S3({ region: "us-east-1" });
const sqs = new AWS.SQS({ region: 'us-east-1', apiVersion: '2012-11-05'  })

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
        Bucket: bucketName,
        Key: record.s3.object.key
    }).createReadStream();

    fastCSV.fromStream(s3Stream)
      .on('data', (data) => {
        console.log(data, 'data');

        sqs.sendMessage({
          QueueUrl: 'https://sqs.us-east-1.amazonaws.com/206809917337/catalogItemsQueue',
          MessageBody: JSON.stringify(data),
        }).promise()
      })
      .on('end', () => {
        s3.copyObject({
          Bucket: bucketName,
          CopySource: `${bucketName}/${record.s3.object.key}`,
          Key: record.s3.object.key.replace('uploaded', 'parsed')
        }).promise();
      })

    // console.log(record.s3.object.key);
    // s3Stream.pipe(csv())
    // .on('data', (data) => {
    //   console.log(data, 'data');

    //   sqs.sendMessage({
    //     QueueUrl: 'https://sqs.us-east-1.amazonaws.com/206809917337/catalogItemsQueue',
    //     MessageBody: JSON.stringify(data),
    //   }).promise()
    // })
    // .on('end', () => {
    //   s3.copyObject({
    //     Bucket: bucketName,
    //     CopySource: `${bucketName}/${record.s3.object.key}`,
    //     Key: record.s3.object.key.replace('uploaded', 'parsed')
    //   }).promise();
    // })
    // .on('error', (error) => console.error(error, "Caught an error"))
    })
  }
}
