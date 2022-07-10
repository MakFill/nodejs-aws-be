import type { AWS } from '@serverless/typescript';
import 'dotenv/config';

import importProductsFile from '@functions/importProductsFile';
import importFileParser from '@functions/importFileParser';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  useDotenv: true,
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['s3:ListBucket'],
        Resource: `arn:aws:s3:::${process.env.BUCKET}`,
      },
      {
        Effect: 'Allow',
        Action: ['s3:*'],
        Resource: `arn:aws:s3:::${process.env.BUCKET}/*`,
      },
      {
        Effect: 'Allow',
        Action: ['sqs:*'],
        Resource: {
          'Fn::GetAtt': ['SQSQueue', 'Arn'],
        },
      },
    ],
    environment: {
      BUCKET: process.env.BUCKET,
      SQS_URL: {
        Ref: 'SQSQueue',
      },
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    region: 'eu-west-1',
    stage: 'dev',
  },
  resources: {
    Resources: {
      SQSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItemsQueue',
        },
      },
    },
    Outputs: {
      SQSArn: {
        Value: {
          'Fn::GetAtt': ['SQSQueue', 'Arn'],
        },
      },
    },
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser },
  package: { individually: true },
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
};

module.exports = serverlessConfiguration;
