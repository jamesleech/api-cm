import Log from '@dazn/lambda-powertools-logger';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import { dynamoDbItemResponse, dynamoDbItemsResponse } from '@mappers/dynamoDbItemResponse';
import { dynamoDbClient } from '@libs/dynamoDbClient';
import { DynamoDBPrimaryKey } from '@models/DynamoDbPrimaryKey';
import { DynamoDbItem, DynamoDbItems } from '@models/DynamoDbItem';

export const dynamoDbGet = async <T extends DynamoDBPrimaryKey>(
  params: DocumentClient.GetItemInput): Promise<DynamoDbItem<T>> => {
  try {
    const result = await dynamoDbClient.get(params).promise();
    return dynamoDbItemResponse(result);
  } catch (error) {
    Log.error('dynamoDbGet', error);
    return dynamoDbItemResponse<T>(undefined, error);
  }
};

export const dynamoDbQuery = async <T extends DynamoDBPrimaryKey>(
  params: DocumentClient.QueryInput): Promise<DynamoDbItems<T>> => {
  try {
    const result = await dynamoDbClient.query(params).promise();
    return dynamoDbItemsResponse(result);
  } catch (error) {
    Log.error('dynamoDbGet', error);
    return dynamoDbItemsResponse<T>(undefined, error);
  }
};

export const dynamoDbPutItem = async <T extends DynamoDBPrimaryKey>(
  params: DocumentClient.PutItemInput,
  item?: T): Promise<DynamoDbItem<T> | T> => {
  try {
    await dynamoDbClient.put(params).promise();
    return { item };
  } catch (error) {
    Log.error('dynamoDbPutItem', error);
    return dynamoDbItemResponse<T>(undefined, error);
  }
};

export const dynamoDbBatchWrite = async <T extends DynamoDBPrimaryKey>(
  params: DocumentClient.BatchWriteItemInput,
  items?: T[] | Omit<T, 'partitionKey' | 'sortKey'>[],
): Promise<DynamoDbItems<T>> => {
  try {
    await dynamoDbClient.batchWrite(params).promise();
    return { items };
  } catch (error) {
    Log.error('dynamoDbBatchWrite', error);
    return dynamoDbItemResponse<T>(undefined, error);
  }
};

export const dynamoDbTransactWrite = async <T extends DynamoDBPrimaryKey>(
  params: DocumentClient.TransactWriteItemsInput,
  items?: T[] | Omit<T, 'partitionKey' | 'sortKey'>[],
): Promise<DynamoDbItems<T>> => {
  try {
    await dynamoDbClient.transactWrite(params).promise();
    return { items };
  } catch (error) {
    if (!(error.code === 'IdempotentParameterMismatchException'
            || error.code === 'TransactionCanceledException')) {
      Log.error('createCheckout error', error);
    }
    return dynamoDbItemResponse<T>(undefined, error);
  }
};
