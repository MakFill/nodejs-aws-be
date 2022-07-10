export default {
  type: 'object',
  body: {
    title: { type: 'string' },
    description: { type: 'string' },
    price: { type: 'number' },
    count: { type: 'number' },
    image: { type: 'string' },
  },
} as const;
