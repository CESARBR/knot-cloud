/* eslint-disable no-console */
import yargs from 'yargs';
import fs from 'fs';
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

const updateSchema = (args) => {
  const client = new Client({
    protocol: args.protocol,
    hostname: args.server,
    port: args.port,
    pathName: args.pathName,
    id: args['client-id'],
    token: args['client-token'],
  });

  client.on('ready', () => {
    client.updateSchema([
      {
        sensorId: args['sensor-id'],
        valueType: args['value-type'],
        unit: args.unit,
        typeId: args['type-id'],
        name: args.name,
      },
    ]);
  });
  client.on('updated', () => {
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
  .config('schema-file', path => getFileSchema(path))
  .command({
    command: 'update-schema [sensor-id] [value-type] [unit] [type-id] [name]',
    desc: 'Update a thing schema',
    builder: (_yargs) => {
      _yargs
        .options(options)
        .positional('sensor-id', {
          describe: 'Sensor ID',
          demandOption: false,
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
    handler: (args) => {
      updateSchema(args);
    },
  });
