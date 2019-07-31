/* eslint-disable no-console */
import yargs from 'yargs';
import { Client } from '@cesarbr/knot-cloud-sdk-js';
import options from './utils/options';
import getFileCredentials from './utils/getFileCredentials';

const buildQuery = (params) => {
  const base = {
    type: params.type,
  };

  if (params.name) {
    base.metadata = {
      name: params.name,
    };
  }

  return base;
};

const listDevices = (args) => {
  const client = new Client({
    protocol: args.protocol,
    hostname: args.server,
    port: args.port,
    pathName: args.pathName,
    id: args['client-id'],
    token: args['client-token'],
  });

  client.on('ready', () => {
    client.getDevices(buildQuery(args));
  });
  client.on('devices', (devices) => {
    console.log(JSON.stringify(devices, null, 2));
    client.close();
  });
  client.on('error', (err) => {
    console.log(err);
    client.close();
  });
  client.connect();
};

yargs
  .config('credentials-file', path => getFileCredentials(path))
  .command({
    command: 'list-devices',
    desc: 'List devices',
    builder: (_yargs) => {
      _yargs
        .options(options)
        .option({
          type: {
            describe: 'Query by type',
            demandOption: false,
          },
          name: {
            describe: 'Query by name',
            demandOption: false,
          },
        });
    },
    handler: (args) => {
      listDevices(args);
    },
  });
