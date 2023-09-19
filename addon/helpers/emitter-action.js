import Helper from '@ember/component/helper';
import { assert } from '@ember/debug';

export default class extends Helper {
  isListening = false;

  compute(_params, { emitter, eventName, action }) {
    assert('[emitter-action helper] Must specify an emitter', emitter);
    assert('[emitter-action helper] Must specify an eventName', eventName);
    assert('[emitter-action helper] Must specify an action', action);
    this.stopListening();
    this.emitter = emitter;
    this.eventName = eventName;
    this.handler = action;

    this.startListening();
  }

  willDestroy() {
    this.stopListening();
    super.willDestroy(...arguments);
  }

  startListening() {
    let { handler, emitter, eventName } = this;
    emitter.addEventListener(eventName, handler);
    this.isListening = true;
  }

  stopListening() {
    let { isListening, handler, emitter, eventName } = this;
    if (!isListening) {
      return;
    }
    emitter.removeEventListener(eventName, handler);
    this.isListening = false;
  }
}
