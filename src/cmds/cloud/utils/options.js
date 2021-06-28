import os from 'os';
import getFileCredentials from './getFileCredentials';

const credentials = getFileCredentials(`${os.homedir()}/.knot/credentials.json`);

export default {
  'server': {
    describe: 'Server hostname',
    demandOption: true,
    default: 'ws.knot.cloud',
  },
  'port': {
    describe: 'Server port',
    demandOption: true,
    default: 443,
  },
  'protocol': {
    describe: 'Protocol name',
    demandOption: true,
    default: 'wss',
  },
  'username': {
    describe: 'RabbitMQ username',
    demandOption: true,
    default: 'knot',
  },
  'password': {
    describe: 'RabbitMQ password',
    demandOption: true,
    default: 'knot',
  },
  'token': {
    describe: 'Client token',
    demandOption: true,
    default: credentials.token,
  },
  'credentials-file': {
    describe: 'Credentials file',
    demandOption: false,
  },
};
