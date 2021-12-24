import { DateTime } from 'luxon';
import { middyfyHttp } from '@libs/lambda';
import { formatJSONResponse } from '@libs/formatJSONResponse';
import Log from '@dazn/lambda-powertools-logger';
import schema from '@src/functions/parse/schema';
import { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { siteGetQuery } from '@queries/siteQueries';
import { dynamoDbQuery } from '@libs/dynamoDbOperations';

const getSites: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  Log.info('got event', event);
  let { fromDate, toDate } = event?.headers;
  const { page } = event?.headers;

  Log.info('headers', { fromDate, toDate, page });
  if (!fromDate) {
    fromDate = DateTime.now().minus({ weeks: 2 }).toISODate();
  }
  if (!toDate) {
    toDate = DateTime.now().toISODate();
  }

  const params = siteGetQuery(fromDate, toDate, page);
  Log.info('get sites', params);
  const { items, nextPage } = await dynamoDbQuery(params);
  return formatJSONResponse({
    items,
    page: nextPage,
  });
};

export const main = middyfyHttp(getSites);
