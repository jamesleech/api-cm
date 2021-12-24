import { AWSError } from 'aws-sdk';
import { DynamoDBPrimaryKey } from '@models/DynamoDbPrimaryKey';

export interface DynamoDbItem<T extends DynamoDBPrimaryKey> {
    error?: AWSError;
    item?: T | Omit<T, 'partitionKey' | 'sortKey'>;
}

export interface DynamoDbItems<T extends DynamoDBPrimaryKey> {
    error?: AWSError;
    items?: T[] | Omit<T, 'partitionKey' | 'sortKey'>[];
    nextPage?: string;
}
