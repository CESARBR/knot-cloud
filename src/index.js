#!/usr/bin/env node
/* eslint-disable no-console */
import yargs from 'yargs';

yargs // eslint-disable-line no-unused-expressions
  .command('init [path]', 'initialize stack', (_yargs) => {
    _yargs
      .positional('path', {
        describe: 'path where to clone repositories',
        default: `.`,
      });
  }, () => {
    console.log('Starting...');
  })
  .demandCommand()
  .help()
  .strict()
  .argv;
