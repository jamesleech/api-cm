import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import { Site } from '@models/Site';
import { Key } from 'aws-sdk/clients/dynamodb';

const { DYNAMODB_TABLE = '' } = process.env;

// partitionKey: site ,
// sortKey: date(without time component)suburb#location#added, data
// site: {
//     date: '2021-12-15T13:25',
//     lgas: 'QLD21',
//     advice: 'Casual',
//     location: 'Big W Macarthur',
//     address: 'G/255 Queen St',
//     suburb: 'Brisbane City',
//     datetext: 'Wednesday 15 December 2021',
//     timetext: '1.25pm - 1.45pm',
//     added: '2021-12-18T20:18'
// },

interface SiteItem {
    partitionKey: string;
    sortKey: string;
    site: Site;
}

export const siteGetQuery = (fromDate: string, toDate: string, page?: string): DocumentClient.QueryInput => ({
  TableName: DYNAMODB_TABLE,
  ExclusiveStartKey: page ? JSON.parse(page) as Key : undefined,
  KeyConditionExpression: 'partitionKey = :site AND sortKey BETWEEN :fromDate AND :toDate',
  ExpressionAttributeValues: {
    ':site': 'site',
    ':fromDate': fromDate,
    ':toDate': toDate,
  },
});

const siteItem = (site: Site): SiteItem => ({
  partitionKey: 'site',
  sortKey: `${site.date.slice(0, 10)}#${site.suburb}#${site.advice}#${site.location}#${site.added}#${site.date.slice(11, 16)}`, // just make the record unique once we have it sorted by date and suburb
  site,
});

export const siteBatchWriteQuery = (
  sites: Site[],
): DocumentClient.BatchWriteItemInput => ({
  RequestItems: {
    [DYNAMODB_TABLE]: sites.map((site) => ({
      PutRequest: {
        Item: siteItem(site),
      },
    })),
  },
});
