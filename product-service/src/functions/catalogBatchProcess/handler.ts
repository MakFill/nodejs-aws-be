import { middyfy } from '@libs/lambda';
import 'source-map-support/register';
import * as AWS from 'aws-sdk';
import { postProduct } from '@db/services';

interface ISQSEvent {
  Records: {
    body: string;
  }[];
}

const catalogBatchProcess = async (event: ISQSEvent): Promise<void> => {
  const sns = new AWS.SNS();

  try {
    const products = event.Records.map(({ body }) => JSON.parse(body));

    await Promise.all(products.map(async (product) => postProduct(product)));

    products.forEach((product) => {
      sns.publish(
        {
          Subject: 'Product added',
          Message: JSON.stringify(product),
          MessageAttributes: {
            count: {
              DataType: 'Number',
              StringValue: product.count,
            },
          },
          TopicArn: process.env.SNS_ARN,
        },
        (err) => {
          if (err) {
            console.log('ERROR SNS: ', err);
          }
        }
      );
    });
  } catch (e) {
    console.log('Error: ', e);
  }
};

export const main = middyfy(catalogBatchProcess);
