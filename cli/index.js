/* eslint-disable no-console */
import yargs from 'yargs';
import gitClone from 'git-clone-repo';
import fs from 'fs-extra';
import path from 'path';

const REPOSITORIES = [
  'CESARBR/knot-cloud-ui',
  'CESARBR/knot-cloud-protocol-adapter-websocket',
  'CESARBR/knot-cloud-authenticator',
  'CESARBR/knot-cloud-storage',
];

const cpDevDir = (basePath) => {
  const stackDir = path.join(basePath, 'stack');
  try {
    if (fs.existsSync(stackDir)) {
      fs.removeSync(stackDir);
    }
    fs.ensureDirSync(stackDir);
    fs.copySync('/dev', stackDir);
  } catch (err) {
    console.error(err);
  }
};

yargs // eslint-disable-line no-unused-expressions
  .command('init [path]', 'init stack', (_yargs) => {
    _yargs
      .positional('path', {
        describe: 'path destination to clone repositories',
        default: `${process.env.HOME}/cloud`,
      });
  }, (args) => {
    REPOSITORIES.forEach((repo) => {
      console.log(`Trying to clone repository: ${repo}`);
      if (gitClone(repo, { host: 'github.com', destination: `${args.path}/${repo.split('/')[1]}` })) {
        console.log('Cloned!');
      } else {
        console.error('Repository already exists');
      }
    });
    cpDevDir(args.path);
  })
  .demandCommand()
  .help()
  .strict()
  .argv;
