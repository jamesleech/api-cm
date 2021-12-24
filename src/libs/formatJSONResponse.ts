import { JSONResponse } from '@models/JSONResponse';

export const formatJSONResponse = (response: Record<string, unknown>): JSONResponse => ({
  statusCode: 200,
  body: JSON.stringify(response),
  headers: {
    'Access-Control-Allow-Origin': '*', // (* or a specific host)
    'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
  },
});
