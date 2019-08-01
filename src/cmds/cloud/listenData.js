/* eslint-disable no-console */
import yargs from 'yargs';
import { Client } from '@cesarbr/knot-cloud-sdk-js';
import options from './utils/options';
import getFileCredentials from './utils/getFileCredentials';

const listenToData = (args) => {
  const client = new Client({
    protocol: args.protocol,
    hostname: args.server,
    port: args.port,
    pathName: args.pathName,
    id: args['client-id'],
    token: args['client-token'],
  });

  client.on('ready', () => {});
  client.on('data', (data) => {
    console.log(JSON.stringify(data, null, 2));
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
    command: 'listen-data',
    desc: 'Listen to data events',
    builder: (_yargs) => {
      _yargs
        .options(options);
    },
    handler: (args) => {
      listenToData(args);
    },
  });
