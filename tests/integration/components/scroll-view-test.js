import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { click, find, waitFor, waitUntil } from '@ember/test-helpers';
import { panY } from '../../helpers/yapp-test-support/gestures';
import RSVP from 'rsvp';
import { timeout } from 'ember-concurrency';
import { setupTestRequiringBrowserFocus } from '../../helpers/yapp-test-support';

const SCROLL_CONTAINER = '[data-test-scroll-container]';
const SCROLLBAR_THUMB = '[data-test-scroll-bar] [data-test-thumb]';

module('Integration | Component | scroll-view', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('onClickLink', function(){});
    this.set('viewportHeight', 480);
    this.set('element3', null);
  });
  const EXAMPLE_1_HBS = hbs`
    <div style={{-html-safe (concat "width:320px; height:" viewportHeight "px; position:relative")}}>
      <ScrollView as |scrollViewApi|>
        <div id="element1" style="width:320px;height:200px">
          One
          <button
            onclick={{action scrollViewApi.scrollToBottom}}
            data-test-scroll-to-bottom-button
          >
            Scroll to Bottom
          </button>
          <button
            onclick={{action scrollViewApi.scrollToElement element3}}
            data-test-scroll-to-element-button
          >
            Scroll to Element 3
          </button>
        </div>
        <div style="width:320px;height:200px">Two</div>
        <div id="element3" style="width:320px;height:200px">Three</div>
        <a {{action onClickLink}} data-test-link style="display:block;width:320px;height:200px">Four</a>
        <div style="width:320px;height:200px">
          Five
          <button
            onclick={{action scrollViewApi.scrollToTop}}
            data-test-scroll-to-top-button
          >
            Scroll to Top
          </button>
        </div>
      </ScrollView>
      </div>
  `;


  function scrollPosition(element) {
    let { transform } = element.style;
    return new window.WebKitCSSMatrix(transform).m42;
  }

  test('it renders', async function(assert) {
    this.render(EXAMPLE_1_HBS);
    await waitFor('.ScrollView');
    assert.dom('.ScrollView').containsText('One');
    assert.dom(SCROLL_CONTAINER).containsText('One');
    assert.equal(scrollPosition(find(SCROLL_CONTAINER)), 0);
  });

  test('it scrolls with a swipe', async function(assert) {
    await this.render(EXAMPLE_1_HBS);
    let panYPromise = panY(find('.ScrollView #element1'), {
      position: [10, 50],
      amount: 200,
      duration: 400
    });
    await waitUntil(() => {
      return find(SCROLLBAR_THUMB).style.opacity === '1';
     });
    assert.equal(find(SCROLLBAR_THUMB).offsetHeight, 227);
    await panYPromise;
    assert.ok(scrollPosition(find(SCROLL_CONTAINER)) <= -190);
  });

  test('it shows the scrollbar until the user releases their finger', async function(assert) {
    await this.render(EXAMPLE_1_HBS);
    let mouseUpDeferred = RSVP.defer();
    panY(find('.ScrollView'), {
      position: [10, 50],
      amount: 200,
      duration: 400,
      waitForMouseUp: mouseUpDeferred.promise
    });
    await waitUntil(() => {
      return scrollPosition(find(SCROLL_CONTAINER)) <= -190;
     });
    assert.equal(find(SCROLLBAR_THUMB).style.opacity, '1', 'scrollbar visible while still touching');
    await timeout(100);
    mouseUpDeferred.resolve();
    await waitUntil(() => {
      return find(SCROLLBAR_THUMB).style.opacity === '0';
     });
    assert.equal(find(SCROLLBAR_THUMB).style.opacity, '0', 'scrollbar hides after no longer touching');
  });

  test('it renders content with height less than the height of the scroll container OK', async function(assert) {
    await this.render(hbs`
      <div style="width:320px; height:480px; position:relative">
        <ScrollView>
          <div style="width:320px;height:200px">One</div>
        </ScrollView>
      </div>
    `);
    assert.equal(find(SCROLL_CONTAINER).offsetHeight, 480);
    assert.equal(find('[data-test-scroll-bar]').offsetHeight, 476);
  });

  test('when scroll-view changes size, it scrolling behavior follows suit', async function(assert) {
    await this.render(EXAMPLE_1_HBS);

    this.set('viewportHeight', 1200);
    window.SIMULATE_SCROLL_VIEW_MEASUREMENT_LOOP();
    await waitUntil(() => document.querySelector(SCROLL_CONTAINER).offsetHeight === 1200, {
      timeoutMessage: 'scroll-view should update its scroll container size'
    });
    assert.equal(find('[data-test-scroll-bar]').offsetHeight, 1196, 'scrollbar height is correct');
    await panY(find('.ScrollView'), {
      position: [10, 50],
      amount: 100,
      duration: 200
    });
    await waitUntil(() => scrollPosition(find(SCROLL_CONTAINER)) === 0, {
      timeoutMessage: 'scroll position should bounce back to zero'
    });
  });

  test('when content height changes, it scrolling behavior follows suit', async function(assert) {
    await this.render(EXAMPLE_1_HBS);
    let el = document.createElement('div');
    el.style.height = '800px';
    el.textContent = 'Six!';
    find(SCROLL_CONTAINER).appendChild(el);
    window.SIMULATE_SCROLL_VIEW_MEASUREMENT_LOOP();
    assert.equal(find(SCROLL_CONTAINER).offsetHeight, 1800);
    assert.equal(find('[data-test-scroll-bar]').offsetHeight, 476);
    await panY(find('.ScrollView'), {
      position: [10, 50],
      amount: 1000,
      duration: 200
    });
    await waitUntil(() => scrollPosition(find(SCROLL_CONTAINER)) < -1000, {
      timeoutMessage: 'should allow scrolling to go beyond old dimensions'
    });
  });

  test('yields scrollViewApi, which provides scrollTo methods', async function(assert) {
    await this.render(EXAMPLE_1_HBS);
    this.set('element3', find('#element3'));
    await click('[data-test-scroll-to-bottom-button]');
    await waitUntil(() => scrollPosition(find(SCROLL_CONTAINER)) < -500, {
      timeoutMessage: 'should scroll to bottom'
    });
    await click('[data-test-scroll-to-top-button]');
    await waitUntil(() => scrollPosition(find(SCROLL_CONTAINER)) > -5, {
      timeoutMessage: 'should scroll to top'
    });
    await click('[data-test-scroll-to-element-button]');
    await waitUntil(() => scrollPosition(find(SCROLL_CONTAINER)) === -400, {
      timeoutMessage: 'should scroll to element'
    });

    assert.ok(true, 'Scroll buttons worked!')
  });

  test('subscribes to requestScrollToTop event on window and scrolls to top when in viewport', async function(assert) {
    await this.render(EXAMPLE_1_HBS);
    await click('[data-test-scroll-to-bottom-button]');
    await waitUntil(() => scrollPosition(find(SCROLL_CONTAINER)) < -500);
    await click(SCROLL_CONTAINER);

    let bottomScrollPos = scrollPosition(find(SCROLL_CONTAINER));
    this.element.style.transform = 'translateX(-10000px)';
    window.dispatchEvent(new Event('requestScrollToTop'));
    assert.equal(find(SCROLLBAR_THUMB).style.opacity, '0', 'scrollbar is not shown');
    await timeout(50);
    assert.equal(scrollPosition(find(SCROLL_CONTAINER)), bottomScrollPos, 'does not scroll to top');

    this.element.style.transform = 'translateX(0px)';
    window.dispatchEvent(new Event('requestScrollToTop'));
    await timeout(50);
    assert.equal(find(SCROLLBAR_THUMB).style.opacity, '1');
    await waitUntil(() => scrollPosition(find(SCROLL_CONTAINER)) > -5, {
      timeoutMessage: 'should scroll to top'
    });
    assert.ok(true, 'Scrolled to top!');
  });

  test('swiping on a textarea does not cause scrolling', async function(assert) {
    let template = hbs`
      <div style={{-html-safe (concat "width:320px; height:" viewportHeight "px; position:relative")}}>
        <ScrollView as |scrollViewApi|>
          <div style="width:320px;height:200px">
            <textarea style="width:320px;height:200px">
            </textarea>
          </div>
          <div style="width:320px;height:200px">Two</div>
          <div style="width:320px;height:200px">Three</div>
          <div style="width:320px;height:200px">Four</div>
          <div style="width:320px;height:200px">Five</div>
        </ScrollView>
        </div>
    `;
    await this.render(template);
    await panY(find('.ScrollView textarea'), {
      position: [10, 50],
      amount: 100,
      duration: 200
    });
    assert.equal(find(SCROLLBAR_THUMB).style.opacity, '0');
    assert.equal(scrollPosition(find(SCROLL_CONTAINER)), 0);
  });

  test('remembers scroll position based on key attribute', async function(assert) {
    const template = hbs`
      <div style={{-html-safe (concat "width:320px; height:" viewportHeight "px; position:relative")}}>
        <ScrollView @key={{key}}>
          <div style="width:320px;height:400px">One</div>
          <div style="width:320px;height:400px">Two</div>
        </ScrollView>
        </div>
    `
    this.set('key', 'my-scroll-view');
    await this.render(template);
    assert.equal(scrollPosition(find(SCROLL_CONTAINER)), 0);
    await panY(find('.ScrollView'), {
      position: [10, 50],
      amount: 100,
      duration: 200
    });
    await click(SCROLL_CONTAINER);
    let scrollPos = scrollPosition(find(SCROLL_CONTAINER));

    await this.render(hbs``);
    this.set('key', 'other-scroll-view');
    await this.render(template);
    assert.equal(scrollPosition(find(SCROLL_CONTAINER)), 0, 'previous scroll position is not restored when there key does not match');

    await this.render(hbs``);
    this.set('key', 'my-scroll-view');
    await this.render(template);
    assert.equal(scrollPosition(find(SCROLL_CONTAINER)), scrollPos, 'previous scroll position is restored');
  });

  module('needs focus / tempermental', function(hooks){
    setupTestRequiringBrowserFocus(hooks);

    test('when momentum scrolling, a tap stops the scroll', async function(assert) {
      await this.render(EXAMPLE_1_HBS);
      this.set('onClickLink', function(){
        assert.ok(false, 'should not activate action when tapping when scrolling');
      });
      let panYPromise = panY(find('.ScrollView'), {
        position: [10, 50],
        amount: 200,
        duration: 400
      });
      await panYPromise;
      let scrollPos = scrollPosition(find(SCROLL_CONTAINER));
      await click('[data-test-link]');
      await timeout(50);
      let newScrollPos = scrollPosition(find(SCROLL_CONTAINER));
      assert.ok(Math.abs(scrollPos - newScrollPos) < 5, 'scrolling should stop when clicked');
    });
  })
});
