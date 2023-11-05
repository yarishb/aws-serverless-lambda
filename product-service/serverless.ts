import type { AWS } from "@serverless/typescript";

import getProductsList from "@functions/getProductsList";
import getProductById from "@functions/getProductById";
import createProduct from "@functions/createProduct";
import catalogBatchProcess from "@functions/catalogBatchProcess";

import {
  ProductTable,
  StocksTable,
  CatalogItemsQueue,
  CreateProductTopic,
  CreateProductTopicSubscription,
} from "@db/tables";

const serverlessConfiguration: AWS = {
  service: "products-service-testing",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    region: "us-east-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      REGION: "us-east-1",
      STAGE: "dev",
      PRODUCT_TABLE: "Products",
      STOCK_TABLE: "Stocks",
      SNS_TOPIC: "CreateProductTopic",
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: ["dynamodb:*"],
            Resource: "*",
          },
          {
            Effect: "Allow",
            Action: ["sqs:*"],
            Resource: {
              "Fn::GetAtt": ["CatalogItemsQueue", "Arn"],
            },
          },
          {
            Effect: "Allow",
            Action: ["sns:*"],
            Resource: {
              Ref: "CreateProductTopic",
            },
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: {
    getProductsList,
    getProductById,
    createProduct,
    catalogBatchProcess,
  },
  resources: {
    Resources: {
      Products: ProductTable,
      Stocks: StocksTable,
      CatalogItemsQueue: CatalogItemsQueue,
      CreateProductTopic: CreateProductTopic,
      CreateProductTopicSubscription: CreateProductTopicSubscription,
    },
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
