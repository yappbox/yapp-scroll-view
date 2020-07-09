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

  get useEventedApi() {
    return this.emitter.on && this.emitter.off;
  }

  startListening() {
    let { handler, emitter, eventName } = this;
    if (this.useEventedApi) {
      emitter.on(eventName, this, handler);
    } else {
      emitter.addEventListener(eventName, handler);
    }
    this.isListening = true;
  }

  stopListening() {
    let { isListening, handler, emitter, eventName } = this;
    if (!isListening) {
      return;
    }
    if (this.useEventedApi) {
      emitter.off(eventName, this, handler);
    } else {
      emitter.removeEventListener(eventName, handler);
    }
    this.isListening = false;
  }
}
