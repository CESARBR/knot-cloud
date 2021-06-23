/* eslint-disable no-console */
import yargs from 'yargs';
import fs from 'fs';
import chalk from 'chalk';
import { Client } from '@cesarbr/knot-cloud-sdk-js';
import options from './utils/options';
import getFileCredentials from './utils/getFileCredentials';

const getFileConfig = (filePath) => {
  const rawData = fs.readFileSync(filePath);
  return JSON.parse(rawData);
};

const updateConfig = async (args) => {
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

  const config = getFileConfig(args.filePath);

  await client.connect();
  const response = await client.updateConfig(args.thingId, [config]);
  console.log(response);
  await client.close();
};

yargs
  .config('credentials-file', (path) => getFileCredentials(path))
  .command({
    command: 'update-config <thing-id> <file-path>',
    desc: 'Update a thing configuration from a file',
    builder: (_yargs) => {
      _yargs
        .positional('file-path', {
          describe: 'Config file path',
          demandOption: true,
          default: 0,
        })
        .options(options.amqp)
        .options(options.http)
        .options(options.basic);
    },
    handler: async (args) => {
      try {
        await updateConfig(args);
        console.log(chalk.green(`thing ${args.thingId} config updated`));
      } catch (err) {
        console.log(chalk.red("it was not possible to update the thing's config :("));
        console.log(chalk.red(err));
      }
    },
  });
