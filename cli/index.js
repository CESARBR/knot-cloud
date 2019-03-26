#!/usr/bin/env node
/* eslint-disable no-console */
import yargs from 'yargs';
import gitClone from 'git-clone';

const REPOSITORIES = [
  'CESARBR/knot-cloud-ui',
  'CESARBR/knot-cloud-protocol-adapter-websocket',
  'CESARBR/knot-cloud-authenticator',
  'CESARBR/knot-cloud-storage',
];

yargs // eslint-disable-line no-unused-expressions
  .command('init [path]', 'init stack', (_yargs) => {
    _yargs
      .positional('path', {
        describe: 'path destination to clone repositories',
        default: process.env.HOME,
      });
  }, (args) => {
    REPOSITORIES.forEach((repo) => {
      console.log(`Trying to clone repository: ${repo}`);
      gitClone(
        `http://github.com/${repo}`,
        `${args.path}/cloud/${repo.split('/')[1]}`,
        err => err ? console.error(err) : console.log('Cloned!')
      );
    });
  })
  .demandCommand()
  .help()
  .strict()
  .argv;
