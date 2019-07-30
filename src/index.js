#!/usr/bin/env node
/* eslint-disable no-console */
import yargs from 'yargs';

yargs // eslint-disable-line no-unused-expressions
  .commandDir('cmds/stack')
  .demandCommand()
  .strict()
  .alias('h', 'help')
  .help()
  .argv;
