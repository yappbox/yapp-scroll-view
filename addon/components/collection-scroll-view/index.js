import { scheduleOnce } from '@ember/runloop';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { cached, tracked } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';

export default class CollectionScrollView extends Component {
  @service('scroll-position-memory') memory;

  @tracked clientWidth;
  @tracked clientHeight;
  @tracked scrollTop = 0;
  scrollElement;

  get headerHeight() {
    return this.args.headerHeight || 0;
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

  get clientSize() {
    return (
      this.measuredClientSize || {
        width: this.args.estimatedWidth,
        height: this.args.estimatedHeight,
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

  firstVisibleChanged = (firstVisibleItem) => {
    this.args.firstVisibleChanged?.(firstVisibleItem);

    if (!this._hasInitialVisibleChange) {
      this._hasInitialVisibleChange = true;
      this.restoreScrollPosition();
    }
  };

  get filteredItems() {
    return this.args.filterStrategy?.filteredItems || [];
  }

  get filterText() {
    return this.args.filterStrategy?.filterText;
  }

  get visibleHeaderHeight() {
    let { headerHeight, scrollTop } = this;
    return Math.max(0, headerHeight - scrollTop);
  }

  get windowRef() {
    return window;
  }

  registerScrollElement = modifier((element) => {
    this.scrollElement = element;
    this.scrollTop = element?.scrollTop ?? 0;
    this.clientWidth = element?.clientWidth ?? 0;
    this.clientHeight = element?.clientHeight ?? 0;

    this.args.scrolledToTopChange?.(this.scrollTop === 0);

    return () => {
      if (this.scrollElement === element) {
        this.scrollElement = null;
      }
      this.clientWidth = undefined;
      this.clientHeight = undefined;
      this.scrollTop = 0;
    };
  });

  get isInViewport() {
    if (!this.scrollElement) {
      return false;
    }
    let rect = this.scrollElement.getBoundingClientRect();
    let viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;
    let viewportWidth =
      window.innerWidth || document.documentElement.clientWidth;
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= viewportHeight &&
      rect.right <= viewportWidth
    );
  }

  registerAPI = (verticalCollectionApi) => {
    this.verticalCollectionApi = verticalCollectionApi;
  };

  scrollChange = (scrollTop) => {
    if (scrollTop !== this.scrollTop) {
      this.scrollTop = scrollTop;
    }
    this.args.scrolledToTopChange?.(scrollTop === 0);
  };

  handleScroll = (event) => {
    let nextScrollTop = event?.target?.scrollTop ?? 0;

    this.scrollChange(nextScrollTop);
    this.storeScrollPosition();
  };

  scrollToTopIfInViewport = () => {
    if (this.isInViewport) {
      this.scrollToTop();
    }
  };

  scrollToTop() {
    this.scrollTo(0);
  }

  scrollTo(yPos) {
    let element = this.scrollElement;
    if (!element) {
      return;
    }
    try {
      element.scrollTo({
        top: yPos,
        behavior: 'smooth',
      });
      return;
    } catch (e) {
      // fall through to direct assignment
      element.scrollTop = yPos;
    }
  }

  scrollToItem = async (revealItemPayload) => {
    let { id, source } = revealItemPayload;
    if (
      source &&
      (isChildComponent(this, source) ||
        isChildElement(this.scrollElement, source))
    ) {
      return;
    }
    if (!this.verticalCollectionApi) {
      return;
    }
    await this.verticalCollectionApi.scrollToItem(id);
  };

  handleResize = (entry) => {
    let rect = entry?.contentRect;
    let width;
    let height;

    if (rect) {
      ({ width, height } = rect);
    } else if (this.scrollElement) {
      width = this.scrollElement.clientWidth;
      height = this.scrollElement.clientHeight;
    }

    if (width !== undefined) {
      this.clientWidth = width;
    }

    let previousHeight = this.clientHeight;
    if (height !== undefined) {
      this.clientHeight = height;
    }

    if (height !== undefined && height !== previousHeight) {
      this.scheduleVerticalCollectionRefresh();
    }

    this.schedulePendingRestore();
  };

  scheduleVerticalCollectionRefresh() {
    if (this._verticalCollectionRefreshScheduled) {
      return;
    }
    this._verticalCollectionRefreshScheduled = true;
    scheduleOnce('afterRender', this, this.dispatchVerticalCollectionRefresh);
  }

  dispatchVerticalCollectionRefresh() {
    this._verticalCollectionRefreshScheduled = false;
    if (typeof window === 'undefined') {
      return;
    }
    window.dispatchEvent(new Event('resize'));
  }

  storeScrollPosition() {
    if (!this.args.memoryScrollKey || !this.scrollElement) {
      return;
    }
    let scrollTop = this.scrollElement.scrollTop ?? 0;
    this.memory[this.args.memoryScrollKey] = scrollTop;
  }

  restoreScrollPosition() {
    const { initialScrollTop, memoryScrollKey } = this.args;
    if (!memoryScrollKey && !initialScrollTop) {
      return;
    }
    let storedPosition = this.memory[memoryScrollKey];
    if (typeof storedPosition !== 'number') {
      storedPosition = initialScrollTop;
    }
    if (typeof storedPosition !== 'number') {
      return;
    }
    this._pendingRestorePosition = storedPosition;
    this.schedulePendingRestore();
  }

  schedulePendingRestore() {
    if (this._pendingRestorePosition === undefined || this._restoreScheduled) {
      return;
    }
    this._restoreScheduled = true;
    scheduleOnce('afterRender', this, this.applyPendingRestore);
  }

  applyPendingRestore() {
    this._restoreScheduled = false;
    let position = this._pendingRestorePosition;
    if (position === undefined) {
      return;
    }
    if (!this.canRestoreScrollPosition()) {
      this.schedulePendingRestore();
      return;
    }
    let targetScrollTop = Math.max(0, position);
    this.scrollElement.scrollTop = targetScrollTop;
    this.scrollTop = targetScrollTop;
    this._pendingRestorePosition = undefined;
  }

  canRestoreScrollPosition() {
    return (
      Boolean(this.scrollElement) && Boolean(this._hasInitialVisibleChange)
    );
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
