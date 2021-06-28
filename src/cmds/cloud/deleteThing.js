/* eslint-disable no-console */
import yargs from 'yargs';
import chalk from 'chalk';
import { Client } from '@cesarbr/knot-cloud-sdk-js';
import options from './utils/options';
import getFileCredentials from './utils/getFileCredentials';

const deleteThing = async (args) => {
  const client = new Client({
    hostname: args.server,
    port: args.port,
    protocol: args.protocol,
    username: args.username,
    password: args.password,
    token: args.token,
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
      _yargs.options(options).positional('id', {
        describe: 'Thing ID',
      });
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
