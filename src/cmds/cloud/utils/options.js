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
  },
  'client-token': {
    describe: 'Client token',
    demandOption: true,
  },
  'credentials-file': {
    describe: 'Credentials file',
    demandOption: false,
  },
};
