import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import {
  find,
  focus,
  render,
  triggerKeyEvent,
  waitFor,
  waitUntil,
} from '@ember/test-helpers';
import {
  scrollPosition,
  scrollDown,
  waitForOpacity,
} from '../../helpers/scrolling';
import EmberObject from '@ember/object';
import { timeout } from 'ember-concurrency';
import EventEmitter from 'eventemitter3';

const SCROLL_CONTAINER = '[data-test-scroll-container]';
const SCROLLBAR_THUMB = '[data-test-scroll-bar] [data-test-thumb]';
const ITEMS_CONTAINER = '[data-test-collection-items-container]';

function assertDoNotOverlap(assert, selector1, selector2) {
  let rect1 = document.querySelector(selector1).getBoundingClientRect();
  let rect2 = document.querySelector(selector2).getBoundingClientRect();
  let overlaps =
    rect1.right > rect2.left &&
    rect1.left < rect2.right &&
    rect1.bottom > rect2.top &&
    rect1.top < rect2.bottom;
  assert.ok(
    !overlaps,
    `Expected element at ${selector1} to NOT overlap element at ${selector2} but it does`,
  );
}

function waitUntilText(text) {
  return waitUntil(() => find(SCROLL_CONTAINER).textContent.includes(text));
}

class FakeRevealService extends EmberObject {
  events = new EventEmitter();
  addEventListener() {
    this.events.addListener(...arguments);
  }
  removeEventListener() {
    this.events.addListener(...arguments);
  }
  trigger() {
    this.events.emit(...arguments);
  }
}

module('Integration | Component | collection-scroll-view', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.set('viewportWidth', 320);
    this.set('viewportHeight', 480);
    this.set('items', [
      { id: '1', name: 'One' },
      { id: '2', name: 'Two' },
      { id: '3', name: 'Three' },
      { id: '4', name: 'Four' },
      { id: '5', name: 'Five' },
      { id: '6', name: 'Six' },
      { id: '7', name: 'Seven' },
      { id: '8', name: 'Eight' },
      { id: '9', name: 'Nine' },
      { id: '10', name: 'Ten' },
    ]);
    this.set('revealService', null);
  });
  const EXAMPLE_1_HBS = hbs`
    <div style={{html-safe (concat "width:320px; height:" this.viewportHeight "px; position:relative")}}>
      <CollectionScrollView
        @items={{this.items}}
        @estimated-width={{this.viewportWidth}}
        @estimated-height={{this.viewportHeight}}
        @buffer={{1}}
        @cell-layout={{fixed-grid-layout 320 100}}
        @revealService={{this.revealService}}
      >
        <:row as |item|>
          <div class="list-item" data-list-item-id={{item.id}}>
            {{item.name}}
          </div>
        </:row>
      </CollectionScrollView>
    </div>
  `;

  test('it renders', async function (assert) {
    await render(EXAMPLE_1_HBS);
    assert.dom(SCROLL_CONTAINER).containsText('One');
    assert.dom(SCROLL_CONTAINER).containsText('Six');
    assert.dom(SCROLL_CONTAINER).doesNotContainText('Eight');
    assert.equal(scrollPosition(find(SCROLL_CONTAINER)), 0);
  });

  test('it scrolls with a swipe', async function (assert) {
    await render(EXAMPLE_1_HBS);
    await waitUntilText('One');
    let scrollPromise = scrollDown(SCROLL_CONTAINER, {
      amount: 550,
      duration: 700,
    });
    await waitForOpacity(SCROLLBAR_THUMB, '1');
    await waitUntil(() => {
      // console.log('find(SCROLLBAR_THUMB).offsetHeight', find(SCROLLBAR_THUMB).offsetHeight);
      let thumbEl = find(SCROLLBAR_THUMB);
      return Math.abs(thumbEl.offsetHeight - 228) <= 1;
    });
    assert.close(find(SCROLLBAR_THUMB).offsetHeight, 228, 1);
    await scrollPromise;
    await waitUntil(() => {
      // console.log('scrollPosition(find(SCROLL_CONTAINER))', scrollPosition(find(SCROLL_CONTAINER)));
      return scrollPosition(find(SCROLL_CONTAINER)) <= -390;
    });
    assert.ok(scrollPosition(find(SCROLL_CONTAINER)) <= -390);
    assert.dom(SCROLL_CONTAINER).containsText('Ten');
    assert.dom(SCROLL_CONTAINER).containsText('Four');
    assert.dom(SCROLL_CONTAINER).doesNotContainText('One');
  });

  test('it handles scroll view changing size', async function (assert) {
    await render(EXAMPLE_1_HBS);
    assert.dom(SCROLL_CONTAINER).doesNotContainText('Eight');
    this.set('viewportHeight', 1200);
    window.SIMULATE_SCROLL_VIEW_MEASUREMENT_LOOP();
    await waitUntil(
      () => document.querySelector(SCROLL_CONTAINER).offsetHeight === 1200,
      {
        timeoutMessage: 'scroll-view should update its scroll container size',
      },
    );
    assert.dom(SCROLL_CONTAINER).containsText('Eight');
  });

  test('it accepts reveal service and scrolls item into view', async function (assert) {
    let fakeRevealService = new FakeRevealService();
    this.set('revealService', fakeRevealService);
    await render(EXAMPLE_1_HBS);
    assert.dom(SCROLL_CONTAINER).doesNotContainText('Eight');
    fakeRevealService.trigger('revealItemById', { id: '8' });
    await waitFor('[data-list-item-id="8"]');
    assert.dom(SCROLL_CONTAINER).containsText('Eight');
    assert.ok(scrollPosition(find(SCROLL_CONTAINER)) <= -100);
  });

  test('revealItemById does not scroll if source is within the CollectionScrollView', async function (assert) {
    let fakeRevealService = new FakeRevealService();
    this.set('revealService', fakeRevealService);
    await render(EXAMPLE_1_HBS);
    fakeRevealService.trigger('revealItemById', {
      id: '4',
      source: document.querySelector('[data-list-item-id="4"]'),
    });
    await timeout(200);
    assert.dom(SCROLL_CONTAINER).doesNotContainText('Eight');
    assert.equal(scrollPosition(find(SCROLL_CONTAINER)), 0);
  });

  test('allows keyboard users to move focus between rendered items', async function (assert) {
    await render(EXAMPLE_1_HBS);
    await waitUntilText('One');

    const firstSelector = '[data-collection-scroll-view-cell-index="0"]';
    const secondSelector = '[data-collection-scroll-view-cell-index="1"]';
    const lastSelector = '[data-collection-scroll-view-cell-index="9"]';

    await waitUntil(() => Boolean(find(firstSelector)));
    await focus(firstSelector);

    assert.strictEqual(
      document.activeElement,
      find(firstSelector),
      'focus defaults to the first rendered cell',
    );
    assert.dom(firstSelector).hasAttribute('tabindex', '0');
    await waitUntil(() => Boolean(find(secondSelector)));
    assert.dom(secondSelector).hasAttribute('tabindex', '-1');

    await triggerKeyEvent(firstSelector, 'keydown', 'Tab');
    await waitUntil(() => document.activeElement === find(secondSelector));

    assert.dom(firstSelector).hasAttribute('tabindex', '-1');
    assert.dom(secondSelector).hasAttribute('tabindex', '0');

    await triggerKeyEvent(secondSelector, 'keydown', 'Tab', { shiftKey: true });
    await waitUntil(() => document.activeElement === find(firstSelector));

    assert.dom(firstSelector).hasAttribute('tabindex', '0');
    assert.dom(secondSelector).hasAttribute('tabindex', '-1');

    await triggerKeyEvent(firstSelector, 'keydown', 'ArrowDown');
    await waitUntil(() => document.activeElement === find(secondSelector));

    assert.dom(firstSelector).hasAttribute('tabindex', '-1');
    assert.dom(secondSelector).hasAttribute('tabindex', '0');

    await triggerKeyEvent(secondSelector, 'keydown', 'End');
    await waitUntil(() => {
      let candidate = find(lastSelector);
      return candidate && document.activeElement === candidate;
    });
    assert.dom(lastSelector).hasAttribute('tabindex', '0');
  });

  test('uses focus target attribute when provided', async function (assert) {
    this.keys = [];
    this.set('handleCellKeyDown', (event) => {
      this.keys.push(event.key);
    });
    const template = hbs`
      <div style={{html-safe (concat "width:320px; height:" this.viewportHeight "px; position:relative")}}>
        <CollectionScrollView
          @items={{this.items}}
          @estimated-width={{this.viewportWidth}}
          @estimated-height={{this.viewportHeight}}
          @buffer={{1}}
          @cell-layout={{fixed-grid-layout 320 100}}
        >
          <:row as |item|>
            <div
              class='focus-target'
              data-collection-scroll-view-focus-target
              tabindex='0'
              {{on 'keydown' this.handleCellKeyDown}}
            >
              {{item.name}}
            </div>
          </:row>
        </CollectionScrollView>
      </div>
    `;

    await render(template);
    const firstTarget =
      '[data-collection-scroll-view-cell-index="0"] [data-collection-scroll-view-focus-target]';
    const secondTarget =
      '[data-collection-scroll-view-cell-index="1"] [data-collection-scroll-view-focus-target]';

    await focus('[data-collection-scroll-view-cell-index="0"]');
    await waitUntil(() => document.activeElement === find(firstTarget), {
      timeoutMessage: 'first focus target should receive focus',
    });
    assert.dom(firstTarget).isFocused();

    await triggerKeyEvent(firstTarget, 'keydown', 'ArrowDown');
    await waitUntil(() => document.activeElement === find(secondTarget), {
      timeoutMessage:
        'second focus target should receive focus after ArrowDown',
    });
    assert.deepEqual(this.keys, ['ArrowDown']);

    await triggerKeyEvent(secondTarget, 'keydown', 'Enter');
    await waitUntil(() => this.keys.includes('Enter'), {
      timeoutMessage: 'Enter key should be observed by focus target handler',
    });
    assert.deepEqual(this.keys, ['ArrowDown', 'Enter']);
  });

  module('providing a header', function (hooks) {
    const HBS_WITH_HEADER = hbs`
    <div style={{html-safe (concat "width:320px; height:" this.viewportHeight "px; position:relative")}}>
      <CollectionScrollView
        @items={{this.items}}
        @estimated-width={{this.viewportWidth}}
        @estimated-height={{this.viewportHeight}}
        @buffer={{1}}
        @cell-layout={{fixed-grid-layout 320 100}}
        @revealService={{this.revealService}}
        @initialScrollTop={{this.initialScrollTop}}
      >
        <:header>
          <h1 style={{html-safe (concat "color:black;border:5px dotted red;margin-top:0px;margin-bottom:10px;font-size:1.5rem;height:" this.h1Height "px;")}}>
            This list is <em>fancy</em>!
          </h1>
        </:header>

        <:row as |item|>
          <div class="list-item" data-list-item-id={{item.id}}>
            {{item.name}}
          </div>
        </:row>
      </CollectionScrollView>
    </div>
    `;
    hooks.beforeEach(function () {
      this.set('h1Height', 180);
    });

    test('it renders the header and part of the collection at scrollTop zero', async function (assert) {
      assert.expect(8);
      this.set('initialScrollTop', 0);
      await render(HBS_WITH_HEADER);
      assert.dom(SCROLL_CONTAINER).containsText('This list is fancy');
      await waitUntilText('One');
      assert.dom(SCROLL_CONTAINER).containsText('One');
      assertDoNotOverlap(
        assert,
        `${SCROLL_CONTAINER} h1`,
        `[data-list-item-id="${this.items[0].id}"]`,
      );
      assert.dom(SCROLL_CONTAINER).containsText('Three');
      assert.dom(SCROLL_CONTAINER).containsText('Four');
      assert.dom(SCROLL_CONTAINER).doesNotContainText('Seven');
      assert.dom(SCROLL_CONTAINER).doesNotContainText('Eight');
      assert.equal(scrollPosition(find(SCROLL_CONTAINER)), 0);
    });

    test('it renders the end of the collection at scrollTop 720', async function (assert) {
      assert.expect(9);
      this.set('initialScrollTop', 720);
      await render(HBS_WITH_HEADER);
      await waitUntilText('Ten');
      assert.dom(SCROLL_CONTAINER).doesNotContainText('One');
      assert.dom(SCROLL_CONTAINER).doesNotContainText('Two');
      assert.dom(SCROLL_CONTAINER).doesNotContainText('Three');
      assert.dom(SCROLL_CONTAINER).containsText('Six');
      assert.dom(SCROLL_CONTAINER).containsText('Seven');
      assert.dom(SCROLL_CONTAINER).containsText('Eight');
      assert.dom(SCROLL_CONTAINER).containsText('Nine');
      assert.dom(SCROLL_CONTAINER).containsText('Ten');
      assert.close(scrollPosition(find(SCROLL_CONTAINER)), -719, 1);
    });

    test('it renders part of the header and the beginning of the collection at scrollTop 180', async function (assert) {
      assert.expect(9);
      this.set('initialScrollTop', 180);
      await render(HBS_WITH_HEADER);
      assert.dom(SCROLL_CONTAINER).containsText('This list is fancy');
      await waitUntilText('One');
      assert.dom(SCROLL_CONTAINER).containsText('One');
      assertDoNotOverlap(
        assert,
        `${SCROLL_CONTAINER} h1`,
        `[data-list-item-id="${this.items[0].id}"]`,
      );
      assert.dom(SCROLL_CONTAINER).containsText('Three');
      assert.dom(SCROLL_CONTAINER).containsText('Four');
      assert.dom(SCROLL_CONTAINER).containsText('Five');
      assert.dom(SCROLL_CONTAINER).doesNotContainText('Eight');
      assert.dom(SCROLL_CONTAINER).doesNotContainText('Nine');
      await waitUntil(() => scrollPosition(find(SCROLL_CONTAINER)) === -180);
      assert.equal(scrollPosition(find(SCROLL_CONTAINER)), -180);
    });

    test('it adjusts when the headerHeight changes', async function (assert) {
      assert.expect(14);
      this.set('initialScrollTop', 0);
      this.set('h1Height', 380);
      await render(HBS_WITH_HEADER);
      assert.dom(SCROLL_CONTAINER).containsText('This list is fancy');
      await waitFor(ITEMS_CONTAINER);
      assert.strictEqual(find(ITEMS_CONTAINER).offsetHeight, 1000);
      assertDoNotOverlap(
        assert,
        `${SCROLL_CONTAINER} h1`,
        `[data-list-item-id="${this.items[0].id}"]`,
      );
      assert.dom(SCROLL_CONTAINER).containsText('One');
      assert.dom(SCROLL_CONTAINER).containsText('Three');
      assert.dom(SCROLL_CONTAINER).doesNotContainText('Four');
      this.set('h1Height', 80);
      assertDoNotOverlap(
        assert,
        `${SCROLL_CONTAINER} h1`,
        `[data-list-item-id="${this.items[0].id}"]`,
      );
      assert.strictEqual(find(ITEMS_CONTAINER).offsetHeight, 1000);
      assert.dom(SCROLL_CONTAINER).containsText('One');
      assert.dom(SCROLL_CONTAINER).containsText('Three');
      await waitUntilText('Four');
      assert.dom(SCROLL_CONTAINER).containsText('Four');
      assert.dom(SCROLL_CONTAINER).containsText('Five');
      assert.dom(SCROLL_CONTAINER).doesNotContainText('Seven');
      assert.dom(SCROLL_CONTAINER).doesNotContainText('Eight');
    });
  });
});
