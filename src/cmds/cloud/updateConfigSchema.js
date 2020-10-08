/* eslint-disable no-console */
import yargs from 'yargs';
import fs from 'fs';
import chalk from 'chalk';
import { Client } from '@cesarbr/knot-cloud-sdk-js';
import options from './utils/options';
import getFileCredentials from './utils/getFileCredentials';

const getFileSchema = (filePath) => {
  const rawData = fs.readFileSync(filePath);
  const schema = JSON.parse(rawData);
  return {
    'sensor-id': schema.sensorId,
    'value-type': schema.valueType,
    unit: schema.unit,
    'type-id': schema.typeId,
    name: schema.name,
  };
};

const updateConfigSchema = async (args) => {
  const client = new Client({
    hostname: args.server,
    port: args.port,
    protocol: args.protocol,
    username: args.username,
    password: args.password,
    token: args.token,
  });

  const config = {
    sensorId: args.sensorId,
    schema: {
      valueType: args.valueType,
      unit: args.unit,
      typeId: args.typeId,
      name: args.name,
    },
  };

  await client.connect();
  const response = await client.updateConfig(args.thingId, [config]);
  console.log(response);
  await client.close();
};

yargs
  .config('credentials-file', path => getFileCredentials(path))
  .config('schema-file', path => getFileSchema(path))
  .command({
    command: 'update-config-schema <thing-id> <sensor-id> [value-type] [unit] [type-id] [name]',
    desc: 'Update a thing schema',
    builder: (_yargs) => {
      _yargs
        .options(options)
        .positional('sensor-id', {
          describe: 'Sensor ID',
          demandOption: true,
          default: 0,
        })
        .positional('value-type', {
          describe: 'Semantic value type (voltage, current, temperature, etc)',
          demandOption: false,
          default: 3,
        })
        .positional('unit', {
          describe: 'sensor unit (V, A, W, W, etc)',
          demandOption: false,
          default: 0,
        })
        .positional('type-id', {
          describe: 'data value type (boolean, integer, etc)',
          demandOption: false,
          default: 65521,
        })
        .positional('name', {
          describe: 'Sensor name',
          demandOption: false,
          default: 'Development Thing',
        });
    },
    handler: async (args) => {
      try {
        await updateConfigSchema(args);
        console.log(chalk.green(`thing ${args.thingId} schema updated`));
      } catch (err) {
        console.log(chalk.red('it was not possible to update the thing\'s schema :('));
        console.log(chalk.red(err));
      }
    },
  });
