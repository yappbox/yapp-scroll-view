import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { find, settled, waitFor } from '@ember/test-helpers';
import { scrollPosition, scrollDown } from '../../helpers/scrolling';
import RSVP from 'rsvp';

const SCROLL_CONTAINER = '[data-test-scroll-container]';

module('Integration | Component | loading-scroll-view', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('viewportHeight', 480);
    this.set('isMoreLoaded', false);
    this.set('isLoadingMore', false);
    this.set('hasMore', false);
    this.set('loadMore', function(){});
  });
  const EXAMPLE_1_HBS = hbs`
    <div style={{-html-safe (concat "width:320px; height:" viewportHeight "px; position:relative")}}>
      <LoadingScrollView
          @hasMore={{hasMore}}
          @isLoadingMore={{isLoadingMore}}
          @loadMore={{loadMore}}
        as |scrollViewApi|
      >
        <div id="element1" style="width:320px;height:200px">One</div>
        <div style="width:320px;height:200px">Two</div>
        <div style="width:320px;height:200px">Three</div>
        <div style="width:320px;height:200px">Four</div>
        <div style="width:320px;height:200px">Five</div>
        {{#if isMoreLoaded}}
          <div id="element6" style="width:320px;height:200px">Six</div>
          <div style="width:320px;height:200px">Seven</div>
          <div style="width:320px;height:200px">Eight</div>
          <div style="width:320px;height:200px">Nine</div>
          <div style="width:320px;height:200px">Ten</div>
        {{/if}}
      </LoadingScrollView>
    </div>
  `;

  test('it renders', async function(assert) {
    this.render(EXAMPLE_1_HBS);
    await waitFor('.ScrollView');
    assert.dom(SCROLL_CONTAINER).containsText('Five');
    assert.dom(SCROLL_CONTAINER).doesNotContainText('Six');
    assert.equal(scrollPosition(find(SCROLL_CONTAINER)), 0);
  });

  test('it does not load more when scrolled down if hasMore is false', async function(assert) {
    assert.expect(0);
    this.set('hasMore', false);
    this.set('loadMore', function() {
      assert.ok(false, 'should not invoke loadMore');
    });
    await this.render(EXAMPLE_1_HBS);
    await scrollDown('.ScrollView #element1', {
      amount: 500,
      duration: 300
    });
  });

  test('it loads more when scrolled down if hasMore is true', async function(assert) {
    this.set('hasMore', true);
    this.set('loadMore', () => {
      this.set('isMoreLoaded', true);
      return RSVP.resolve();
    });
    await this.render(EXAMPLE_1_HBS);
    await scrollDown('.ScrollView #element1', {
      amount: 500,
      duration: 300
    });
    assert.dom(SCROLL_CONTAINER).containsText('Five');
    await settled();
    assert.dom(SCROLL_CONTAINER).containsText('Ten');
    await scrollDown('.ScrollView #element6', {
      amount: 500,
      duration: 300
    });
    assert.ok(
      scrollPosition(find(SCROLL_CONTAINER)) < -1000,
      'can scroll down below previous boundary'
    );
  });

  test('it does not reinvoke loadMore when isLoadingMore is true', async function(assert) {
    this.set('hasMore', true);
    let loadMoreInvocationCount = 0;
    this.set('loadMore', () => {
      loadMoreInvocationCount++;
      this.set('isLoadingMore', true);
    });
    await this.render(EXAMPLE_1_HBS);
    await scrollDown('.ScrollView #element1', {
      amount: 500,
      duration: 300
    });
    await settled();
    await scrollDown('.ScrollView #element1', {
      amount: -500,
      duration: 300
    });
    await settled();
    await scrollDown('.ScrollView #element1', {
      amount: 500,
      duration: 300
    });
    await settled();
    assert.equal(loadMoreInvocationCount, 1, 'only invokes loadMore once');
  });
});
