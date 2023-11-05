import { createProductItem } from "@functions/utils/manageDB/manageDB";
const AWS = require("aws-sdk");

const sns = new AWS.SNS({ region: "us-east-1" });

export const publishCreatedProductMessage = async (product) => {
  try {
    await sns
      .publish({
        Subject: "Product has been created",
        Message: JSON.stringify(product),
        TopicArn: process.env.SNS_TOPIC,
      })
      .promise();
  } catch (error) {
    console.error(
      "SOMETHING WENT WRONG WHEN TRYING TO PUBLISH A MESSAGE",
      error
    );
  }
};

export const catalogBatchProcessHandler = () => async (event) => {
  try {
    event.Record?.forEach(async (record) => {
      const product = JSON.parse(record.body);

      await createProductItem(product);
      await publishCreatedProductMessage(product);
    });

    return {
      statusCode: 200,
      body: "product was successfully created!!!",
    };
  } catch (error) {
    console.log(error, "catalogBatchProcessHandler error");
    throw error;
  }
};

export const main = catalogBatchProcessHandler;
