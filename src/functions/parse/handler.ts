import axios from 'axios';
import { middyfySNS } from '@libs/lambda';
import { formatJSONResponse } from '@libs/formatJSONResponse';
import { dynamoDbBatchWrite, dynamoDbGet, dynamoDbPutItem } from '@libs/dynamoDbOperations';
import Log from '@dazn/lambda-powertools-logger';
import { MAX_BATCH_WRITE_ITEMS } from '@libs/dynamoDbClient';
import { Site } from '@models/Site';
import { latestAddedCreateQuery, latestAddedGetQuery } from '@queries/latestAddedQueries';
import { LatestAdded } from '@models/LatestAdded';
import { DynamoDBPrimaryKey } from '@models/DynamoDbPrimaryKey';
import { siteBatchWriteQuery } from '@queries/siteQueries';
import { parseMarkup } from '@src/functions/parse/parseMarkup';
import schema from '@src/functions/parse/schema';
import { ValidatedEventSNSEvent } from '@libs/snsTopic';
import { addCoords } from '@functions/parse/addCoords';

const defaultUri = 'https://www.qld.gov.au/health/conditions/health-alerts/coronavirus-covid-19/current-status/contact-tracing';

const getLatestAdded = async (): Promise<string | undefined> => {
  const params = latestAddedGetQuery();
  Log.info('getLatestAdded', params);
  const { error, item } = await dynamoDbGet<LatestAdded & DynamoDBPrimaryKey>(params);
  if (item) {
    return item.latestAdded;
  }
  Log.error('getLatestAdded error', error);
  return undefined;
};

const storeSites = async (sites: Site[], size = MAX_BATCH_WRITE_ITEMS): Promise<number> => {
  if (sites.length === 0) {
    Log.info('no new sites since last update');
  }

  let result = 0;
  for (let i = 0; i < sites.length; i += size) {
    const chunk = sites.slice(i, i + size);
    // store the chunk
    Log.info(`storing chunk of size: ${chunk.length}`);
    const params = siteBatchWriteQuery(chunk);
    // eslint-disable-next-line no-await-in-loop
    const { error } = await dynamoDbBatchWrite(params);
    if (error) {
      Log.error('storeSites error', chunk);
    } else {
      result += chunk.length;
    }
  }
  return result;
};

const storeLatestAdded = async (latestAdded: string): Promise<void> => {
  const params = latestAddedCreateQuery(latestAdded);
  await dynamoDbPutItem(params);
};

const parse: ValidatedEventSNSEvent<typeof schema, {}> = async (event) => {
  Log.info('got event', event);
  const uri = event?.body?.uri || defaultUri;
  const getMarkupTask = axios.get(uri);
  const latestAdded = await getLatestAdded();
  Log.info('latestAdded', { latestAdded });
  const { data } = await getMarkupTask;
  const { sites, newLatestAdded } = parseMarkup(data, latestAdded);
  Log.info('got sites', { newLatestAdded, sites: sites.length });

  // sort and remove duplicates
  const sorted = [...new Set(sites)].sort((a, b) => (a.added < b.added ? 1 : 0));
  const mapped = addCoords(sorted);
  const result = await storeSites(mapped);

  if (newLatestAdded) {
    await storeLatestAdded(newLatestAdded);
  }

  return formatJSONResponse({
    message: `Stored ${result} sites from ${uri}`,
  });
};

export const main = middyfySNS(parse);
