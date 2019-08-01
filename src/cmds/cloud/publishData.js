/* eslint-disable no-console */
import yargs from 'yargs';
import { Client } from '@cesarbr/knot-cloud-sdk-js';
import isBase64 from 'is-base64';
import options from './utils/options';
import getFileCredentials from './utils/getFileCredentials';

const publishData = (args) => {
  const client = new Client({
    protocol: args.protocol,
    hostname: args.server,
    port: args.port,
    pathName: args.pathName,
    id: args['client-id'],
    token: args['client-token'],
  });

  client.on('ready', () => {
    client.publishData(args['sensor-id'], args.value);
  });
  client.on('published', () => {
    client.close();
  });
  client.on('error', (err) => {
    console.error(err);
    console.log('Connection refused');
  });
  client.connect();
};

yargs
  .config('credentials-file', path => getFileCredentials(path))
  .command({
    command: 'publish-data <sensor-id> <value>',
    desc: 'Publish <value> as a <sensor-id>',
    builder: (_yargs) => {
      _yargs
        .options(options)
        .positional('sensor-id', {
          describe: 'ID of the sensor that is publishing the data',
        })
        .positional('value', {
          describe: 'Value to be published. Supported types: boolean, number or Base64 strings.',
          coerce: (value) => {
            if (isNaN(value)) { // eslint-disable-line no-restricted-globals
              if (value === 'true' || value === 'false') {
                return (value === 'true');
              }
              if (!isBase64(value)) {
                throw new Error('Supported types are boolean, number or Base64 strings');
              }
              return value;
            }

            return parseFloat(value);
          },
        });
    },
    handler: (args) => {
      publishData(args);
    },
  });
