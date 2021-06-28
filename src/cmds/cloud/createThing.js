/* eslint-disable no-console */
import yargs from 'yargs';
import chalk from 'chalk';
import { Client } from '@cesarbr/knot-cloud-sdk-js';
import options from './utils/options';
import getFileCredentials from './utils/getFileCredentials';

const createThing = async (args) => {
  const client = new Client({
    hostname: args.server,
    port: args.port,
    protocol: args.protocol,
    username: args.username,
    password: args.password,
    token: args.token,
  });

  await client.connect();
  await client.register(args.id, args.name);
  await client.close();
};

yargs
  .config('credentials-file', (path) => getFileCredentials(path))
  .command({
    command: 'create-thing <id> <name>',
    desc: 'Create a new thing',
    builder: (_yargs) => {
      _yargs.options(options);
    },
    handler: async (args) => {
      try {
        await createThing(args);
        console.log(chalk.green('thing successfully created'));
      } catch (err) {
        console.log(chalk.red('it was not possible to create your thing :('));
        console.log(chalk.red(err));
      }
    },
  });
