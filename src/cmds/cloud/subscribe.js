/* eslint-disable no-console */
import yargs from 'yargs';
import chalk from 'chalk';
import { Client } from '@cesarbr/knot-cloud-sdk-js';
import options from './utils/options';
import getFileCredentials from './utils/getFileCredentials';

const subscribe = async (args) => {
  const client = new Client({
    amqp: {
      hostname: args.amqpServer,
      port: args.amqpPort,
      protocol: args.amqpProtocol,
      username: args.amqpUsername,
      password: args.amqpPassword,
      token: args.token,
    },
    http: {
      hostname: args.httpServer,
      port: args.httpPort,
      protocol: args.httpProtocol,
    },
  });

  await client.connect();
  await client.on(args.event, (event) => {
    console.log(event);
  });
};

yargs
  .config('credentials-file', (path) => getFileCredentials(path))
  .command({
    command: 'on <event>',
    desc: 'Subscribe to receive events',
    builder: (_yargs) => {
      _yargs
        .options(options.amqp)
        .options(options.http)
        .options(options.basic)
        .example([['$0 on data --http-server api.fog', 'Subscribe for receiving `data` events.']]);
    },
    handler: async (args) => {
      try {
        await subscribe(args);
      } catch (err) {
        console.log(chalk.red('it was not possible to create the subscription :('));
        console.log(chalk.red(err));
      }
    },
  });
