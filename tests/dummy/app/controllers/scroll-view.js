/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class extends Controller {
  @tracked isShort = false;
  @action
  toggleIsShort() {
    this.isShort = !this.isShort;
  }
}