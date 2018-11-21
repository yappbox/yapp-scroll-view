import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { find, waitUntil } from '@ember/test-helpers';
import { panY } from 'yapp-test-support/test-support/helpers';

const SCROLL_CONTAINER = '[data-test-scroll-container]';
const SCROLLBAR_THUMB = '[data-test-scroll-bar] [data-test-thumb]';

module('Integration | Component | collection-scroll-view', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('viewportWidth', 320);
    this.set('viewportHeight', 480);
    this.set('items', [
      { name: 'One' },
      { name: 'Two' },
      { name: 'Three' },
      { name: 'Four' },
      { name: 'Five' },
      { name: 'Six' },
      { name: 'Seven' },
      { name: 'Eight' },
      { name: 'Nine' },
      { name: 'Ten' }
    ]);
  });
  const EXAMPLE_1_HBS = hbs`
    <div style={{-html-safe (concat "width:320px; height:" viewportHeight "px; position:relative")}}>
      <CollectionScrollView
        @items={{items}}
        @estimated-width={{viewportWidth}}
        @estimated-height={{viewportHeight}}
        @buffer={{1}}
        @cell-layout={{fixed-grid-layout 320 100}}
       as |item index|
      >
        <div class="list-item">
          {{item.name}}
        </div>
      </CollectionScrollView>
    </div>
  `;

  function scrollPosition(element) {
    let { transform } = element.style;
    return new window.WebKitCSSMatrix(transform).m42;
  }

  test('it renders', async function(assert) {
    await this.render(EXAMPLE_1_HBS);
    assert.dom(SCROLL_CONTAINER).containsText('One');
    assert.dom(SCROLL_CONTAINER).containsText('Six');
    assert.dom(SCROLL_CONTAINER).doesNotContainText('Eight');
    assert.equal(scrollPosition(find(SCROLL_CONTAINER)), 0);
  });

  test('it scrolls with a swipe', async function(assert) {
    await this.render(EXAMPLE_1_HBS);
    let panYPromise = panY(find(SCROLL_CONTAINER), {
      position: [10, 50],
      amount: 400,
      duration: 400
    });
    await waitUntil(() => {
      return find(SCROLLBAR_THUMB).style.opacity === '1';
     });
    assert.equal(find(SCROLLBAR_THUMB).offsetHeight, 227);
    await panYPromise;
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
});
