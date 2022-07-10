import * as AWS from 'aws-sdk';
import csv from 'csv-parser';
import { Handler, S3Event } from 'aws-lambda';
import { InvokeAsyncResponse } from 'aws-sdk/clients/lambda';
import { middyfy } from '@libs/lambda';

const importFileParser: Handler = async (event: S3Event): Promise<InvokeAsyncResponse> => {
  try {
    const s3 = new AWS.S3({ region: 'eu-west-1' });
    const sqs = new AWS.SQS();
    const { BUCKET } = process.env || {};

    for (const record of event.Records) {
      const s3Stream = s3
        .getObject({
          Bucket: BUCKET,
          Key: record.s3.object.key,
        })
        .createReadStream();

      await new Promise((resolve, reject) => {
        s3Stream
          .pipe(csv())
          .on('data', (data) => {
            sqs.sendMessage(
              {
                QueueUrl: process.env.SQS_URL,
                MessageBody: JSON.stringify(data),
              },
              (err) => {
                if (err) {
                  console.log('ERROR SQS:', err);
                }
              }
            );
          })
          .on('error', (error) => reject('ERROR: ' + error))
          .on('end', async () => {
            console.log(`Copy from ${BUCKET}/${record.s3.object.key}`);

            await s3
              .copyObject({
                Bucket: BUCKET,
                CopySource: `${BUCKET}/${record.s3.object.key}`,
                Key: record.s3.object.key.replace('uploaded', 'parsed'),
              })
              .promise();

            await s3
              .deleteObject({
                Bucket: BUCKET,
                Key: record.s3.object.key,
              })
              .promise();

            console.log(
              `Placed into ${BUCKET}/${record.s3.object.key.replace('uploaded', 'parsed')}`
            );
            resolve(() => {});
          });
      });
    }

    return {
      Status: 202,
    };
  } catch {
    return {
      Status: 500,
    };
  }
};

export const main = middyfy(importFileParser);
