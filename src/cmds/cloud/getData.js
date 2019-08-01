/* eslint-disable no-console */
import yargs from 'yargs';
import { Client } from '@cesarbr/knot-cloud-sdk-js';
import options from './utils/options';
import getFileCredentials from './utils/getFileCredentials';

const getData = (args) => {
  const client = new Client({
    protocol: args.protocol,
    hostname: args.server,
    port: args.port,
    pathName: args.pathName,
    id: args['client-id'],
    token: args['client-token'],
  });

  client.on('ready', () => {
    client.getData(args['thing-id'], [args['sensor-id']]);
  });
  client.on('sent', () => {
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
    command: 'get-data <thing-id> <sensor-id>',
    desc: 'Requests the current value of <sensor-id> from <thing-id>',
    builder: (_yargs) => {
      _yargs
        .options(options)
        .positional('thing-id', {
          describe: 'Thing ID',
        })
        .positional('sensor-id', {
          describe: 'ID of the sensor to request the data',
        });
    },
    handler: (args) => {
      getData(args);
    },
  });
