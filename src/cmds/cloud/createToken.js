/* eslint-disable no-console */
import yargs from 'yargs';
import chalk from 'chalk';
import { Authenticator } from '@cesarbr/knot-cloud-sdk-js';
import options from './utils/options';

const createToken = async (args) => {
  const client = new Authenticator({
    hostname: args.httpServer,
    port: args.httpPort,
    protocol: args.httpProtocol,
  });

  return client.createToken(args.email, args.credential, args.type);
};

yargs.command({
  command: 'create-token <email> <credential> <type>',
  desc: 'Create a new user or app token',
  builder: (_yargs) => {
    _yargs.options(options.http);
  },
  handler: async (args) => {
    try {
      const token = await createToken(args);
      console.log(chalk.green('token successfully created:'));
      console.log(chalk.grey(token.token));
    } catch (err) {
      console.log(chalk.red('it was not possible to create a new token :('));
      if (err.message === '') {
        console.log(
          chalk.red(
            'no error message returned, check if auth and babeltower services are correctly up'
          )
        );
      } else {
        console.log(chalk.red(err));
      }
    }
  },
});
