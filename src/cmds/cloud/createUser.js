/* eslint-disable no-console */
import yargs from 'yargs';
import chalk from 'chalk';
import { Authenticator } from '@cesarbr/knot-cloud-sdk-js';

const createUser = async (args) => {
  const client = new Authenticator({
    hostname: args.server,
    port: args.port,
    protocol: args.protocol,
  });

  try {
    await client.createUser(args.email, args.password);
    const token = await client.createToken(args.email, args.password, 'user');
    console.log(chalk.green('user successfully created'));
    console.log(chalk.grey(JSON.stringify(token, null, 2)));
  } catch (err) {
    if (err.code === 409) {
      console.log(chalk.red(`user ${args.email} is already created :/`));
    } else {
      console.log(chalk.red('it was not possible to create your user :('));
      console.log(chalk.red(err));
    }
  }
};

yargs
  .command({
    command: 'create-user <email> <password>',
    desc: 'Create a new user',
    builder: (_yargs) => {
      _yargs
        .options({
          server: {
            describe: 'Server hostname',
            demandOption: true,
            default: 'api.knot.cloud',
          },
          protocol: {
            describe: 'Server protocol',
            demandOption: true,
            default: 'https',
          },
        });
    },
    handler: async (args) => {
      await createUser(args);
    },
  });
