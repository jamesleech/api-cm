import { GetItemOutput, QueryOutput } from 'aws-sdk/clients/dynamodb';
import { AWSError } from 'aws-sdk';
import { StatusCodes } from 'http-status-codes';
import { DateTime } from 'luxon';
import { DynamoDbItem, DynamoDbItems } from '@models/DynamoDbItem';
import { DynamoDBPrimaryKey } from '@models/DynamoDbPrimaryKey';

export const dynamoDbItemResponse = <T extends DynamoDBPrimaryKey>(data?: GetItemOutput, error?: AWSError): DynamoDbItem<T> => {
  if (error) {
    return {
      error,
    };
  }

  if (data && data.Item) {
    const { Item } = data;
    return {
      item: Item as unknown as T,
    };
  }

  return {
    error: {
      code: 'NotFound',
      name: 'Not Found',
      message: 'Not Found',
      statusCode: StatusCodes.NOT_FOUND,
      time: DateTime.now().toJSDate(),
    },
  };
};

export const dynamoDbItemsResponse = <T extends DynamoDBPrimaryKey>(data?: QueryOutput, error?: AWSError): DynamoDbItems<T> => {
  if (error) {
    return {
      error,
    };
  }

  if (data && data.Items) {
    const { Items } = data;
    return {
      items: Items as unknown as T[],
      nextPage: JSON.stringify(data?.LastEvaluatedKey),
    };
  }

  return {
    error: {
      code: 'NotFound',
      name: 'Not Found',
      message: 'Not Found',
      statusCode: StatusCodes.NOT_FOUND,
      time: DateTime.now().toJSDate(),
    },
  };
};
