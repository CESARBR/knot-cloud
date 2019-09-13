/* eslint-disable no-console */
import yargs from 'yargs';
import { Authenticator } from '@cesarbr/knot-cloud-sdk-js';
import os from 'os';
import prompt from 'prompt';
import fse from 'fs-extra';
import colors from 'colors/safe';

const askCredentials = () => {
  prompt.message = '';
  prompt.delimiter = '';
  prompt.start();
  const schema = {
    properties: {
      email: {
        description: 'Enter your e-mail:',
        required: true,
      },
      password: {
        description: 'Enter your password:',
        hidden: true,
        required: true,
      },
    },
  };

  return new Promise((resolve) => {
    prompt.get(schema, (err, result) => {
      resolve(result);
    });
  });
};

const login = async (config) => {
  const { email, password } = await askCredentials();
  const client = new Authenticator({
    hostname: config.server,
    protocol: config.protocol,
  });

  try {
    const credentials = await client.authUser(email, password);
    const credentialsLocation = `${os.homedir()}/.knot/credentials.json`;
    fse.outputFileSync(credentialsLocation, JSON.stringify(credentials, null, 2));
    console.log(colors.cyan(`You have been successfully logged in.\nCredentials saved in ${credentialsLocation}`));
  } catch (err) {
    if (err.response.status === 401) {
      console.log(colors.red('Authentication failed. Please, try again.'));
    } else if (err.response.status === 400) {
      console.log(colors.red('Bad request. Verify the e-mail format.'));
    }
  }
};

yargs
  .command({
    command: 'login',
    desc: 'Sign-in as a user',
    builder: (_yargs) => {
      _yargs
        .options({
          server: {
            describe: 'Server hostname',
            demandOption: true,
            default: 'auth.knot.cloud',
          },
          protocol: {
            describe: 'Server protocol',
            demandOption: true,
            default: 'https',
          },
        })
        .positional('email', {
          describe: 'User\'s e-mail',
          demandOption: true,
        })
        .positional('password', {
          describe: 'User\'s password',
          demandOption: true,
        });
    },
    handler: async (args) => {
      login(args);
    },
  });
