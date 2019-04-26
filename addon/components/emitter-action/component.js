import Component from '@ember/component';
import { tagName } from '@ember-decorators/component';
import { join } from '@ember/runloop';
// import { argument } from '@ember-decorators/argument';
// import { type } from '@ember-decorators/argument/type';
// import { ClosureAction } from '@ember-decorators/argument/types';
// import { required } from '@ember-decorators/argument/validation';

@tagName('')
export default class EmitterAction extends Component {

  // @argument @required @type('any')
  emitter;

  // @argument @required @type('string')
  eventName;

  // @argument @required @type(ClosureAction)
  action;

  didInsertElement() {
    super.didInsertElement(...arguments);
    this.addListener();
  }

  willDestroyElement() {
    super.didInsertElement(...arguments);
    this.removeListener();
  }

  addListener() {
    let { emitter, eventName, _action } = this;
    if (emitter.on) {
      emitter.on(eventName, this, _action);
    } else {
      this._boundAction = _action.bind(this);
      emitter.addEventListener(eventName, this._boundAction);
    }
  }

  removeListener() {
    let { emitter, eventName, _action } = this;
    if (emitter.off) {
      emitter.off(eventName, this, _action);
    } else {
      emitter.removeEventListener(eventName, this._boundAction);
    }
  }

  _action() {
    let args = arguments;
    join(() => {
      this.action(...args);
    });
  }
}
