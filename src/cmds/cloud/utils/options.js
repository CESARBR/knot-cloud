import os from 'os';
import getFileCredentials from './getFileCredentials';

const credentials = getFileCredentials(`${os.homedir()}/.knot/credentials.json`);

const options = {
  basic: {
    'token': {
      describe: 'User or application token',
      demandOption: true,
      default: credentials.token,
    },
    'credentials-file': {
      describe: 'Credentials file',
      demandOption: false,
    },
  },
  http: {
    'http-server': {
      describe: 'HTTP server hostname',
      demandOption: true,
      default: 'api.knot.cloud',
    },
    'http-port': {
      describe: 'HTTP server port',
      demandOption: true,
      default: 80,
    },
    'http-protocol': {
      describe: 'HTTP protocol name',
      demandOption: true,
      default: 'http',
    },
  },
  amqp: {
    'amqp-server': {
      describe: 'AMQP server hostname',
      demandOption: true,
      default: 'broker.knot.cloud',
    },
    'amqp-port': {
      describe: 'AMQP server port',
      demandOption: true,
      default: 5672,
    },
    'amqp-protocol': {
      describe: 'AMQP protocol name',
      demandOption: true,
      default: 'amqp',
    },
    'amqp-username': {
      describe: 'RabbitMQ username',
      demandOption: true,
      default: 'knot',
    },
    'amqp-password': {
      describe: 'RabbitMQ password',
      demandOption: true,
      default: 'knot',
    },
  },
};

export default options;
