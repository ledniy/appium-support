// transpile:mocha

import { getDynamicLogger, restoreWriters, setupWriters,
         assertOutputContains, assertOutputDoesntContain } from './helpers';

const LOG_LEVELS = ['silly', 'verbose', 'info', 'http', 'warn', 'error'];

describe('normal logger', () => {
  let writers, log;
  beforeEach(() => {
    writers = setupWriters();
    log = getDynamicLogger(false, false);
    log.level = 'silly';
  });

  afterEach(() => {
    restoreWriters(writers);
  });

  it('should not rewrite log levels outside of testing', function () {
    for (const levelName of LOG_LEVELS) {
      log[levelName](levelName);
      assertOutputContains(writers, levelName);
    }
  });
  it('throw should not rewrite log levels outside of testing and throw error', function () {
    (() => { log.errorAndThrow('msg1'); }).should.throw('msg1');
    (() => { log.errorAndThrow(new Error('msg2')); }).should.throw('msg2');
    assertOutputContains(writers, 'msg1');
    assertOutputContains(writers, 'msg2');
  });
  it('should get and set log levels', function () {
    log.level = 'warn';
    log.level.should.equal('warn');
    log.info('information');
    log.warn('warning');
    assertOutputDoesntContain(writers, 'information');
    assertOutputContains(writers, 'warning');
  });
});

describe('normal logger with static prefix', () => {
  let writers, log;
  const PREFIX = 'my_static_prefix';

  before(() => {
    writers = setupWriters();
    log = getDynamicLogger(false, false, PREFIX);
    log.level = 'silly';
  });

  after(() => {
    restoreWriters(writers);
  });

  it('should not rewrite log levels outside of testing', function () {
    for (const levelName of LOG_LEVELS) {
      log[levelName](levelName);
      assertOutputContains(writers, levelName);
      assertOutputContains(writers, PREFIX);
    }
  });
  it('throw should not rewrite log levels outside of testing and throw error', function () {
    (() => { log.errorAndThrow('msg'); }).should.throw('msg');
    assertOutputContains(writers, 'error');
    assertOutputContains(writers, PREFIX);
  });
});

describe('normal logger with dynamic prefix', () => {
  let writers, log;
  const PREFIX = 'my_dynamic_prefix';

  before(() => {
    writers = setupWriters();
    log = getDynamicLogger(false, false, () => PREFIX);
    log.level = 'silly';
  });

  after(() => {
    restoreWriters(writers);
  });

  it('should not rewrite log levels outside of testing', function () {
    for (const levelName of LOG_LEVELS) {
      log[levelName](levelName);
      assertOutputContains(writers, levelName);
      assertOutputContains(writers, PREFIX);
    }
  });
  it('throw should not rewrite log levels outside of testing and throw error', function () {
    (() => { log.errorAndThrow('msg'); }).should.throw('msg');
    assertOutputContains(writers, 'error');
    assertOutputContains(writers, PREFIX);
  });
});
