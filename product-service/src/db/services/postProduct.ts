import { Sequelize } from 'sequelize';
import 'source-map-support/register';
import { yupObject as verify } from '@libs/validate';
import { Product, Stock } from '@db/models';
import { sequelize } from '@db';

interface IProduct {
  title: string;
  description: string;
  price: number;
  count: number;
  image?: string;
}

const postProduct = async (event: IProduct): Promise<any> =>
  await verify.isValid(event).then(async (isValid) => {
    if (!isValid) {
      console.log('Product data is invalid');
      return;
    }

    const { title, description, price, count, image } = event || {};

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

      await Product.findOne({
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
    } catch (e) {
      console.log('Error during database request executing', e);
    }
  });

export default postProduct;
