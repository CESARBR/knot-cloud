/* eslint-disable no-console */
import yargs from 'yargs';
import chalk from 'chalk';
import jwt from 'jsonwebtoken';
import { Client } from '@cesarbr/knot-cloud-sdk-js';
import options from './utils/options';
import getFileCredentials from './utils/getFileCredentials';

const printThings = (devices) => {
  devices.forEach((d) => {
    console.log(`${chalk.green.bold('id')}: ${chalk.blueBright(d.id)}`);
    console.log(`${chalk.green.bold('name')}: ${chalk.blueBright(d.name)}`);
    if (d.config) {
      console.log(
        `${chalk.green.bold('config')}: ${chalk.blueBright(JSON.stringify(d.config, null, 2))}`
      );
    }
    console.log('\n');
  });
};

const listThings = async (args) => {
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

  await client.connect();

  const { devices } = await client.getDevices();
  if (devices.length !== 0) {
    const tokenPayload = jwt.decode(args.token);
    console.log(`\nshowing things owned by ${chalk.white.bold(tokenPayload.sub)}\n`);
    printThings(devices);
  } else {
    console.log('there is no thing registered yet');
  }

  await client.close();
};

yargs
  .config('credentials-file', (path) => getFileCredentials(path))
  .command({
    command: 'list-things',
    desc: 'List registered things',
    builder: (_yargs) => {
      _yargs
        .options(options.amqp)
        .options(options.http)
        .options(options.basic)
        .example([
          [
            '$0 list-things --amqp-server api.fog --token <user-token>',
            'List the registered things.',
          ],
        ]);
    },
    handler: async (args) => {
      try {
        await listThings(args);
      } catch (err) {
        console.log(chalk.red('it was not possible to obtain the registered things :('));
        console.log(chalk.red(err));
      }
    },
  });
