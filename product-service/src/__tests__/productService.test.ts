import { getProductsList } from '@functions/getProductsList/handler';
import { getProductsById } from '@functions/getProductsById/handler';
import productList from '@mocks/productList.json';
import { formatJSONResponse, allowHeaders as headers } from '@libs/api-gateway';

describe('Check product service', () => {
  it('Check if get /products returns products array', async () => {
    const list = await getProductsList(null, null, null);
    expect(list).toEqual(formatJSONResponse({ response: productList, headers }));
  });

  it('Check if get /products/{productId} returns Product not found', async () => {
    const mockEvent = {
      pathParameters: {
        productId: 'some wrong id',
      },
    } as any;
    const productItem = await getProductsById(mockEvent, null, null);
    expect(productItem).toEqual(
      formatJSONResponse({ response: 'Product not found', headers, statusCode: 404 })
    );
  });

  it('Check if get /products/{productId} returns correct product', async () => {
    const mockEvent = {
      pathParameters: {
        productId: productList[0].id,
      },
    } as any;
    const productItem = await getProductsById(mockEvent, null, null);
    expect(productItem).toEqual(formatJSONResponse({ response: productList[0], headers }));
  });
});
