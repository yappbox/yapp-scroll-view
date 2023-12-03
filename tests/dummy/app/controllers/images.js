import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export default class extends Controller {
  @tracked itemWidth = 200;
  @tracked itemHeight = 100;
  @tracked containerWidth = 300;
  @tracked containerHeight = 600;

  @action
  updateContainerWidth(ev) {
    this.containerWidth = parseInt(ev.target.value, 10);
  }

  @action
  updateContainerHeight(ev) {
    this.containerHeight = parseInt(ev.target.value, 10);
  }

  @action
  shuffle() {
    this.model = shuffle(this.model.slice(0));
  }
}
