/* eslint-disable no-console */
import yargs from 'yargs';
import chalk from 'chalk';
import { Client } from '@cesarbr/knot-cloud-sdk-js';
import options from './utils/options';
import getFileCredentials from './utils/getFileCredentials';

const deleteThing = async (args) => {
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
  await client.unregister(args.id);
  await client.close();
};

yargs
  .config('credentials-file', (path) => getFileCredentials(path))
  .command({
    command: 'delete-thing <id>',
    desc: 'Delete thing <id>',
    builder: (_yargs) => {
      _yargs
        .options(options.amqp)
        .options(options.http)
        .options(options.basic)
        .positional('id', {
          describe: 'Thing ID',
        })
        .example([
          [
            '$0 delete-thing 0c2958525df5dc3c --amqp-server api.fog --token <user-token>',
            'Delete the thing `0c2958525df5dc3c`.',
          ],
        ]);
    },
    handler: async (args) => {
      try {
        await deleteThing(args);
        console.log(chalk.green('thing sucessfully deleted'));
      } catch (err) {
        console.log(chalk.red('it was not possible to delete the thing :('));
        console.log(chalk.red(err));
      }
    },
  });
