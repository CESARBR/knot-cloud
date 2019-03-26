#!/usr/bin/env node
/* eslint-disable no-console */
import yargs from 'yargs';
import gitClone from 'git-clone';
import fs from 'fs';
import path from 'path';

const REPOSITORIES = [
  'CESARBR/knot-cloud-ui',
  'CESARBR/knot-cloud-protocol-adapter-websocket',
  'CESARBR/knot-cloud-authenticator',
  'CESARBR/knot-cloud-storage',
  'CESARBR/knot-cloud-bootstrap',
];

const LOG_FILE_NAME = 'knot.err';
const PATH_LOG_DIR = path.join(process.env.HOME, '.knot', 'logs');
const PATH_LOG_FILE = path.join(PATH_LOG_DIR, LOG_FILE_NAME);

const logFileMessageRepository = `
        This is mostly caused when the repository is already installed
        on the destination directory or if there is a connection problem.
        Check ${PATH_LOG_FILE} for more details about the issue\n`;

function mkdirRecursive(directory) {
  if (!path.isAbsolute(directory)) return;
  const { root } = path.parse(directory);
  const parent = path.join(directory, '..');
  if (parent !== root && !fs.existsSync(parent)) mkdirRecursive(parent);
  if (!fs.existsSync(directory)) fs.mkdirSync(directory);
}

function handleError(err, msg, logFileMessage) {
  console.error(msg);
  console.error(logFileMessage);
  if (!fs.existsSync(PATH_LOG_DIR)) {
    mkdirRecursive(PATH_LOG_DIR);
  }
  fs.writeFileSync(PATH_LOG_FILE, `${msg}\n`, { flag: 'a', encoding: 'utf-8' });
  fs.writeFileSync(PATH_LOG_FILE, `${err.stack}\n`, { flag: 'a', encoding: 'utf-8' });
}

yargs // eslint-disable-line no-unused-expressions
  .command('init [path]', 'initialize stack', (_yargs) => {
    _yargs
      .positional('path', {
        describe: 'path where to clone repositories',
        default: '.',
      });
  }, (args) => {
    if (fs.existsSync(PATH_LOG_FILE)) {
      fs.unlinkSync(PATH_LOG_FILE);
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
  })
  .demandCommand()
  .help()
  .strict()
  .argv;
