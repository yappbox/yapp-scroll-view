/* eslint-disable ember/no-component-lifecycle-hooks */
/* eslint-disable ember/no-side-effects */
import { A } from '@ember/array';
import Component from '@glimmer/component';
import identity from 'ember-collection/utils/identity';
import { tracked } from '@glimmer/tracking';
import { reads } from 'macro-decorators';

class Cell {
  @tracked hidden;
  @tracked item;
  @tracked index;
  @tracked style;

  constructor(key, item, index, style) {
    this.key = key;
    this.hidden = false;
    this.item = item;
    this.index = index;
    this.style = style;
  }
}

export default class CollectionScrollViewCollectionItems extends Component {
  _contentSize;
  cells = A();
  cellMap = Object.create(null);

  @reads('args.buffer', 5) buffer;
  @reads('args.scrollLeft', 0) scrollLeft;
  @reads('args.scrollTop', 0) scrollTop;
  @reads('args.estimatedSize', { width: 0, height: 0 }) estimatedSize;
  @reads('args.cellLayout') cellLayout;
  @reads('args.items', []) items; // args.items should be a TrackedArray if you want it this component to update when it changes

  get clientWidth() {
    let { clientSize, estimatedSize } = this.args;
    return clientSize ? clientSize.width : estimatedSize.width;
  }

  get clientHeight() {
    let { clientSize, estimatedSize } = this.args;
    return clientSize ? clientSize.height : estimatedSize.height;
  }

  safeRerender() {
    if (this.isDestroyed || this.isDestroying) {
      return;
    }
    this.rerender();
  }

  get contentSize() {
    this._contentSize =
      this._contentSize ||
      this.cellLayout.contentSize(this.clientWidth, this.clientHeight);
    return this._contentSize;
  }

  set contentSize(contentSize) {
    if (this._contentSize !== contentSize) {
      let { cellLayout, clientWidth, clientHeight } = this;
      this._contentSize = cellLayout.contentSize(clientWidth, clientHeight);
      if (this.args.onContentSizeUpdated) {
        this.args.onContentSizeUpdated(contentSize);
      }
    }
  }

  get renderCells() {
    let {
      cellLayout,
      cells,
      items,
      scrollLeft,
      scrollTop,
      clientWidth,
      clientHeight,
    } = this;
    const numItems = items.length;
    if (cellLayout.length !== numItems) {
      cellLayout.length = numItems;
    }

    let priorMap = this.cellMap;
    let cellMap = Object.create(null);

    let index = cellLayout.indexAt(
      scrollLeft,
      scrollTop,
      clientWidth,
      clientHeight
    );
    let count = cellLayout.count(
      scrollLeft,
      scrollTop,
      clientWidth,
      clientHeight
    );
    let bufferBefore = Math.min(index, this.buffer);
    index -= bufferBefore;
    count += bufferBefore;
    count = Math.min(count + this.buffer, items.length - index);
    let i, style, itemIndex, itemKey, cell;

    let newItems = [];

    for (i = 0; i < count; i++) {
      itemIndex = index + i;
      itemKey = identity(items[itemIndex]);
      if (priorMap) {
        cell = priorMap[itemKey];
      }
      if (cell) {
        style = cellLayout.formatItemStyle(
          itemIndex,
          clientWidth,
          clientHeight
        );
        cell.style = style;
        cell.hidden = false;
        cell.key = itemKey;
        cell.index = itemIndex;
        cellMap[itemKey] = cell;
      } else {
        newItems.push(itemIndex);
      }
    }

    for (i = 0; i < cells.length; i++) {
      cell = cells[i];
      if (!cellMap[cell.key]) {
        if (newItems.length) {
          itemIndex = newItems.pop();
          let item = items[itemIndex];
          itemKey = identity(item);
          style = cellLayout.formatItemStyle(
            itemIndex,
            clientWidth,
            clientHeight
          );
          cell.style = style;
          cell.key = itemKey;
          cell.index = itemIndex;
          cell.item = item;
          cell.hidden = false;
          cellMap[itemKey] = cell;
        } else {
          cell.hidden = true;
          cell.style = 'height: 0; display: none;';
        }
      }
    }

    for (i = 0; i < newItems.length; i++) {
      itemIndex = newItems[i];
      let item = items[itemIndex];
      itemKey = identity(item);
      style = cellLayout.formatItemStyle(itemIndex, clientWidth, clientHeight);
      cell = new Cell(itemKey, item, itemIndex, style);
      cellMap[itemKey] = cell;
      cells.pushObject(cell);
    }
    this.cellMap = cellMap;
    this.contentSize = cellLayout.contentSize(clientWidth, clientHeight);
    return cells;
  }
}
