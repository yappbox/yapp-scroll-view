import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { find } from '@ember/test-helpers';
import { scrollPosition, waitForOpacity } from '../../helpers/scrolling';

module('Integration | Component | vertical-scroll-bar', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('scrollerHeight', 484);
    this.set('contentHeight', 1000);
    this.callbacks = [];
    this.registerCallback= (callback) => {
      this.callbacks.push(callback);
    }
    this.simulateCallback = (isScrolling, scrollTop) => {
      this.callbacks.forEach(function(callback){
        callback(isScrolling, scrollTop);
      });
    }
    this.set('scrollTop', 0);
    this.set('isScrolling', false);
    this.set('verticalPadding', 2);
  });
  const EXAMPLE_1_HBS = hbs`
    <style>
      .VerticalScrollBar {
        position: absolute;
        bottom: {{verticalPadding}}px;
        top: {{verticalPadding}}px;
        width: 5px;
        right: 2px;
      }
    </style>
    <div style={{-html-safe (concat 'width:320px; height:' scrollerHeight 'px; position:relative; border: 1px solid blue')}}>
      <VerticalScrollBar
        @contentHeight={{contentHeight}}
        @scrollerHeight={{scrollerHeight}}
        @registerWithScrollView={{registerCallback}}
      />
    </div>
  `;
  const THUMB = '[data-test-thumb]';

  function thumbPosition() {
    return Math.floor(scrollPosition(find(THUMB)));
  }

  function thumbSize() {
    return find(THUMB).offsetHeight;
  }

  test('it renders with a thumb size proportional to content ratio', async function(assert) {
    await this.render(EXAMPLE_1_HBS);
    this.simulateCallback(true, 100);
    assert.equal(thumbSize(), 232);
    assert.equal(thumbPosition(), 48);
    assert.equal(find(THUMB).style.opacity, "1");
  });

  test('it renders full-size when contentHeight is less than scrollerHeight', async function(assert) {
    this.set('contentHeight', 100);
    await this.render(EXAMPLE_1_HBS);
    this.simulateCallback(true, 5);
    this.simulateCallback(true, 0);
    assert.equal(thumbSize(), 479);
    assert.equal(thumbPosition(), 0);
    assert.equal(find(THUMB).style.opacity, "1");
  });

  test('it has 0 opacity when not scrolling', async function(assert) {
    await this.render(EXAMPLE_1_HBS);
    assert.equal(find(THUMB).style.opacity, "0");
  });

  test('it has a minimum scrollbar length', async function(assert) {
    this.set('contentHeight', 100000);
    await this.render(EXAMPLE_1_HBS);
    this.simulateCallback(true, 100);
    assert.equal(thumbSize(), 15);
  });

  test('thumb is visible when isScrolling is true', async function(assert) {
    await this.render(EXAMPLE_1_HBS);
    this.simulateCallback(true, 10);
    assert.equal(find(THUMB).style.opacity, "1");
    this.simulateCallback(false, 10);
    await waitForOpacity(THUMB, '0');

    assert.equal(find(THUMB).style.opacity, "0");
  });

  test('compresses scrollbar when overscrolled at top', async function(assert) {
    await this.render(EXAMPLE_1_HBS);
    this.simulateCallback(true, -100);
    assert.equal(thumbPosition(), 0, 'thumb is at top');
    assert.equal(thumbSize(), 193, 'thumb height is compressed');
  });

  test('compresses scrollbar when overscrolled at bottom', async function(assert) {
    await this.render(EXAMPLE_1_HBS);
    this.simulateCallback(true, 650);
    assert.equal(thumbSize(), 182, 'thumb height is compressed');
    assert.equal(thumbPosition(), 298, 'thumb is at bottom');
  });

  test('compresses scrollbar when overscrolled at top, short content', async function(assert) {
    this.set('contentHeight', 300);
    await this.render(EXAMPLE_1_HBS);
    this.simulateCallback(true, -100);
    assert.equal(thumbPosition(), 0, 'thumb is at top');
    assert.equal(thumbSize(), 397, 'thumb height is compressed');
  });

  test('compresses scrollbar when overscrolled at bottom, short content', async function(assert) {
    this.set('contentHeight', 300);
    await this.render(EXAMPLE_1_HBS);
    this.simulateCallback(true, 400);
    assert.equal(thumbSize(), 263, 'thumb height is compressed');
    assert.equal(thumbPosition(), 217, 'thumb is at bottom');
  });

  test('behavior when content is less than scrollview height', async function(assert) {
    this.set('verticalPadding', 0);
    this.set('contentHeight', 900);
    this.set('scrollerHeight', 1000);
    await this.render(EXAMPLE_1_HBS);

    // when scrolled past bottom by 5
    this.simulateCallback(true, 105);
    assert.equal(thumbPosition(), 95, 'thumb is at bottom');
    assert.equal(thumbSize(), 905, 'thumb is slightly compressed');

    // when scrolled past top by 5
    this.simulateCallback(true, -5);
    assert.equal(thumbPosition(), 0, 'thumb is at top');
    assert.equal(thumbSize(), 994, 'thumb is slightly compressed');

    // when scrolled past bottom by 100
    this.simulateCallback(true, 100);
    assert.equal(thumbPosition(), 90, 'thumb is at bottom');
    assert.equal(thumbSize(), 909, 'thumb is slightly compressed');

    // when scrolled past top by 100
    this.simulateCallback(true, -100);
    assert.equal(thumbPosition(), 0, 'thumb is at top');
    assert.equal(thumbSize(), 908, 'thumb is slightly compressed');
  });

  test('behavior when content is equal to scrollview height', async function(assert) {
    this.set('verticalPadding', 0);
    this.set('contentHeight', 1000);
    this.set('scrollerHeight', 1000);
    await this.render(EXAMPLE_1_HBS);

    // when scrolled past bottom by 5
    this.simulateCallback(true, 5);
    assert.equal(thumbPosition(), 4, 'thumb is at bottom');
    assert.equal(thumbSize(), 995, 'thumb is slightly compressed');

    // when scrolled past top by 5
    this.simulateCallback(true, -5);
    assert.equal(thumbPosition(), 0, 'thumb is at top');
    assert.equal(thumbSize(), 994, 'thumb is slightly compressed');

    // when scrolled past bottom by 100
    this.simulateCallback(true, 100);
    assert.equal(thumbPosition(), 90, 'thumb is at bottom');
    assert.equal(thumbSize(), 909, 'thumb is slightly compressed');

    // when scrolled past top by 100
    this.simulateCallback(true, -100);
    assert.equal(thumbPosition(), 0, 'thumb is at top');
    assert.equal(thumbSize(), 908, 'thumb is slightly compressed');
  });

  test('behavior when content is slightly more than scrollview height', async function(assert) {
    this.set('verticalPadding', 0);
    this.set('contentHeight', 1000);
    this.set('scrollerHeight', 900);
    await this.render(EXAMPLE_1_HBS);

    // when scrolled past bottom by 1
    this.simulateCallback(true, 101);
    assert.equal(thumbPosition(), 90, 'thumb is at bottom');
    assert.equal(thumbSize(), 809, 'thumb is slightly compressed');

    // when scrolled past top by 1
    this.simulateCallback(true, -1);
    assert.equal(thumbPosition(), 0, 'thumb is at top');
    assert.equal(thumbSize(), 809, 'thumb is slightly compressed');

    // when scrolled to center
    this.simulateCallback(true, 50);
    assert.equal(thumbPosition(), 45, 'thumb is in center');
    assert.equal(thumbSize(), 810, 'thumb height is not compressed');

    // when scrolled past bottom by 200
    this.simulateCallback(true, 300);
    assert.equal(thumbPosition(), 237, 'thumb is at bottom');
    assert.equal(thumbSize(), 663, 'thumb is heavily compressed');

    // when scrolled past top by 200
    this.simulateCallback(true, -200);
    assert.equal(thumbPosition(), 0, 'thumb is at top');
    assert.equal(thumbSize(), 663, 'thumb is heavily compressed');
  });

  test('behavior when content is a lot more than scrollview height', async function(assert) {
    this.set('verticalPadding', 0);
    this.set('contentHeight', 2000);
    this.set('scrollerHeight', 500);
    await this.render(EXAMPLE_1_HBS);

    // when scrolled past bottom by 5
    this.simulateCallback(true, 1505);
    assert.equal(thumbPosition(), 376, 'thumb is at bottom');
    assert.equal(thumbSize(), 124, 'thumb is slightly compressed');

    // when scrolled past top by 5
    this.simulateCallback(true, -5);
    assert.equal(thumbPosition(), 0, 'thumb is at top');
    assert.equal(thumbSize(), 124, 'thumb is slightly compressed');

    // when scrolled to center
    this.simulateCallback(true, 750);
    assert.equal(thumbPosition(), 187, 'thumb is in center');
    assert.equal(thumbSize(), 125, 'thumb height is not compressed');

    // when scrolled past bottom by 100
    this.simulateCallback(true, 1600);
    assert.equal(thumbPosition(), 395, 'thumb is at bottom');
    assert.equal(thumbSize(), 104, 'thumb is heavily compressed');

    // when scrolled past top by 100
    this.simulateCallback(true, -100);
    assert.equal(thumbPosition(), 0, 'thumb is at top');
    assert.equal(thumbSize(), 104, 'thumb is heavily compressed');

    // when scrolled past bottom by 500
    this.simulateCallback(true, 2000);
    assert.equal(thumbPosition(), 437, 'thumb is at bottom');
    assert.equal(thumbSize(), 63, 'thumb is small');

    // when scrolled past top by 500
    this.simulateCallback(true, -500);
    assert.equal(thumbPosition(), 0, 'thumb is at top');
    assert.equal(thumbSize(), 63, 'thumb is small');
  });
});
