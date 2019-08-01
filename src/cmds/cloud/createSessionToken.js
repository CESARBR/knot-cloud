/* eslint-disable no-console */
import yargs from 'yargs';
import { Client } from '@cesarbr/knot-cloud-sdk-js';
import options from './utils/options';
import getFileCredentials from './utils/getFileCredentials';

const createSessionToken = (args) => {
  const client = new Client({
    protocol: args.protocol,
    hostname: args.server,
    port: args.port,
    pathName: args.pathName,
    id: args['client-id'],
    token: args['client-token'],
  });

  client.on('ready', () => {
    client.createSessionToken(args.id);
  });
  client.on('created', (token) => {
    console.log({ token });
    client.close();
  });
  client.on('error', (err) => {
    console.log(err);
    console.log('Connection refused');
  });
  client.connect();
};

yargs
  .config('credentials-file', path => getFileCredentials(path))
  .command({
    command: 'create-session-token <id>',
    desc: 'Create session token to device <id>',
    builder: (_yargs) => {
      _yargs
        .options(options)
        .positional('id', {
          describe: 'Device ID',
        });
    },
    handler: (args) => {
      createSessionToken(args);
    },
  });
