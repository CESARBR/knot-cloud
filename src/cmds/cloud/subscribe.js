/* eslint-disable no-console */
import yargs from 'yargs';
import chalk from 'chalk';
import { Client } from '@cesarbr/knot-cloud-sdk-js';
import options from './utils/options';
import getFileCredentials from './utils/getFileCredentials';

const subscribe = async (args) => {
  const client = new Client({
    hostname: args.server,
    port: args.port,
    token: args.token,
    username: args.username,
    password: args.password,
    protocol: args.protocol,
  });

  await client.connect();
  await client.on(args.event, (event) => {
    console.log(event);
  });
};

yargs
  .config('credentials-file', path => getFileCredentials(path))
  .command({
    command: 'on <event>',
    desc: 'Subscribe to receive events',
    builder: (_yargs) => {
      _yargs
        .options(options);
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
