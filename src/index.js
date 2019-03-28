#!/usr/bin/env node
/* eslint-disable no-console */
import yargs from 'yargs';
import gitClone from 'git-clone';
import fs from 'fs-extra';
import path from 'path';

const REPOSITORIES = [
  'CESARBR/knot-cloud-ui',
  'CESARBR/knot-cloud-protocol-adapter-websocket',
  'CESARBR/knot-cloud-authenticator',
  'CESARBR/knot-cloud-storage',
  'CESARBR/knot-cloud-bootstrap',
];

const cpDevDir = (basePath) => {
  const stackDir = path.join(basePath, 'stack');
  try {
    if (fs.existsSync(stackDir)) {
      fs.removeSync(stackDir);
    }
    fs.ensureDirSync(stackDir);
    fs.copySync('stacks/dev', stackDir);
  } catch (err) {
    console.error(`[Error]:
    An error occurred while copying the development stack files.
    This is mostly associated with write permissions on the destination directory,
    check knot.err for details on the issue.`);
    fs.writeJsonSync('knot.err',
      {
        Description: 'Error copying development stack',
        Error: err,
      });
  }
};

yargs // eslint-disable-line no-unused-expressions
  .command('init [path]', 'initialize stack', (_yargs) => {
    _yargs
      .positional('path', {
        describe: 'path where to clone repositories',
        default: '.',
      });
  }, (args) => {
    REPOSITORIES.forEach((repo) => {
      console.log(`Trying to clone repository: ${repo}`);
      gitClone(
        `http://github.com/${repo}`,
        `${args.path}/${repo.split('/')[1]}`,
        err => (err ? console.error(err) : console.log('Cloned!')),
      );
    });
    cpDevDir(args.path);
  })
  .demandCommand()
  .help()
  .strict()
  .argv;
