import { Client } from 'pg';
import 'source-map-support/register';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse, allowHeaders as headers } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import dbOptions from '../../db/dbOptions';
import { yupObject as verify } from '@libs/validate';

import schema from './schema';

export const postProducts: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
): Promise<any> =>
  await verify.isValid(event.body).then(async (isValid) => {
    if (!isValid) {
      console.error('Product data is invalid');
      return formatJSONResponse({ response: 'Product data is invalid', statusCode: 400, headers });
    }

    const { title, description, price, count, image } = event.body;

    console.log(
      `POST request: {title: ${title}, description: ${description}, price: ${price}, count: ${count}, image: ${image}`
    );

    const client = new Client(dbOptions);

    try {
      await client.connect();

      await client.query(`begin`);

      await client.query(`
              insert into products (title, description, price, image) values ('${title}', '${description}', ${price}, '${image}')`);

      await client.query(`
        insert into stocks (product_id, count) values ((select id from products where products.title='${title}'), ${count})`);

      await client.query('commit');

      const { rows } =
        (await client.query(
          `SELECT p.id, p.description, p.price, p.title, p.image, s.count FROM products p  LEFT JOIN stocks s on p.id=s.product_id WHERE p.title='${title}' and s.count=${count}`
        )) || {};

      return formatJSONResponse({
        response: rows,
        headers,
      });
    } catch (e) {
      await client.query('rollback');
      console.error('Error during database request executing', e);
      return formatJSONResponse({ response: 'Error during request', statusCode: 500, headers });
    } finally {
      client.end();
    }
  });

export const main = middyfy(postProducts);
