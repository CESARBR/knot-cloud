/* eslint-disable no-console, no-restricted-globals */
import yargs from 'yargs';
import chalk from 'chalk';
import { Client } from '@cesarbr/knot-cloud-sdk-js';
import isBase64 from 'is-base64';
import options from './utils/options';
import getFileCredentials from './utils/getFileCredentials';

const setData = async (args) => {
  const client = new Client({
    hostname: args.server,
    port: args.port,
    protocol: args.protocol,
    username: args.username,
    password: args.password,
    token: args.token,
  });

  await client.connect();
  await client.setData(args.thingId, [
    {
      sensorId: args.sensorId,
      value: args.value,
    },
  ]);
  await client.close();
};

yargs
  .config('credentials-file', (path) => getFileCredentials(path))
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
          describe:
            'Value to set the sensor to. Supported types: boolean, number or Base64 strings.',
          coerce: (value) => {
            if (isNaN(value)) {
              if (value === 'true' || value === 'false') {
                return value === 'true';
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
    handler: async (args) => {
      try {
        await setData(args);
        console.log(chalk.green('update data command successfully sent'));
      } catch (err) {
        console.log(chalk.red("it was not possible to update the thing's data :("));
        console.log(chalk.red(err));
      }
    },
  });
