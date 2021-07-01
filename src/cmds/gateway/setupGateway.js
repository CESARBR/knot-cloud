/* eslint-disable no-console */
import yargs from 'yargs';
import colors from 'colors/safe';
import randomEmail from 'random-email';
import chalk from 'chalk';
import emoji from 'node-emoji';
import fs from 'fs';
import ini from 'ini';

import { Authenticator } from '@cesarbr/knot-cloud-sdk-js';
import { NodeSSH } from 'node-ssh';

const createTokens = async (properties) => {
  const client = new Authenticator(properties);
  const email = randomEmail({ domain: 'knot.com' });
  const password = 'acabate@1234';
  await client.createUser(email, password);
  const { token } = await client.createToken(email, password, 'user');
  const { token: appToken } = await client.createToken(email, token, 'app');
  return { email, password, token: appToken };
};

const setupThingd = async (ssh, token, modbusServer) => {
  const cloudConfig = ini.parse(fs.readFileSync(`${__dirname}/cloud.conf`, 'utf-8'));
  cloudConfig.Cloud.UserToken = token;
  fs.writeFileSync(`${__dirname}/cloud.conf`, ini.stringify(cloudConfig));
  await ssh.putFile(`${__dirname}/cloud.conf`, '/etc/knot/cloud.conf');

  const simulatorConfig = ini.parse(fs.readFileSync(`${__dirname}/simulator.conf`, 'utf-8'));
  simulatorConfig.KNoTThing.ModbusURL = modbusServer;
  fs.writeFileSync(`${__dirname}/simulator.conf`, ini.stringify(simulatorConfig));
  await ssh.putFile(`${__dirname}/simulator.conf`, '/etc/knot/device.conf');

  console.log(chalk.cyanBright('step 1: .conf files updated'));
};

const setupConnector = async (ssh, fogToken, cloudToken, cloudHostname) => {
  const fileContent = fs.readFileSync(`${__dirname}/connector.json`, 'utf-8');
  const config = JSON.parse(fileContent);
  config.fog.token = fogToken;
  config.cloud.amqp.token = cloudToken;
  config.cloud.amqp.hostname = cloudHostname;
  config.cloud.http.hostname = cloudHostname;
  fs.writeFileSync(`${__dirname}/connector.json`, JSON.stringify(config));
  await ssh.putFile(
    `${__dirname}/connector.json`,
    '/usr/local/bin/knot-fog-connector/config/default.json'
  );
  console.log(chalk.cyanBright('step 2: updating config/default.json file'));
};

const printCredentials = ({ email, password, token }) => {
  console.log(`${chalk.cyan.bold('email')}: ${chalk.whiteBright(email)}`);
  console.log(`${chalk.cyan.bold('password')}: ${chalk.whiteBright(password)}`);
  console.log(`${chalk.cyan.bold('app token')}: ${chalk.whiteBright(token)}`);
};

const getOptions = (args) => ({
  fog: {
    hostname: args.fogHostname,
    apiPort: args.fogPort,
    amqpPort: 5672,
  },
  cloud: {
    hostname: args.cloudHostname,
    apiPort: args.cloudPort,
    amqpPort: 5672,
  },
});

const startSSHConnection = async (host) => {
  const ssh = new NodeSSH();
  await ssh.connect({
    host,
    username: 'root',
    password: 'root',
  });
  return ssh;
};

const setupGateway = async (args) => {
  const cloudEmoji = emoji.get('cloud');
  const whiteCheckEmoji = emoji.get('white_check_mark');
  const dogEmoji = emoji.get('dog');

  const { fog, cloud } = getOptions(args);
  const fogCredentials = await createTokens({
    hostname: fog.hostname,
    port: fog.apiPort,
    protocol: 'http',
  });
  const cloudCredentials = await createTokens({
    hostname: cloud.hostname,
    port: cloud.apiPort,
    protocol: 'http',
  });

  const ssh = await startSSHConnection(args.fogHostname);

  try {
    console.log(chalk.blue.bold(`${dogEmoji} virtual-thing\n`));
    await setupThingd(ssh, fogCredentials.token, args.modbusServer);
    console.log(chalk.blue.bold(`\n${dogEmoji} knot-fog-connector\n`));
    await setupConnector(ssh, fogCredentials.token, cloudCredentials.token, cloud.hostname);
  } catch (err) {
    console.log(chalk.red(err));
  }

  console.log(chalk.green.bold(`\n${whiteCheckEmoji} finished - rebooting device`));
  await ssh.execCommand('reboot', {});
  await ssh.dispose();

  console.log('\n---------------------------------------------------------\n');

  console.log(chalk.blue.bold(`${cloudEmoji}  fog credentials ${cloudEmoji}\n`));
  printCredentials(fogCredentials);
  console.log('\n');
  console.log(chalk.blue.bold(`${cloudEmoji}  cloud credentials ${cloudEmoji}\n`));
  printCredentials(cloudCredentials);
};

const setup = async (args) => {
  try {
    await setupGateway(args);
  } catch (err) {
    if (err.code === 403) {
      console.log(colors.red('authentication failed, try again'));
    } else if (err.code === 400) {
      console.log(colors.red('bad request, verify e-mail and password formats'));
    }
  }
};

yargs.command({
  command: 'setup-gateway',
  desc: 'Setup gateway manually',
  builder: (_yargs) => {
    _yargs
      .positional('fog-hostname', {
        describe: 'Fog hostname',
        demandOption: true,
      })
      .positional('fog-port', {
        describe: 'Fog port',
        demandOption: true,
      })
      .positional('cloud-hostname', {
        describe: 'Cloud hostname',
        demandOption: true,
      })
      .positional('cloud-port', {
        describe: 'Cloud port',
        demandOption: true,
      })
      .positional('modbus-server', {
        describe: 'Modbus Server address',
        demandOption: true,
      });
  },
  handler: async (args) => {
    setup(args);
  },
});
