export default {
  body: {
    title: { type: 'string' },
    description: { type: 'string' },
    price: { type: 'number' },
    count: { type: 'number' },
    image: { type: 'string' },
  },
} as const;
