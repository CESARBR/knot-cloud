/* eslint-disable no-console */
import yargs from 'yargs';
import { Client } from '@cesarbr/knot-cloud-sdk-js';
import options from './utils/options';
import getFileCredentials from './utils/getFileCredentials';

const createThing = (args) => {
  const client = new Client({
    protocol: args.protocol,
    hostname: args.server,
    port: args.port,
    pathName: args.pathName,
    id: args['client-id'],
    token: args['client-token'],
  });

  client.on('ready', () => {
    client.register({
      type: 'knot:gateway',
      name: args.name,
      active: args.active === 'true',
    });
  });
  client.on('registered', (device) => {
    console.log(JSON.stringify(device, null, 2));
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
    command: 'create-gateway <name> <active>',
    desc: 'Create a gateway',
    builder: (_yargs) => {
      _yargs
        .options(options);
    },
    handler: (args) => {
      createThing(args);
    },
  });
