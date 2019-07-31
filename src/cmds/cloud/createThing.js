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
      type: 'knot:thing',
      id: args.id,
      name: args.name,
    });
  });
  client.on('registered', (device) => {
    console.log(JSON.stringify(device, null, 2));
    client.close();
  });
  client.on('error', (err) => {
    if (err.message) {
      console.log(err.message);
    } else {
      console.log(err);
    }
    client.close();
  });
  client.connect();
};

yargs
  .config('credentials-file', path => getFileCredentials(path))
  .command({
    command: 'create-thing <id> <name>',
    desc: 'Create a thing',
    builder: (_yargs) => {
      _yargs
        .options(options);
    },
    handler: (args) => {
      createThing(args);
    },
  });
