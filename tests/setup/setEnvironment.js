const env = {
  AWS_REGION: 'local',
  AWS_ACCESS_KEY: 'fake_key',
  AWS_SECRET_KEY: 'fake_secret',
  DYNAMODB_TABLE_NAME: 'DYNAMO-DB-TABLE-NAME',
};

process.env = {
  ...process.env,
  ...env,
};
