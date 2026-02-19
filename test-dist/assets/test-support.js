

(function() {
/*!
 * @overview  Ember - JavaScript Application Framework
 * @copyright Copyright 2011 Tilde Inc. and contributors
 *            Portions Copyright 2006-2011 Strobe Inc.
 *            Portions Copyright 2008-2011 Apple Inc. All rights reserved.
 * @license   Licensed under MIT license
 *            See https://raw.github.com/emberjs/ember.js/master/LICENSE
 * @version   4.12.4
 */
/* eslint-disable no-var */
/* globals global globalThis self */
/* eslint-disable-next-line no-unused-vars */
var define, require;
(function () {
  var globalObj = typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : null;
  if (globalObj === null) {
    throw new Error('unable to locate global object');
  }
  if (typeof globalObj.define === 'function' && typeof globalObj.require === 'function') {
    define = globalObj.define;
    require = globalObj.require;
    return;
  }
  var registry = Object.create(null);
  var seen = Object.create(null);
  function missingModule(name, referrerName) {
    if (referrerName) {
      throw new Error('Could not find module ' + name + ' required by: ' + referrerName);
    } else {
      throw new Error('Could not find module ' + name);
    }
  }
  function internalRequire(_name, referrerName) {
    var name = _name;
    var mod = registry[name];
    if (!mod) {
      name = name + '/index';
      mod = registry[name];
    }
    var exports = seen[name];
    if (exports !== undefined) {
      return exports;
    }
    exports = seen[name] = {};
    if (!mod) {
      missingModule(_name, referrerName);
    }
    var deps = mod.deps;
    var callback = mod.callback;
    var reified = new Array(deps.length);
    for (var i = 0; i < deps.length; i++) {
      if (deps[i] === 'exports') {
        reified[i] = exports;
      } else if (deps[i] === 'require') {
        reified[i] = require;
      } else {
        reified[i] = require(deps[i], name);
      }
    }
    callback.apply(this, reified);
    return exports;
  }
  require = function (name) {
    return internalRequire(name, null);
  };
  define = function (name, deps, callback) {
    registry[name] = {
      deps: deps,
      callback: callback
    };
  };

  // setup `require` module
  require['default'] = require;
  require.has = function registryHas(moduleName) {
    return Boolean(registry[moduleName]) || Boolean(registry[moduleName + '/index']);
  };
  require._eak_seen = require.entries = registry;
})();
define("@ember/debug/index", ["exports", "@ember/-internals/browser-environment", "@ember/debug/lib/deprecate", "@ember/debug/lib/testing", "@ember/debug/lib/warn", "@ember/debug/lib/inspect", "@ember/debug/lib/capture-render-tree"], function (_exports, _browserEnvironment, _deprecate2, _testing, _warn2, _inspect, _captureRenderTree) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.assert = _exports._warnIfUsingStrippedFeatureFlags = void 0;
  Object.defineProperty(_exports, "captureRenderTree", {
    enumerable: true,
    get: function () {
      return _captureRenderTree.default;
    }
  });
  _exports.info = _exports.getDebugFunction = _exports.deprecateFunc = _exports.deprecate = _exports.debugSeal = _exports.debugFreeze = _exports.debug = void 0;
  Object.defineProperty(_exports, "inspect", {
    enumerable: true,
    get: function () {
      return _inspect.default;
    }
  });
  Object.defineProperty(_exports, "isTesting", {
    enumerable: true,
    get: function () {
      return _testing.isTesting;
    }
  });
  Object.defineProperty(_exports, "registerDeprecationHandler", {
    enumerable: true,
    get: function () {
      return _deprecate2.registerHandler;
    }
  });
  Object.defineProperty(_exports, "registerWarnHandler", {
    enumerable: true,
    get: function () {
      return _warn2.registerHandler;
    }
  });
  _exports.setDebugFunction = _exports.runInDebug = void 0;
  Object.defineProperty(_exports, "setTesting", {
    enumerable: true,
    get: function () {
      return _testing.setTesting;
    }
  });
  _exports.warn = void 0;
  // These are the default production build versions:
  var noop = () => {};
  var assert = noop;
  _exports.assert = assert;
  var info = noop;
  _exports.info = info;
  var warn = noop;
  _exports.warn = warn;
  var debug = noop;
  _exports.debug = debug;
  var deprecate = noop;
  _exports.deprecate = deprecate;
  var debugSeal = noop;
  _exports.debugSeal = debugSeal;
  var debugFreeze = noop;
  _exports.debugFreeze = debugFreeze;
  var runInDebug = noop;
  _exports.runInDebug = runInDebug;
  var setDebugFunction = noop;
  _exports.setDebugFunction = setDebugFunction;
  var getDebugFunction = noop;
  _exports.getDebugFunction = getDebugFunction;
  var deprecateFunc = function () {
    return arguments[arguments.length - 1];
  };
  _exports.deprecateFunc = deprecateFunc;
  if (true /* DEBUG */) {
    _exports.setDebugFunction = setDebugFunction = function (type, callback) {
      switch (type) {
        case 'assert':
          return _exports.assert = assert = callback;
        case 'info':
          return _exports.info = info = callback;
        case 'warn':
          return _exports.warn = warn = callback;
        case 'debug':
          return _exports.debug = debug = callback;
        case 'deprecate':
          return _exports.deprecate = deprecate = callback;
        case 'debugSeal':
          return _exports.debugSeal = debugSeal = callback;
        case 'debugFreeze':
          return _exports.debugFreeze = debugFreeze = callback;
        case 'runInDebug':
          return _exports.runInDebug = runInDebug = callback;
        case 'deprecateFunc':
          return _exports.deprecateFunc = deprecateFunc = callback;
      }
    };
    _exports.getDebugFunction = getDebugFunction = function (type) {
      switch (type) {
        case 'assert':
          return assert;
        case 'info':
          return info;
        case 'warn':
          return warn;
        case 'debug':
          return debug;
        case 'deprecate':
          return deprecate;
        case 'debugSeal':
          return debugSeal;
        case 'debugFreeze':
          return debugFreeze;
        case 'runInDebug':
          return runInDebug;
        case 'deprecateFunc':
          return deprecateFunc;
      }
    };
  }
  /**
  @module @ember/debug
  */
  if (true /* DEBUG */) {
    /**
      Verify that a certain expectation is met, or throw a exception otherwise.
         This is useful for communicating assumptions in the code to other human
      readers as well as catching bugs that accidentally violates these
      expectations.
         Assertions are removed from production builds, so they can be freely added
      for documentation and debugging purposes without worries of incuring any
      performance penalty. However, because of that, they should not be used for
      checks that could reasonably fail during normal usage. Furthermore, care
      should be taken to avoid accidentally relying on side-effects produced from
      evaluating the condition itself, since the code will not run in production.
         ```javascript
      import { assert } from '@ember/debug';
         // Test for truthiness
      assert('Must pass a string', typeof str === 'string');
         // Fail unconditionally
      assert('This code path should never be run');
      ```
         @method assert
      @static
      @for @ember/debug
      @param {String} description Describes the expectation. This will become the
        text of the Error thrown if the assertion fails.
      @param {any} condition Must be truthy for the assertion to pass. If
        falsy, an exception will be thrown.
      @public
      @since 1.0.0
    */
    setDebugFunction('assert', function assert(desc, test) {
      if (!test) {
        throw new Error(`Assertion Failed: ${desc}`);
      }
    });
    /**
      Display a debug notice.
         Calls to this function are not invoked in production builds.
         ```javascript
      import { debug } from '@ember/debug';
         debug('I\'m a debug notice!');
      ```
         @method debug
      @for @ember/debug
      @static
      @param {String} message A debug message to display.
      @public
    */
    setDebugFunction('debug', function debug(message) {
      console.debug(`DEBUG: ${message}`); /* eslint-disable-line no-console */
    });
    /**
      Display an info notice.
         Calls to this function are removed from production builds, so they can be
      freely added for documentation and debugging purposes without worries of
      incuring any performance penalty.
         @method info
      @private
    */
    setDebugFunction('info', function info() {
      console.info(...arguments); /* eslint-disable-line no-console */
    });
    /**
     @module @ember/debug
     @public
    */
    /**
      Alias an old, deprecated method with its new counterpart.
         Display a deprecation warning with the provided message and a stack trace
      (Chrome and Firefox only) when the assigned method is called.
         Calls to this function are removed from production builds, so they can be
      freely added for documentation and debugging purposes without worries of
      incuring any performance penalty.
         ```javascript
      import { deprecateFunc } from '@ember/debug';
         Ember.oldMethod = deprecateFunc('Please use the new, updated method', options, Ember.newMethod);
      ```
         @method deprecateFunc
      @static
      @for @ember/debug
      @param {String} message A description of the deprecation.
      @param {Object} [options] The options object for `deprecate`.
      @param {Function} func The new function called to replace its deprecated counterpart.
      @return {Function} A new function that wraps the original function with a deprecation warning
      @private
    */
    setDebugFunction('deprecateFunc', function deprecateFunc() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      if (args.length === 3) {
        var [message, options, func] = args;
        return function () {
          deprecate(message, false, options);
          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }
          return func.apply(this, args);
        };
      } else {
        var [_message, _func] = args;
        return function () {
          deprecate(_message);
          return _func.apply(this, arguments);
        };
      }
    });
    /**
     @module @ember/debug
     @public
    */
    /**
      Run a function meant for debugging.
         Calls to this function are removed from production builds, so they can be
      freely added for documentation and debugging purposes without worries of
      incuring any performance penalty.
         ```javascript
      import Component from '@ember/component';
      import { runInDebug } from '@ember/debug';
         runInDebug(() => {
        Component.reopen({
          didInsertElement() {
            console.log("I'm happy");
          }
        });
      });
      ```
         @method runInDebug
      @for @ember/debug
      @static
      @param {Function} func The function to be executed.
      @since 1.5.0
      @public
    */
    setDebugFunction('runInDebug', function runInDebug(func) {
      func();
    });
    setDebugFunction('debugSeal', function debugSeal(obj) {
      Object.seal(obj);
    });
    setDebugFunction('debugFreeze', function debugFreeze(obj) {
      // re-freezing an already frozen object introduces a significant
      // performance penalty on Chrome (tested through 59).
      //
      // See: https://bugs.chromium.org/p/v8/issues/detail?id=6450
      if (!Object.isFrozen(obj)) {
        Object.freeze(obj);
      }
    });
    setDebugFunction('deprecate', _deprecate2.default);
    setDebugFunction('warn', _warn2.default);
  }
  var _warnIfUsingStrippedFeatureFlags;
  _exports._warnIfUsingStrippedFeatureFlags = _warnIfUsingStrippedFeatureFlags;
  if (true /* DEBUG */ && !(0, _testing.isTesting)()) {
    if (typeof window !== 'undefined' && (_browserEnvironment.isFirefox || _browserEnvironment.isChrome) && window.addEventListener) {
      window.addEventListener('load', () => {
        if (document.documentElement && document.documentElement.dataset && !document.documentElement.dataset['emberExtension']) {
          var downloadURL;
          if (_browserEnvironment.isChrome) {
            downloadURL = 'https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi';
          } else if (_browserEnvironment.isFirefox) {
            downloadURL = 'https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/';
          }
          debug(`For more advanced debugging, install the Ember Inspector from ${downloadURL}`);
        }
      }, false);
    }
  }
});
define("@ember/debug/lib/capture-render-tree", ["exports", "@glimmer/util"], function (_exports, _util) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = captureRenderTree;
  /**
    @module @ember/debug
  */
  /**
    Ember Inspector calls this function to capture the current render tree.
  
    In production mode, this requires turning on `ENV._DEBUG_RENDER_TREE`
    before loading Ember.
  
    @private
    @static
    @method captureRenderTree
    @for @ember/debug
    @param app {ApplicationInstance} An `ApplicationInstance`.
    @since 3.14.0
  */
  function captureRenderTree(app) {
    // SAFETY: Ideally we'd assert here but that causes awkward circular requires since this is also in @ember/debug.
    // This is only for debug stuff so not very risky.
    var renderer = (0, _util.expect)(app.lookup('renderer:-dom'), `BUG: owner is missing renderer`);
    return renderer.debugRenderTree.capture();
  }
});
define("@ember/debug/lib/deprecate", ["exports", "@ember/-internals/environment", "@ember/debug/index", "@ember/debug/lib/handlers"], function (_exports, _environment, _index, _handlers) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.registerHandler = _exports.missingOptionsIdDeprecation = _exports.missingOptionsDeprecation = _exports.missingOptionDeprecation = _exports.default = void 0;
  /**
   @module @ember/debug
   @public
  */
  /**
    Allows for runtime registration of handler functions that override the default deprecation behavior.
    Deprecations are invoked by calls to [@ember/debug/deprecate](/ember/release/classes/@ember%2Fdebug/methods/deprecate?anchor=deprecate).
    The following example demonstrates its usage by registering a handler that throws an error if the
    message contains the word "should", otherwise defers to the default handler.
  
    ```javascript
    import { registerDeprecationHandler } from '@ember/debug';
  
    registerDeprecationHandler((message, options, next) => {
      if (message.indexOf('should') !== -1) {
        throw new Error(`Deprecation message with should: ${message}`);
      } else {
        // defer to whatever handler was registered before this one
        next(message, options);
      }
    });
    ```
  
    The handler function takes the following arguments:
  
    <ul>
      <li> <code>message</code> - The message received from the deprecation call.</li>
      <li> <code>options</code> - An object passed in with the deprecation call containing additional information including:</li>
        <ul>
          <li> <code>id</code> - An id of the deprecation in the form of <code>package-name.specific-deprecation</code>.</li>
          <li> <code>until</code> - The Ember version number the feature and deprecation will be removed in.</li>
        </ul>
      <li> <code>next</code> - A function that calls into the previously registered handler.</li>
    </ul>
  
    @public
    @static
    @method registerDeprecationHandler
    @for @ember/debug
    @param handler {Function} A function to handle deprecation calls.
    @since 2.1.0
  */
  var registerHandler = () => {};
  _exports.registerHandler = registerHandler;
  var missingOptionsDeprecation;
  _exports.missingOptionsDeprecation = missingOptionsDeprecation;
  var missingOptionsIdDeprecation;
  _exports.missingOptionsIdDeprecation = missingOptionsIdDeprecation;
  var missingOptionDeprecation = () => '';
  _exports.missingOptionDeprecation = missingOptionDeprecation;
  var deprecate = () => {};
  if (true /* DEBUG */) {
    _exports.registerHandler = registerHandler = function registerHandler(handler) {
      (0, _handlers.registerHandler)('deprecate', handler);
    };
    var formatMessage = function formatMessage(_message, options) {
      var message = _message;
      if (options === null || options === void 0 ? void 0 : options.id) {
        message = message + ` [deprecation id: ${options.id}]`;
      }
      if (options === null || options === void 0 ? void 0 : options.until) {
        message = message + ` This will be removed in ${options.for} ${options.until}.`;
      }
      if (options === null || options === void 0 ? void 0 : options.url) {
        message += ` See ${options.url} for more details.`;
      }
      return message;
    };
    registerHandler(function logDeprecationToConsole(message, options) {
      var updatedMessage = formatMessage(message, options);
      console.warn(`DEPRECATION: ${updatedMessage}`); // eslint-disable-line no-console
    });

    var captureErrorForStack;
    if (new Error().stack) {
      captureErrorForStack = () => new Error();
    } else {
      captureErrorForStack = () => {
        try {
          __fail__.fail();
        } catch (e) {
          return e;
        }
      };
    }
    registerHandler(function logDeprecationStackTrace(message, options, next) {
      if (_environment.ENV.LOG_STACKTRACE_ON_DEPRECATION) {
        var stackStr = '';
        var error = captureErrorForStack();
        var stack;
        if (error instanceof Error) {
          if (error.stack) {
            if (error['arguments']) {
              // Chrome
              stack = error.stack.replace(/^\s+at\s+/gm, '').replace(/^([^(]+?)([\n$])/gm, '{anonymous}($1)$2').replace(/^Object.<anonymous>\s*\(([^)]+)\)/gm, '{anonymous}($1)').split('\n');
              stack.shift();
            } else {
              // Firefox
              stack = error.stack.replace(/(?:\n@:0)?\s+$/m, '').replace(/^\(/gm, '{anonymous}(').split('\n');
            }
            stackStr = `\n    ${stack.slice(2).join('\n    ')}`;
          }
        }
        var updatedMessage = formatMessage(message, options);
        console.warn(`DEPRECATION: ${updatedMessage}${stackStr}`); // eslint-disable-line no-console
      } else {
        next(message, options);
      }
    });
    registerHandler(function raiseOnDeprecation(message, options, next) {
      if (_environment.ENV.RAISE_ON_DEPRECATION) {
        var updatedMessage = formatMessage(message);
        throw new Error(updatedMessage);
      } else {
        next(message, options);
      }
    });
    _exports.missingOptionsDeprecation = missingOptionsDeprecation = 'When calling `deprecate` you ' + 'must provide an `options` hash as the third parameter.  ' + '`options` should include `id` and `until` properties.';
    _exports.missingOptionsIdDeprecation = missingOptionsIdDeprecation = 'When calling `deprecate` you must provide `id` in options.';
    _exports.missingOptionDeprecation = missingOptionDeprecation = (id, missingOption) => {
      return `When calling \`deprecate\` you must provide \`${missingOption}\` in options. Missing options.${missingOption} in "${id}" deprecation`;
    };
    /**
     @module @ember/debug
     @public
     */
    /**
      Display a deprecation warning with the provided message and a stack trace
      (Chrome and Firefox only).
         Ember itself leverages [Semantic Versioning](https://semver.org) to aid
      projects in keeping up with changes to the framework. Before any
      functionality or API is removed, it first flows linearly through a
      deprecation staging process. The staging process currently contains two
      stages: available and enabled.
         Deprecations are initially released into the 'available' stage.
      Deprecations will stay in this stage until the replacement API has been
      marked as a recommended practice via the RFC process and the addon
      ecosystem has generally adopted the change.
         Once a deprecation meets the above criteria, it will move into the
      'enabled' stage where it will remain until the functionality or API is
      eventually removed.
         For application and addon developers, "available" deprecations are not
      urgent and "enabled" deprecations require action.
         * In a production build, this method is defined as an empty function (NOP).
      Uses of this method in Ember itself are stripped from the ember.prod.js build.
         ```javascript
      import { deprecate } from '@ember/debug';
         deprecate(
        'Use of `assign` has been deprecated. Please use `Object.assign` or the spread operator instead.',
        false,
        {
          id: 'ember-polyfills.deprecate-assign',
          until: '5.0.0',
          url: 'https://deprecations.emberjs.com/v4.x/#toc_ember-polyfills-deprecate-assign',
          for: 'ember-source',
          since: {
            available: '4.0.0',
            enabled: '4.0.0',
          },
        }
      );
      ```
         @method deprecate
      @for @ember/debug
      @param {String} message A description of the deprecation.
      @param {Boolean} test A boolean. If falsy, the deprecation will be displayed.
      @param {Object} options
      @param {String} options.id A unique id for this deprecation. The id can be
        used by Ember debugging tools to change the behavior (raise, log or silence)
        for that specific deprecation. The id should be namespaced by dots, e.g.
        "view.helper.select".
      @param {string} options.until The version of Ember when this deprecation
        warning will be removed.
      @param {String} options.for A namespace for the deprecation, usually the package name
      @param {Object} options.since Describes when the deprecation became available and enabled.
      @param {String} [options.url] An optional url to the transition guide on the
            emberjs.com website.
      @static
      @public
      @since 1.0.0
    */
    deprecate = function deprecate(message, test, options) {
      (0, _index.assert)(missingOptionsDeprecation, Boolean(options && (options.id || options.until)));
      (0, _index.assert)(missingOptionsIdDeprecation, Boolean(options.id));
      (0, _index.assert)(missingOptionDeprecation(options.id, 'until'), Boolean(options.until));
      (0, _index.assert)(missingOptionDeprecation(options.id, 'for'), Boolean(options.for));
      (0, _index.assert)(missingOptionDeprecation(options.id, 'since'), Boolean(options.since));
      (0, _handlers.invoke)('deprecate', message, test, options);
    };
  }
  var _default = deprecate;
  _exports.default = _default;
});
define("@ember/debug/lib/handlers", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.registerHandler = _exports.invoke = _exports.HANDLERS = void 0;
  var HANDLERS = {};
  _exports.HANDLERS = HANDLERS;
  var registerHandler = function registerHandler(_type, _callback) {};
  _exports.registerHandler = registerHandler;
  var invoke = () => {};
  _exports.invoke = invoke;
  if (true /* DEBUG */) {
    _exports.registerHandler = registerHandler = function registerHandler(type, callback) {
      var nextHandler = HANDLERS[type] || (() => {});
      HANDLERS[type] = (message, options) => {
        callback(message, options, nextHandler);
      };
    };
    _exports.invoke = invoke = function invoke(type, message, test, options) {
      if (test) {
        return;
      }
      var handlerForType = HANDLERS[type];
      if (handlerForType) {
        handlerForType(message, options);
      }
    };
  }
});
define("@ember/debug/lib/inspect", ["exports", "@glimmer/util", "@ember/debug"], function (_exports, _util, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = inspect;
  var {
    toString: objectToString
  } = Object.prototype;
  var {
    toString: functionToString
  } = Function.prototype;
  var {
    isArray
  } = Array;
  var {
    keys: objectKeys
  } = Object;
  var {
    stringify
  } = JSON;
  var LIST_LIMIT = 100;
  var DEPTH_LIMIT = 4;
  var SAFE_KEY = /^[\w$]+$/;
  /**
   @module @ember/debug
  */
  /**
    Convenience method to inspect an object. This method will attempt to
    convert the object into a useful string description.
  
    It is a pretty simple implementation. If you want something more robust,
    use something like JSDump: https://github.com/NV/jsDump
  
    @method inspect
    @static
    @param {Object} obj The object you want to inspect.
    @return {String} A description of the object
    @since 1.4.0
    @private
  */
  function inspect(obj) {
    // detect Node util.inspect call inspect(depth: number, opts: object)
    if (typeof obj === 'number' && arguments.length === 2) {
      return this;
    }
    return inspectValue(obj, 0);
  }
  function inspectValue(value, depth, seen) {
    var valueIsArray = false;
    switch (typeof value) {
      case 'undefined':
        return 'undefined';
      case 'object':
        if (value === null) return 'null';
        if (isArray(value)) {
          valueIsArray = true;
          break;
        }
        // is toString Object.prototype.toString or undefined then traverse
        if (value.toString === objectToString || value.toString === undefined) {
          break;
        }
        // custom toString
        return value.toString();
      case 'function':
        return value.toString === functionToString ? value.name ? `[Function:${value.name}]` : `[Function]` : value.toString();
      case 'string':
        return stringify(value);
      case 'symbol':
      case 'boolean':
      case 'number':
      default:
        return value.toString();
    }
    if (seen === undefined) {
      seen = new _util._WeakSet();
    } else {
      if (seen.has(value)) return `[Circular]`;
    }
    seen.add(value);
    return valueIsArray ? inspectArray(value, depth + 1, seen) : inspectObject(value, depth + 1, seen);
  }
  function inspectKey(key) {
    return SAFE_KEY.test(key) ? key : stringify(key);
  }
  function inspectObject(obj, depth, seen) {
    if (depth > DEPTH_LIMIT) {
      return '[Object]';
    }
    var s = '{';
    var keys = objectKeys(obj);
    for (var i = 0; i < keys.length; i++) {
      s += i === 0 ? ' ' : ', ';
      if (i >= LIST_LIMIT) {
        s += `... ${keys.length - LIST_LIMIT} more keys`;
        break;
      }
      var key = keys[i];
      (true && !(key) && (0, _debug.assert)('has key', key)); // Looping over array
      s += `${inspectKey(String(key))}: ${inspectValue(obj[key], depth, seen)}`;
    }
    s += ' }';
    return s;
  }
  function inspectArray(arr, depth, seen) {
    if (depth > DEPTH_LIMIT) {
      return '[Array]';
    }
    var s = '[';
    for (var i = 0; i < arr.length; i++) {
      s += i === 0 ? ' ' : ', ';
      if (i >= LIST_LIMIT) {
        s += `... ${arr.length - LIST_LIMIT} more items`;
        break;
      }
      s += inspectValue(arr[i], depth, seen);
    }
    s += ' ]';
    return s;
  }
});
define("@ember/debug/lib/testing", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.isTesting = isTesting;
  _exports.setTesting = setTesting;
  var testing = false;
  function isTesting() {
    return testing;
  }
  function setTesting(value) {
    testing = Boolean(value);
  }
});
define("@ember/debug/lib/warn", ["exports", "@ember/debug/index", "@ember/debug/lib/handlers"], function (_exports, _index, _handlers) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.registerHandler = _exports.missingOptionsIdDeprecation = _exports.missingOptionsDeprecation = _exports.default = void 0;
  var registerHandler = () => {};
  _exports.registerHandler = registerHandler;
  var warn = () => {};
  var missingOptionsDeprecation;
  _exports.missingOptionsDeprecation = missingOptionsDeprecation;
  var missingOptionsIdDeprecation;
  /**
  @module @ember/debug
  */
  _exports.missingOptionsIdDeprecation = missingOptionsIdDeprecation;
  if (true /* DEBUG */) {
    /**
      Allows for runtime registration of handler functions that override the default warning behavior.
      Warnings are invoked by calls made to [@ember/debug/warn](/ember/release/classes/@ember%2Fdebug/methods/warn?anchor=warn).
      The following example demonstrates its usage by registering a handler that does nothing overriding Ember's
      default warning behavior.
         ```javascript
      import { registerWarnHandler } from '@ember/debug';
         // next is not called, so no warnings get the default behavior
      registerWarnHandler(() => {});
      ```
         The handler function takes the following arguments:
         <ul>
        <li> <code>message</code> - The message received from the warn call. </li>
        <li> <code>options</code> - An object passed in with the warn call containing additional information including:</li>
          <ul>
            <li> <code>id</code> - An id of the warning in the form of <code>package-name.specific-warning</code>.</li>
          </ul>
        <li> <code>next</code> - A function that calls into the previously registered handler.</li>
      </ul>
         @public
      @static
      @method registerWarnHandler
      @for @ember/debug
      @param handler {Function} A function to handle warnings.
      @since 2.1.0
    */
    _exports.registerHandler = registerHandler = function registerHandler(handler) {
      (0, _handlers.registerHandler)('warn', handler);
    };
    registerHandler(function logWarning(message) {
      /* eslint-disable no-console */
      console.warn(`WARNING: ${message}`);
      /* eslint-enable no-console */
    });

    _exports.missingOptionsDeprecation = missingOptionsDeprecation = 'When calling `warn` you ' + 'must provide an `options` hash as the third parameter.  ' + '`options` should include an `id` property.';
    _exports.missingOptionsIdDeprecation = missingOptionsIdDeprecation = 'When calling `warn` you must provide `id` in options.';
    /**
      Display a warning with the provided message.
         * In a production build, this method is defined as an empty function (NOP).
      Uses of this method in Ember itself are stripped from the ember.prod.js build.
         ```javascript
      import { warn } from '@ember/debug';
      import tomsterCount from './tomster-counter'; // a module in my project
         // Log a warning if we have more than 3 tomsters
      warn('Too many tomsters!', tomsterCount <= 3, {
        id: 'ember-debug.too-many-tomsters'
      });
      ```
         @method warn
      @for @ember/debug
      @static
      @param {String} message A warning to display.
      @param {Boolean} test An optional boolean. If falsy, the warning
        will be displayed.
      @param {Object} options An object that can be used to pass a unique
        `id` for this warning.  The `id` can be used by Ember debugging tools
        to change the behavior (raise, log, or silence) for that specific warning.
        The `id` should be namespaced by dots, e.g. "ember-debug.feature-flag-with-features-stripped"
      @public
      @since 1.0.0
    */
    warn = function warn(message, test, options) {
      if (arguments.length === 2 && typeof test === 'object') {
        options = test;
        test = false;
      }
      (0, _index.assert)(missingOptionsDeprecation, Boolean(options));
      (0, _index.assert)(missingOptionsIdDeprecation, Boolean(options && options.id));
      (0, _handlers.invoke)('warn', message, test, options);
    };
  }
  var _default = warn;
  _exports.default = _default;
});
define("ember-testing/index", ["exports", "ember-testing/lib/test", "ember-testing/lib/adapters/adapter", "ember-testing/lib/setup_for_testing", "ember-testing/lib/adapters/qunit", "ember-testing/lib/ext/application", "ember-testing/lib/ext/rsvp", "ember-testing/lib/helpers", "ember-testing/lib/initializers"], function (_exports, _test, _adapter, _setup_for_testing, _qunit, _application, _rsvp, _helpers, _initializers) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "Adapter", {
    enumerable: true,
    get: function () {
      return _adapter.default;
    }
  });
  Object.defineProperty(_exports, "QUnitAdapter", {
    enumerable: true,
    get: function () {
      return _qunit.default;
    }
  });
  Object.defineProperty(_exports, "Test", {
    enumerable: true,
    get: function () {
      return _test.default;
    }
  });
  Object.defineProperty(_exports, "setupForTesting", {
    enumerable: true,
    get: function () {
      return _setup_for_testing.default;
    }
  });
});
define("ember-testing/lib/adapters/adapter", ["exports", "@ember/object"], function (_exports, _object) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var Adapter = _object.default.extend({
    /**
      This callback will be called whenever an async operation is about to start.
         Override this to call your framework's methods that handle async
      operations.
         @public
      @method asyncStart
    */
    asyncStart() {},
    /**
      This callback will be called whenever an async operation has completed.
         @public
      @method asyncEnd
    */
    asyncEnd() {},
    /**
      Override this method with your testing framework's false assertion.
      This function is called whenever an exception occurs causing the testing
      promise to fail.
         QUnit example:
         ```javascript
        exception: function(error) {
          ok(false, error);
        };
      ```
         @public
      @method exception
      @param {String} error The exception to be raised.
    */
    exception(error) {
      throw error;
    }
  });
  var _default = Adapter;
  _exports.default = _default;
});
define("ember-testing/lib/adapters/qunit", ["exports", "@ember/debug", "ember-testing/lib/adapters/adapter"], function (_exports, _debug, _adapter) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  /* globals QUnit */

  function isVeryOldQunit(obj) {
    return obj != null && typeof obj.stop === 'function';
  }
  var QUnitAdapter = _adapter.default.extend({
    init() {
      this.doneCallbacks = [];
    },
    asyncStart() {
      if (isVeryOldQunit(QUnit)) {
        // very old QUnit version
        // eslint-disable-next-line qunit/no-qunit-stop
        QUnit.stop();
      } else {
        this.doneCallbacks.push(QUnit.config.current ? QUnit.config.current.assert.async() : null);
      }
    },
    asyncEnd() {
      // checking for QUnit.stop here (even though we _need_ QUnit.start) because
      // QUnit.start() still exists in QUnit 2.x (it just throws an error when calling
      // inside a test context)
      if (isVeryOldQunit(QUnit)) {
        QUnit.start();
      } else {
        var done = this.doneCallbacks.pop();
        // This can be null if asyncStart() was called outside of a test
        if (done) {
          done();
        }
      }
    },
    exception(error) {
      QUnit.config.current.assert.ok(false, (0, _debug.inspect)(error));
    }
  });
  var _default = QUnitAdapter;
  _exports.default = _default;
});
define("ember-testing/lib/ext/application", ["@ember/application", "ember-testing/lib/setup_for_testing", "ember-testing/lib/test/helpers", "ember-testing/lib/test/promise", "ember-testing/lib/test/run", "ember-testing/lib/test/on_inject_helpers", "ember-testing/lib/test/adapter", "@ember/debug"], function (_application, _setup_for_testing, _helpers, _promise, _run, _on_inject_helpers, _adapter, _debug) {
  "use strict";

  _application.default.reopen({
    /**
     This property contains the testing helpers for the current application. These
     are created once you call `injectTestHelpers` on your `Application`
     instance. The included helpers are also available on the `window` object by
     default, but can be used from this object on the individual application also.
         @property testHelpers
      @type {Object}
      @default {}
      @public
    */
    testHelpers: {},
    /**
     This property will contain the original methods that were registered
     on the `helperContainer` before `injectTestHelpers` is called.
        When `removeTestHelpers` is called, these methods are restored to the
     `helperContainer`.
         @property originalMethods
      @type {Object}
      @default {}
      @private
      @since 1.3.0
    */
    originalMethods: {},
    /**
    This property indicates whether or not this application is currently in
    testing mode. This is set when `setupForTesting` is called on the current
    application.
       @property testing
    @type {Boolean}
    @default false
    @since 1.3.0
    @public
    */
    testing: false,
    /**
      This hook defers the readiness of the application, so that you can start
      the app when your tests are ready to run. It also sets the router's
      location to 'none', so that the window's location will not be modified
      (preventing both accidental leaking of state between tests and interference
      with your testing framework). `setupForTesting` should only be called after
      setting a custom `router` class (for example `App.Router = Router.extend(`).
         Example:
         ```
      App.setupForTesting();
      ```
         @method setupForTesting
      @public
    */
    setupForTesting() {
      (0, _setup_for_testing.default)();
      this.testing = true;
      this.resolveRegistration('router:main').reopen({
        location: 'none'
      });
    },
    /**
      This will be used as the container to inject the test helpers into. By
      default the helpers are injected into `window`.
         @property helperContainer
      @type {Object} The object to be used for test helpers.
      @default window
      @since 1.2.0
      @private
    */
    helperContainer: null,
    /**
      This injects the test helpers into the `helperContainer` object. If an object is provided
      it will be used as the helperContainer. If `helperContainer` is not set it will default
      to `window`. If a function of the same name has already been defined it will be cached
      (so that it can be reset if the helper is removed with `unregisterHelper` or
      `removeTestHelpers`).
         Any callbacks registered with `onInjectHelpers` will be called once the
      helpers have been injected.
         Example:
      ```
      App.injectTestHelpers();
      ```
         @method injectTestHelpers
      @public
    */
    injectTestHelpers(helperContainer) {
      if (helperContainer) {
        this.helperContainer = helperContainer;
      } else {
        this.helperContainer = window;
      }
      this.reopen({
        willDestroy() {
          this._super(...arguments);
          this.removeTestHelpers();
        }
      });
      this.testHelpers = {};
      for (var name in _helpers.helpers) {
        // SAFETY: It is safe to access a property on an object
        this.originalMethods[name] = this.helperContainer[name];
        // SAFETY: It is not quite as safe to do this, but it _seems_ to be ok.
        this.testHelpers[name] = this.helperContainer[name] = helper(this, name);
        // SAFETY: We checked that it exists
        protoWrap(_promise.default.prototype, name, helper(this, name), _helpers.helpers[name].meta.wait);
      }
      (0, _on_inject_helpers.invokeInjectHelpersCallbacks)(this);
    },
    /**
      This removes all helpers that have been registered, and resets and functions
      that were overridden by the helpers.
         Example:
         ```javascript
      App.removeTestHelpers();
      ```
         @public
      @method removeTestHelpers
    */
    removeTestHelpers() {
      if (!this.helperContainer) {
        return;
      }
      for (var name in _helpers.helpers) {
        this.helperContainer[name] = this.originalMethods[name];
        // SAFETY: This is a weird thing, but it's not technically unsafe here.
        delete _promise.default.prototype[name];
        delete this.testHelpers[name];
        delete this.originalMethods[name];
      }
    }
  });
  // This method is no longer needed
  // But still here for backwards compatibility
  // of helper chaining
  function protoWrap(proto, name, callback, isAsync) {
    // SAFETY: This isn't entirely safe, but it _seems_ to be ok.
    proto[name] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      if (isAsync) {
        return callback.apply(this, args);
      } else {
        // SAFETY: This is not actually safe.
        return this.then(function () {
          return callback.apply(this, args);
        });
      }
    };
  }
  function helper(app, name) {
    var helper = _helpers.helpers[name];
    (true && !(helper) && (0, _debug.assert)(`[BUG] Missing helper: ${name}`, helper));
    var fn = helper.method;
    var meta = helper.meta;
    if (!meta.wait) {
      return function () {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }
        return fn.apply(app, [app, ...args]);
      };
    }
    return function () {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }
      var lastPromise = (0, _run.default)(() => (0, _promise.resolve)((0, _promise.getLastPromise)()));
      // wait for last helper's promise to resolve and then
      // execute. To be safe, we need to tell the adapter we're going
      // asynchronous here, because fn may not be invoked before we
      // return.
      (0, _adapter.asyncStart)();
      return lastPromise.then(() => fn.apply(app, [app, ...args])).finally(_adapter.asyncEnd);
    };
  }
});
define("ember-testing/lib/ext/rsvp", ["exports", "@ember/-internals/runtime", "@ember/runloop", "@ember/debug", "ember-testing/lib/test/adapter"], function (_exports, _runtime, _runloop, _debug, _adapter) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _runtime.RSVP.configure('async', function (callback, promise) {
    // if schedule will cause autorun, we need to inform adapter
    if ((0, _debug.isTesting)() && !_runloop._backburner.currentInstance) {
      (0, _adapter.asyncStart)();
      _runloop._backburner.schedule('actions', () => {
        (0, _adapter.asyncEnd)();
        callback(promise);
      });
    } else {
      _runloop._backburner.schedule('actions', () => callback(promise));
    }
  });
  var _default = _runtime.RSVP;
  _exports.default = _default;
});
define("ember-testing/lib/helpers", ["ember-testing/lib/test/helpers", "ember-testing/lib/helpers/and_then", "ember-testing/lib/helpers/current_path", "ember-testing/lib/helpers/current_route_name", "ember-testing/lib/helpers/current_url", "ember-testing/lib/helpers/pause_test", "ember-testing/lib/helpers/visit", "ember-testing/lib/helpers/wait"], function (_helpers, _and_then, _current_path, _current_route_name, _current_url, _pause_test, _visit, _wait) {
  "use strict";

  (0, _helpers.registerAsyncHelper)('visit', _visit.default);
  (0, _helpers.registerAsyncHelper)('wait', _wait.default);
  (0, _helpers.registerAsyncHelper)('andThen', _and_then.default);
  (0, _helpers.registerAsyncHelper)('pauseTest', _pause_test.pauseTest);
  (0, _helpers.registerHelper)('currentRouteName', _current_route_name.default);
  (0, _helpers.registerHelper)('currentPath', _current_path.default);
  (0, _helpers.registerHelper)('currentURL', _current_url.default);
  (0, _helpers.registerHelper)('resumeTest', _pause_test.resumeTest);
});
define("ember-testing/lib/helpers/and_then", ["exports", "@ember/debug"], function (_exports, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = andThen;
  function andThen(app, callback) {
    var wait = app.testHelpers['wait'];
    (true && !(wait) && (0, _debug.assert)('[BUG] Missing wait helper', wait));
    return wait(callback(app));
  }
});
define("ember-testing/lib/helpers/current_path", ["exports", "@ember/object", "@ember/routing/-internals", "@ember/debug"], function (_exports, _object, _internals, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = currentPath;
  /**
  @module ember
  */

  /**
    Returns the current path.
  
  Example:
  
  ```javascript
  function validateURL() {
    equal(currentPath(), 'some.path.index', "correct path was transitioned into.");
  }
  
  click('#some-link-id').then(validateURL);
  ```
  
  @method currentPath
  @return {Object} The currently active path.
  @since 1.5.0
  @public
  */
  function currentPath(app) {
    (true && !(app.__container__) && (0, _debug.assert)('[BUG] app.__container__ is not set', app.__container__));
    var routingService = app.__container__.lookup('service:-routing');
    (true && !(routingService instanceof _internals.RoutingService) && (0, _debug.assert)('[BUG] service:-routing is not a RoutingService', routingService instanceof _internals.RoutingService));
    return (0, _object.get)(routingService, 'currentPath');
  }
});
define("ember-testing/lib/helpers/current_route_name", ["exports", "@ember/object", "@ember/routing/-internals", "@ember/debug"], function (_exports, _object, _internals, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = currentRouteName;
  /**
  @module ember
  */

  /**
    Returns the currently active route name.
  
  Example:
  
  ```javascript
  function validateRouteName() {
    equal(currentRouteName(), 'some.path', "correct route was transitioned into.");
  }
  visit('/some/path').then(validateRouteName)
  ```
  
  @method currentRouteName
  @return {Object} The name of the currently active route.
  @since 1.5.0
  @public
  */
  function currentRouteName(app) {
    (true && !(app.__container__) && (0, _debug.assert)('[BUG] app.__container__ is not set', app.__container__));
    var routingService = app.__container__.lookup('service:-routing');
    (true && !(routingService instanceof _internals.RoutingService) && (0, _debug.assert)('[BUG] service:-routing is not a RoutingService', routingService instanceof _internals.RoutingService));
    return (0, _object.get)(routingService, 'currentRouteName');
  }
});
define("ember-testing/lib/helpers/current_url", ["exports", "@ember/object", "@ember/debug", "@ember/routing/router"], function (_exports, _object, _debug, _router) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = currentURL;
  /**
  @module ember
  */

  /**
    Returns the current URL.
  
  Example:
  
  ```javascript
  function validateURL() {
    equal(currentURL(), '/some/path', "correct URL was transitioned into.");
  }
  
  click('#some-link-id').then(validateURL);
  ```
  
  @method currentURL
  @return {Object} The currently active URL.
  @since 1.5.0
  @public
  */
  function currentURL(app) {
    (true && !(app.__container__) && (0, _debug.assert)('[BUG] app.__container__ is not set', app.__container__));
    var router = app.__container__.lookup('router:main');
    (true && !(router instanceof _router.default) && (0, _debug.assert)('[BUG] router:main is not a Router', router instanceof _router.default));
    var location = (0, _object.get)(router, 'location');
    (true && !(typeof location !== 'string') && (0, _debug.assert)('[BUG] location is still a string', typeof location !== 'string'));
    return location.getURL();
  }
});
define("ember-testing/lib/helpers/pause_test", ["exports", "@ember/-internals/runtime", "@ember/debug"], function (_exports, _runtime, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.pauseTest = pauseTest;
  _exports.resumeTest = resumeTest;
  /**
  @module ember
  */

  var resume;
  /**
   Resumes a test paused by `pauseTest`.
  
   @method resumeTest
   @return {void}
   @public
  */
  function resumeTest() {
    (true && !(resume) && (0, _debug.assert)('Testing has not been paused. There is nothing to resume.', resume));
    resume();
    resume = undefined;
  }
  /**
   Pauses the current test - this is useful for debugging while testing or for test-driving.
   It allows you to inspect the state of your application at any point.
   Example (The test will pause before clicking the button):
  
   ```javascript
   visit('/')
   return pauseTest();
   click('.btn');
   ```
  
   You may want to turn off the timeout before pausing.
  
   qunit (timeout available to use as of 2.4.0):
  
   ```
   visit('/');
   assert.timeout(0);
   return pauseTest();
   click('.btn');
   ```
  
   mocha (timeout happens automatically as of ember-mocha v0.14.0):
  
   ```
   visit('/');
   this.timeout(0);
   return pauseTest();
   click('.btn');
   ```
  
  
   @since 1.9.0
   @method pauseTest
   @return {Object} A promise that will never resolve
   @public
  */
  function pauseTest() {
    (0, _debug.info)('Testing paused. Use `resumeTest()` to continue.');
    return new _runtime.RSVP.Promise(resolve => {
      resume = resolve;
    }, 'TestAdapter paused promise');
  }
});
define("ember-testing/lib/helpers/visit", ["exports", "@ember/debug", "@ember/routing/router", "@ember/runloop"], function (_exports, _debug, _router, _runloop) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = visit;
  /**
    Loads a route, sets up any controllers, and renders any templates associated
    with the route as though a real user had triggered the route change while
    using your app.
  
    Example:
  
    ```javascript
    visit('posts/index').then(function() {
      // assert something
    });
    ```
  
    @method visit
    @param {String} url the name of the route
    @return {RSVP.Promise<undefined>}
    @public
  */
  function visit(app, url) {
    (true && !(app.__container__) && (0, _debug.assert)('[BUG] Missing container', app.__container__));
    var router = app.__container__.lookup('router:main');
    (true && !(router instanceof _router.default) && (0, _debug.assert)('[BUG] router:main is not a Router', router instanceof _router.default));
    var shouldHandleURL = false;
    app.boot().then(() => {
      (true && !(typeof router.location !== 'string') && (0, _debug.assert)('[BUG] router.location is still a string', typeof router.location !== 'string'));
      router.location.setURL(url);
      if (shouldHandleURL) {
        (true && !(app.__deprecatedInstance__) && (0, _debug.assert)("[BUG] __deprecatedInstance__ isn't set", app.__deprecatedInstance__));
        (0, _runloop.run)(app.__deprecatedInstance__, 'handleURL', url);
      }
    });
    if (app._readinessDeferrals > 0) {
      // SAFETY: This should be safe, though it is odd.
      router.initialURL = url;
      (0, _runloop.run)(app, 'advanceReadiness');
      delete router.initialURL;
    } else {
      shouldHandleURL = true;
    }
    var wait = app.testHelpers['wait'];
    (true && !(wait) && (0, _debug.assert)('[BUG] missing wait helper', wait));
    return wait();
  }
});
define("ember-testing/lib/helpers/wait", ["exports", "ember-testing/lib/test/waiters", "@ember/-internals/runtime", "@ember/runloop", "ember-testing/lib/test/pending_requests", "@ember/debug", "@ember/routing/router"], function (_exports, _waiters, _runtime, _runloop, _pending_requests, _debug, _router) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = wait;
  /**
  @module ember
  */

  /**
    Causes the run loop to process any pending events. This is used to ensure that
    any async operations from other helpers (or your assertions) have been processed.
  
    This is most often used as the return value for the helper functions (see 'click',
    'fillIn','visit',etc). However, there is a method to register a test helper which
    utilizes this method without the need to actually call `wait()` in your helpers.
  
    The `wait` helper is built into `registerAsyncHelper` by default. You will not need
    to `return app.testHelpers.wait();` - the wait behavior is provided for you.
  
    Example:
  
    ```javascript
    import { registerAsyncHelper } from '@ember/test';
  
    registerAsyncHelper('loginUser', function(app, username, password) {
      visit('secured/path/here')
        .fillIn('#username', username)
        .fillIn('#password', password)
        .click('.submit');
    });
    ```
  
    @method wait
    @param {Object} value The value to be returned.
    @return {RSVP.Promise<any>} Promise that resolves to the passed value.
    @public
    @since 1.0.0
  */
  function wait(app, value) {
    return new _runtime.RSVP.Promise(function (resolve) {
      (true && !(app.__container__) && (0, _debug.assert)('[BUG] Missing container', app.__container__));
      var router = app.__container__.lookup('router:main');
      (true && !(router instanceof _router.default) && (0, _debug.assert)('[BUG] Expected router:main to be a subclass of Ember Router', router instanceof _router.default)); // Every 10ms, poll for the async thing to have finished
      var watcher = setInterval(() => {
        // 1. If the router is loading, keep polling
        var routerIsLoading = router._routerMicrolib && Boolean(router._routerMicrolib.activeTransition);
        if (routerIsLoading) {
          return;
        }
        // 2. If there are pending Ajax requests, keep polling
        if ((0, _pending_requests.pendingRequests)()) {
          return;
        }
        // 3. If there are scheduled timers or we are inside of a run loop, keep polling
        if ((0, _runloop._hasScheduledTimers)() || (0, _runloop._getCurrentRunLoop)()) {
          return;
        }
        if ((0, _waiters.checkWaiters)()) {
          return;
        }
        // Stop polling
        clearInterval(watcher);
        // Synchronously resolve the promise
        (0, _runloop.run)(null, resolve, value);
      }, 10);
    });
  }
});
define("ember-testing/lib/initializers", ["@ember/application"], function (_application) {
  "use strict";

  var name = 'deferReadiness in `testing` mode';
  (0, _application.onLoad)('Ember.Application', function (ApplicationClass) {
    if (!ApplicationClass.initializers[name]) {
      ApplicationClass.initializer({
        name: name,
        initialize(application) {
          if (application.testing) {
            application.deferReadiness();
          }
        }
      });
    }
  });
});
define("ember-testing/lib/setup_for_testing", ["exports", "@ember/debug", "ember-testing/lib/test/adapter", "ember-testing/lib/adapters/adapter", "ember-testing/lib/adapters/qunit"], function (_exports, _debug, _adapter, _adapter2, _qunit) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = setupForTesting;
  /* global self */

  /**
    Sets Ember up for testing. This is useful to perform
    basic setup steps in order to unit test.
  
    Use `App.setupForTesting` to perform integration tests (full
    application testing).
  
    @method setupForTesting
    @namespace Ember
    @since 1.5.0
    @private
  */
  function setupForTesting() {
    (0, _debug.setTesting)(true);
    var adapter = (0, _adapter.getAdapter)();
    // if adapter is not manually set default to QUnit
    if (!adapter) {
      (0, _adapter.setAdapter)(typeof self.QUnit === 'undefined' ? _adapter2.default.create() : _qunit.default.create());
    }
  }
});
define("ember-testing/lib/test", ["exports", "ember-testing/lib/test/helpers", "ember-testing/lib/test/on_inject_helpers", "ember-testing/lib/test/promise", "ember-testing/lib/test/waiters", "ember-testing/lib/test/adapter"], function (_exports, _helpers, _on_inject_helpers, _promise, _waiters, _adapter) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  /**
    @module ember
  */

  /**
    This is a container for an assortment of testing related functionality:
  
    * Choose your default test adapter (for your framework of choice).
    * Register/Unregister additional test helpers.
    * Setup callbacks to be fired when the test helpers are injected into
      your application.
  
    @class Test
    @namespace Ember
    @public
  */
  var Test = {
    /**
      Hash containing all known test helpers.
         @property _helpers
      @private
      @since 1.7.0
    */
    _helpers: _helpers.helpers,
    registerHelper: _helpers.registerHelper,
    registerAsyncHelper: _helpers.registerAsyncHelper,
    unregisterHelper: _helpers.unregisterHelper,
    onInjectHelpers: _on_inject_helpers.onInjectHelpers,
    Promise: _promise.default,
    promise: _promise.promise,
    resolve: _promise.resolve,
    registerWaiter: _waiters.registerWaiter,
    unregisterWaiter: _waiters.unregisterWaiter,
    checkWaiters: _waiters.checkWaiters
  };
  /**
   Used to allow ember-testing to communicate with a specific testing
   framework.
  
   You can manually set it before calling `App.setupForTesting()`.
  
   Example:
  
   ```javascript
   Ember.Test.adapter = MyCustomAdapter.create()
   ```
  
   If you do not set it, ember-testing will default to `Ember.Test.QUnitAdapter`.
  
   @public
   @for Ember.Test
   @property adapter
   @type {Class} The adapter to be used.
   @default Ember.Test.QUnitAdapter
  */
  Object.defineProperty(Test, 'adapter', {
    get: _adapter.getAdapter,
    set: _adapter.setAdapter
  });
  var _default = Test;
  _exports.default = _default;
});
define("ember-testing/lib/test/adapter", ["exports", "@ember/-internals/error-handling"], function (_exports, _errorHandling) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.asyncEnd = asyncEnd;
  _exports.asyncStart = asyncStart;
  _exports.getAdapter = getAdapter;
  _exports.setAdapter = setAdapter;
  var adapter;
  function getAdapter() {
    return adapter;
  }
  function setAdapter(value) {
    adapter = value;
    if (value && typeof value.exception === 'function') {
      (0, _errorHandling.setDispatchOverride)(adapterDispatch);
    } else {
      (0, _errorHandling.setDispatchOverride)(null);
    }
  }
  function asyncStart() {
    if (adapter) {
      adapter.asyncStart();
    }
  }
  function asyncEnd() {
    if (adapter) {
      adapter.asyncEnd();
    }
  }
  function adapterDispatch(error) {
    adapter.exception(error);
    // @ts-expect-error Normally unreachable
    console.error(error.stack); // eslint-disable-line no-console
  }
});
define("ember-testing/lib/test/helpers", ["exports", "ember-testing/lib/test/promise"], function (_exports, _promise) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.helpers = void 0;
  _exports.registerAsyncHelper = registerAsyncHelper;
  _exports.registerHelper = registerHelper;
  _exports.unregisterHelper = unregisterHelper;
  var helpers = {};
  /**
   @module @ember/test
  */
  /**
    `registerHelper` is used to register a test helper that will be injected
    when `App.injectTestHelpers` is called.
  
    The helper method will always be called with the current Application as
    the first parameter.
  
    For example:
  
    ```javascript
    import { registerHelper } from '@ember/test';
    import { run } from '@ember/runloop';
  
    registerHelper('boot', function(app) {
      run(app, app.advanceReadiness);
    });
    ```
  
    This helper can later be called without arguments because it will be
    called with `app` as the first parameter.
  
    ```javascript
    import Application from '@ember/application';
  
    App = Application.create();
    App.injectTestHelpers();
    boot();
    ```
  
    @public
    @for @ember/test
    @static
    @method registerHelper
    @param {String} name The name of the helper method to add.
    @param {Function} helperMethod
    @param options {Object}
  */
  _exports.helpers = helpers;
  function registerHelper(name, helperMethod) {
    helpers[name] = {
      method: helperMethod,
      meta: {
        wait: false
      }
    };
  }
  /**
    `registerAsyncHelper` is used to register an async test helper that will be injected
    when `App.injectTestHelpers` is called.
  
    The helper method will always be called with the current Application as
    the first parameter.
  
    For example:
  
    ```javascript
    import { registerAsyncHelper } from '@ember/test';
    import { run } from '@ember/runloop';
  
    registerAsyncHelper('boot', function(app) {
      run(app, app.advanceReadiness);
    });
    ```
  
    The advantage of an async helper is that it will not run
    until the last async helper has completed.  All async helpers
    after it will wait for it complete before running.
  
  
    For example:
  
    ```javascript
    import { registerAsyncHelper } from '@ember/test';
  
    registerAsyncHelper('deletePost', function(app, postId) {
      click('.delete-' + postId);
    });
  
    // ... in your test
    visit('/post/2');
    deletePost(2);
    visit('/post/3');
    deletePost(3);
    ```
  
    @public
    @for @ember/test
    @method registerAsyncHelper
    @param {String} name The name of the helper method to add.
    @param {Function} helperMethod
    @since 1.2.0
  */
  function registerAsyncHelper(name, helperMethod) {
    helpers[name] = {
      method: helperMethod,
      meta: {
        wait: true
      }
    };
  }
  /**
    Remove a previously added helper method.
  
    Example:
  
    ```javascript
    import { unregisterHelper } from '@ember/test';
  
    unregisterHelper('wait');
    ```
  
    @public
    @method unregisterHelper
    @static
    @for @ember/test
    @param {String} name The helper to remove.
  */
  function unregisterHelper(name) {
    delete helpers[name];
    // SAFETY: This isn't necessarily a safe thing to do, but in terms of the immediate types here
    // it won't error.
    delete _promise.default.prototype[name];
  }
});
define("ember-testing/lib/test/on_inject_helpers", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.callbacks = void 0;
  _exports.invokeInjectHelpersCallbacks = invokeInjectHelpersCallbacks;
  _exports.onInjectHelpers = onInjectHelpers;
  var callbacks = [];
  /**
    Used to register callbacks to be fired whenever `App.injectTestHelpers`
    is called.
  
    The callback will receive the current application as an argument.
  
    Example:
  
    ```javascript
    import $ from 'jquery';
  
    Ember.Test.onInjectHelpers(function() {
      $(document).ajaxSend(function() {
        Test.pendingRequests++;
      });
  
      $(document).ajaxComplete(function() {
        Test.pendingRequests--;
      });
    });
    ```
  
    @public
    @for Ember.Test
    @method onInjectHelpers
    @param {Function} callback The function to be called.
  */
  _exports.callbacks = callbacks;
  function onInjectHelpers(callback) {
    callbacks.push(callback);
  }
  function invokeInjectHelpersCallbacks(app) {
    for (var callback of callbacks) {
      callback(app);
    }
  }
});
define("ember-testing/lib/test/pending_requests", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.clearPendingRequests = clearPendingRequests;
  _exports.decrementPendingRequests = decrementPendingRequests;
  _exports.incrementPendingRequests = incrementPendingRequests;
  _exports.pendingRequests = pendingRequests;
  var requests = [];
  function pendingRequests() {
    return requests.length;
  }
  function clearPendingRequests() {
    requests.length = 0;
  }
  function incrementPendingRequests(_, xhr) {
    requests.push(xhr);
  }
  function decrementPendingRequests(_, xhr) {
    setTimeout(function () {
      for (var i = 0; i < requests.length; i++) {
        if (xhr === requests[i]) {
          requests.splice(i, 1);
          break;
        }
      }
    }, 0);
  }
});
define("ember-testing/lib/test/promise", ["exports", "@ember/-internals/runtime", "ember-testing/lib/test/run"], function (_exports, _runtime, _run) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _exports.getLastPromise = getLastPromise;
  _exports.promise = promise;
  _exports.resolve = resolve;
  var lastPromise = null;
  class TestPromise extends _runtime.RSVP.Promise {
    constructor(executor, label) {
      super(executor, label);
      lastPromise = this;
    }
    then(onFulfilled, onRejected, label) {
      var normalizedOnFulfilled = typeof onFulfilled === 'function' ? result => isolate(onFulfilled, result) : undefined;
      return super.then(normalizedOnFulfilled, onRejected, label);
    }
  }
  /**
    This returns a thenable tailored for testing.  It catches failed
    `onSuccess` callbacks and invokes the `Ember.Test.adapter.exception`
    callback in the last chained then.
  
    This method should be returned by async helpers such as `wait`.
  
    @public
    @for Ember.Test
    @method promise
    @param {Function} resolver The function used to resolve the promise.
    @param {String} label An optional string for identifying the promise.
  */
  _exports.default = TestPromise;
  function promise(resolver, label) {
    var fullLabel = `Ember.Test.promise: ${label || '<Unknown Promise>'}`;
    return new TestPromise(resolver, fullLabel);
  }
  /**
    Replacement for `Ember.RSVP.resolve`
    The only difference is this uses
    an instance of `Ember.Test.Promise`
  
    @public
    @for Ember.Test
    @method resolve
    @param {Mixed} The value to resolve
    @since 1.2.0
  */
  function resolve(result, label) {
    return TestPromise.resolve(result, label);
  }
  function getLastPromise() {
    return lastPromise;
  }
  // This method isolates nested async methods
  // so that they don't conflict with other last promises.
  //
  // 1. Set `Ember.Test.lastPromise` to null
  // 2. Invoke method
  // 3. Return the last promise created during method
  function isolate(onFulfilled, result) {
    // Reset lastPromise for nested helpers
    lastPromise = null;
    var value = onFulfilled(result);
    var promise = lastPromise;
    lastPromise = null;
    // If the method returned a promise
    // return that promise. If not,
    // return the last async helper's promise
    if (value && value instanceof TestPromise || !promise) {
      return value;
    } else {
      return (0, _run.default)(() => resolve(promise).then(() => value));
    }
  }
});
define("ember-testing/lib/test/run", ["exports", "@ember/runloop"], function (_exports, _runloop) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = run;
  function run(fn) {
    if (!(0, _runloop._getCurrentRunLoop)()) {
      return (0, _runloop.run)(fn);
    } else {
      return fn();
    }
  }
});
define("ember-testing/lib/test/waiters", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.checkWaiters = checkWaiters;
  _exports.registerWaiter = registerWaiter;
  _exports.unregisterWaiter = unregisterWaiter;
  /**
   @module @ember/test
  */
  var contexts = [];
  var callbacks = [];
  function registerWaiter() {
    var checkedCallback;
    var checkedContext;
    if (arguments.length === 1) {
      checkedContext = null;
      checkedCallback = arguments.length <= 0 ? undefined : arguments[0];
    } else {
      checkedContext = arguments.length <= 0 ? undefined : arguments[0];
      checkedCallback = arguments.length <= 1 ? undefined : arguments[1];
    }
    if (indexOf(checkedContext, checkedCallback) > -1) {
      return;
    }
    contexts.push(checkedContext);
    callbacks.push(checkedCallback);
  }
  /**
     `unregisterWaiter` is used to unregister a callback that was
     registered with `registerWaiter`.
  
     @public
     @for @ember/test
     @static
     @method unregisterWaiter
     @param {Object} context (optional)
     @param {Function} callback
     @since 1.2.0
  */
  function unregisterWaiter(context, callback) {
    if (!callbacks.length) {
      return;
    }
    if (arguments.length === 1) {
      callback = context;
      context = null;
    }
    var i = indexOf(context, callback);
    if (i === -1) {
      return;
    }
    contexts.splice(i, 1);
    callbacks.splice(i, 1);
  }
  /**
    Iterates through each registered test waiter, and invokes
    its callback. If any waiter returns false, this method will return
    true indicating that the waiters have not settled yet.
  
    This is generally used internally from the acceptance/integration test
    infrastructure.
  
    @public
    @for @ember/test
    @static
    @method checkWaiters
  */
  function checkWaiters() {
    if (!callbacks.length) {
      return false;
    }
    for (var i = 0; i < callbacks.length; i++) {
      var context = contexts[i];
      var callback = callbacks[i];
      // SAFETY: The loop ensures that this exists
      if (!callback.call(context)) {
        return true;
      }
    }
    return false;
  }
  function indexOf(context, callback) {
    for (var i = 0; i < callbacks.length; i++) {
      if (callbacks[i] === callback && contexts[i] === context) {
        return i;
      }
    }
    return -1;
  }
});
require('ember-testing');
}());

(function() {
  var key = '_embroider_macros_runtime_config';
  if (!window[key]) {
    window[key] = [];
  }
  window[key].push(function(m) {
    m.setGlobalConfig(
      '@embroider/macros',
      Object.assign({}, m.getGlobalConfig()['@embroider/macros'], { isTesting: true })
    );
  });
})();

define("ember-cli-test-loader/test-support/index", ["exports"], function (_exports) {
  /* globals requirejs, require */
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.addModuleExcludeMatcher = addModuleExcludeMatcher;
  _exports.addModuleIncludeMatcher = addModuleIncludeMatcher;
  _exports.default = void 0;
  let moduleIncludeMatchers = [];
  let moduleExcludeMatchers = [];
  function addModuleIncludeMatcher(fn) {
    moduleIncludeMatchers.push(fn);
  }
  function addModuleExcludeMatcher(fn) {
    moduleExcludeMatchers.push(fn);
  }
  function checkMatchers(matchers, moduleName) {
    return matchers.some(matcher => matcher(moduleName));
  }
  class TestLoader {
    static load() {
      new TestLoader().loadModules();
    }
    constructor() {
      this._didLogMissingUnsee = false;
    }
    shouldLoadModule(moduleName) {
      return moduleName.match(/[-_]test$/);
    }
    listModules() {
      return Object.keys(requirejs.entries);
    }
    listTestModules() {
      let moduleNames = this.listModules();
      let testModules = [];
      let moduleName;
      for (let i = 0; i < moduleNames.length; i++) {
        moduleName = moduleNames[i];
        if (checkMatchers(moduleExcludeMatchers, moduleName)) {
          continue;
        }
        if (checkMatchers(moduleIncludeMatchers, moduleName) || this.shouldLoadModule(moduleName)) {
          testModules.push(moduleName);
        }
      }
      return testModules;
    }
    loadModules() {
      let testModules = this.listTestModules();
      let testModule;
      for (let i = 0; i < testModules.length; i++) {
        testModule = testModules[i];
        this.require(testModule);
        this.unsee(testModule);
      }
    }
    require(moduleName) {
      try {
        require(moduleName);
      } catch (e) {
        this.moduleLoadFailure(moduleName, e);
      }
    }
    unsee(moduleName) {
      if (typeof require.unsee === 'function') {
        require.unsee(moduleName);
      } else if (!this._didLogMissingUnsee) {
        this._didLogMissingUnsee = true;
        if (typeof console !== 'undefined') {
          console.warn('unable to require.unsee, please upgrade loader.js to >= v3.3.0');
        }
      }
    }
    moduleLoadFailure(moduleName, error) {
      console.error('Error loading: ' + moduleName, error.stack);
    }
  }
  _exports.default = TestLoader;
  ;
});
define("ember-qunit/adapter", ["exports", "ember", "qunit", "@ember/test-helpers/has-ember-version"], function (_exports, _ember, QUnit, _hasEmberVersion) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _exports.nonTestDoneCallback = nonTestDoneCallback;
  0; //eaimeta@70e063a35619d71f0,"ember",0,"qunit",0,"@ember/test-helpers/has-ember-version"eaimeta@70e063a35619d71f
  function unhandledRejectionAssertion(current, error) {
    let message, source;
    if (typeof error === 'object' && error !== null) {
      message = error.message;
      source = error.stack;
    } else if (typeof error === 'string') {
      message = error;
      source = 'unknown source';
    } else {
      message = 'unhandledRejection occurred, but it had no message';
      source = 'unknown source';
    }
    current.assert.pushResult({
      result: false,
      actual: false,
      expected: true,
      message: message,
      source: source
    });
  }
  function nonTestDoneCallback() {}
  let Adapter = _ember.default.Test.Adapter.extend({
    init() {
      this.doneCallbacks = [];
      this.qunit = this.qunit || QUnit;
    },
    asyncStart() {
      let currentTest = this.qunit.config.current;
      let done = currentTest && currentTest.assert ? currentTest.assert.async() : nonTestDoneCallback;
      this.doneCallbacks.push({
        test: currentTest,
        done
      });
    },
    asyncEnd() {
      let currentTest = this.qunit.config.current;
      if (this.doneCallbacks.length === 0) {
        throw new Error('Adapter asyncEnd called when no async was expected. Please create an issue in ember-qunit.');
      }
      let {
        test,
        done
      } = this.doneCallbacks.pop();

      // In future, we should explore fixing this at a different level, specifically
      // addressing the pairing of asyncStart/asyncEnd behavior in a more consistent way.
      if (test === currentTest) {
        done();
      }
    },
    // clobber default implementation of `exception` will be added back for Ember
    // < 2.17 just below...
    exception: null
  });

  // Ember 2.17 and higher do not require the test adapter to have an `exception`
  // method When `exception` is not present, the unhandled rejection is
  // automatically re-thrown and will therefore hit QUnit's own global error
  // handler (therefore appropriately causing test failure)
  if (!(0, _hasEmberVersion.default)(2, 17)) {
    Adapter = Adapter.extend({
      exception(error) {
        unhandledRejectionAssertion(QUnit.config.current, error);
      }
    });
  }
  var _default = _exports.default = Adapter;
});
define("ember-qunit/index", ["exports", "ember-qunit/adapter", "ember-qunit/test-loader", "ember-qunit/qunit-configuration", "@ember/runloop", "@ember/test-helpers", "ember", "qunit", "ember-qunit/test-isolation-validation"], function (_exports, _adapter, _testLoader, _qunitConfiguration, _runloop, _testHelpers, _ember, QUnit, _testIsolationValidation) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "QUnitAdapter", {
    enumerable: true,
    get: function () {
      return _adapter.default;
    }
  });
  Object.defineProperty(_exports, "loadTests", {
    enumerable: true,
    get: function () {
      return _testLoader.loadTests;
    }
  });
  Object.defineProperty(_exports, "nonTestDoneCallback", {
    enumerable: true,
    get: function () {
      return _adapter.nonTestDoneCallback;
    }
  });
  _exports.setupApplicationTest = setupApplicationTest;
  _exports.setupEmberOnerrorValidation = setupEmberOnerrorValidation;
  _exports.setupEmberTesting = setupEmberTesting;
  _exports.setupRenderingTest = setupRenderingTest;
  _exports.setupResetOnerror = setupResetOnerror;
  _exports.setupTest = setupTest;
  _exports.setupTestAdapter = setupTestAdapter;
  _exports.setupTestContainer = setupTestContainer;
  _exports.setupTestIsolationValidation = setupTestIsolationValidation;
  _exports.start = start;
  _exports.startTests = startTests;
  0; //eaimeta@70e063a35619d71f0,"ember-qunit/adapter",0,"ember-qunit/test-loader",0,"ember-qunit/qunit-configuration",0,"@ember/runloop",0,"@ember/test-helpers",0,"ember-qunit/test-loader",0,"ember",0,"qunit",0,"ember-qunit/adapter",0,"@ember/test-helpers",0,"ember-qunit/test-isolation-validation"eaimeta@70e063a35619d71f
  /* globals Testem */
  if (typeof Testem !== 'undefined') {
    Testem.hookIntoTestFramework();
  }
  let waitForSettled = true;
  function setupTest(hooks, _options) {
    let options = {
      waitForSettled,
      ..._options
    };
    hooks.beforeEach(function (assert) {
      let testMetadata = (0, _testHelpers.getTestMetadata)(this);
      testMetadata.framework = 'qunit';
      return (0, _testHelpers.setupContext)(this, options).then(() => {
        let originalPauseTest = this.pauseTest;
        this.pauseTest = function QUnit_pauseTest() {
          assert.timeout(-1); // prevent the test from timing out

          // This is a temporary work around for
          // https://github.com/emberjs/ember-qunit/issues/496 this clears the
          // timeout that would fail the test when it hits the global testTimeout
          // value.
          clearTimeout(QUnit.config.timeout);
          return originalPauseTest.call(this);
        };
      });
    });
    hooks.afterEach(function () {
      return (0, _testHelpers.teardownContext)(this, options);
    });
  }
  function setupRenderingTest(hooks, _options) {
    let options = {
      waitForSettled,
      ..._options
    };
    setupTest(hooks, options);
    hooks.beforeEach(function () {
      return (0, _testHelpers.setupRenderingContext)(this);
    });
  }
  function setupApplicationTest(hooks, _options) {
    let options = {
      waitForSettled,
      ..._options
    };
    setupTest(hooks, options);
    hooks.beforeEach(function () {
      return (0, _testHelpers.setupApplicationContext)(this);
    });
  }

  /**
     Uses current URL configuration to setup the test container.
  
     * If `?nocontainer` is set, the test container will be hidden.
     * If `?devmode` or `?fullscreencontainer` is set, the test container will be
       made full screen.
  
     @method setupTestContainer
   */
  function setupTestContainer() {
    let testContainer = document.getElementById('ember-testing-container');
    if (!testContainer) {
      return;
    }
    let params = QUnit.urlParams;
    if (params.devmode || params.fullscreencontainer) {
      testContainer.classList.add('ember-testing-container-full-screen');
    }
    if (params.nocontainer) {
      testContainer.classList.add('ember-testing-container-hidden');
    }
  }

  /**
     Instruct QUnit to start the tests.
     @method startTests
   */
  function startTests() {
    QUnit.start();
  }

  /**
     Sets up the `Ember.Test` adapter for usage with QUnit 2.x.
  
     @method setupTestAdapter
   */
  function setupTestAdapter() {
    _ember.default.Test.adapter = _adapter.default.create();
  }

  /**
    Ensures that `Ember.testing` is set to `true` before each test begins
    (including `before` / `beforeEach`), and reset to `false` after each test is
    completed. This is done via `QUnit.testStart` and `QUnit.testDone`.
  
   */
  function setupEmberTesting() {
    QUnit.testStart(() => {
      _ember.default.testing = true;
    });
    QUnit.testDone(() => {
      _ember.default.testing = false;
    });
  }

  /**
    Ensures that `Ember.onerror` (if present) is properly configured to re-throw
    errors that occur while `Ember.testing` is `true`.
  */
  function setupEmberOnerrorValidation() {
    QUnit.module('ember-qunit: Ember.onerror validation', function () {
      QUnit.test('Ember.onerror is functioning properly', function (assert) {
        assert.expect(1);
        let result = (0, _testHelpers.validateErrorHandler)();
        assert.ok(result.isValid, `Ember.onerror handler with invalid testing behavior detected. An Ember.onerror handler _must_ rethrow exceptions when \`Ember.testing\` is \`true\` or the test suite is unreliable. See https://git.io/vbine for more details.`);
      });
    });
  }
  function setupResetOnerror() {
    QUnit.testDone(_testHelpers.resetOnerror);
  }
  function setupTestIsolationValidation(delay) {
    waitForSettled = false;
    _runloop._backburner.DEBUG = true;
    QUnit.on('testStart', () => (0, _testIsolationValidation.installTestNotIsolatedHook)(delay));
  }

  /**
     @method start
     @param {Object} [options] Options to be used for enabling/disabling behaviors
     @param {Boolean} [options.loadTests] If `false` tests will not be loaded automatically.
     @param {Boolean} [options.setupTestContainer] If `false` the test container will not
     be setup based on `devmode`, `dockcontainer`, or `nocontainer` URL params.
     @param {Boolean} [options.startTests] If `false` tests will not be automatically started
     (you must run `QUnit.start()` to kick them off).
     @param {Boolean} [options.setupTestAdapter] If `false` the default Ember.Test adapter will
     not be updated.
     @param {Boolean} [options.setupEmberTesting] `false` opts out of the
     default behavior of setting `Ember.testing` to `true` before all tests and
     back to `false` after each test will.
     @param {Boolean} [options.setupEmberOnerrorValidation] If `false` validation
     of `Ember.onerror` will be disabled.
     @param {Boolean} [options.setupTestIsolationValidation] If `false` test isolation validation
     will be disabled.
     @param {Number} [options.testIsolationValidationDelay] When using
     setupTestIsolationValidation this number represents the maximum amount of
     time in milliseconds that is allowed _after_ the test is completed for all
     async to have been completed. The default value is 50.
   */
  function start(options = {}) {
    if (options.loadTests !== false) {
      (0, _testLoader.loadTests)();
    }
    if (options.setupTestContainer !== false) {
      setupTestContainer();
    }
    if (options.setupTestAdapter !== false) {
      setupTestAdapter();
    }
    if (options.setupEmberTesting !== false) {
      setupEmberTesting();
    }
    if (options.setupEmberOnerrorValidation !== false) {
      setupEmberOnerrorValidation();
    }
    if (typeof options.setupTestIsolationValidation !== 'undefined' && options.setupTestIsolationValidation !== false) {
      setupTestIsolationValidation(options.testIsolationValidationDelay);
    }
    if (options.startTests !== false) {
      startTests();
    }
    setupResetOnerror();
  }
});
define("ember-qunit/qunit-configuration", ["qunit"], function (QUnit) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"qunit"eaimeta@70e063a35619d71f
  QUnit.config.autostart = false;
  QUnit.config.urlConfig.push({
    id: 'nocontainer',
    label: 'Hide container'
  });
  QUnit.config.urlConfig.push({
    id: 'nolint',
    label: 'Disable Linting'
  });
  QUnit.config.urlConfig.push({
    id: 'devmode',
    label: 'Development mode'
  });
  QUnit.config.testTimeout = QUnit.urlParams.devmode ? null : 60000; //Default Test Timeout 60 Seconds
});
define("ember-qunit/test-isolation-validation", ["exports", "qunit", "@ember/runloop", "@ember/test-helpers"], function (_exports, QUnit, _runloop, _testHelpers) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.detectIfTestNotIsolated = detectIfTestNotIsolated;
  _exports.installTestNotIsolatedHook = installTestNotIsolatedHook;
  0; //eaimeta@70e063a35619d71f0,"qunit",0,"@ember/runloop",0,"@ember/test-helpers",0,"@ember/test-helpers"eaimeta@70e063a35619d71f
  /* eslint-disable no-console */
  /**
   * Detects if a specific test isn't isolated. A test is considered
   * not isolated if it:
   *
   * - has pending timers
   * - is in a runloop
   * - has pending AJAX requests
   * - has pending test waiters
   *
   * @function detectIfTestNotIsolated
   * @param {Object} testInfo
   * @param {string} testInfo.module The name of the test module
   * @param {string} testInfo.name The test name
   */
  function detectIfTestNotIsolated(test, message = '') {
    if (!(0, _testHelpers.isSettled)()) {
      let {
        debugInfo
      } = (0, _testHelpers.getSettledState)();
      console.group(`${test.module.name}: ${test.testName}`);
      debugInfo.toConsole();
      console.groupEnd();
      test.expected++;
      test.assert.pushResult({
        result: false,
        message: `${message} \nMore information has been printed to the console. Please use that information to help in debugging.\n\n`
      });
    }
  }

  /**
   * Installs a hook to detect if a specific test isn't isolated.
   * This hook is installed by patching into the `test.finish` method,
   * which allows us to be very precise as to when the detection occurs.
   *
   * @function installTestNotIsolatedHook
   * @param {number} delay the delay delay to use when checking for isolation validation
   */
  function installTestNotIsolatedHook(delay = 50) {
    if (!(0, _testHelpers.getDebugInfo)()) {
      return;
    }
    let test = QUnit.config.current;
    let finish = test.finish;
    let pushFailure = test.pushFailure;
    test.pushFailure = function (message) {
      if (message.indexOf('Test took longer than') === 0) {
        detectIfTestNotIsolated(this, message);
      } else {
        return pushFailure.apply(this, arguments);
      }
    };

    // We're hooking into `test.finish`, which utilizes internal ordering of
    // when a test's hooks are invoked. We do this mainly because we need
    // greater precision as to when to detect and subsequently report if the
    // test is isolated.
    //
    // We looked at using:
    // - `afterEach`
    //    - the ordering of when the `afterEach` is called is not easy to guarantee
    //      (ancestor `afterEach`es have to be accounted for too)
    // - `QUnit.on('testEnd')`
    //    - is executed too late; the test is already considered done so
    //      we're unable to push a new assert to fail the current test
    // - 'QUnit.done'
    //    - it detaches the failure from the actual test that failed, making it
    //      more confusing to the end user.
    test.finish = function () {
      let doFinish = () => finish.apply(this, arguments);
      if ((0, _testHelpers.isSettled)()) {
        return doFinish();
      } else {
        return (0, _testHelpers.waitUntil)(_testHelpers.isSettled, {
          timeout: delay
        }).catch(() => {
          // we consider that when waitUntil times out, you're in a state of
          // test isolation violation. The nature of the error is irrelevant
          // in this case, and we want to allow the error to fall through
          // to the finally, where cleanup occurs.
        }).finally(() => {
          detectIfTestNotIsolated(this, 'Test is not isolated (async execution is extending beyond the duration of the test).');

          // canceling timers here isn't perfect, but is as good as we can do
          // to attempt to prevent future tests from failing due to this test's
          // leakage
          (0, _runloop._cancelTimers)();
          return doFinish();
        });
      }
    };
  }
});
define("ember-qunit/test-loader", ["exports", "qunit", "ember-cli-test-loader/test-support/index"], function (_exports, QUnit, _index) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.TestLoader = void 0;
  _exports.loadTests = loadTests;
  0; //eaimeta@70e063a35619d71f0,"qunit",0,"ember-cli-test-loader/test-support/index"eaimeta@70e063a35619d71f
  (0, _index.addModuleExcludeMatcher)(function (moduleName) {
    return QUnit.urlParams.nolint && moduleName.match(/\.(jshint|lint-test)$/);
  });
  (0, _index.addModuleIncludeMatcher)(function (moduleName) {
    return moduleName.match(/\.jshint$/);
  });
  let moduleLoadFailures = [];
  QUnit.done(function () {
    let length = moduleLoadFailures.length;
    try {
      if (length === 0) {
        // do nothing
      } else if (length === 1) {
        throw moduleLoadFailures[0];
      } else {
        throw new Error('\n' + moduleLoadFailures.join('\n'));
      }
    } finally {
      // ensure we release previously captured errors.
      moduleLoadFailures = [];
    }
  });
  class TestLoader extends _index.default {
    moduleLoadFailure(moduleName, error) {
      moduleLoadFailures.push(error);
      QUnit.module('TestLoader Failures');
      QUnit.test(moduleName + ': could not be loaded', function () {
        throw error;
      });
    }
  }

  /**
     Load tests following the default patterns:
  
     * The module name ends with `-test`
     * The module name ends with `.jshint`
  
     Excludes tests that match the following
     patterns when `?nolint` URL param is set:
  
     * The module name ends with `.jshint`
     * The module name ends with `-lint-test`
  
     @method loadTests
   */
  _exports.TestLoader = TestLoader;
  function loadTests() {
    new TestLoader().loadModules();
  }
});
define("ember-simulant-test-helpers/gestures", ["exports", "ember-simulant-test-helpers/simulant", "rsvp"], function (_exports, _simulant, _rsvp) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.panAlongPath = panAlongPath;
  _exports.panX = panX;
  _exports.panY = panY;
  _exports.press = press;
  // imported there by ember-cli: see index.js at the root of this project

  const MOUSE_MOVE_INTERVAL = 10;
  class Point {
    constructor(x, y) {
      if (arguments.length === 1) {
        this.x = x[0];
        this.y = x[1];
      } else {
        this.x = x;
        this.y = y;
      }
    }
    get tuple() {
      return [this.x, this.y];
    }
    offset(distance) {
      return new Point(this.x + distance.x, this.y + distance.y);
    }
  }
  class Distance {
    constructor(x, y) {
      if (arguments.length === 1) {
        this.x = x[0];
        this.y = x[1];
      } else {
        this.x = x;
        this.y = y;
      }
    }
    get tuple() {
      return [this.x, this.y];
    }
    dividedBy(divisor) {
      return new Distance(this.x / divisor, this.y / divisor);
    }
  }
  function* positionRange(start, end, step) {
    function done() {
      let isXDone = step.x >= 0 && start.x >= end.x || step.x <= 0 && start.x <= end.x;
      let isYDone = step.y >= 0 && start.y >= end.y || step.y <= 0 && start.y <= end.y;
      return isXDone && isYDone;
    }
    while (!done()) {
      yield start;
      start = start.offset(step);
    }
  }
  function trigger(eventName, position, element) {
    // console.log('trigger', ...arguments);
    _simulant.default.fire(element, eventName, {
      clientX: position[0],
      clientY: position[1]
    });
  }
  let getTestContainerEl = function () {
    return document.querySelector('#ember-testing') || false;
  };
  function adjustCoordinates(position) {
    let testContainerEl = getTestContainerEl();
    if (testContainerEl) {
      let testContainerRect = testContainerEl.getBoundingClientRect();
      return [position[0] + testContainerRect.x, position[1] + testContainerRect.y];
    }
    return position;
  }
  function panAlongPath(element, options) {
    return new _rsvp.default.Promise(function (resolve) {
      options = Object.assign({
        position: [50, 100],
        amounts: [[10, 10], [0, -20], [-20, 0], [-10, 10]],
        duration: 300,
        waitForMouseUp: _rsvp.default.resolve()
      }, options);
      let {
        duration
      } = options;
      let position = new Point(adjustCoordinates(options.position));
      let distances = options.amounts.map(tuple => new Distance(tuple));
      trigger('mousedown', position.tuple, element);
      let mouseMoveCount = duration / MOUSE_MOVE_INTERVAL;
      let movesPerSequence = mouseMoveCount / distances.length;
      let positions = [];
      let startingPosition = position;
      distances.forEach(distance => {
        let stepDistance = distance.dividedBy(movesPerSequence);
        let endingPosition = startingPosition.offset(distance);
        positions = positions.concat(Array.from(positionRange(startingPosition, endingPosition, stepDistance)));
        startingPosition = endingPosition;
      });
      let positionIndex = 0;
      let scheduleMouseMove = function () {
        let finishedMoving = positionIndex === positions.length;
        if (finishedMoving) {
          let mouseUpPosition = positions[positionIndex - 1];
          options.waitForMouseUp.then(function () {
            trigger('mouseup', mouseUpPosition.tuple, element);
            trigger('click', mouseUpPosition.tuple, element);
            setTimeout(resolve, MOUSE_MOVE_INTERVAL);
          });
          return;
        }
        let currentPosition = positions[positionIndex];
        setTimeout(function () {
          trigger('mousemove', currentPosition.tuple, element);
          positionIndex++;
          scheduleMouseMove();
        }, MOUSE_MOVE_INTERVAL);
      };
      scheduleMouseMove();
    });
  }
  function panAlongAxis(element, options) {
    options = Object.assign({
      position: [50, 100],
      amount: 150,
      // amount may be a number of pixels, OR an array of pixel amounts, to simulate pans going one direction and then back the other way
      duration: 300,
      axis: 'x',
      waitForMouseUp: _rsvp.default.resolve()
    }, options);
    if (options.axis === 'y') {
      options.amounts = Array.isArray(options.amount) ? options.amount.map(y => [0, y]) : [[0, options.amount]];
    } else {
      options.amounts = Array.isArray(options.amount) ? options.amount.map(x => [x, 0]) : [[options.amount, 0]];
    }
    delete options.amount;
    return panAlongPath(element, options);
  }
  function panX(element, options) {
    return panAlongAxis(element, Object.assign(options, {
      axis: 'x'
    }));
  }
  function panY(element, options) {
    return panAlongAxis(element, Object.assign(options, {
      axis: 'y'
    }));
  }
  function press(element, options) {
    options = Object.assign({
      position: [10, 10],
      duration: 500
    }, options);
    let position = adjustCoordinates(options.position);
    trigger('mousedown', position, element);
    return new _rsvp.default.Promise(function (resolve) {
      setTimeout(function () {
        trigger('mouseup', options.position, element);
        trigger('click', options.position, element);
        resolve();
      }, options.duration);
    });
  }
});
define("ember-simulant-test-helpers/index", ["exports", "ember-simulant-test-helpers/gestures"], function (_exports, _gestures) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "panAlongPath", {
    enumerable: true,
    get: function () {
      return _gestures.panAlongPath;
    }
  });
  Object.defineProperty(_exports, "panX", {
    enumerable: true,
    get: function () {
      return _gestures.panX;
    }
  });
  Object.defineProperty(_exports, "panY", {
    enumerable: true,
    get: function () {
      return _gestures.panY;
    }
  });
  Object.defineProperty(_exports, "press", {
    enumerable: true,
    get: function () {
      return _gestures.press;
    }
  });
});
define("ember-simulant-test-helpers/simulant", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var defaults = {
    bubbles: true,
    cancelable: true,
    view: window,
    detail: null,
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    button: 0,
    relatedTarget: null,
    locale: '',
    oldURL: '',
    newURL: '',
    origin: '',
    lastEventId: '',
    source: null,
    ports: [],
    oldValue: null,
    newValue: null,
    url: '',
    storageArea: null,
    deltaX: 0,
    deltaY: 0,
    deltaZ: 0,
    deltaMode: 0
  };

  // TODO remove the ones that aren't supported in any browser
  var eventTypesByGroup = {
    UIEvent: 'abort error resize scroll select unload',
    Event: 'afterprint beforeprint cached canplay canplaythrough change chargingchange chargingtimechange checking close dischargingtimechange DOMContentLoaded downloading durationchange emptied ended fullscreenchange fullscreenerror input invalid levelchange loadeddata loadedmetadata noupdate obsolete offline online open orientationchange pause pointerlockchange pointerlockerror play playing ratechange readystatechange reset seeked seeking stalled submit success suspend timeupdate updateready visibilitychange volumechange waiting',
    AnimationEvent: 'animationend animationiteration animationstart',
    AudioProcessingEvent: 'audioprocess',
    BeforeUnloadEvent: 'beforeunload',
    TimeEvent: 'beginEvent endEvent repeatEvent',
    FocusEvent: 'blur focus focusin focusout',
    MouseEvent: 'click contextmenu dblclick mousedown mouseenter mouseleave mousemove mouseout mouseover mouseup show',
    SensorEvent: 'compassneedscalibration userproximity',
    OfflineAudioCompletionEvent: 'complete',
    CompositionEvent: 'compositionend compositionstart compositionupdate',
    ClipboardEvent: 'copy cut paste',
    DeviceLightEvent: 'devicelight',
    DeviceMotionEvent: 'devicemotion',
    DeviceOrientationEvent: 'deviceorientation',
    DeviceProximityEvent: 'deviceproximity',
    DragEvent: 'drag dragend dragenter dragleave dragover dragstart drop',
    GamepadEvent: 'gamepadconnected gamepaddisconnected',
    HashChangeEvent: 'hashchange',
    KeyboardEvent: 'keydown keypress keyup',
    ProgressEvent: 'loadend loadstart progress timeout',
    MessageEvent: 'message',
    PageTransitionEvent: 'pagehide pageshow',
    PopStateEvent: 'popstate',
    StorageEvent: 'storage',
    SVGEvent: 'SVGAbort SVGError SVGLoad SVGResize SVGScroll SVGUnload',
    SVGZoomEvent: 'SVGZoom',
    TouchEvent: 'touchcancel touchend touchenter touchleave touchmove touchstart',
    TransitionEvent: 'transitionend',
    WheelEvent: 'wheel'
  };
  var eventGroupByType = {};
  Object.keys(eventTypesByGroup).forEach(function (group) {
    var types = eventTypesByGroup[group].split(' ');
    types.forEach(function (t) {
      eventGroupByType[t] = group;
    });
  });

  // The parameters required by event constructors and init methods, in the order the init methods need them.

  // There is no initKeyboardEvent or initKeyEvent here. Keyboard events are a goddamned mess. You can't fake them
  // well in any browser - the which and keyCode properties are readonly, for example. So we don't actually use the
  // KeyboardEvent constructor, or the initKeyboardEvent or initKeyEvent methods. Instead we use a bog standard
  // Event and add the required parameters as expando properties.

  // TODO I think in some browsers we need to use modifiersList instead of ctrlKey/shiftKey etc?
  var initialiserParams = {
    initUIEvent: 'view detail',
    initMouseEvent: 'view detail screenX screenY clientX clientY ctrlKey altKey shiftKey metaKey button relatedTarget',
    initTouchEvent: 'view detail touches targetTouches changedTouches ctrlKey altKey shiftKey metaKey',
    initCompositionEvent: 'view detail data locale',
    initHashChangeEvent: 'oldURL newURL',
    initMessageEvent: 'data origin lastEventId source ports',
    initStorageEvent: 'key oldValue newValue url storageArea',
    initWheelEvent: 'view detail screenX screenY clientX clientY ctrlKey altKey shiftKey metaKey button relatedTarget deltaX deltaY deltaZ deltaMode'
  };
  Object.keys(initialiserParams).forEach(function (initMethod) {
    initialiserParams[initMethod] = initialiserParams[initMethod].split(' ');
  });
  var initialisersByGroup = {
    UIEvent: [window.UIEvent, 'initUIEvent'],
    Event: [window.Event, 'initEvent'],
    FocusEvent: [window.FocusEvent, 'initUIEvent'],
    MouseEvent: [window.MouseEvent, 'initMouseEvent'],
    CompositionEvent: [window.CompositionEvent, 'initCompositionEvent'],
    HashChangeEvent: [window.HashChangeEvent, 'initHashChangeEvent'],
    KeyboardEvent: [window.Event, 'initEvent'],
    ProgressEvent: [window.ProgressEvent, 'initEvent'],
    MessageEvent: [window.MessageEvent, 'initMessageEvent'],
    // TODO prefixed?
    PageTransitionEvent: [window.PageTransitionEvent, 'initEvent'],
    PopStateEvent: [window.PopStateEvent, 'initEvent'],
    StorageEvent: [window.StorageEvent, 'initStorageEvent'],
    TouchEvent: [window.TouchEvent, 'initTouchEvent'],
    WheelEvent: [window.WheelEvent, 'initWheelEvent'] // TODO this differs between browsers...
  };
  var keyboardParams = ['altKey', 'charCode', 'code', 'ctrlKey', 'isComposing', 'key', 'keyCode', 'keyIdentifier', 'location', 'metaKey', 'repeat', 'shiftKey', 'which'];
  function extendWithKeyboardParams(event, params) {
    if (params === void 0) params = {};
    var i = keyboardParams.length;
    while (i--) {
      event[keyboardParams[i]] = params[keyboardParams[i]];
    }
  }
  function ancient() {
    function makeInitialiser(methodName, paramsList) {
      return function (event, type, params) {
        event.type = type;
        var i = paramsList.length;
        while (i--) {
          var paramName = paramsList[i];
          event[paramName] = params[paramName] || defaults[paramName];
        }
      };
    }
    var initialisers = {};
    var methodName;
    for (methodName in initialiserParams) {
      if (initialiserParams.hasOwnProperty(methodName)) {
        initialisers[methodName] = makeInitialiser(methodName, initialiserParams[methodName]);
      }
    }
    initialisers.initEvent = makeInitialiser('initEvent', []);
    function simulant(type, params) {
      var group = eventGroupByType[type];
      var isKeyboardEvent;
      if (group === 'KeyboardEvent') {
        isKeyboardEvent = true;
        group = 'Event';
      }
      var initialiserName = initialisersByGroup[group][1];
      var initialise = initialisers[initialiserName];
      var event = document.createEventObject();
      initialise(event, type, params || {});
      if (isKeyboardEvent) {
        extendWithKeyboardParams(event, params);
      }
      return event;
    }
    simulant.mode = 'ancient';
    return simulant;
  }
  function legacy() {
    function makeInitialiser(methodName, paramsList) {
      return function (event, type, params) {
        var args;

        // first three args are always `type`, `bubbles`, `cancelable`
        args = [type, true, true]; // TODO some events don't bubble?

        paramsList.forEach(function (paramName) {
          args.push(params[paramName] || defaults[paramName]);
        });
        event[methodName].apply(event, args);
      };
    }
    var initialisers = {};
    Object.keys(initialiserParams).forEach(function (methodName) {
      initialisers[methodName] = makeInitialiser(methodName, initialiserParams[methodName]);
    });
    initialisers.initEvent = makeInitialiser('initEvent', []);
    function simulant(type, params) {
      var event, group, initialiserName, initialise, isKeyboardEvent;
      group = eventGroupByType[type];
      if (group === 'KeyboardEvent') {
        isKeyboardEvent = true;
        group = 'Event';
      }
      initialiserName = initialisersByGroup[group][1];
      initialise = initialisers[initialiserName];
      event = document.createEvent(group);
      initialise(event, type, params || {});
      if (isKeyboardEvent) {
        extendWithKeyboardParams(event, params);
      }
      return event;
    }
    simulant.mode = 'legacy';
    return simulant;
  }
  function modern() {
    function simulant(type, params) {
      if (params === void 0) params = {};
      var group = eventGroupByType[type];
      var isKeyboardEvent;
      if (group === 'KeyboardEvent') {
        group = 'Event'; // because you can't fake KeyboardEvents well in any browser
        isKeyboardEvent = true;
      }
      var initialiser = initialisersByGroup[group] || initialisersByGroup.Event;
      var Constructor = initialiser[0] || window.Event;
      var method = initialiser[1];
      var extendedParams = {
        bubbles: true,
        // TODO some events don't bubble?
        cancelable: true
      };
      var paramsList = initialiserParams[method];
      var i = paramsList ? paramsList.length : 0;
      while (i--) {
        var paramName = paramsList[i];
        extendedParams[paramName] = paramName in params ? params[paramName] : defaults[paramName];
      }
      var event = new Constructor(type, extendedParams);
      if (isKeyboardEvent) {
        extendWithKeyboardParams(event, params);
      }
      return event;
    }
    simulant.mode = 'modern';
    return simulant;
  }
  function polyfill() {
    // https://gist.github.com/Rich-Harris/6010282 via https://gist.github.com/jonathantneal/2869388
    // addEventListener polyfill IE6+
    var Event, addEventListener, removeEventListener, head, style;
    Event = function (e, element) {
      var property,
        instance = this;
      for (property in e) {
        instance[property] = e[property];
      }
      instance.currentTarget = element;
      instance.target = e.srcElement || element;
      instance.timeStamp = +new Date();
      instance.preventDefault = function () {
        e.returnValue = false;
      };
      instance.stopPropagation = function () {
        e.cancelBubble = true;
      };
    };
    addEventListener = function (type, listener) {
      var element = this,
        listeners,
        i;
      listeners = element.listeners || (element.listeners = []);
      i = listeners.length;
      listeners[i] = [listener, function (e) {
        listener.call(element, new Event(e, element));
      }];
      element.attachEvent('on' + type, listeners[i][1]);
    };
    removeEventListener = function (type, listener) {
      var element = this,
        listeners,
        i;
      if (!element.listeners) {
        return;
      }
      listeners = element.listeners;
      i = listeners.length;
      while (i--) {
        if (listeners[i][0] === listener) {
          element.detachEvent('on' + type, listeners[i][1]);
        }
      }
    };
    window.addEventListener = document.addEventListener = addEventListener;
    window.removeEventListener = document.removeEventListener = removeEventListener;
    if ('Element' in window) {
      Element.prototype.addEventListener = addEventListener;
      Element.prototype.removeEventListener = removeEventListener;
    } else {
      head = document.getElementsByTagName('head')[0];
      style = document.createElement('style');
      head.insertBefore(style, head.firstChild);
      style.styleSheet.cssText = '*{-ms-event-prototype:expression(!this.addEventListener&&(this.addEventListener=addEventListener)&&(this.removeEventListener=removeEventListener))}';
    }
    addEventListener.simulant = true;
  }
  var simulant;
  try {
    new MouseEvent('click');
    simulant = modern();
  } catch (err) {
    if (!document.createEvent) {
      if (document.createEventObject) {
        simulant = ancient();
      } else {
        throw new Error('Events cannot be created in this browser');
      }
    } else {
      simulant = legacy();
    }
  }
  if (document.dispatchEvent) {
    simulant.fire = function (node, event, params) {
      if (typeof event === 'string') {
        event = simulant(event, params);
      }
      node.dispatchEvent(event);
      return event;
    };
  } else if (document.fireEvent) {
    simulant.fire = function (node, event, params) {
      if (typeof event === 'string') {
        event = simulant(event, params);
      }
      node.fireEvent('on' + event.type, event);

      // Special case - checkbox inputs
      if (node.tagName === 'INPUT' && node.type === 'checkbox') {
        node.click();
      }
      return event;
    };
  }
  simulant.polyfill = polyfill;
  var simulant$1 = simulant;
  var _default = _exports.default = simulant$1;
});
define("qunit-dom/index", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.install = install;
  _exports.setup = setup;
  function exists(options, message) {
    var expectedCount = null;
    if (typeof options === 'string') {
      message = options;
    } else if (options) {
      expectedCount = options.count;
    }
    var elements = this.findElements();
    if (expectedCount === null) {
      var result = elements.length > 0;
      var expected = format$1(this.targetDescription);
      var actual = result ? expected : format$1(this.targetDescription, 0);
      if (!message) {
        message = expected;
      }
      this.pushResult({
        result: result,
        actual: actual,
        expected: expected,
        message: message
      });
    } else if (typeof expectedCount === 'number') {
      var result = elements.length === expectedCount;
      var actual = format$1(this.targetDescription, elements.length);
      var expected = format$1(this.targetDescription, expectedCount);
      if (!message) {
        message = expected;
      }
      this.pushResult({
        result: result,
        actual: actual,
        expected: expected,
        message: message
      });
    } else {
      throw new TypeError("Unexpected Parameter: " + expectedCount);
    }
  }
  function format$1(selector, num) {
    if (num === undefined || num === null) {
      return "Element " + selector + " exists";
    } else if (num === 0) {
      return "Element " + selector + " does not exist";
    } else if (num === 1) {
      return "Element " + selector + " exists once";
    } else if (num === 2) {
      return "Element " + selector + " exists twice";
    } else {
      return "Element " + selector + " exists " + num + " times";
    }
  }

  // imported from https://github.com/nathanboktae/chai-dom
  function elementToString(el) {
    if (!el) return '<not found>';
    var desc;
    if (el instanceof NodeList) {
      if (el.length === 0) {
        return 'empty NodeList';
      }
      desc = Array.prototype.slice.call(el, 0, 5).map(elementToString).join(', ');
      return el.length > 5 ? desc + "... (+" + (el.length - 5) + " more)" : desc;
    }
    if (!(el instanceof HTMLElement || el instanceof SVGElement)) {
      return String(el);
    }
    desc = el.tagName.toLowerCase();
    if (el.id) {
      desc += "#" + el.id;
    }
    if (el.className && !(el.className instanceof SVGAnimatedString)) {
      desc += "." + String(el.className).replace(/\s+/g, '.');
    }
    Array.prototype.forEach.call(el.attributes, function (attr) {
      if (attr.name !== 'class' && attr.name !== 'id') {
        desc += "[" + attr.name + (attr.value ? "=\"" + attr.value + "\"]" : ']');
      }
    });
    return desc;
  }
  function focused(message) {
    var element = this.findTargetElement();
    if (!element) return;
    var result = document.activeElement === element;
    var actual = elementToString(document.activeElement);
    var expected = elementToString(this.target);
    if (!message) {
      message = "Element " + expected + " is focused";
    }
    this.pushResult({
      result: result,
      actual: actual,
      expected: expected,
      message: message
    });
  }
  function notFocused(message) {
    var element = this.findTargetElement();
    if (!element) return;
    var result = document.activeElement !== element;
    var expected = "Element " + this.targetDescription + " is not focused";
    var actual = result ? expected : "Element " + this.targetDescription + " is focused";
    if (!message) {
      message = expected;
    }
    this.pushResult({
      result: result,
      message: message,
      actual: actual,
      expected: expected
    });
  }
  function checked(message) {
    var element = this.findTargetElement();
    if (!element) return;
    var isChecked = element.checked === true;
    var isNotChecked = element.checked === false;
    var result = isChecked;
    var hasCheckedProp = isChecked || isNotChecked;
    if (!hasCheckedProp) {
      var ariaChecked = element.getAttribute('aria-checked');
      if (ariaChecked !== null) {
        result = ariaChecked === 'true';
      }
    }
    var actual = result ? 'checked' : 'not checked';
    var expected = 'checked';
    if (!message) {
      message = "Element " + elementToString(this.target) + " is checked";
    }
    this.pushResult({
      result: result,
      actual: actual,
      expected: expected,
      message: message
    });
  }
  function notChecked(message) {
    var element = this.findTargetElement();
    if (!element) return;
    var isChecked = element.checked === true;
    var isNotChecked = element.checked === false;
    var result = !isChecked;
    var hasCheckedProp = isChecked || isNotChecked;
    if (!hasCheckedProp) {
      var ariaChecked = element.getAttribute('aria-checked');
      if (ariaChecked !== null) {
        result = ariaChecked !== 'true';
      }
    }
    var actual = result ? 'not checked' : 'checked';
    var expected = 'not checked';
    if (!message) {
      message = "Element " + elementToString(this.target) + " is not checked";
    }
    this.pushResult({
      result: result,
      actual: actual,
      expected: expected,
      message: message
    });
  }
  function required(message) {
    var element = this.findTargetElement();
    if (!element) return;
    if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement)) {
      throw new TypeError("Unexpected Element Type: " + element.toString());
    }
    var result = element.required === true;
    var actual = result ? 'required' : 'not required';
    var expected = 'required';
    if (!message) {
      message = "Element " + elementToString(this.target) + " is required";
    }
    this.pushResult({
      result: result,
      actual: actual,
      expected: expected,
      message: message
    });
  }
  function notRequired(message) {
    var element = this.findTargetElement();
    if (!element) return;
    if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement)) {
      throw new TypeError("Unexpected Element Type: " + element.toString());
    }
    var result = element.required === false;
    var actual = !result ? 'required' : 'not required';
    var expected = 'not required';
    if (!message) {
      message = "Element " + elementToString(this.target) + " is not required";
    }
    this.pushResult({
      result: result,
      actual: actual,
      expected: expected,
      message: message
    });
  }
  function isValid(message, options) {
    if (options === void 0) {
      options = {};
    }
    var element = this.findTargetElement();
    if (!element) return;
    if (!(element instanceof HTMLFormElement || element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLButtonElement || element instanceof HTMLOutputElement || element instanceof HTMLSelectElement)) {
      throw new TypeError("Unexpected Element Type: " + element.toString());
    }
    var validity = element.reportValidity() === true;
    var result = validity === !options.inverted;
    var actual = validity ? 'valid' : 'not valid';
    var expected = options.inverted ? 'not valid' : 'valid';
    if (!message) {
      message = "Element " + elementToString(this.target) + " is " + actual;
    }
    this.pushResult({
      result: result,
      actual: actual,
      expected: expected,
      message: message
    });
  }

  // Visible logic based on jQuery's
  // https://github.com/jquery/jquery/blob/4a2bcc27f9c3ee24b3effac0fbe1285d1ee23cc5/src/css/hiddenVisibleSelectors.js#L11-L13
  function visible(el) {
    if (el === null) return false;
    if (el.offsetWidth === 0 || el.offsetHeight === 0) return false;
    var clientRects = el.getClientRects();
    if (clientRects.length === 0) return false;
    for (var i = 0; i < clientRects.length; i++) {
      var rect = clientRects[i];
      if (rect.width !== 0 && rect.height !== 0) return true;
    }
    return false;
  }
  function isVisible(options, message) {
    var expectedCount = null;
    if (typeof options === 'string') {
      message = options;
    } else if (options) {
      expectedCount = options.count;
    }
    var elements = this.findElements().filter(visible);
    if (expectedCount === null) {
      var result = elements.length > 0;
      var expected = format(this.targetDescription);
      var actual = result ? expected : format(this.targetDescription, 0);
      if (!message) {
        message = expected;
      }
      this.pushResult({
        result: result,
        actual: actual,
        expected: expected,
        message: message
      });
    } else if (typeof expectedCount === 'number') {
      var result = elements.length === expectedCount;
      var actual = format(this.targetDescription, elements.length);
      var expected = format(this.targetDescription, expectedCount);
      if (!message) {
        message = expected;
      }
      this.pushResult({
        result: result,
        actual: actual,
        expected: expected,
        message: message
      });
    } else {
      throw new TypeError("Unexpected Parameter: " + expectedCount);
    }
  }
  function format(selector, num) {
    if (num === undefined || num === null) {
      return "Element " + selector + " is visible";
    } else if (num === 0) {
      return "Element " + selector + " is not visible";
    } else if (num === 1) {
      return "Element " + selector + " is visible once";
    } else if (num === 2) {
      return "Element " + selector + " is visible twice";
    } else {
      return "Element " + selector + " is visible " + num + " times";
    }
  }
  function isDisabled(message, options) {
    if (options === void 0) {
      options = {};
    }
    var inverted = options.inverted;
    var element = this.findTargetElement();
    if (!element) return;
    if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement || element instanceof HTMLButtonElement || element instanceof HTMLOptGroupElement || element instanceof HTMLOptionElement || element instanceof HTMLFieldSetElement)) {
      throw new TypeError("Unexpected Element Type: " + element.toString());
    }
    var result = element.disabled === !inverted;
    var actual = element.disabled === false ? "Element " + this.targetDescription + " is not disabled" : "Element " + this.targetDescription + " is disabled";
    var expected = inverted ? "Element " + this.targetDescription + " is not disabled" : "Element " + this.targetDescription + " is disabled";
    if (!message) {
      message = expected;
    }
    this.pushResult({
      result: result,
      actual: actual,
      expected: expected,
      message: message
    });
  }
  function matchesSelector(elements, compareSelector) {
    var failures = elements.filter(function (it) {
      return !it.matches(compareSelector);
    });
    return failures.length;
  }
  function collapseWhitespace(string) {
    return string.replace(/[\t\r\n]/g, ' ').replace(/ +/g, ' ').replace(/^ /, '').replace(/ $/, '');
  }

  /**
   * This function can be used to convert a NodeList to a regular array.
   * We should be using `Array.from()` for this, but IE11 doesn't support that :(
   *
   * @private
   */
  function toArray(list) {
    return Array.prototype.slice.call(list);
  }
  var DOMAssertions = /** @class */function () {
    function DOMAssertions(target, rootElement, testContext) {
      this.target = target;
      this.rootElement = rootElement;
      this.testContext = testContext;
    }
    /**
     * Assert an {@link HTMLElement} (or multiple) matching the `selector` exists.
     *
     * @param {object?} options
     * @param {number?} options.count
     * @param {string?} message
     *
     * @example
     * assert.dom('#title').exists();
     * assert.dom('.choice').exists({ count: 4 });
     *
     * @see {@link #doesNotExist}
     */
    DOMAssertions.prototype.exists = function (options, message) {
      exists.call(this, options, message);
      return this;
    };
    /**
     * Assert an {@link HTMLElement} matching the `selector` does not exists.
     *
     * @param {string?} message
     *
     * @example
     * assert.dom('.should-not-exist').doesNotExist();
     *
     * @see {@link #exists}
     */
    DOMAssertions.prototype.doesNotExist = function (message) {
      exists.call(this, {
        count: 0
      }, message);
      return this;
    };
    /**
     * Assert that the {@link HTMLElement} or an {@link HTMLElement} matching the
     * `selector` is currently checked.
     *
     * Note: This also supports `aria-checked="true/false"`.
     *
     * @param {string?} message
     *
     * @example
     * assert.dom('input.active').isChecked();
     *
     * @see {@link #isNotChecked}
     */
    DOMAssertions.prototype.isChecked = function (message) {
      checked.call(this, message);
      return this;
    };
    /**
     * Assert that the {@link HTMLElement} or an {@link HTMLElement} matching the
     * `selector` is currently unchecked.
     *
     * Note: This also supports `aria-checked="true/false"`.
     *
     * @param {string?} message
     *
     * @example
     * assert.dom('input.active').isNotChecked();
     *
     * @see {@link #isChecked}
     */
    DOMAssertions.prototype.isNotChecked = function (message) {
      notChecked.call(this, message);
      return this;
    };
    /**
     * Assert that the {@link HTMLElement} or an {@link HTMLElement} matching the
     * `selector` is currently focused.
     *
     * @param {string?} message
     *
     * @example
     * assert.dom('input.email').isFocused();
     *
     * @see {@link #isNotFocused}
     */
    DOMAssertions.prototype.isFocused = function (message) {
      focused.call(this, message);
      return this;
    };
    /**
     * Assert that the {@link HTMLElement} or an {@link HTMLElement} matching the
     * `selector` is not currently focused.
     *
     * @param {string?} message
     *
     * @example
     * assert.dom('input[type="password"]').isNotFocused();
     *
     * @see {@link #isFocused}
     */
    DOMAssertions.prototype.isNotFocused = function (message) {
      notFocused.call(this, message);
      return this;
    };
    /**
     * Assert that the {@link HTMLElement} or an {@link HTMLElement} matching the
     * `selector` is currently required.
     *
     * @param {string?} message
     *
     * @example
     * assert.dom('input[type="text"]').isRequired();
     *
     * @see {@link #isNotRequired}
     */
    DOMAssertions.prototype.isRequired = function (message) {
      required.call(this, message);
      return this;
    };
    /**
     * Assert that the {@link HTMLElement} or an {@link HTMLElement} matching the
     * `selector` is currently not required.
     *
     * @param {string?} message
     *
     * @example
     * assert.dom('input[type="text"]').isNotRequired();
     *
     * @see {@link #isRequired}
     */
    DOMAssertions.prototype.isNotRequired = function (message) {
      notRequired.call(this, message);
      return this;
    };
    /**
     * Assert that the {@link HTMLElement} passes validation
     *
     * Validity is determined by asserting that:
     *
     * - `element.reportValidity() === true`
     *
     * @param {string?} message
     *
     * @example
     * assert.dom('.input').isValid();
     *
     * @see {@link #isValid}
     */
    DOMAssertions.prototype.isValid = function (message) {
      isValid.call(this, message);
      return this;
    };
    /**
     * Assert that the {@link HTMLElement} does not pass validation
     *
     * Validity is determined by asserting that:
     *
     * - `element.reportValidity() === true`
     *
     * @param {string?} message
     *
     * @example
     * assert.dom('.input').isNotValid();
     *
     * @see {@link #isValid}
     */
    DOMAssertions.prototype.isNotValid = function (message) {
      isValid.call(this, message, {
        inverted: true
      });
      return this;
    };
    /**
     * Assert that the {@link HTMLElement} or an {@link HTMLElement} matching the
     * `selector` exists and is visible.
     *
     * Visibility is determined by asserting that:
     *
     * - the element's offsetWidth and offsetHeight are non-zero
     * - any of the element's DOMRect objects have a non-zero size
     *
     * Additionally, visibility in this case means that the element is visible on the page,
     * but not necessarily in the viewport.
     *
     * @param {object?} options
     * @param {number?} options.count
     * @param {string?} message
     *
     * @example
     * assert.dom('#title').isVisible();
     * assert.dom('.choice').isVisible({ count: 4 });
     *
     * @see {@link #isNotVisible}
     */
    DOMAssertions.prototype.isVisible = function (options, message) {
      isVisible.call(this, options, message);
      return this;
    };
    /**
     * Assert that the {@link HTMLElement} or an {@link HTMLElement} matching the
     * `selector` does not exist or is not visible on the page.
     *
     * Visibility is determined by asserting that:
     *
     * - the element's offsetWidth or offsetHeight are zero
     * - all of the element's DOMRect objects have a size of zero
     *
     * Additionally, visibility in this case means that the element is visible on the page,
     * but not necessarily in the viewport.
     *
     * @param {string?} message
     *
     * @example
     * assert.dom('.foo').isNotVisible();
     *
     * @see {@link #isVisible}
     */
    DOMAssertions.prototype.isNotVisible = function (message) {
      isVisible.call(this, {
        count: 0
      }, message);
      return this;
    };
    /**
     * Assert that the {@link HTMLElement} has an attribute with the provided `name`
     * and optionally checks if the attribute `value` matches the provided text
     * or regular expression.
     *
     * @param {string} name
     * @param {string|RegExp|object?} value
     * @param {string?} message
     *
     * @example
     * assert.dom('input.password-input').hasAttribute('type', 'password');
     *
     * @see {@link #doesNotHaveAttribute}
     */
    DOMAssertions.prototype.hasAttribute = function (name, value, message) {
      var element = this.findTargetElement();
      if (!element) return this;
      if (arguments.length === 1) {
        value = {
          any: true
        };
      }
      var actualValue = element.getAttribute(name);
      if (value instanceof RegExp) {
        var result = value.test(actualValue);
        var expected = "Element " + this.targetDescription + " has attribute \"" + name + "\" with value matching " + value;
        var actual = actualValue === null ? "Element " + this.targetDescription + " does not have attribute \"" + name + "\"" : "Element " + this.targetDescription + " has attribute \"" + name + "\" with value " + JSON.stringify(actualValue);
        if (!message) {
          message = expected;
        }
        this.pushResult({
          result: result,
          actual: actual,
          expected: expected,
          message: message
        });
      } else if (value.any === true) {
        var result = actualValue !== null;
        var expected = "Element " + this.targetDescription + " has attribute \"" + name + "\"";
        var actual = result ? expected : "Element " + this.targetDescription + " does not have attribute \"" + name + "\"";
        if (!message) {
          message = expected;
        }
        this.pushResult({
          result: result,
          actual: actual,
          expected: expected,
          message: message
        });
      } else {
        var result = value === actualValue;
        var expected = "Element " + this.targetDescription + " has attribute \"" + name + "\" with value " + JSON.stringify(value);
        var actual = actualValue === null ? "Element " + this.targetDescription + " does not have attribute \"" + name + "\"" : "Element " + this.targetDescription + " has attribute \"" + name + "\" with value " + JSON.stringify(actualValue);
        if (!message) {
          message = expected;
        }
        this.pushResult({
          result: result,
          actual: actual,
          expected: expected,
          message: message
        });
      }
      return this;
    };
    /**
     * Assert that the {@link HTMLElement} has no attribute with the provided `name`.
     *
     * **Aliases:** `hasNoAttribute`, `lacksAttribute`
     *
     * @param {string} name
     * @param {string?} message
     *
     * @example
     * assert.dom('input.username').hasNoAttribute('disabled');
     *
     * @see {@link #hasAttribute}
     */
    DOMAssertions.prototype.doesNotHaveAttribute = function (name, message) {
      var element = this.findTargetElement();
      if (!element) return;
      var result = !element.hasAttribute(name);
      var expected = "Element " + this.targetDescription + " does not have attribute \"" + name + "\"";
      var actual = expected;
      if (!result) {
        var value = element.getAttribute(name);
        actual = "Element " + this.targetDescription + " has attribute \"" + name + "\" with value " + JSON.stringify(value);
      }
      if (!message) {
        message = expected;
      }
      this.pushResult({
        result: result,
        actual: actual,
        expected: expected,
        message: message
      });
      return this;
    };
    DOMAssertions.prototype.hasNoAttribute = function (name, message) {
      return this.doesNotHaveAttribute(name, message);
    };
    DOMAssertions.prototype.lacksAttribute = function (name, message) {
      return this.doesNotHaveAttribute(name, message);
    };
    /**
     * Assert that the {@link HTMLElement} has an ARIA attribute with the provided
     * `name` and optionally checks if the attribute `value` matches the provided
     * text or regular expression.
     *
     * @param {string} name
     * @param {string|RegExp|object?} value
     * @param {string?} message
     *
     * @example
     * assert.dom('button').hasAria('pressed', 'true');
     *
     * @see {@link #hasNoAria}
     */
    DOMAssertions.prototype.hasAria = function (name, value, message) {
      return this.hasAttribute("aria-" + name, value, message);
    };
    /**
     * Assert that the {@link HTMLElement} has no ARIA attribute with the
     * provided `name`.
     *
     * @param {string} name
     * @param {string?} message
     *
     * @example
     * assert.dom('button').doesNotHaveAria('pressed');
     *
     * @see {@link #hasAria}
     */
    DOMAssertions.prototype.doesNotHaveAria = function (name, message) {
      return this.doesNotHaveAttribute("aria-" + name, message);
    };
    /**
     * Assert that the {@link HTMLElement} has a property with the provided `name`
     * and checks if the property `value` matches the provided text or regular
     * expression.
     *
     * @param {string} name
     * @param {RegExp|any} value
     * @param {string?} message
     *
     * @example
     * assert.dom('input.password-input').hasProperty('type', 'password');
     *
     * @see {@link #doesNotHaveProperty}
     */
    DOMAssertions.prototype.hasProperty = function (name, value, message) {
      var element = this.findTargetElement();
      if (!element) return this;
      var description = this.targetDescription;
      var actualValue = element[name];
      if (value instanceof RegExp) {
        var result = value.test(String(actualValue));
        var expected = "Element " + description + " has property \"" + name + "\" with value matching " + value;
        var actual = "Element " + description + " has property \"" + name + "\" with value " + JSON.stringify(actualValue);
        if (!message) {
          message = expected;
        }
        this.pushResult({
          result: result,
          actual: actual,
          expected: expected,
          message: message
        });
      } else {
        var result = value === actualValue;
        var expected = "Element " + description + " has property \"" + name + "\" with value " + JSON.stringify(value);
        var actual = "Element " + description + " has property \"" + name + "\" with value " + JSON.stringify(actualValue);
        if (!message) {
          message = expected;
        }
        this.pushResult({
          result: result,
          actual: actual,
          expected: expected,
          message: message
        });
      }
      return this;
    };
    /**
     *  Assert that the {@link HTMLElement} or an {@link HTMLElement} matching the
     * `selector` is disabled.
     *
     * @param {string?} message
     *
     * @example
     * assert.dom('.foo').isDisabled();
     *
     * @see {@link #isNotDisabled}
     */
    DOMAssertions.prototype.isDisabled = function (message) {
      isDisabled.call(this, message);
      return this;
    };
    /**
     *  Assert that the {@link HTMLElement} or an {@link HTMLElement} matching the
     * `selector` is not disabled.
     *
     * **Aliases:** `isEnabled`
     *
     * @param {string?} message
     *
     * @example
     * assert.dom('.foo').isNotDisabled();
     *
     * @see {@link #isDisabled}
     */
    DOMAssertions.prototype.isNotDisabled = function (message) {
      isDisabled.call(this, message, {
        inverted: true
      });
      return this;
    };
    DOMAssertions.prototype.isEnabled = function (message) {
      return this.isNotDisabled(message);
    };
    /**
     * Assert that the {@link HTMLElement} has the `expected` CSS class using
     * [`classList`](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList).
     *
     * `expected` can also be a regular expression, and the assertion will return
     * true if any of the element's CSS classes match.
     *
     * @param {string|RegExp} expected
     * @param {string?} message
     *
     * @example
     * assert.dom('input[type="password"]').hasClass('secret-password-input');
     *
     * @example
     * assert.dom('input[type="password"]').hasClass(/.*password-input/);
     *
     * @see {@link #doesNotHaveClass}
     */
    DOMAssertions.prototype.hasClass = function (expected, message) {
      var element = this.findTargetElement();
      if (!element) return this;
      var actual = element.classList.toString();
      if (expected instanceof RegExp) {
        var classNames = Array.prototype.slice.call(element.classList);
        var result = classNames.some(function (className) {
          return expected.test(className);
        });
        if (!message) {
          message = "Element " + this.targetDescription + " has CSS class matching " + expected;
        }
        this.pushResult({
          result: result,
          actual: actual,
          expected: expected,
          message: message
        });
      } else {
        var result = element.classList.contains(expected);
        if (!message) {
          message = "Element " + this.targetDescription + " has CSS class \"" + expected + "\"";
        }
        this.pushResult({
          result: result,
          actual: actual,
          expected: expected,
          message: message
        });
      }
      return this;
    };
    /**
     * Assert that the {@link HTMLElement} does not have the `expected` CSS class using
     * [`classList`](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList).
     *
     * `expected` can also be a regular expression, and the assertion will return
     * true if none of the element's CSS classes match.
     *
     * **Aliases:** `hasNoClass`, `lacksClass`
     *
     * @param {string|RegExp} expected
     * @param {string?} message
     *
     * @example
     * assert.dom('input[type="password"]').doesNotHaveClass('username-input');
     *
     * @example
     * assert.dom('input[type="password"]').doesNotHaveClass(/username-.*-input/);
     *
     * @see {@link #hasClass}
     */
    DOMAssertions.prototype.doesNotHaveClass = function (expected, message) {
      var element = this.findTargetElement();
      if (!element) return this;
      var actual = element.classList.toString();
      if (expected instanceof RegExp) {
        var classNames = Array.prototype.slice.call(element.classList);
        var result = classNames.every(function (className) {
          return !expected.test(className);
        });
        if (!message) {
          message = "Element " + this.targetDescription + " does not have CSS class matching " + expected;
        }
        this.pushResult({
          result: result,
          actual: actual,
          expected: "not: " + expected,
          message: message
        });
      } else {
        var result = !element.classList.contains(expected);
        if (!message) {
          message = "Element " + this.targetDescription + " does not have CSS class \"" + expected + "\"";
        }
        this.pushResult({
          result: result,
          actual: actual,
          expected: "not: " + expected,
          message: message
        });
      }
      return this;
    };
    DOMAssertions.prototype.hasNoClass = function (expected, message) {
      return this.doesNotHaveClass(expected, message);
    };
    DOMAssertions.prototype.lacksClass = function (expected, message) {
      return this.doesNotHaveClass(expected, message);
    };
    /**
     * Assert that the [HTMLElement][] has the `expected` style declarations using
     * [`window.getComputedStyle`](https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle).
     *
     * @param {object} expected
     * @param {string?} message
     *
     * @example
     * assert.dom('.progress-bar').hasStyle({
     *   opacity: 1,
     *   display: 'block'
     * });
     *
     * @see {@link #hasClass}
     */
    DOMAssertions.prototype.hasStyle = function (expected, message) {
      return this.hasPseudoElementStyle(null, expected, message);
    };
    /**
     * Assert that the pseudo element for `selector` of the [HTMLElement][] has the `expected` style declarations using
     * [`window.getComputedStyle`](https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle).
     *
     * @param {string} selector
     * @param {object} expected
     * @param {string?} message
     *
     * @example
     * assert.dom('.progress-bar').hasPseudoElementStyle(':after', {
     *   content: '";"',
     * });
     *
     * @see {@link #hasClass}
     */
    DOMAssertions.prototype.hasPseudoElementStyle = function (selector, expected, message) {
      var element = this.findTargetElement();
      if (!element) return this;
      var computedStyle = window.getComputedStyle(element, selector);
      var expectedProperties = Object.keys(expected);
      if (expectedProperties.length <= 0) {
        throw new TypeError("Missing style expectations. There must be at least one style property in the passed in expectation object.");
      }
      var result = expectedProperties.every(function (property) {
        return computedStyle[property] === expected[property];
      });
      var actual = {};
      expectedProperties.forEach(function (property) {
        return actual[property] = computedStyle[property];
      });
      if (!message) {
        var normalizedSelector = selector ? selector.replace(/^:{0,2}/, '::') : '';
        message = "Element " + this.targetDescription + normalizedSelector + " has style \"" + JSON.stringify(expected) + "\"";
      }
      this.pushResult({
        result: result,
        actual: actual,
        expected: expected,
        message: message
      });
      return this;
    };
    /**
     * Assert that the [HTMLElement][] does not have the `expected` style declarations using
     * [`window.getComputedStyle`](https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle).
     *
     * @param {object} expected
     * @param {string?} message
     *
     * @example
     * assert.dom('.progress-bar').doesNotHaveStyle({
     *   opacity: 1,
     *   display: 'block'
     * });
     *
     * @see {@link #hasClass}
     */
    DOMAssertions.prototype.doesNotHaveStyle = function (expected, message) {
      return this.doesNotHavePseudoElementStyle(null, expected, message);
    };
    /**
     * Assert that the pseudo element for `selector` of the [HTMLElement][] does not have the `expected` style declarations using
     * [`window.getComputedStyle`](https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle).
     *
     * @param {string} selector
     * @param {object} expected
     * @param {string?} message
     *
     * @example
     * assert.dom('.progress-bar').doesNotHavePseudoElementStyle(':after', {
     *   content: '";"',
     * });
     *
     * @see {@link #hasClass}
     */
    DOMAssertions.prototype.doesNotHavePseudoElementStyle = function (selector, expected, message) {
      var element = this.findTargetElement();
      if (!element) return this;
      var computedStyle = window.getComputedStyle(element, selector);
      var expectedProperties = Object.keys(expected);
      if (expectedProperties.length <= 0) {
        throw new TypeError("Missing style expectations. There must be at least one style property in the passed in expectation object.");
      }
      var result = expectedProperties.some(function (property) {
        return computedStyle[property] !== expected[property];
      });
      var actual = {};
      expectedProperties.forEach(function (property) {
        return actual[property] = computedStyle[property];
      });
      if (!message) {
        var normalizedSelector = selector ? selector.replace(/^:{0,2}/, '::') : '';
        message = "Element " + this.targetDescription + normalizedSelector + " does not have style \"" + JSON.stringify(expected) + "\"";
      }
      this.pushResult({
        result: result,
        actual: actual,
        expected: expected,
        message: message
      });
      return this;
    };
    /**
     * Assert that the text of the {@link HTMLElement} or an {@link HTMLElement}
     * matching the `selector` matches the `expected` text, using the
     * [`textContent`](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)
     * attribute and stripping/collapsing whitespace.
     *
     * `expected` can also be a regular expression.
     *
     * > Note: This assertion will collapse whitespace if the type you pass in is a string.
     * > If you are testing specifically for whitespace integrity, pass your expected text
     * > in as a RegEx pattern.
     *
     * **Aliases:** `matchesText`
     *
     * @param {string|RegExp} expected
     * @param {string?} message
     *
     * @example
     * // <h2 id="title">
     * //   Welcome to <b>QUnit</b>
     * // </h2>
     *
     * assert.dom('#title').hasText('Welcome to QUnit');
     *
     * @example
     * assert.dom('.foo').hasText(/[12]\d{3}/);
     *
     * @see {@link #includesText}
     */
    DOMAssertions.prototype.hasText = function (expected, message) {
      var element = this.findTargetElement();
      if (!element) return this;
      if (expected instanceof RegExp) {
        var result = expected.test(element.textContent);
        var actual = element.textContent;
        if (!message) {
          message = "Element " + this.targetDescription + " has text matching " + expected;
        }
        this.pushResult({
          result: result,
          actual: actual,
          expected: expected,
          message: message
        });
      } else if (expected.any === true) {
        var result = Boolean(element.textContent);
        var expected_1 = "Element " + this.targetDescription + " has a text";
        var actual = result ? expected_1 : "Element " + this.targetDescription + " has no text";
        if (!message) {
          message = expected_1;
        }
        this.pushResult({
          result: result,
          actual: actual,
          expected: expected_1,
          message: message
        });
      } else if (typeof expected === 'string') {
        expected = collapseWhitespace(expected);
        var actual = collapseWhitespace(element.textContent);
        var result = actual === expected;
        if (!message) {
          message = "Element " + this.targetDescription + " has text \"" + expected + "\"";
        }
        this.pushResult({
          result: result,
          actual: actual,
          expected: expected,
          message: message
        });
      } else {
        throw new TypeError("You must pass a string or Regular Expression to \"hasText\". You passed " + expected + ".");
      }
      return this;
    };
    DOMAssertions.prototype.matchesText = function (expected, message) {
      return this.hasText(expected, message);
    };
    /**
     * Assert that the `textContent` property of an {@link HTMLElement} is not empty.
     *
     * @param {string?} message
     *
     * @example
     * assert.dom('button.share').hasAnyText();
     *
     * @see {@link #hasText}
     */
    DOMAssertions.prototype.hasAnyText = function (message) {
      return this.hasText({
        any: true
      }, message);
    };
    /**
     * Assert that the `textContent` property of an {@link HTMLElement} is empty.
     *
     * @param {string?} message
     *
     * @example
     * assert.dom('div').hasNoText();
     *
     * @see {@link #hasNoText}
     */
    DOMAssertions.prototype.hasNoText = function (message) {
      return this.hasText('', message);
    };
    /**
     * Assert that the text of the {@link HTMLElement} or an {@link HTMLElement}
     * matching the `selector` contains the given `text`, using the
     * [`textContent`](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)
     * attribute.
     *
     * > Note: This assertion will collapse whitespace in `textContent` before searching.
     * > If you would like to assert on a string that *should* contain line breaks, tabs,
     * > more than one space in a row, or starting/ending whitespace, use the {@link #hasText}
     * > selector and pass your expected text in as a RegEx pattern.
     *
     * **Aliases:** `containsText`, `hasTextContaining`
     *
     * @param {string} text
     * @param {string?} message
     *
     * @example
     * assert.dom('#title').includesText('Welcome');
     *
     * @see {@link #hasText}
     */
    DOMAssertions.prototype.includesText = function (text, message) {
      var element = this.findTargetElement();
      if (!element) return this;
      var collapsedText = collapseWhitespace(element.textContent);
      var result = collapsedText.indexOf(text) !== -1;
      var actual = collapsedText;
      var expected = text;
      if (!message) {
        message = "Element " + this.targetDescription + " has text containing \"" + text + "\"";
      }
      if (!result && text !== collapseWhitespace(text)) {
        console.warn('The `.includesText()`, `.containsText()`, and `.hasTextContaining()` assertions collapse whitespace. The text you are checking for contains whitespace that may have made your test fail incorrectly. Try the `.hasText()` assertion passing in your expected text as a RegExp pattern. Your text:\n' + text);
      }
      this.pushResult({
        result: result,
        actual: actual,
        expected: expected,
        message: message
      });
      return this;
    };
    DOMAssertions.prototype.containsText = function (expected, message) {
      return this.includesText(expected, message);
    };
    DOMAssertions.prototype.hasTextContaining = function (expected, message) {
      return this.includesText(expected, message);
    };
    /**
     * Assert that the text of the {@link HTMLElement} or an {@link HTMLElement}
     * matching the `selector` does not include the given `text`, using the
     * [`textContent`](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)
     * attribute.
     *
     * **Aliases:** `doesNotContainText`, `doesNotHaveTextContaining`
     *
     * @param {string} text
     * @param {string?} message
     *
     * @example
     * assert.dom('#title').doesNotIncludeText('Welcome');
     */
    DOMAssertions.prototype.doesNotIncludeText = function (text, message) {
      var element = this.findTargetElement();
      if (!element) return this;
      var collapsedText = collapseWhitespace(element.textContent);
      var result = collapsedText.indexOf(text) === -1;
      var expected = "Element " + this.targetDescription + " does not include text \"" + text + "\"";
      var actual = expected;
      if (!result) {
        actual = "Element " + this.targetDescription + " includes text \"" + text + "\"";
      }
      if (!message) {
        message = expected;
      }
      this.pushResult({
        result: result,
        actual: actual,
        expected: expected,
        message: message
      });
      return this;
    };
    DOMAssertions.prototype.doesNotContainText = function (unexpected, message) {
      return this.doesNotIncludeText(unexpected, message);
    };
    DOMAssertions.prototype.doesNotHaveTextContaining = function (unexpected, message) {
      return this.doesNotIncludeText(unexpected, message);
    };
    /**
     * Assert that the `value` property of an {@link HTMLInputElement} matches
     * the `expected` text or regular expression.
     *
     * If no `expected` value is provided, the assertion will fail if the
     * `value` is an empty string.
     *
     * @param {string|RegExp|object?} expected
     * @param {string?} message
     *
     * @example
     * assert.dom('input.username').hasValue('HSimpson');
        * @see {@link #hasAnyValue}
     * @see {@link #hasNoValue}
     */
    DOMAssertions.prototype.hasValue = function (expected, message) {
      var element = this.findTargetElement();
      if (!element) return this;
      if (arguments.length === 0) {
        expected = {
          any: true
        };
      }
      var value = element.value;
      if (expected instanceof RegExp) {
        var result = expected.test(value);
        var actual = value;
        if (!message) {
          message = "Element " + this.targetDescription + " has value matching " + expected;
        }
        this.pushResult({
          result: result,
          actual: actual,
          expected: expected,
          message: message
        });
      } else if (expected.any === true) {
        var result = Boolean(value);
        var expected_2 = "Element " + this.targetDescription + " has a value";
        var actual = result ? expected_2 : "Element " + this.targetDescription + " has no value";
        if (!message) {
          message = expected_2;
        }
        this.pushResult({
          result: result,
          actual: actual,
          expected: expected_2,
          message: message
        });
      } else {
        var actual = value;
        var result = actual === expected;
        if (!message) {
          message = "Element " + this.targetDescription + " has value \"" + expected + "\"";
        }
        this.pushResult({
          result: result,
          actual: actual,
          expected: expected,
          message: message
        });
      }
      return this;
    };
    /**
     * Assert that the `value` property of an {@link HTMLInputElement} is not empty.
     *
     * @param {string?} message
     *
     * @example
     * assert.dom('input.username').hasAnyValue();
     *
     * @see {@link #hasValue}
     * @see {@link #hasNoValue}
     */
    DOMAssertions.prototype.hasAnyValue = function (message) {
      return this.hasValue({
        any: true
      }, message);
    };
    /**
     * Assert that the `value` property of an {@link HTMLInputElement} is empty.
     *
     * **Aliases:** `lacksValue`
     *
     * @param {string?} message
     *
     * @example
     * assert.dom('input.username').hasNoValue();
     *
     * @see {@link #hasValue}
     * @see {@link #hasAnyValue}
     */
    DOMAssertions.prototype.hasNoValue = function (message) {
      return this.hasValue('', message);
    };
    DOMAssertions.prototype.lacksValue = function (message) {
      return this.hasNoValue(message);
    };
    /**
     * Assert that the target selector selects only Elements that are also selected by
     * compareSelector.
     *
     * @param {string} compareSelector
     * @param {string?} message
     *
     * @example
     * assert.dom('p.red').matchesSelector('div.wrapper p:last-child')
     */
    DOMAssertions.prototype.matchesSelector = function (compareSelector, message) {
      var targetElements = this.target instanceof Element ? [this.target] : this.findElements();
      var targets = targetElements.length;
      var matchFailures = matchesSelector(targetElements, compareSelector);
      var singleElement = targets === 1;
      var selectedByPart = this.target instanceof Element ? 'passed' : "selected by " + this.target;
      var actual;
      var expected;
      if (matchFailures === 0) {
        // no failures matching.
        if (!message) {
          message = singleElement ? "The element " + selectedByPart + " also matches the selector " + compareSelector + "." : targets + " elements, selected by " + this.target + ", also match the selector " + compareSelector + ".";
        }
        actual = expected = message;
        this.pushResult({
          result: true,
          actual: actual,
          expected: expected,
          message: message
        });
      } else {
        var difference = targets - matchFailures;
        // there were failures when matching.
        if (!message) {
          message = singleElement ? "The element " + selectedByPart + " did not also match the selector " + compareSelector + "." : matchFailures + " out of " + targets + " elements selected by " + this.target + " did not also match the selector " + compareSelector + ".";
        }
        actual = singleElement ? message : difference + " elements matched " + compareSelector + ".";
        expected = singleElement ? "The element should have matched " + compareSelector + "." : targets + " elements should have matched " + compareSelector + ".";
        this.pushResult({
          result: false,
          actual: actual,
          expected: expected,
          message: message
        });
      }
      return this;
    };
    /**
     * Assert that the target selector selects only Elements that are not also selected by
     * compareSelector.
     *
     * @param {string} compareSelector
     * @param {string?} message
     *
     * @example
     * assert.dom('input').doesNotMatchSelector('input[disabled]')
     */
    DOMAssertions.prototype.doesNotMatchSelector = function (compareSelector, message) {
      var targetElements = this.target instanceof Element ? [this.target] : this.findElements();
      var targets = targetElements.length;
      var matchFailures = matchesSelector(targetElements, compareSelector);
      var singleElement = targets === 1;
      var selectedByPart = this.target instanceof Element ? 'passed' : "selected by " + this.target;
      var actual;
      var expected;
      if (matchFailures === targets) {
        // the assertion is successful because no element matched the other selector.
        if (!message) {
          message = singleElement ? "The element " + selectedByPart + " did not also match the selector " + compareSelector + "." : targets + " elements, selected by " + this.target + ", did not also match the selector " + compareSelector + ".";
        }
        actual = expected = message;
        this.pushResult({
          result: true,
          actual: actual,
          expected: expected,
          message: message
        });
      } else {
        var difference = targets - matchFailures;
        // the assertion fails because at least one element matched the other selector.
        if (!message) {
          message = singleElement ? "The element " + selectedByPart + " must not also match the selector " + compareSelector + "." : difference + " elements out of " + targets + ", selected by " + this.target + ", must not also match the selector " + compareSelector + ".";
        }
        actual = singleElement ? "The element " + selectedByPart + " matched " + compareSelector + "." : matchFailures + " elements did not match " + compareSelector + ".";
        expected = singleElement ? message : targets + " elements should not have matched " + compareSelector + ".";
        this.pushResult({
          result: false,
          actual: actual,
          expected: expected,
          message: message
        });
      }
      return this;
    };
    /**
     * Assert that the tagName of the {@link HTMLElement} or an {@link HTMLElement}
     * matching the `selector` matches the `expected` tagName, using the
     * [`tagName`](https://developer.mozilla.org/en-US/docs/Web/API/Element/tagName)
     * property of the {@link HTMLElement}.
     *
     * @param {string} expected
     * @param {string?} message
     *
     * @example
     * // <h1 id="title">
     * //   Title
     * // </h1>
     *
     * assert.dom('#title').hasTagName('h1');
     */
    DOMAssertions.prototype.hasTagName = function (tagName, message) {
      var element = this.findTargetElement();
      var actual;
      var expected;
      if (!element) return this;
      if (typeof tagName !== 'string') {
        throw new TypeError("You must pass a string to \"hasTagName\". You passed " + tagName + ".");
      }
      actual = element.tagName.toLowerCase();
      expected = tagName.toLowerCase();
      if (actual === expected) {
        if (!message) {
          message = "Element " + this.targetDescription + " has tagName " + expected;
        }
        this.pushResult({
          result: true,
          actual: actual,
          expected: expected,
          message: message
        });
      } else {
        if (!message) {
          message = "Element " + this.targetDescription + " does not have tagName " + expected;
        }
        this.pushResult({
          result: false,
          actual: actual,
          expected: expected,
          message: message
        });
      }
      return this;
    };
    /**
     * Assert that the tagName of the {@link HTMLElement} or an {@link HTMLElement}
     * matching the `selector` does not match the `expected` tagName, using the
     * [`tagName`](https://developer.mozilla.org/en-US/docs/Web/API/Element/tagName)
     * property of the {@link HTMLElement}.
     *
     * @param {string} expected
     * @param {string?} message
     *
     * @example
     * // <section id="block">
     * //   Title
     * // </section>
     *
     * assert.dom('section#block').doesNotHaveTagName('div');
     */
    DOMAssertions.prototype.doesNotHaveTagName = function (tagName, message) {
      var element = this.findTargetElement();
      var actual;
      var expected;
      if (!element) return this;
      if (typeof tagName !== 'string') {
        throw new TypeError("You must pass a string to \"doesNotHaveTagName\". You passed " + tagName + ".");
      }
      actual = element.tagName.toLowerCase();
      expected = tagName.toLowerCase();
      if (actual !== expected) {
        if (!message) {
          message = "Element " + this.targetDescription + " does not have tagName " + expected;
        }
        this.pushResult({
          result: true,
          actual: actual,
          expected: expected,
          message: message
        });
      } else {
        if (!message) {
          message = "Element " + this.targetDescription + " has tagName " + expected;
        }
        this.pushResult({
          result: false,
          actual: actual,
          expected: expected,
          message: message
        });
      }
      return this;
    };
    /**
     * @private
     */
    DOMAssertions.prototype.pushResult = function (result) {
      this.testContext.pushResult(result);
    };
    /**
     * Finds a valid HTMLElement from target, or pushes a failing assertion if a valid
     * element is not found.
     * @private
     * @returns (HTMLElement|null) a valid HTMLElement, or null
     */
    DOMAssertions.prototype.findTargetElement = function () {
      var el = this.findElement();
      if (el === null) {
        var message = "Element " + (this.target || '<unknown>') + " should exist";
        this.pushResult({
          message: message,
          result: false,
          actual: undefined,
          expected: undefined
        });
        return null;
      }
      return el;
    };
    /**
     * Finds a valid HTMLElement from target
     * @private
     * @returns (HTMLElement|null) a valid HTMLElement, or null
     * @throws TypeError will be thrown if target is an unrecognized type
     */
    DOMAssertions.prototype.findElement = function () {
      if (this.target === null) {
        return null;
      } else if (typeof this.target === 'string') {
        return this.rootElement.querySelector(this.target);
      } else if (this.target instanceof Element) {
        return this.target;
      } else {
        throw new TypeError("Unexpected Parameter: " + this.target);
      }
    };
    /**
     * Finds a collection of Element instances from target using querySelectorAll
     * @private
     * @returns (Element[]) an array of Element instances
     * @throws TypeError will be thrown if target is an unrecognized type
     */
    DOMAssertions.prototype.findElements = function () {
      if (this.target === null) {
        return [];
      } else if (typeof this.target === 'string') {
        return toArray(this.rootElement.querySelectorAll(this.target));
      } else if (this.target instanceof Element) {
        return [this.target];
      } else {
        throw new TypeError("Unexpected Parameter: " + this.target);
      }
    };
    Object.defineProperty(DOMAssertions.prototype, "targetDescription", {
      /**
       * @private
       */
      get: function () {
        return elementToString(this.target);
      },
      enumerable: false,
      configurable: true
    });
    return DOMAssertions;
  }();
  var _getRootElement = function () {
    return null;
  };
  function overrideRootElement(fn) {
    _getRootElement = fn;
  }
  function getRootElement() {
    return _getRootElement();
  }
  function install(assert) {
    assert.dom = function (target, rootElement) {
      if (!isValidRootElement(rootElement)) {
        throw new Error(rootElement + " is not a valid root element");
      }
      rootElement = rootElement || this.dom.rootElement || getRootElement();
      if (arguments.length === 0) {
        target = rootElement instanceof Element ? rootElement : null;
      }
      return new DOMAssertions(target, rootElement, this);
    };
    function isValidRootElement(element) {
      return !element || typeof element === 'object' && typeof element.querySelector === 'function' && typeof element.querySelectorAll === 'function';
    }
  }
  function setup(assert, options) {
    if (options === void 0) {
      options = {};
    }
    install(assert);
    var getRootElement = typeof options.getRootElement === 'function' ? options.getRootElement : function () {
      return document.querySelector('#ember-testing');
    };
    overrideRootElement(getRootElement);
  }
});
/*
  used to determine if the application should be booted immediately when `app-name.js` is evaluated
  when `runningTests` the `app-name.js` file will **not** import the applications `app/app.js` and
  call `Application.create(...)` on it. Additionally, applications can opt-out of this behavior by
  setting `autoRun` to `false` in their `ember-cli-build.js`
*/
runningTests = true;

/*
  This file overrides a file built into ember-cli's build pipeline and prevents
  this built-in `Testem.hookIntoTestFramework` invocation:

  https://github.com/ember-cli/ember-cli/blob/v3.20.0/lib/broccoli/test-support-suffix.js#L3-L5
*/
//# sourceMappingURL=test-support.map
