#!/usr/bin/env node
/* eslint-disable no-console */
import yargs from 'yargs';
import gitClone from 'git-clone';
import fs from 'fs-extra';

const REPOSITORIES = [
  'CESARBR/knot-cloud-ui',
  'CESARBR/knot-cloud-protocol-adapter-websocket',
  'CESARBR/knot-cloud-authenticator',
  'CESARBR/knot-cloud-storage',
  'CESARBR/knot-cloud-bootstrap',
];

yargs // eslint-disable-line no-unused-expressions
  .command('init [path]', 'initialize stack', (_yargs) => {
    _yargs
      .positional('path', {
        describe: 'path where to clone repositories',
        default: '.',
      });
  }, (args) => {
    REPOSITORIES.forEach((repo) => {
      const repoName = repo.split('/')[1];
      const path = `${args.path}/${repoName}`;
      console.log(`Cloning: ${repoName}`);
      gitClone(
        `http://github.com/${repo}`,
        path,
        (err) => {
          if (err) {
            const msg = `[Error]:\n\tAn error occured while cloning repository ${repoName}\n`;
            console.error(msg);
            fs.writeFileSync('knot.err', msg, { flag: 'a', encoding: 'utf-8' });
            fs.writeFileSync('knot.err', `${err.stack}\n`, { flag: 'a', encoding: 'utf-8' });
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
