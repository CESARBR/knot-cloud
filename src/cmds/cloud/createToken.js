/* eslint-disable no-console */
import yargs from 'yargs';
import chalk from 'chalk';
import { Authenticator } from '@cesarbr/knot-cloud-sdk-js';

const createToken = async (args) => {
  const client = new Authenticator({
    hostname: args.server,
    port: args.port,
    protocol: args.protocol,
  });

  return client.createToken(args.email, args.password);
};

yargs
  .command({
    command: 'create-token <email> <password>',
    desc: "Create a new user's token",
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
      try {
        const token = await createToken(args);
        console.log(chalk.green('token successfully created:'));
        console.log(chalk.grey(token.token));
      } catch (err) {
        console.log(chalk.red('it was not possible to create a new token :('));
        console.log(chalk.red(err));
      }
    },
  });
