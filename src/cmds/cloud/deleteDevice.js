/* eslint-disable no-console */
import yargs from 'yargs';
import { Client } from '@cesarbr/knot-cloud-sdk-js';
import options from './utils/options';
import getFileCredentials from './utils/getFileCredentials';

const deleteDevice = (args) => {
  const client = new Client({
    protocol: args.protocol,
    hostname: args.server,
    port: args.port,
    pathName: args.pathName,
    id: args['client-id'],
    token: args['client-token'],
  });

  client.on('ready', () => {
    client.unregister(args.id);
  });
  client.on('unregistered', () => {
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
    command: 'delete-device <id>',
    desc: 'Delete device <id>',
    builder: (_yargs) => {
      _yargs
        .options(options)
        .positional('id', {
          describe: 'Device ID',
        });
    },
    handler: (args) => {
      deleteDevice(args);
    },
  });
