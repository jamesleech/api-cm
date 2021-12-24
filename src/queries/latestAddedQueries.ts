import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';

const { DYNAMODB_TABLE = '' } = process.env;

export const latestAddedCreateQuery = (
  latestAdded: string,
): DocumentClient.PutItemInput => ({
  TableName: DYNAMODB_TABLE,
  Item: {
    partitionKey: 'latestAdded',
    sortKey: 'latestAdded',
    latestAdded,
  },
});

export const latestAddedGetQuery = (): DocumentClient.GetItemInput => ({
  TableName: DYNAMODB_TABLE,
  Key: {
    partitionKey: 'latestAdded',
    sortKey: 'latestAdded',
  },
});
