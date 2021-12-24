export default {
  type: 'object',
  properties: {
    fromDate: { type: 'string' },
    toDate: { type: 'string' },
    page: { type: 'string' },
  },
} as const;
