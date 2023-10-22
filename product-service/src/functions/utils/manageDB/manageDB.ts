import { Product } from "@interfaces/product";
const AWSInstance = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const dbClient = new AWSInstance.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: "us-east-1",
});

enum TableName {
  products = "products",
  stocks = "stocks",
}

const retrieveDataFromTable = (tableName: TableName, query = {}) =>
  dbClient
    .scan({
      TableName: tableName,
      ...query,
    })
    .promise();

const retrieveItemByKeyFromTable = (
  tableName: TableName,
  key: string,
  value: unknown
) =>
  dbClient
    .query({
      TableName: tableName,
      KeyConditionExpression: `${key} = :${key}`,
      ExpressionAttributeValues: {
        [`:${key}`]: value,
      },
    })
    .promise();

const createItemInTable = (tableName: TableName, itemData = {}) =>
  dbClient
    .put({
      TableName: tableName,
      Item: {
        ...itemData,
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
    const { Items: products } = await retrieveDataFromTable(TableName.products);
    const { Items: stocks } = await retrieveDataFromTable(TableName.stocks);

    return formatProductList(products, stocks);
  } catch (error) {
    console.log(error);
  }
};

export const getProductWithStockById = async (productId) => {
  try {
    const { Items: product } = await retrieveItemByKeyFromTable(
      TableName.products,
      "id",
      productId
    );
    const { Items: productStock } = await retrieveItemByKeyFromTable(
      TableName.stocks,
      "product_id",
      productId
    );

    if (!product || !productStock) return null;

    return joinProductWithStock(product[0], productStock[0]);
  } catch (error) {
    console.log(error);
  }
};

export const createProductItem = async (productFields: Product) => {
  try {
    return await createItemInTable(TableName.products, {
      ...productFields,
      id: uuidv4(),
    });
  } catch (error) {
    console.log(error, "something went wrong while creating a product");
  }
};
