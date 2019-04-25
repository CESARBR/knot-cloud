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

const KNOT_ERR_FILE = 'knot.err';
const KNOT_ERR_DIR = path.join(process.env.HOME, '.knot', 'logs');
const KNOT_ERR_PATH = path.join(KNOT_ERR_DIR, KNOT_ERR_FILE);

const logFileMessageRepository = `
        This is mostly caused when the repository is already installed
        on the destination directory or if there is a connection problem.
        Check ${KNOT_ERR_PATH} for more details about the issue\n`;

const logFileMessageCopyStack = `
        This is mostly associated with write permissions on the destination
        directory, check ${KNOT_ERR_PATH} for details on the issue.\n`;

function handleError(err, msg, logFileMessage) {
  console.error(msg, logFileMessage);
  fs.ensureDirSync(KNOT_ERR_DIR);
  fs.writeFileSync(KNOT_ERR_PATH, `${msg}\n`, { flag: 'a', encoding: 'utf-8' });
  fs.writeFileSync(KNOT_ERR_PATH, `${err.stack}\n`, { flag: 'a', encoding: 'utf-8' });
}

const cpDevDir = (basePath) => {
  const stackDir = path.join(basePath, 'stack');

  try {
    if (fs.existsSync(stackDir)) {
      fs.removeSync(stackDir);
    }
    fs.ensureDirSync(stackDir);
    fs.copySync(`${__dirname}/stacks/dev`, stackDir);
    console.log('Created development stack files');
  } catch (err) {
    const msg = '[Error]:\n\tAn error occurred while copying the development stack files.';
    handleError(err, msg, logFileMessageCopyStack);
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
    if (fs.existsSync(KNOT_ERR_PATH)) {
      fs.unlinkSync(KNOT_ERR_PATH);
    }
    REPOSITORIES.forEach((repo) => {
      const repoName = repo.split('/')[1];
      const repoPath = `${args.path}/${repoName}`;
      console.log(`Cloning: ${repoName}`);
      gitClone(
        `http://github.com/${repo}`,
        repoPath,
        (err) => {
          if (err) {
            const msg = `[Error]:\n\tAn error occured while cloning repository ${repoName}`;
            handleError(err, msg, logFileMessageRepository);
            return;
          }
          console.log(`Cloned: ${repoName}`);
        },
      );
    });
    cpDevDir(args.path);
  })
  .demandCommand()
  .help()
  .strict()
  .argv;
