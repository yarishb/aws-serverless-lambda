import { Product, ProductList } from "@interfaces/product";
import { compose } from "../utils";

const AWSInstance = require("aws-sdk");

const dbClient = new AWSInstance.DynamoDB.DocumentClient();

const TABLE_NAMES = {
  products: "products",
  stocks: "stocks",
};

const retrieveDataFromTable = (tableName, query = {}) =>
  dbClient
    .scan({
      TableName: tableName,
      ...query,
    })
    .promise();

const retrieveItemByKeyFromTable = (tableName, key, value) =>
  dbClient
    .query({
      TableName: tableName,
      KeyConditionExpression: `${key} = :${key}`,
      ExpressionAttributeValues: {
        [`:${key}`]: value,
      },
    })
    .promise();

const joinProductWithStock = (product, stock) => ({
  ...product,
  stock: stock?.count,
});

const formatProductList = (products, stocks) =>
  products.map((product) => {
    const productStock = stocks.find(
      (stock) => stock.product_id === product.id
    );

    return joinProductWithStock(product, productStock);
  });

export const getAllProductsWithStocks = async () => {
  try {
    const { Items: products } = await retrieveDataFromTable(
      TABLE_NAMES.products
    );
    const { Items: stocks } = await retrieveDataFromTable(TABLE_NAMES.stocks);

    return formatProductList(products, stocks);
  } catch (error) {
    console.log(error);
  }
};

export const getProductWithStockById = async (productId) => {
  try {
    const { Items: product } = await retrieveItemByKeyFromTable(
      TABLE_NAMES.products,
      "id",
      productId
    );
    const { Items: productStock } = await retrieveItemByKeyFromTable(
      TABLE_NAMES.stocks,
      "product_id",
      productId
    );

    if (!product || !productStock) return null;

    return joinProductWithStock(product[0], productStock[0]);
  } catch (error) {
    console.log(error);
  }
};
