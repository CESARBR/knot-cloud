#!/usr/bin/env node
/* eslint-disable no-console */
import yargs from 'yargs';

yargs // eslint-disable-line no-unused-expressions
  .command('init [path]', 'init stack', (_yargs) => {
    _yargs
      .positional('path', {
        describe: 'path destination to clone repositories',
        default: `${process.env.HOME}/cloud`,
      });
  }, () => {
    console.log('Starting...');
  })
  .demandCommand()
  .help()
  .strict()
  .argv;
