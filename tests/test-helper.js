import Application from 'dummy/app';
import config from 'dummy/config/environment';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';
import { setup } from 'qunit-dom';

setup(QUnit.assert);

setApplication(Application.create(config.APP));

setup(QUnit.assert);

function _getPushContext(context) {
  var pushContext;

  if (context && typeof context.push === 'function') {
    // `context` is an `Assert` context
    pushContext = context;
  } else if (
    context &&
    context.assert &&
    typeof context.assert.pushResult === 'function'
  ) {
    // `context` is a `Test` context
    pushContext = context.assert;
  } else if (
    QUnit &&
    QUnit.config &&
    QUnit.config.current &&
    QUnit.config.current.assert &&
    typeof QUnit.config.current.assert.pushResult === 'function'
  ) {
    // `context` is an unknown context but we can find the `Assert` context via QUnit
    pushContext = QUnit.config.current.assert;
  } else if (QUnit && typeof QUnit.pushResult === 'function') {
    pushContext = QUnit.pushResult;
  } else {
    throw new Error(
      'Could not find the QUnit `Assert` context to push results'
    );
  }

  return pushContext;
}

QUnit.assert.close = function close(actual, expected, maxDifference, message) {
  var actualDiff = actual === expected ? 0 : Math.abs(actual - expected),
    result = actualDiff <= maxDifference,
    pushContext = _getPushContext(this);

  message =
    message ||
    actual +
      ' should be within ' +
      maxDifference +
      ' (inclusive) of ' +
      expected +
      (result ? '' : '. Actual: ' + actualDiff);

  pushContext.pushResult({ result, actual, expected, message });
};

start();
