'use strict';

module.exports = {
  extends: ['recommended'],
  rules: {
    'no-curly-component-invocation': {
      allow: ['emitter-action'],
    },
    'no-at-ember-render-modifiers': false,
  },
};
