/* eslint-disable no-console, no-multi-str */
import yargs from 'yargs';
import { Authenticator } from '@cesarbr/knot-cloud-sdk-js';
import os from 'os';
import prompt from 'prompt';
import fse from 'fs-extra';
import colors from 'colors/safe';
import options from './utils/options';

const askCredentials = () => {
  prompt.message = '';
  prompt.delimiter = '';
  prompt.start();
  const schema = {
    properties: {
      email: {
        description: 'enter your e-mail:',
        required: true,
      },
      password: {
        description: 'enter your password:',
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
    hostname: config.httpServer,
    protocol: config.httpProtocol,
  });

  try {
    const { token } = await client.createToken(email, password);
    const appToken = await client.createToken(email, token, 'app');
    const credentialsLocation = `${os.homedir()}/.knot/credentials.json`;
    fse.outputFileSync(credentialsLocation, JSON.stringify(appToken, null, 2));
    console.log(
      colors.cyan(
        `you have been successfully logged in\ncredentials saved in ${credentialsLocation}`
      )
    );
  } catch (err) {
    if (err.code === 403) {
      console.log(colors.red('authentication failed, try again'));
    } else if (err.code === 400) {
      console.log(colors.red('bad request, verify e-mail and password formats'));
    }
  }
};

yargs.command({
  command: 'login',
  desc: 'Sign-in as a user',
  builder: (_yargs) => {
    _yargs
      .options(options.http)
      .positional('email', {
        describe: "User's e-mail",
        demandOption: true,
      })
      .positional('password', {
        describe: "User's password",
        demandOption: true,
      })
      .example([
        [
          '$0 login --http-server api.fog',
          'Login to the KNoT Cloud and create a token that will automatically be imported by the \
          operations.',
        ],
      ]);
  },
  handler: async (args) => {
    login(args);
  },
});
