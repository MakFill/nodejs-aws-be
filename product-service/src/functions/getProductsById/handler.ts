import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse, allowHeaders as headers } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import productList from '@mocks/productList.json';
import delay from '@helpers/delay';

import schema from './schema';

export const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
): Promise<any> => {
  try {
    await delay();
    const { productId } = event.pathParameters;
    const productItem = productList.find((el) => el.id === productId);
    if (!productItem) {
      throw new Error();
    }
    return formatJSONResponse({ response: productItem, headers });
  } catch (e) {
    return formatJSONResponse({ response: 'Product not found', statusCode: 404, headers });
  }
};

export const main = middyfy(getProductsById);
