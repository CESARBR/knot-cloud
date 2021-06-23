/* eslint-disable no-console */
import yargs from 'yargs';
import chalk from 'chalk';
import { Authenticator } from '@cesarbr/knot-cloud-sdk-js';
import options from './utils/options';

const createUser = async (args) => {
  const client = new Authenticator({
    hostname: args.httpServer,
    port: args.httpPort,
    protocol: args.httpProtocol,
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
      if (err.message === '') {
        console.log(
          chalk.red(
            'no error message returned, check if user and babeltower services are correctly up'
          )
        );
      } else {
        console.log(chalk.red(err));
      }
    }
  }
};

yargs.command({
  command: 'create-user <email> <password>',
  desc: 'Create a new user',
  builder: (_yargs) => {
    _yargs
      .options(options.http);
  },
  handler: async (args) => {
    await createUser(args);
  },
});
