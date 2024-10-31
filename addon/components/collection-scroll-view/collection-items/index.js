/* eslint-disable ember/no-component-lifecycle-hooks */
/* eslint-disable ember/no-side-effects */
import { A } from '@ember/array';
import Component from '@glimmer/component';
import identity from 'ember-collection/utils/identity';
import { tracked } from '@glimmer/tracking';
import { reads } from 'macro-decorators';

function isElementInViewport (el) {
    let rect = el.getBoundingClientRect();
    let windowHeight = (window.innerHeight || document.documentElement.clientHeight);
    return (rect.top > 0 && rect.top < windowHeight) ||
      (rect.bottom > 0 && rect.bottom < windowHeight);
}

let scrollViewCollectionItemsCellCounter = 0;

class Cell {
  @tracked hidden;
  @tracked item;
  @tracked index;
  @tracked style;
  @tracked containerId;
  needsReflow = false;

  constructor(key, item, index, style) {
    this.key = key;
    this.hidden = false;
    this.item = item;
    this.index = index;
    this.style = style;
    this.containerId = scrollViewCollectionItemsCellCounter++;
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

    let newItems = [];

    for (let i = 0; i < count; i++) {
      let cell;
      let itemIndex = index + i;
      let itemKey = identity(items[itemIndex]);
      if (priorMap) {
        cell = priorMap[itemKey];
      }
      if (cell) {
        let style = cellLayout.formatItemStyle(
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

    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      if (!cellMap[cell.key]) {
        if (newItems.length) {
          let itemIndex = newItems.pop();
          let item = items[itemIndex];
          let itemKey = identity(item);
          let style = cellLayout.formatItemStyle(
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
          if (window.SCROLL_VIEW_FORCE_REFLOW) {
            cell.needsReflow = true;
          }
        } else {
          cell.hidden = true;
          cell.style = 'height: 0; display: none;';
        }
      }
    }

    for (let i = 0; i < newItems.length; i++) {
      let itemIndex = newItems[i];
      let item = items[itemIndex];
      let itemKey = identity(item);
      let style = cellLayout.formatItemStyle(itemIndex, clientWidth, clientHeight);
      const cell = new Cell(itemKey, item, itemIndex, style);
      cellMap[itemKey] = cell;
      cells.pushObject(cell);
    }
    this.cellMap = cellMap;
    this.contentSize = cellLayout.contentSize(clientWidth, clientHeight);

    // Workaround for bug in Android System WebView 130. Cells that are updated when outside
    // viewport aren't rerendered. When they are scrolled into view, access offsetHeight to
    // force a reflow.
    if (window.SCROLL_VIEW_FORCE_REFLOW) {
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        if (cell.needsReflow) {
          let element = document.querySelector(`[data-collection-scroll-view-cell-container-id="${cell.containerId}"]`);
          if (element && isElementInViewport(element)) {
            let display = element.style.display;
            element.style.display = 'none';
            element.offsetHeight;
            element.style.display = display;
            cell.needsReflow = false;
          }
        }
      }
    }

    return cells;
  }
}
