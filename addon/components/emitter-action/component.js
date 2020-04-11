import Component from '@glimmer/component';
import { action } from '@ember/object';
import { join } from '@ember/runloop';
// import { argument } from '@ember-decorators/argument';
// import { Action } from '@ember-decorators/argument/types';

export default class extends Component {

  // @argument('any')
  // emitter;
  //
  // @argument('string')
  // eventName;
  //
  // @argument(Action)
  // action;

  constructor() {
    super(...arguments);
    this.addListener();
  }

  willDestroy() {
    super.willDestroy(...arguments);
    this.removeListener();
  }

  addListener() {
    let { _action, args: { emitter, eventName } } = this;
    if (emitter.on) {
      emitter.on(eventName, this, _action);
    } else {
      emitter.addEventListener(eventName, _action);
    }
  }

  removeListener() {
    let { _action, args: { emitter, eventName } } = this;
    if (emitter.off) {
      emitter.off(eventName, this, _action);
    } else {
      emitter.removeEventListener(eventName, this._action);
    }
  }

  @action
  _action() {
    let args = arguments;
    join(() => {
      this.args.action(...args);
    });
  }
}
