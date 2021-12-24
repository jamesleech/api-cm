import middy, { MiddyfiedHandler } from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import { ValidatedEventSNSEvent } from '@libs/snsTopic';
import schema from '@functions/parse/schema';
import { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';

export const middyfySNS = (handler: ValidatedEventSNSEvent<typeof schema, {}>):
  MiddyfiedHandler => middy(handler).use(middyJsonBodyParser());
export const middyfyHttp = (handler: ValidatedEventAPIGatewayProxyEvent<typeof schema>):
  MiddyfiedHandler => middy(handler).use(middyJsonBodyParser());
