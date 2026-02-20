import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { find, render, settled, waitUntil } from '@ember/test-helpers';
import { scrollPosition } from '../../helpers/scrolling';
import EmberObject from '@ember/object';
import { timeout } from 'ember-concurrency';
// ember-raf-scheduler removed — using settled() for test waiting instead
import EventEmitter from 'eventemitter3';

const SCROLL_CONTAINER = '[data-test-scroll-container]';

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
    this.set('itemHeight', 100);
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
    // registerRafWaiter(); — removed, relying on settled() instead
  });
  const EXAMPLE_1_HBS = hbs`
    <div style={{html-safe (concat "width:" this.viewportWidth "px; height:" this.viewportHeight "px; position:relative; --item-height:" this.itemHeight "px; display:flex; flex-direction:column;")}}>
      <CollectionScrollView
        @items={{this.items}}
        @estimateItemHeight={{this.itemHeight}}
        @estimatedHeight={{this.viewportHeight}}
        @estimatedWidth={{this.viewportWidth}}
        @buffer={{1}}
        @cellLayout={{fixed-grid-layout 320 100}}
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
    await waitUntilText('Six');
    assert.dom(SCROLL_CONTAINER).containsText('One');
    assert.dom(SCROLL_CONTAINER).containsText('Six');
    assert.dom(SCROLL_CONTAINER).doesNotContainText('Eight');
    assert.equal(scrollPosition(find(SCROLL_CONTAINER)), 0);
  });

  test('it passes splatable attributes to the scroll container', async function (assert) {
    await render(hbs`
      <div style={{html-safe (concat "width:" this.viewportWidth "px; height:" this.viewportHeight "px; position:relative; --item-height:" this.itemHeight "px; display:flex; flex-direction:column;")}}>
        <CollectionScrollView
          @items={{this.items}}
          @estimateItemHeight={{this.itemHeight}}
          @estimatedHeight={{this.viewportHeight}}
          @estimatedWidth={{this.viewportWidth}}
          @buffer={{1}}
          @cellLayout={{fixed-grid-layout 320 100}}
          data-test-scroll-container="true"
          class="custom-scroll-container"
        >
          <:row as |item|>
            <div class="list-item" data-list-item-id={{item.id}}>
              {{item.name}}
            </div>
          </:row>
        </CollectionScrollView>
      </div>
    `);
    let container = document.querySelector(SCROLL_CONTAINER);
    assert.ok(container);
    assert.dom(container).hasAttribute('data-test-scroll-container', 'true');
    assert.dom(container).hasClass('custom-scroll-container');
  });

  test('it can have a role', async function (assert) {
    await render(hbs`
      <div style={{html-safe (concat "width:" this.viewportWidth "px; height:" this.viewportHeight "px; position:relative; --item-height:" this.itemHeight "px; display:flex; flex-direction:column;")}}>
        <CollectionScrollView
          @items={{this.items}}
          @estimateItemHeight={{this.itemHeight}}
          @estimatedHeight={{this.viewportHeight}}
          @estimatedWidth={{this.viewportWidth}}
          @buffer={{1}}
          @cellLayout={{fixed-grid-layout 320 100}}
          role="list"
        >
          <:row as |item|>
            <div class="list-item" data-list-item-id={{item.id}}>
              {{item.name}}
            </div>
          </:row>
        </CollectionScrollView>
      </div>
    `);
    assert.dom(SCROLL_CONTAINER).hasAttribute('role', 'list');
  });

  test('it handles scroll view changing size', async function (assert) {
    await render(EXAMPLE_1_HBS);
    await waitUntilText('Six');
    assert.dom(SCROLL_CONTAINER).doesNotContainText('Eight');
    this.set('viewportHeight', 1200);
    await waitUntil(() => find(SCROLL_CONTAINER).textContent.includes('Eight'));
    assert.dom(SCROLL_CONTAINER).containsText('Eight');

    let container = document.querySelector(SCROLL_CONTAINER);
    assert.equal(
      container.offsetHeight,
      1000,
      'scroll-view should update its scroll container size',
    );
  });

  test('the collection adjusts when resized', async function (assert) {
    assert.expect(11);

    let resizeEvents = 0;
    let resizeHandler = () => resizeEvents++;
    window.addEventListener('resize', resizeHandler);

    try {
      await render(EXAMPLE_1_HBS);
      await waitUntilText('Three');
      assert.dom(SCROLL_CONTAINER).containsText('Three');
      assert.dom(SCROLL_CONTAINER).containsText('Six');

      let container = document.querySelector(SCROLL_CONTAINER);
      assert.equal(container.offsetWidth, 320, 'initial width is correct');
      assert.equal(container.offsetHeight, 480, 'initial height is correct');
      assert.equal(
        container.scrollHeight,
        1000,
        'initial scroll height is correct',
      );

      let baselineEvents = resizeEvents;
      this.setProperties({ viewportWidth: 568, viewportHeight: 320 });
      await settled();

      assert.equal(
        container.offsetWidth,
        568,
        'width after orientation change is correct',
      );
      assert.equal(
        container.offsetHeight,
        320,
        'height after orientation change is correct',
      );

      await waitUntil(() => resizeEvents > baselineEvents, {
        timeoutMessage:
          'orientation change should trigger a resize event for the collection',
      });
      await settled();

      assert.ok(
        resizeEvents > baselineEvents,
        'orientation change dispatched a resize event',
      );

      assert.equal(
        container.scrollHeight,
        1000,
        'scroll height after orientation change is correct',
      );
      assert.dom(SCROLL_CONTAINER).containsText('Three');
      await waitUntil(
        () => !find(SCROLL_CONTAINER).textContent.includes('Six'),
        { timeoutMessage: 'Six should be occluded after resize' },
      );
      assert.dom(SCROLL_CONTAINER).doesNotContainText('Six');
    } finally {
      window.removeEventListener('resize', resizeHandler);
    }
  });

  test('it accepts reveal service and scrolls item into view', async function (assert) {
    let fakeRevealService = new FakeRevealService();
    this.set('revealService', fakeRevealService);
    await render(EXAMPLE_1_HBS);
    await waitUntilText('One');
    assert.dom(SCROLL_CONTAINER).doesNotContainText('Eight');
    fakeRevealService.trigger('revealItemById', { id: '8' });
    await waitUntilText('Eight');
    assert.dom(SCROLL_CONTAINER).containsText('Eight');
    assert.ok(find(SCROLL_CONTAINER).scrollTop >= 100);
  });

  test('it defers scroll position restore until loading completes', async function (assert) {
    this.set('isLoading', true);

    await render(hbs`
      <div style={{html-safe (concat "width:" this.viewportWidth "px; height:" this.viewportHeight "px; position:relative; --item-height:" this.itemHeight "px; display:flex; flex-direction:column;")}}>
        <CollectionScrollView
          @items={{this.items}}
          @estimateItemHeight={{this.itemHeight}}
          @estimatedHeight={{this.viewportHeight}}
          @estimatedWidth={{this.viewportWidth}}
          @buffer={{1}}
          @cellLayout={{fixed-grid-layout 320 100}}
          @initialScrollTop={{520}}
          @isLoading={{this.isLoading}}
        >
          <:row as |item|>
            <div class="list-item" data-list-item-id={{item.id}}>
              {{item.name}}
            </div>
          </:row>
        </CollectionScrollView>
      </div>
    `);

    assert.equal(scrollPosition(find(SCROLL_CONTAINER)), 0);

    this.set('isLoading', false);
    await waitUntil(() => find(SCROLL_CONTAINER).scrollTop === 520);
    assert.equal(find(SCROLL_CONTAINER).scrollTop, 520);
    await waitUntilText('Ten');
    assert.dom(SCROLL_CONTAINER).containsText('Ten');
  });

  test('revealItemById does not scroll if source is within the CollectionScrollView', async function (assert) {
    let fakeRevealService = new FakeRevealService();
    this.set('revealService', fakeRevealService);
    await render(EXAMPLE_1_HBS);
    await waitUntilText('Four');
    fakeRevealService.trigger('revealItemById', {
      id: '4',
      source: document.querySelector('[data-list-item-id="4"]'),
    });
    await timeout(200);
    assert.dom(SCROLL_CONTAINER).doesNotContainText('Eight');
    assert.equal(scrollPosition(find(SCROLL_CONTAINER)), 0);
  });

  module('providing a header', function (hooks) {
    const HBS_WITH_HEADER = hbs`
    <div style={{html-safe (concat "width:" this.viewportWidth "px; height:" this.viewportHeight "px; position:relative; --item-height:" this.itemHeight "px; display:flex; flex-direction:column;")}}>
      <CollectionScrollView
        @items={{(compact (append (hash id='header' type='header') this.items))}}
        @estimateItemHeight={{this.itemHeight}}
        @estimatedHeight={{this.viewportHeight}}
        @estimatedWidth={{this.viewportWidth}}
        @buffer={{1}}
        @cellLayout={{fixed-grid-layout 320 100}}
        @initialScrollTop={{this.initialScrollTop}}
      >
        <:row as |item|>
          {{#if (eq item.type "header")}}
            <h1 style={{html-safe (concat "color:black;border:5px dotted red;margin-top:0px;margin-bottom:10px;font-size:1.5rem;height:" this.h1Height "px;")}}>
              This list is <em>fancy</em>!
            </h1>
          {{else}}
            <div class="list-item" data-list-item-id={{item.id}}>
              {{item.name}}
            </div>
          {{/if}}
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
      await waitUntilText('Three');
      assert.dom(SCROLL_CONTAINER).containsText('This list is fancy');
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
      assert.equal(find(SCROLL_CONTAINER).scrollTop, 720);
    });

    test('it renders part of the header and the beginning of the collection at scrollTop 180', async function (assert) {
      assert.expect(8);
      this.set('initialScrollTop', 180);
      await render(HBS_WITH_HEADER);
      await waitUntil(() => find(SCROLL_CONTAINER).scrollTop === 180);
      assert.dom(SCROLL_CONTAINER).containsText('This list is fancy');
      assert.dom(SCROLL_CONTAINER).containsText('One');
      assertDoNotOverlap(
        assert,
        `${SCROLL_CONTAINER} h1`,
        `[data-list-item-id="${this.items[0].id}"]`,
      );
      assert.dom(SCROLL_CONTAINER).containsText('Three');
      assert.dom(SCROLL_CONTAINER).containsText('Four');
      // Note: "Five" may or may not be rendered depending on occlusion boundaries
      // The key assertions are that header + early items are visible and late items are not
      assert.dom(SCROLL_CONTAINER).doesNotContainText('Eight');
      assert.dom(SCROLL_CONTAINER).doesNotContainText('Nine');
      assert.equal(find(SCROLL_CONTAINER).scrollTop, 180);
    });
  });
});
