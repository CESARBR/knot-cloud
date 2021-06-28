/* eslint-disable no-console, no-multi-str */
import yargs from 'yargs';
import fs from 'fs';
import chalk from 'chalk';
import { Client } from '@cesarbr/knot-cloud-sdk-js';
import options from './utils/options';
import getFileCredentials from './utils/getFileCredentials';

const getFileConfig = (filePath) => {
  const rawData = fs.readFileSync(filePath);
  const config = JSON.parse(rawData);
  return {
    'sensor-id': config.sensorId,
    'change': config.change,
    'time-sec': config.timeSec,
    'lower-threshold': config.lowerThreshold,
    'upper-threshold': config.upperThreshold,
  };
};

const updateConfigEvent = async (args) => {
  const client = new Client({
    amqp: {
      hostname: args.amqpServer,
      port: args.amqpPort,
      protocol: args.amqpProtocol,
      username: args.amqpUsername,
      password: args.amqpPassword,
      token: args.token,
    },
    http: {
      hostname: args.httpServer,
      port: args.httpPort,
      protocol: args.httpProtocol,
    },
  });

  const config = {
    sensorId: args.sensorId,
    event: {
      change: args.change === 'true',
      timeSec: args.timeSec,
      lowerThreshold: args.lowerThreshold,
      upperThreshold: args.upperThreshold,
    },
  };

  await client.connect();
  const response = await client.updateConfig(args.thingId, [config]);
  console.log(response);
  await client.close();
};

yargs
  .config('credentials-file', (path) => getFileCredentials(path))
  .config('event-file', (path) => getFileConfig(path))
  .command({
    command:
      'update-config-event <thing-id> <sensor-id> [change] [timeSec] [lowerThreshold] [upperThreshold]',
    desc: 'Update a thing schema',
    builder: (_yargs) => {
      _yargs
        .options(options.amqp)
        .options(options.http)
        .options(options.basic)
        .positional('sensor-id', {
          describe: 'Sensor ID',
          demandOption: true,
          default: 0,
        })
        .positional('change', {
          describe: 'enable sending sensor data when its value changes',
          demandOption: false,
          default: true,
        })
        .positional('time-sec', {
          describe: 'time interval in seconds that indicates when data must be sent to the cloud',
          demandOption: false,
          default: 10,
        })
        .positional('lower-threshold', {
          describe: 'send data to the cloud if it is lower than this threshold',
          demandOption: false,
          default: 1000,
        })
        .positional('upper-threshold', {
          describe: 'send data to the cloud if it is upper than this threshold',
          demandOption: false,
          default: 3000,
        })
        .example([
          [
            '$0 update-config-event 9d3b2e867d483c80 0 true 10 3000 4000 \
            --amqp-server api.fog --token <user-token>',
            'Update thing `9d3b2e867d483c80` sensor `0` config event with \
            change=true, timeSec=10, lowerThreshold=3000, upperThreshold=4000',
          ],
        ]);
    },
    handler: async (args) => {
      try {
        await updateConfigEvent(args);
        console.log(chalk.green(`thing ${args.thingId} config updated`));
      } catch (err) {
        console.log(chalk.red("it was not possible to update the thing's config :("));
        console.log(chalk.red(err));
      }
    },
  });
