import type { Handler, SNSEvent } from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';

type ValidatedSNSEventEvent<S> = Omit<SNSEvent, 'body'> & { body: FromSchema<S> }

export type ValidatedEventSNSEvent<S, R> = Handler<ValidatedSNSEventEvent<S>, R>
