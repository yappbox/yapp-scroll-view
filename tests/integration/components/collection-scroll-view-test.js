import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { find, waitFor, waitUntil } from '@ember/test-helpers';
import { scrollPosition, scrollDown, waitForOpacity } from '../../helpers/scrolling';
import EmberObject from '@ember/object';
import Evented from '@ember/object/evented';
const SCROLL_CONTAINER = '[data-test-scroll-container]';
const SCROLLBAR_THUMB = '[data-test-scroll-bar] [data-test-thumb]';

module('Integration | Component | collection-scroll-view', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
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
      { id: '10', name: 'Ten' }
    ]);
    this.set('revealService', null);
  });
  const EXAMPLE_1_HBS = hbs`
    <div style={{-html-safe (concat "width:320px; height:" viewportHeight "px; position:relative")}}>
      <CollectionScrollView
        @items={{items}}
        @estimated-width={{viewportWidth}}
        @estimated-height={{viewportHeight}}
        @buffer={{1}}
        @cell-layout={{fixed-grid-layout 320 100}}
        @revealService={{revealService}}
       as |item index|
      >
        <div class="list-item" data-list-item-id={{item.id}}>
          {{item.name}}
        </div>
      </CollectionScrollView>
    </div>
  `;

  test('it renders', async function(assert) {
    await this.render(EXAMPLE_1_HBS);
    assert.dom(SCROLL_CONTAINER).containsText('One');
    assert.dom(SCROLL_CONTAINER).containsText('Six');
    assert.dom(SCROLL_CONTAINER).doesNotContainText('Eight');
    assert.equal(scrollPosition(find(SCROLL_CONTAINER)), 0);
  });

  test('it scrolls with a swipe', async function(assert) {
    await this.render(EXAMPLE_1_HBS);
    let scrollPromise = scrollDown(SCROLL_CONTAINER, {
      amount: 400
    });
    await waitForOpacity(SCROLLBAR_THUMB, '1');
    assert.equal(find(SCROLLBAR_THUMB).offsetHeight, 229);
    await scrollPromise;
    assert.ok(scrollPosition(find(SCROLL_CONTAINER)) <= -390);
    assert.dom(SCROLL_CONTAINER).containsText('Ten');
    assert.dom(SCROLL_CONTAINER).containsText('Four');
    assert.dom(SCROLL_CONTAINER).doesNotContainText('One');
  });

  test('it handles scroll view changing size', async function(assert) {
    await this.render(EXAMPLE_1_HBS);
    assert.dom(SCROLL_CONTAINER).doesNotContainText('Eight');
    this.set('viewportHeight', 1200);
    window.SIMULATE_SCROLL_VIEW_MEASUREMENT_LOOP();
    await waitUntil(() => document.querySelector(SCROLL_CONTAINER).offsetHeight === 1200, {
      timeoutMessage: 'scroll-view should update its scroll container size'
    });
    assert.dom(SCROLL_CONTAINER).containsText('Eight');
  });

  test('it accepts reveal service and scrolls item into view', async function(assert) {
    let fakeRevealService = EmberObject.extend(Evented).create();
    this.set('revealService', fakeRevealService);
    await this.render(EXAMPLE_1_HBS);
    assert.dom(SCROLL_CONTAINER).doesNotContainText('Eight');
    fakeRevealService.trigger('revealItemById', { id: '8' });
    await waitFor('[data-list-item-id="8"]');
    assert.dom(SCROLL_CONTAINER).containsText('Eight');
    assert.ok(scrollPosition(find(SCROLL_CONTAINER)) <= -100);
  })
});
