import Component from '@glimmer/component';
import { reads } from 'macro-decorators';
import { cached, tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { next, schedule, run } from '@ember/runloop';
import { ref } from 'ember-ref-bucket';
import { invokeResizeCallback } from 'yapp-scroll-view/utils/resize-observer-waiter';

/* A component which integrates a ScrollView with ember-collection */
export default class CollectionScrollView extends Component {
  @ref('element') element;

  @tracked headerDimensions;
  @tracked scrollTop = 0;
  @tracked clientWidth;
  @tracked clientHeight;
  @tracked contentSize;
  @tracked activeCellIndex = 0;

  @reads('headerDimensions.height', 0) headerHeight;
  @reads('args.estimated-height') estimatedHeight;
  @reads('args.estimated-width') estimatedWidth;
  @reads('args.cell-layout') cellLayout;

  get scrollHeight() {
    let { contentSize, clientSize, headerHeight } = this;
    contentSize =
      contentSize ||
      this.cellLayout.contentSize(clientSize.width, clientSize.height);
    return contentSize.height + headerHeight;
  }

  get clientSize() {
    return (
      this.measuredClientSize || {
        width: this.estimatedWidth,
        height: this.estimatedHeight,
      }
    );
  }

  get collectionClientSize() {
    let { clientSize, headerHeight, scrollTop } = this;
    let result = {
      width: clientSize.width,
      height: clientSize.height - Math.max(headerHeight - scrollTop, 0),
    };
    return result;
  }

  get collectionScrollTop() {
    let { headerHeight, scrollTop } = this;
    return Math.max(0, scrollTop - headerHeight);
  }

  get visibleHeaderHeight() {
    let { headerHeight, scrollTop } = this;
    return Math.max(0, headerHeight - scrollTop);
  }

  @action
  updateHeaderDimensions(scrollViewApi, entry) {
    invokeResizeCallback(() => {
      run(() => {
        let isFirstMeasure = !this.headerDimensions;
        this.headerDimensions = {
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        };

        // If an initialScrollTop was set we need to apply it after the collections rows render
        if (isFirstMeasure && this.args.initialScrollTop) {
          next(
            scrollViewApi,
            scrollViewApi.scrollTo,
            this.args.initialScrollTop,
          );
        }
      });
    });
  }

  @action
  updateContentSizeAfterRender(contentSize) {
    schedule('afterRender', this, () => {
      this.contentSize = contentSize;
    });
  }

  @action
  scrollChange(scrollTop) {
    if (scrollTop !== this.scrollTop) {
      this.scrollTop = scrollTop;
      // this._needsRevalidate();
    }
  }

  get itemsLength() {
    let { items } = this.args;
    if (items && typeof items.length === 'number') {
      return items.length;
    }
    return 0;
  }

  @action
  clientSizeChange(clientWidth, clientHeight) {
    next(() => {
      if (!this.isDestroyed) {
        this.clientWidth = clientWidth;
        this.clientHeight = clientHeight;
      }
    });
  }

  @cached
  get measuredClientSize() {
    if (this.clientWidth && this.clientHeight) {
      return {
        width: this.clientWidth,
        height: this.clientHeight,
      };
    }
    return null;
  }

  @action
  onScrolledToTopChange(isAtTop) {
    if (this.args.scrolledToTopChange) {
      this.args.scrolledToTopChange(isAtTop);
    }
  }

  @action
  onItemsDidUpdate(length = this.itemsLength) {
    if (length === 0) {
      this.activeCellIndex = 0;
      return;
    }
    if (this.activeCellIndex > length - 1) {
      this.activeCellIndex = length - 1;
    }
  }

  @action
  handleCellFocus(index, event) {
    if (typeof index === 'number') {
      let normalizedIndex = this.normalizeIndex(index) ?? 0;
      this.activeCellIndex = normalizedIndex;
      if (event?.target === event?.currentTarget) {
        this.requestFocusForIndex(normalizedIndex);
      }
    }
  }

  @action
  handleCellKeydown(scrollViewApi, index, event) {
    if (!event || event.defaultPrevented) {
      return;
    }
    let nextIndex = this.indexFromKey(event, index);
    if (nextIndex === null || nextIndex === undefined) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.moveFocusTo(scrollViewApi, nextIndex);
  }

  moveFocusTo(scrollViewApi, index) {
    let normalizedIndex = this.normalizeIndex(index);
    if (normalizedIndex === null) {
      return;
    }
    if (this.activeCellIndex !== normalizedIndex) {
      this.activeCellIndex = normalizedIndex;
    }
    this.ensureIndexInView(scrollViewApi, normalizedIndex);
    this.requestFocusForIndex(normalizedIndex);
  }

  normalizeIndex(index) {
    let length = this.itemsLength;
    if (!length || length < 1) {
      return null;
    }
    if (index < 0) {
      return 0;
    }
    if (index > length - 1) {
      return length - 1;
    }
    return index;
  }

  indexFromKey(event, index) {
    let { key, altKey, ctrlKey, metaKey, shiftKey } = event;
    if (altKey || ctrlKey || metaKey) {
      return null;
    }
    let length = this.itemsLength;
    if (!length) {
      return null;
    }
    switch (key) {
      case 'Home':
        return 0;
      case 'End':
        return length - 1;
      case 'ArrowDown':
      case 'ArrowRight':
        return index + 1;
      case 'ArrowUp':
      case 'ArrowLeft':
        return index - 1;
      case 'PageDown':
        return index + this.pageSize(length);
      case 'PageUp':
        return index - this.pageSize(length);
      case 'Tab':
        if (shiftKey) {
          return index > 0 ? index - 1 : null;
        }
        return index < length - 1 ? index + 1 : null;
      default:
        return null;
    }
  }

  pageSize(length) {
    let { collectionClientSize, cellLayout } = this;
    if (cellLayout && collectionClientSize?.height) {
      let approxCellHeight =
        typeof cellLayout._cellHeight === 'number'
          ? cellLayout._cellHeight
          : collectionClientSize.height;
      if (approxCellHeight > 0) {
        return Math.max(
          1,
          Math.round(collectionClientSize.height / approxCellHeight),
        );
      }
    }
    return Math.max(1, Math.min(length, 5));
  }

  ensureIndexInView(scrollViewApi, index) {
    if (!scrollViewApi || !this.cellLayout) {
      return;
    }
    let clientSize = this.collectionClientSize;
    if (!clientSize) {
      return;
    }
    let visibleStart = this.collectionScrollTop;
    let visibleCount = this.cellLayout.count(
      0,
      visibleStart,
      clientSize.width,
      clientSize.height,
    );
    let firstVisibleIndex = this.cellLayout.indexAt(
      0,
      visibleStart,
      clientSize.width,
      clientSize.height,
    );
    let lastVisibleIndex = firstVisibleIndex + visibleCount - 1;
    if (index >= firstVisibleIndex && index <= lastVisibleIndex) {
      return;
    }

    let position = this.cellLayout.positionAt(index);
    if (position && typeof position.y === 'number') {
      scrollViewApi.scrollTo(position.y + this.headerHeight, false);
    }
  }

  requestFocusForIndex(index) {
    schedule('afterRender', this, this.focusCellElement, index, 0);
  }

  focusCellElement(index, attempt = 0) {
    if (index !== this.activeCellIndex) {
      return;
    }
    if (typeof document === 'undefined') {
      return;
    }
    let wrapper = this.element?.querySelector(
      `[data-collection-scroll-view-cell-index="${index}"]`,
    );
    if (wrapper) {
      let focusTarget = wrapper.querySelector(
        '[data-collection-scroll-view-focus-target]',
      );
      let element = focusTarget ?? wrapper;
      if (document.activeElement !== element) {
        element.focus();
      }
      return;
    }
    if (attempt >= 5) {
      return;
    }
    let scheduleNext = () => this.focusCellElement(index, attempt + 1);
    if (typeof window !== 'undefined' && window.requestAnimationFrame) {
      window.requestAnimationFrame(scheduleNext);
    } else {
      schedule('afterRender', this, this.focusCellElement, index, attempt + 1);
    }
  }

  @action
  scrollToItem(scrollViewApi, revealItemPayload) {
    let { id, source } = revealItemPayload;
    if (
      source &&
      (isChildComponent(this, source) || isChildElement(this.element, source))
    ) {
      return;
    }
    let { items } = this.args;
    let itemIndex = items.indexOf(items.find((i) => i.id === id));
    if (itemIndex >= 0) {
      let { y } = this.cellLayout.positionAt(itemIndex);
      scrollViewApi.scrollTo(y + this.headerHeight, true);
    }
  }
}

function isChildComponent(component, candidateChildComponent) {
  let parentView = candidateChildComponent;
  while ((parentView = parentView.parentView)) {
    // eslint-disable-line no-cond-assign
    if (parentView === component) {
      return true;
    }
  }
  return false;
}

function isChildElement(element, candidateChildElement) {
  return (
    element &&
    candidateChildElement instanceof HTMLElement &&
    element.contains(candidateChildElement)
  );
}
