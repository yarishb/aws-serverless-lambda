export const ProductTable = {
  Type: "AWS::DynamoDB::Table",
  Properties: {
    TableName: "products",
    AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
    KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  },
};

export const StocksTable = {
  Type: "AWS::DynamoDB::Table",
  Properties: {
    TableName: "stocks",
    AttributeDefinitions: [{ AttributeName: "product_id", AttributeType: "S" }],
    KeySchema: [{ AttributeName: "product_id", KeyType: "HASH" }],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  },
};

export const CatalogItemsQueue = {
  Type: "AWS::SQS::Queue",
  Properties: {
    QueueName: "catalogItemsQueue",
  },
};

export const CreateProductTopic = {
  Type: "AWS::SNS::Topic",
  Properties: {
    TopicName: "createProductTopic",
  },
};

export const CreateProductTopicSubscription = {
  Type: "AWS::SNS::Subscription",
  Properties: {
    Endpoint: "yhbohdan@gmail.com",
    Protocol: "email",
    TopicArn: {
      Ref: "CreateProductTopic",
    },
  },
};
