import os from 'os';
import getFileCredentials from './getFileCredentials';

const credentials = getFileCredentials(`${os.homedir()}/.knot/credentials.json`);

export default {
  server: {
    describe: 'Server hostname',
    demandOption: true,
    default: 'ws.knot.cloud',
  },
  port: {
    describe: 'Server port',
    demandOption: true,
    default: 443,
  },
  protocol: {
    describe: 'Protocol name',
    demandOption: true,
    default: 'wss',
  },
  pathName: {
    describe: 'Path name',
    demandOption: false,
    default: '/ws',
  },
  'client-id': {
    describe: 'Client ID',
    demandOption: true,
    default: credentials['client-id'],
  },
  'client-token': {
    describe: 'Client token',
    demandOption: true,
    default: credentials['client-token'],
  },
  'credentials-file': {
    describe: 'Credentials file',
    demandOption: false,
  },
};
