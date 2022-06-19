import { Sequelize } from 'sequelize';
import 'source-map-support/register';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse, allowHeaders as headers } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { yupObject as verify } from '@libs/validate';
import { Product, Stock } from '@db/models';
import { sequelize } from '@db';

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

    try {
      let productId: string;
      await sequelize.transaction(async (t) => {
        const product = await Product.create(
          {
            title,
            description,
            price,
            image,
          },
          { transaction: t }
        );
        productId = product.id;

        await Stock.create(
          {
            count,
            product_id: product.id,
          },
          { transaction: t }
        );
      });

      const res = await Product.findOne({
        where: { id: productId },
        include: [
          {
            model: Stock,
            attributes: [],
            as: 'stocks',
          },
        ],
        attributes: [
          'id',
          'title',
          'description',
          'price',
          'image',
          [Sequelize.col('stocks.count'), 'count'],
        ],
        raw: true,
      });

      return formatJSONResponse({
        response: res,
        headers,
      });
    } catch (e) {
      console.error('Error during database request executing', e);
      return formatJSONResponse({ response: 'Error during request', statusCode: 500, headers });
    }
  });

export const main = middyfy(postProducts);
