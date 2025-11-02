import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { find, render } from '@ember/test-helpers';
import { waitForOpacity } from '../../helpers/scrolling';

module('Integration | Component | vertical-scroll-bar', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.set('scrollerHeight', 484);
    this.set('contentHeight', 1000);
    this.callbacks = [];
    this.registerCallback = (callback) => {
      this.callbacks.push(callback);
    };
    this.simulateCallback = (isScrolling, scrollTop) => {
      this.callbacks.forEach(function (callback) {
        callback(isScrolling, scrollTop);
      });
    };
    this.set('scrollTop', 0);
    this.set('isScrolling', false);
    this.set('verticalPadding', 2);
  });
  const EXAMPLE_1_HBS = hbs`
    {{!-- template-lint-disable no-forbidden-elements --}}
    <style>
      .VerticalScrollBar {
        position: absolute;
        bottom: {{this.verticalPadding}}px;
        top: {{this.verticalPadding}}px;
        width: 5px;
        right: 2px;
      }
    </style>
    <div style={{html-safe (concat 'width:320px; height:' this.scrollerHeight 'px; position:relative; border: 1px solid blue')}}>
      <VerticalScrollBar
        @contentHeight={{this.contentHeight}}
        @scrollerHeight={{this.scrollerHeight}}
        @registerWithScrollView={{this.registerCallback}}
      />
    </div>
  `;
  const THUMB = '[data-test-thumb]';

  function thumbPosition() {
    let element = find(THUMB);
    if (!element) {
      return 0;
    }
    let transform =
      element.style.transform || window.getComputedStyle(element).transform;
    if (!transform || transform === 'none') {
      return 0;
    }
    let translateMatch = transform.match(/translateY\(([-\d.]+)px\)/);
    if (translateMatch) {
      return Math.round(parseFloat(translateMatch[1]));
    }
    if (transform.startsWith('matrix')) {
      let values = transform
        .replace('matrix(', '')
        .replace(')', '')
        .split(',')
        .map((value) => parseFloat(value.trim()));
      if (values.length === 6) {
        return Math.round(values[5]);
      }
    }
    return 0;
  }

  function thumbSize() {
    return find(THUMB).offsetHeight;
  }

  test('it renders with a thumb size proportional to content ratio', async function (assert) {
    await render(EXAMPLE_1_HBS);
    this.simulateCallback(true, 100);
    assert.close(thumbSize(), 232, 1);
    assert.equal(thumbPosition(), 48);
    assert.equal(find(THUMB).style.opacity, '1');
  });

  test('it renders full-size when contentHeight is less than scrollerHeight', async function (assert) {
    this.set('contentHeight', 100);
    await render(EXAMPLE_1_HBS);
    this.simulateCallback(true, 5);
    this.simulateCallback(true, 0);
    assert.close(thumbSize(), 479, 1);
    assert.equal(thumbPosition(), 0);
    assert.equal(find(THUMB).style.opacity, '1');
  });

  test('it has 0 opacity when not scrolling', async function (assert) {
    await render(EXAMPLE_1_HBS);
    assert.equal(find(THUMB).style.opacity, '0');
  });

  test('it has a minimum scrollbar length', async function (assert) {
    this.set('contentHeight', 100000);
    await render(EXAMPLE_1_HBS);
    this.simulateCallback(true, 100);
    assert.close(thumbSize(), 15, 1);
  });

  test('thumb is visible when isScrolling is true', async function (assert) {
    await render(EXAMPLE_1_HBS);
    this.simulateCallback(true, 10);
    assert.equal(find(THUMB).style.opacity, '1');
    this.simulateCallback(false, 10);
    await waitForOpacity(THUMB, '0');

    assert.equal(find(THUMB).style.opacity, '0');
  });

  test('compresses scrollbar when overscrolled at top', async function (assert) {
    await render(EXAMPLE_1_HBS);
    this.simulateCallback(true, -100);
    assert.equal(thumbPosition(), 0, 'thumb is at top');
    assert.close(thumbSize(), 193, 1, 'thumb height is compressed');
  });

  test('compresses scrollbar when overscrolled at bottom', async function (assert) {
    await render(EXAMPLE_1_HBS);
    this.simulateCallback(true, 650);
    assert.close(thumbSize(), 183, 1, 'thumb height is compressed');
    assert.equal(thumbPosition(), 298, 'thumb is at bottom');
  });

  test('compresses scrollbar when overscrolled at top, short content', async function (assert) {
    this.set('contentHeight', 300);
    await render(EXAMPLE_1_HBS);
    this.simulateCallback(true, -100);
    assert.equal(thumbPosition(), 0, 'thumb is at top');
    assert.close(thumbSize(), 398, 1, 'thumb height is compressed');
  });

  test('compresses scrollbar when overscrolled at bottom, short content', async function (assert) {
    this.set('contentHeight', 300);
    await render(EXAMPLE_1_HBS);
    this.simulateCallback(true, 400);
    assert.close(thumbSize(), 263, 1, 'thumb height is compressed');
    assert.equal(thumbPosition(), 217, 'thumb is at bottom');
  });

  test('behavior when content is less than scrollview height', async function (assert) {
    this.set('verticalPadding', 0);
    this.set('contentHeight', 900);
    this.set('scrollerHeight', 1000);
    await render(EXAMPLE_1_HBS);

    // when scrolled past bottom by 5
    this.simulateCallback(true, 105);
    assert.close(thumbPosition(), 95, 1, 'thumb is at bottom');
    assert.close(thumbSize(), 906, 1, 'thumb is slightly compressed');

    // when scrolled past top by 5
    this.simulateCallback(true, -5);
    assert.close(thumbPosition(), 0, 1, 'thumb is at top');
    assert.close(thumbSize(), 995, 1, 'thumb is slightly compressed');

    // when scrolled past bottom by 100
    this.simulateCallback(true, 100);
    assert.close(thumbPosition(), 90, 1, 'thumb is at bottom');
    assert.close(thumbSize(), 910, 1, 'thumb is slightly compressed');

    // when scrolled past top by 100
    this.simulateCallback(true, -100);
    assert.close(thumbPosition(), 0, 1, 'thumb is at top');
    assert.close(thumbSize(), 909, 1, 'thumb is slightly compressed');
  });

  test('behavior when content is equal to scrollview height', async function (assert) {
    this.set('verticalPadding', 0);
    this.set('contentHeight', 1000);
    this.set('scrollerHeight', 1000);
    await render(EXAMPLE_1_HBS);

    // when scrolled past bottom by 5
    this.simulateCallback(true, 5);
    assert.close(thumbPosition(), 4, 1, 'thumb is at bottom');
    assert.close(thumbSize(), 996, 1, 'thumb is slightly compressed');

    // when scrolled past top by 5
    this.simulateCallback(true, -5);
    assert.close(thumbPosition(), 0, 1, 'thumb is at top');
    assert.close(thumbSize(), 995, 1, 'thumb is slightly compressed');

    // when scrolled past bottom by 100
    this.simulateCallback(true, 100);
    assert.close(thumbPosition(), 90, 1, 'thumb is at bottom');
    assert.close(thumbSize(), 910, 1, 'thumb is slightly compressed');

    // when scrolled past top by 100
    this.simulateCallback(true, -100);
    assert.close(thumbPosition(), 0, 1, 'thumb is at top');
    assert.close(thumbSize(), 909, 1, 'thumb is slightly compressed');
  });

  test('behavior when content is slightly more than scrollview height', async function (assert) {
    this.set('verticalPadding', 0);
    this.set('contentHeight', 1000);
    this.set('scrollerHeight', 900);
    await render(EXAMPLE_1_HBS);

    // when scrolled past bottom by 1
    this.simulateCallback(true, 101);
    assert.close(thumbPosition(), 90, 1, 'thumb is at bottom');
    assert.close(thumbSize(), 810, 1, 'thumb is slightly compressed');

    // when scrolled past top by 1
    this.simulateCallback(true, -1);
    assert.close(thumbPosition(), 0, 1, 'thumb is at top');
    assert.close(thumbSize(), 810, 1, 'thumb is slightly compressed');

    // when scrolled to center
    this.simulateCallback(true, 50);
    assert.close(thumbPosition(), 45, 1, 'thumb is in center');
    assert.close(thumbSize(), 811, 1, 'thumb height is not compressed');

    // when scrolled past bottom by 200
    this.simulateCallback(true, 300);
    assert.close(thumbPosition(), 237, 1, 'thumb is at bottom');
    assert.close(thumbSize(), 664, 1, 'thumb is heavily compressed');

    // when scrolled past top by 200
    this.simulateCallback(true, -200);
    assert.close(thumbPosition(), 0, 1, 'thumb is at top');
    assert.close(thumbSize(), 664, 1, 'thumb is heavily compressed');
  });

  test('behavior when content is a lot more than scrollview height', async function (assert) {
    this.set('verticalPadding', 0);
    this.set('contentHeight', 2000);
    this.set('scrollerHeight', 500);
    await render(EXAMPLE_1_HBS);

    // when scrolled past bottom by 5
    this.simulateCallback(true, 1505);
    assert.equal(thumbPosition(), 376, 'thumb is at bottom');
    assert.close(thumbSize(), 125, 1, 'thumb is slightly compressed');

    // when scrolled past top by 5
    this.simulateCallback(true, -5);
    assert.equal(thumbPosition(), 0, 'thumb is at top');
    assert.close(thumbSize(), 125, 1, 'thumb is slightly compressed');

    // when scrolled to center
    this.simulateCallback(true, 750);
    assert.close(thumbPosition(), 187, 1, 'thumb is in center');
    assert.close(thumbSize(), 126, 1, 'thumb height is not compressed');

    // when scrolled past bottom by 100
    this.simulateCallback(true, 1600);
    assert.close(thumbPosition(), 395, 1, 'thumb is at bottom');
    assert.close(thumbSize(), 105, 1, 'thumb is heavily compressed');

    // when scrolled past top by 100
    this.simulateCallback(true, -100);
    assert.equal(thumbPosition(), 0, 'thumb is at top');
    assert.close(thumbSize(), 105, 1, 'thumb is heavily compressed');

    // when scrolled past bottom by 500
    this.simulateCallback(true, 2000);
    assert.close(thumbPosition(), 437, 1, 'thumb is at bottom');
    assert.close(thumbSize(), 63, 1, 'thumb is small');

    // when scrolled past top by 500
    this.simulateCallback(true, -500);
    assert.equal(thumbPosition(), 0, 'thumb is at top');
    assert.close(thumbSize(), 63, 1, 'thumb is small');
  });

  test('calculations update when scrollerHeight changes', async function (assert) {
    this.set('verticalPadding', 0);
    this.set('contentHeight', 2000);
    this.set('scrollerHeight', 500);
    await render(EXAMPLE_1_HBS);

    this.simulateCallback(true, 750);
    assert.close(thumbPosition(), 187, 1, 'thumb is in center');
    assert.close(thumbSize(), 126, 1, 'thumb height is not compressed');

    this.set('scrollerHeight', 1000);

    this.simulateCallback(true, 750);
    assert.close(thumbPosition(), 375, 1, 'thumb is in center');
    assert.close(thumbSize(), 501, 1, 'thumb height is not compressed');
  });
});
