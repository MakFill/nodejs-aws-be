import { Client } from 'pg';
import 'source-map-support/register';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse, allowHeaders as headers } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import dbOptions from '@db/dbOptions';

export const getProductsList: ValidatedEventAPIGatewayProxyEvent<
  never
> = async (): Promise<any> => {
  console.log('GET request: getProductsList');
  const client = new Client(dbOptions);
  try {
    await client.connect();
    const { rows } = await client.query(
      `SELECT p.id, p.description, p.price, p.title, p.image, s.count FROM products p LEFT JOIN stocks s on p.id=s.product_id`
    );

    return formatJSONResponse({ response: rows, headers });
  } catch (e) {
    console.error('Error during database request executing', e);
    return formatJSONResponse({
      response: 'Error during database request executing',
      statusCode: 500,
      headers,
    });
  } finally {
    client.end();
  }
};

export const main = middyfy(getProductsList);
