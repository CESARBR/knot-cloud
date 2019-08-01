/* eslint-disable no-console */
import yargs from 'yargs';
import { Client } from '@cesarbr/knot-cloud-sdk-js';
import isBase64 from 'is-base64';
import options from './utils/options';
import getFileCredentials from './utils/getFileCredentials';

const setData = (args) => {
  const client = new Client({
    protocol: args.protocol,
    hostname: args.server,
    port: args.port,
    pathName: args.pathName,
    id: args['client-id'],
    token: args['client-token'],
  });

  client.on('ready', () => {
    client.setData(args['thing-id'], [{
      sensorId: args.sensorId,
      value: args.value,
    }]);
  });
  client.on('sent', () => {
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
    command: 'set-data <thing-id> <sensor-id> <value>',
    desc: 'Set data to a thing',
    builder: (_yargs) => {
      _yargs
        .options(options)
        .positional('thing-id', {
          describe: 'Thing ID',
        })
        .positional('sensor-id', {
          describe: 'ID of the sensor to be updated',
        })
        .positional('value', {
          describe: 'Value to set the sensor to. Supported types: boolean, number or Base64 strings.',
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
      setData(args);
    },
  });
