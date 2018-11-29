import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { find } from '@ember/test-helpers';
import { scrollPosition, waitForOpacity } from '../../helpers/scrolling';

module('Integration | Component | vertical-scroll-bar', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('viewportHeight', 484);
    this.set('contentHeight', 1000);
    this.set('scrollTop', 0);
    this.set('isScrolling', false);
  });
  const EXAMPLE_1_HBS = hbs`
    <style>
      .VerticalScrollBar {
        position: absolute;
        bottom: 2px;
        top: 2px;
        width: 5px;
        right: 2px;
      }
    </style>
    <div style={{-html-safe (concat 'width:320px; height:' viewportHeight 'px; position:relative; border: 1px solid blue')}}>
      <VerticalScrollBar
        @contentHeight={{contentHeight}}
        @scrollTop={{scrollTop}}
        @isScrolling={{isScrolling}}
      />
    </div>
  `;
  const THUMB = '[data-test-thumb]';

  test('it renders with a thumb size proportional to content ratio', async function(assert) {
    await this.render(EXAMPLE_1_HBS);
    this.set('scrollTop', 100);
    this.set('isScrolling', true);
    assert.equal(find(THUMB).offsetHeight, 230);
    assert.equal(scrollPosition(find(THUMB)), 48);
    assert.equal(find(THUMB).style.opacity, "1");
  });

  test('it renders full-size when contentHeight is less than viewportHeight', async function(assert) {
    this.set('contentHeight', 100);
    await this.render(EXAMPLE_1_HBS);
    this.set('scrollTop', 5);
    this.set('scrollTop', 0);
    this.set('isScrolling', true);
    assert.equal(find(THUMB).offsetHeight, 480);
    assert.equal(scrollPosition(find(THUMB)), 0);
    assert.equal(find(THUMB).style.opacity, "1");
  });

  test('it has 0 opacity when not scrolling', async function(assert) {
    await this.render(EXAMPLE_1_HBS);
    assert.equal(find(THUMB).style.opacity, "0");
  });

  test('it has a minimum scrollbar length', async function(assert) {
    this.set('contentHeight', 100000);
    await this.render(EXAMPLE_1_HBS);
    this.set('scrollTop', 100);
    assert.equal(find(THUMB).offsetHeight, 15);
  });

  test('thumb is visible when isScrolling is true', async function(assert) {
    await this.render(EXAMPLE_1_HBS);
    this.set('isScrolling', true);
    assert.equal(find(THUMB).style.opacity, "1");
    this.set('isScrolling', false);
    await waitForOpacity(THUMB, '0');

    assert.equal(find(THUMB).style.opacity, "0");
  });

  test('compresses scrollbar when overscrolled at top', async function(assert) {
    await this.render(EXAMPLE_1_HBS);
    this.set('scrollTop', -100);
    assert.equal(scrollPosition(find(THUMB)), 0, 'thumb is at top');
    assert.equal(find(THUMB).offsetHeight, 158, 'thumb height is compressed');
  });

  test('compresses scrollbar when overscrolled at bottom', async function(assert) {
    await this.render(EXAMPLE_1_HBS);
    this.set('scrollTop', 650);
    assert.equal(find(THUMB).offsetHeight, 136, 'thumb height is compressed');
    assert.equal(Math.round(scrollPosition(find(THUMB))), 312, 'thumb is at bottom');
  });

  test('compresses scrollbar when overscrolled at top, short content', async function(assert) {
    this.set('contentHeight', 300);
    await this.render(EXAMPLE_1_HBS);
    this.set('scrollTop', -100);
    assert.equal(scrollPosition(find(THUMB)), 0, 'thumb is at top');
    assert.equal(find(THUMB).offsetHeight, 15, 'thumb height is compressed');
  });

  test('compresses scrollbar when overscrolled at bottom, short content', async function(assert) {
    this.set('contentHeight', 300);
    await this.render(EXAMPLE_1_HBS);
    this.set('scrollTop', 400);
    assert.equal(find(THUMB).offsetHeight, 15, 'thumb height is compressed');
    assert.equal(Math.round(scrollPosition(find(THUMB))), 465, 'thumb is at bottom');
  });
});
