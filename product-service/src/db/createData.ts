const AWS = require("aws-sdk");
const dynamoDbInstance = new AWS.DynamoDB({
  apiVersion: "2012-08-10",
  region: "us-east-1",
});

const productsData = require("./products.json");
const { v4: uuidv4 } = require("uuid");

const TABLE_NAMES = {
  products: "products",
  stocks: "stocks",
};

const generateProductParams = ({ id, price, title, description }) => ({
  TableName: TABLE_NAMES.products,
  Item: {
    id: { S: id },
    title: { S: title },
    price: { S: String(price) },
    description: { S: description },
  },
});

const generateStockParams = ({ id, count }) => ({
  TableName: TABLE_NAMES.stocks,
  Item: {
    product_id: { S: id },
    count: { S: String(count) },
  },
});

const putItem = (itemParams) =>
  dynamoDbInstance.putItem(itemParams, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
    }
  });

productsData.products.forEach((product) => {
  const productId = uuidv4();

  putItem(generateProductParams({ ...product, id: productId }));
  putItem(generateStockParams({ ...product, id: productId }));
});
