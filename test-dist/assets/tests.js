'use strict';

define("dummy/tests/helpers/scrolling", ["exports", "@ember/test-helpers", "ember-simulant-test-helpers"], function (_exports, _testHelpers, _emberSimulantTestHelpers) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.scrollDown = scrollDown;
  _exports.scrollPosition = scrollPosition;
  _exports.waitForOpacity = waitForOpacity;
  0; //eaimeta@70e063a35619d71f0,"@ember/test-helpers",0,"ember-simulant-test-helpers"eaimeta@70e063a35619d71f
  function scrollPosition(element) {
    let {
      transform
    } = element.style;
    return new window.WebKitCSSMatrix(transform).m42;
  }
  function waitForOpacity(selector, value) {
    return (0, _testHelpers.waitUntil)(() => {
      let element = (0, _testHelpers.find)(selector);
      return element && element.style.opacity === value;
    });
  }
  function scrollDown(selector, options = {}) {
    if (options.amount) {
      options.amount = options.amount * -1;
    }
    let defaultOpts = {
      position: [10, 50],
      amount: -200,
      duration: 400
    };
    options = Object.assign(defaultOpts, options);
    return (0, _emberSimulantTestHelpers.panY)((0, _testHelpers.find)(selector), options);
  }
});
define("dummy/tests/integration/components/collection-scroll-view-test", ["qunit", "ember-qunit", "@ember/test-helpers", "dummy/tests/helpers/scrolling", "@ember/object", "ember-concurrency", "ember-raf-scheduler/test-support/register-waiter", "eventemitter3", "@ember/template-factory"], function (_qunit, _emberQunit, _testHelpers, _scrolling, _object, _emberConcurrency, _registerWaiter, _eventemitter, _templateFactory) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"qunit",0,"ember-qunit",0,"@ember/test-helpers",0,"dummy/tests/helpers/scrolling",0,"@ember/object",0,"ember-concurrency",0,"ember-raf-scheduler/test-support/register-waiter",0,"eventemitter3",0,"@ember/template-factory"eaimeta@70e063a35619d71f
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  const SCROLL_CONTAINER = '[data-test-scroll-container]';
  function assertDoNotOverlap(assert, selector1, selector2) {
    let rect1 = document.querySelector(selector1).getBoundingClientRect();
    let rect2 = document.querySelector(selector2).getBoundingClientRect();
    let overlaps = rect1.right > rect2.left && rect1.left < rect2.right && rect1.bottom > rect2.top && rect1.top < rect2.bottom;
    assert.ok(!overlaps, `Expected element at ${selector1} to NOT overlap element at ${selector2} but it does`);
  }
  function waitUntilText(text) {
    return (0, _testHelpers.waitUntil)(() => (0, _testHelpers.find)(SCROLL_CONTAINER).textContent.includes(text));
  }
  class FakeRevealService extends _object.default {
    constructor(...args) {
      super(...args);
      _defineProperty(this, "events", new _eventemitter.default());
    }
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
  (0, _qunit.module)('Integration | Component | collection-scroll-view', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    hooks.beforeEach(function () {
      this.set('viewportWidth', 320);
      this.set('viewportHeight', 480);
      this.set('itemHeight', 100);
      this.set('items', [{
        id: '1',
        name: 'One'
      }, {
        id: '2',
        name: 'Two'
      }, {
        id: '3',
        name: 'Three'
      }, {
        id: '4',
        name: 'Four'
      }, {
        id: '5',
        name: 'Five'
      }, {
        id: '6',
        name: 'Six'
      }, {
        id: '7',
        name: 'Seven'
      }, {
        id: '8',
        name: 'Eight'
      }, {
        id: '9',
        name: 'Nine'
      }, {
        id: '10',
        name: 'Ten'
      }]);
      this.set('revealService', null);
      (0, _registerWaiter.default)();
    });
    const EXAMPLE_1_HBS = (0, _templateFactory.createTemplateFactory)(
    /*
      
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
      
    */
    {
      "id": "+2s6fwVR",
      "block": "[[[1,\"\\n    \"],[10,0],[15,5,[28,[37,0],[[28,[37,1],[\"width:\",[30,0,[\"viewportWidth\"]],\"px; height:\",[30,0,[\"viewportHeight\"]],\"px; position:relative; --item-height:\",[30,0,[\"itemHeight\"]],\"px; display:flex; flex-direction:column;\"],null]],null]],[12],[1,\"\\n      \"],[8,[39,2],null,[[\"@items\",\"@estimateItemHeight\",\"@estimatedHeight\",\"@estimatedWidth\",\"@buffer\",\"@cellLayout\",\"@revealService\"],[[30,0,[\"items\"]],[30,0,[\"itemHeight\"]],[30,0,[\"viewportHeight\"]],[30,0,[\"viewportWidth\"]],1,[28,[37,3],[320,100],null],[30,0,[\"revealService\"]]]],[[\"row\"],[[[[1,\"\\n          \"],[10,0],[14,0,\"list-item\"],[15,\"data-list-item-id\",[30,1,[\"id\"]]],[12],[1,\"\\n            \"],[1,[30,1,[\"name\"]]],[1,\"\\n          \"],[13],[1,\"\\n        \"]],[1]]]]],[1,\"\\n    \"],[13],[1,\"\\n  \"]],[\"item\"],false,[\"html-safe\",\"concat\",\"collection-scroll-view\",\"fixed-grid-layout\"]]",
      "moduleName": "/Users/ylm/p/yapp/yapp-scroll-view/dummy/tests/integration/components/collection-scroll-view-test.js",
      "isStrictMode": false
    });
    (0, _qunit.test)('it renders', async function (assert) {
      await (0, _testHelpers.render)(EXAMPLE_1_HBS);
      assert.dom(SCROLL_CONTAINER).containsText('One');
      assert.dom(SCROLL_CONTAINER).containsText('Six');
      assert.dom(SCROLL_CONTAINER).doesNotContainText('Eight');
      assert.equal((0, _scrolling.scrollPosition)((0, _testHelpers.find)(SCROLL_CONTAINER)), 0);
    });
    (0, _qunit.test)('it passes splatable attributes to the scroll container', async function (assert) {
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
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
          
      */
      {
        "id": "xzNidKRK",
        "block": "[[[1,\"\\n      \"],[10,0],[15,5,[28,[37,0],[[28,[37,1],[\"width:\",[30,0,[\"viewportWidth\"]],\"px; height:\",[30,0,[\"viewportHeight\"]],\"px; position:relative; --item-height:\",[30,0,[\"itemHeight\"]],\"px; display:flex; flex-direction:column;\"],null]],null]],[12],[1,\"\\n        \"],[8,[39,2],[[24,\"data-test-scroll-container\",\"true\"],[24,0,\"custom-scroll-container\"]],[[\"@items\",\"@estimateItemHeight\",\"@estimatedHeight\",\"@estimatedWidth\",\"@buffer\",\"@cellLayout\"],[[30,0,[\"items\"]],[30,0,[\"itemHeight\"]],[30,0,[\"viewportHeight\"]],[30,0,[\"viewportWidth\"]],1,[28,[37,3],[320,100],null]]],[[\"row\"],[[[[1,\"\\n            \"],[10,0],[14,0,\"list-item\"],[15,\"data-list-item-id\",[30,1,[\"id\"]]],[12],[1,\"\\n              \"],[1,[30,1,[\"name\"]]],[1,\"\\n            \"],[13],[1,\"\\n          \"]],[1]]]]],[1,\"\\n      \"],[13],[1,\"\\n    \"]],[\"item\"],false,[\"html-safe\",\"concat\",\"collection-scroll-view\",\"fixed-grid-layout\"]]",
        "moduleName": "/Users/ylm/p/yapp/yapp-scroll-view/dummy/tests/integration/components/collection-scroll-view-test.js",
        "isStrictMode": false
      }));
      let container = document.querySelector(SCROLL_CONTAINER);
      assert.ok(container);
      assert.dom(container).hasAttribute('data-test-scroll-container', 'true');
      assert.dom(container).hasClass('custom-scroll-container');
    });
    (0, _qunit.test)('it can have a role', async function (assert) {
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
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
          
      */
      {
        "id": "W3q6EJbF",
        "block": "[[[1,\"\\n      \"],[10,0],[15,5,[28,[37,0],[[28,[37,1],[\"width:\",[30,0,[\"viewportWidth\"]],\"px; height:\",[30,0,[\"viewportHeight\"]],\"px; position:relative; --item-height:\",[30,0,[\"itemHeight\"]],\"px; display:flex; flex-direction:column;\"],null]],null]],[12],[1,\"\\n        \"],[8,[39,2],[[24,\"role\",\"list\"]],[[\"@items\",\"@estimateItemHeight\",\"@estimatedHeight\",\"@estimatedWidth\",\"@buffer\",\"@cellLayout\"],[[30,0,[\"items\"]],[30,0,[\"itemHeight\"]],[30,0,[\"viewportHeight\"]],[30,0,[\"viewportWidth\"]],1,[28,[37,3],[320,100],null]]],[[\"row\"],[[[[1,\"\\n            \"],[10,0],[14,0,\"list-item\"],[15,\"data-list-item-id\",[30,1,[\"id\"]]],[12],[1,\"\\n              \"],[1,[30,1,[\"name\"]]],[1,\"\\n            \"],[13],[1,\"\\n          \"]],[1]]]]],[1,\"\\n      \"],[13],[1,\"\\n    \"]],[\"item\"],false,[\"html-safe\",\"concat\",\"collection-scroll-view\",\"fixed-grid-layout\"]]",
        "moduleName": "/Users/ylm/p/yapp/yapp-scroll-view/dummy/tests/integration/components/collection-scroll-view-test.js",
        "isStrictMode": false
      }));
      assert.dom(SCROLL_CONTAINER).hasAttribute('role', 'list');
    });
    (0, _qunit.test)('it handles scroll view changing size', async function (assert) {
      await (0, _testHelpers.render)(EXAMPLE_1_HBS);
      assert.dom(SCROLL_CONTAINER).doesNotContainText('Eight');
      this.set('viewportHeight', 1200);
      await (0, _testHelpers.settled)();
      let container = document.querySelector(SCROLL_CONTAINER);
      assert.equal(container.offsetHeight, 1000, 'scroll-view should update its scroll container size');
      await (0, _testHelpers.waitUntil)(() => (0, _testHelpers.find)(SCROLL_CONTAINER).textContent.includes('Eight'));
      assert.dom(SCROLL_CONTAINER).containsText('Eight');
    });
    (0, _qunit.test)('the collection adjusts when resized', async function (assert) {
      assert.expect(11);
      let resizeEvents = 0;
      let resizeHandler = () => resizeEvents++;
      window.addEventListener('resize', resizeHandler);
      try {
        await (0, _testHelpers.render)(EXAMPLE_1_HBS);
        assert.dom(SCROLL_CONTAINER).containsText('Three');
        assert.dom(SCROLL_CONTAINER).containsText('Six');
        let container = document.querySelector(SCROLL_CONTAINER);
        assert.equal(container.offsetWidth, 320, 'initial width is correct');
        assert.equal(container.offsetHeight, 480, 'initial height is correct');
        assert.equal(container.scrollHeight, 1000, 'initial scroll height is correct');
        let baselineEvents = resizeEvents;
        this.setProperties({
          viewportWidth: 568,
          viewportHeight: 320
        });
        await (0, _testHelpers.settled)();
        assert.equal(container.offsetWidth, 568, 'width after orientation change is correct');
        assert.equal(container.offsetHeight, 320, 'height after orientation change is correct');
        await (0, _testHelpers.waitUntil)(() => resizeEvents > baselineEvents, {
          timeoutMessage: 'orientation change should trigger a resize event for the collection'
        });
        await (0, _testHelpers.settled)();
        assert.ok(resizeEvents > baselineEvents, 'orientation change dispatched a resize event');
        assert.equal(container.scrollHeight, 1000, 'scroll height after orientation change is correct');
        assert.dom(SCROLL_CONTAINER).containsText('Three');
        assert.dom(SCROLL_CONTAINER).doesNotContainText('Six');
      } finally {
        window.removeEventListener('resize', resizeHandler);
      }
    });
    (0, _qunit.test)('it accepts reveal service and scrolls item into view', async function (assert) {
      let fakeRevealService = new FakeRevealService();
      this.set('revealService', fakeRevealService);
      await (0, _testHelpers.render)(EXAMPLE_1_HBS);
      assert.dom(SCROLL_CONTAINER).doesNotContainText('Eight');
      fakeRevealService.trigger('revealItemById', {
        id: '8'
      });
      await (0, _testHelpers.settled)();
      assert.dom(SCROLL_CONTAINER).containsText('Eight');
      assert.ok((0, _testHelpers.find)(SCROLL_CONTAINER).scrollTop >= 100);
    });
    (0, _qunit.test)('it defers scroll position restore until loading completes', async function (assert) {
      this.set('isLoading', true);
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
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
          
      */
      {
        "id": "GzRypjb/",
        "block": "[[[1,\"\\n      \"],[10,0],[15,5,[28,[37,0],[[28,[37,1],[\"width:\",[30,0,[\"viewportWidth\"]],\"px; height:\",[30,0,[\"viewportHeight\"]],\"px; position:relative; --item-height:\",[30,0,[\"itemHeight\"]],\"px; display:flex; flex-direction:column;\"],null]],null]],[12],[1,\"\\n        \"],[8,[39,2],null,[[\"@items\",\"@estimateItemHeight\",\"@estimatedHeight\",\"@estimatedWidth\",\"@buffer\",\"@cellLayout\",\"@initialScrollTop\",\"@isLoading\"],[[30,0,[\"items\"]],[30,0,[\"itemHeight\"]],[30,0,[\"viewportHeight\"]],[30,0,[\"viewportWidth\"]],1,[28,[37,3],[320,100],null],520,[30,0,[\"isLoading\"]]]],[[\"row\"],[[[[1,\"\\n            \"],[10,0],[14,0,\"list-item\"],[15,\"data-list-item-id\",[30,1,[\"id\"]]],[12],[1,\"\\n              \"],[1,[30,1,[\"name\"]]],[1,\"\\n            \"],[13],[1,\"\\n          \"]],[1]]]]],[1,\"\\n      \"],[13],[1,\"\\n    \"]],[\"item\"],false,[\"html-safe\",\"concat\",\"collection-scroll-view\",\"fixed-grid-layout\"]]",
        "moduleName": "/Users/ylm/p/yapp/yapp-scroll-view/dummy/tests/integration/components/collection-scroll-view-test.js",
        "isStrictMode": false
      }));
      assert.equal((0, _scrolling.scrollPosition)((0, _testHelpers.find)(SCROLL_CONTAINER)), 0);
      this.set('isLoading', false);
      await (0, _testHelpers.waitUntil)(() => (0, _testHelpers.find)(SCROLL_CONTAINER).scrollTop === 520);
      assert.equal((0, _testHelpers.find)(SCROLL_CONTAINER).scrollTop, 520);
      await waitUntilText('Ten');
      assert.dom(SCROLL_CONTAINER).containsText('Ten');
    });
    (0, _qunit.test)('revealItemById does not scroll if source is within the CollectionScrollView', async function (assert) {
      let fakeRevealService = new FakeRevealService();
      this.set('revealService', fakeRevealService);
      await (0, _testHelpers.render)(EXAMPLE_1_HBS);
      fakeRevealService.trigger('revealItemById', {
        id: '4',
        source: document.querySelector('[data-list-item-id="4"]')
      });
      await (0, _emberConcurrency.timeout)(200);
      assert.dom(SCROLL_CONTAINER).doesNotContainText('Eight');
      assert.equal((0, _scrolling.scrollPosition)((0, _testHelpers.find)(SCROLL_CONTAINER)), 0);
    });
    (0, _qunit.module)('providing a header', function (hooks) {
      const HBS_WITH_HEADER = (0, _templateFactory.createTemplateFactory)(
      /*
        
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
          
      */
      {
        "id": "RQ0MLjed",
        "block": "[[[1,\"\\n    \"],[10,0],[15,5,[28,[37,0],[[28,[37,1],[\"width:\",[30,0,[\"viewportWidth\"]],\"px; height:\",[30,0,[\"viewportHeight\"]],\"px; position:relative; --item-height:\",[30,0,[\"itemHeight\"]],\"px; display:flex; flex-direction:column;\"],null]],null]],[12],[1,\"\\n      \"],[8,[39,2],null,[[\"@items\",\"@estimateItemHeight\",\"@estimatedHeight\",\"@estimatedWidth\",\"@buffer\",\"@cellLayout\",\"@initialScrollTop\"],[[28,[37,3],[[28,[37,4],[[28,[37,5],null,[[\"id\",\"type\"],[\"header\",\"header\"]]],[30,0,[\"items\"]]],null]],null],[30,0,[\"itemHeight\"]],[30,0,[\"viewportHeight\"]],[30,0,[\"viewportWidth\"]],1,[28,[37,6],[320,100],null],[30,0,[\"initialScrollTop\"]]]],[[\"row\"],[[[[1,\"\\n\"],[41,[28,[37,8],[[30,1,[\"type\"]],\"header\"],null],[[[1,\"            \"],[10,\"h1\"],[15,5,[28,[37,0],[[28,[37,1],[\"color:black;border:5px dotted red;margin-top:0px;margin-bottom:10px;font-size:1.5rem;height:\",[30,0,[\"h1Height\"]],\"px;\"],null]],null]],[12],[1,\"\\n              This list is \"],[10,\"em\"],[12],[1,\"fancy\"],[13],[1,\"!\\n            \"],[13],[1,\"\\n\"]],[]],[[[1,\"            \"],[10,0],[14,0,\"list-item\"],[15,\"data-list-item-id\",[30,1,[\"id\"]]],[12],[1,\"\\n              \"],[1,[30,1,[\"name\"]]],[1,\"\\n            \"],[13],[1,\"\\n\"]],[]]],[1,\"        \"]],[1]]]]],[1,\"\\n    \"],[13],[1,\"\\n    \"]],[\"item\"],false,[\"html-safe\",\"concat\",\"collection-scroll-view\",\"compact\",\"append\",\"hash\",\"fixed-grid-layout\",\"if\",\"eq\"]]",
        "moduleName": "/Users/ylm/p/yapp/yapp-scroll-view/dummy/tests/integration/components/collection-scroll-view-test.js",
        "isStrictMode": false
      });
      hooks.beforeEach(function () {
        this.set('h1Height', 180);
      });
      (0, _qunit.test)('it renders the header and part of the collection at scrollTop zero', async function (assert) {
        assert.expect(8);
        this.set('initialScrollTop', 0);
        await (0, _testHelpers.render)(HBS_WITH_HEADER);
        assert.dom(SCROLL_CONTAINER).containsText('This list is fancy');
        await waitUntilText('One');
        assert.dom(SCROLL_CONTAINER).containsText('One');
        assertDoNotOverlap(assert, `${SCROLL_CONTAINER} h1`, `[data-list-item-id="${this.items[0].id}"]`);
        assert.dom(SCROLL_CONTAINER).containsText('Three');
        assert.dom(SCROLL_CONTAINER).containsText('Four');
        assert.dom(SCROLL_CONTAINER).doesNotContainText('Seven');
        assert.dom(SCROLL_CONTAINER).doesNotContainText('Eight');
        assert.equal((0, _scrolling.scrollPosition)((0, _testHelpers.find)(SCROLL_CONTAINER)), 0);
      });
      (0, _qunit.test)('it renders the end of the collection at scrollTop 720', async function (assert) {
        assert.expect(9);
        this.set('initialScrollTop', 720);
        await (0, _testHelpers.render)(HBS_WITH_HEADER);
        await waitUntilText('Ten');
        assert.dom(SCROLL_CONTAINER).doesNotContainText('One');
        assert.dom(SCROLL_CONTAINER).doesNotContainText('Two');
        assert.dom(SCROLL_CONTAINER).doesNotContainText('Three');
        assert.dom(SCROLL_CONTAINER).containsText('Six');
        assert.dom(SCROLL_CONTAINER).containsText('Seven');
        assert.dom(SCROLL_CONTAINER).containsText('Eight');
        assert.dom(SCROLL_CONTAINER).containsText('Nine');
        assert.dom(SCROLL_CONTAINER).containsText('Ten');
        assert.equal((0, _testHelpers.find)(SCROLL_CONTAINER).scrollTop, 720);
      });
      (0, _qunit.test)('it renders part of the header and the beginning of the collection at scrollTop 180', async function (assert) {
        assert.expect(9);
        this.set('initialScrollTop', 180);
        await (0, _testHelpers.render)(HBS_WITH_HEADER);
        assert.dom(SCROLL_CONTAINER).containsText('This list is fancy');
        await waitUntilText('One');
        assert.dom(SCROLL_CONTAINER).containsText('One');
        assertDoNotOverlap(assert, `${SCROLL_CONTAINER} h1`, `[data-list-item-id="${this.items[0].id}"]`);
        assert.dom(SCROLL_CONTAINER).containsText('Three');
        assert.dom(SCROLL_CONTAINER).containsText('Four');
        assert.dom(SCROLL_CONTAINER).containsText('Five');
        assert.dom(SCROLL_CONTAINER).doesNotContainText('Eight');
        assert.dom(SCROLL_CONTAINER).doesNotContainText('Nine');
        assert.equal((0, _testHelpers.find)(SCROLL_CONTAINER).scrollTop, 180);
      });
    });
  });
});
define("dummy/tests/integration/components/loading-scroll-view-test", ["qunit", "ember-qunit", "@ember/test-helpers", "dummy/tests/helpers/scrolling", "rsvp", "@ember/template-factory"], function (_qunit, _emberQunit, _testHelpers, _scrolling, _rsvp, _templateFactory) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"qunit",0,"ember-qunit",0,"@ember/test-helpers",0,"dummy/tests/helpers/scrolling",0,"rsvp",0,"@ember/template-factory"eaimeta@70e063a35619d71f
  const SCROLL_CONTAINER = '[data-test-scroll-container]';
  (0, _qunit.module)('Integration | Component | loading-scroll-view', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    hooks.beforeEach(function () {
      this.set('viewportHeight', 480);
      this.set('isMoreLoaded', false);
      this.set('isLoadingMore', false);
      this.set('hasMore', false);
      this.set('loadMore', function () {});
    });
    const EXAMPLE_1_HBS = (0, _templateFactory.createTemplateFactory)(
    /*
      
        {{!-- template-lint-disable no-inline-styles --}}
        <div style={{html-safe (concat "width:320px; height:" this.viewportHeight "px; position:relative")}}>
          <LoadingScrollView
              @hasMore={{this.hasMore}}
              @isLoadingMore={{this.isLoadingMore}}
              @loadMore={{this.loadMore}}
          >
            <div id="element1" style="width:320px;height:200px">One</div>
            <div style="width:320px;height:200px">Two</div>
            <div style="width:320px;height:200px">Three</div>
            <div style="width:320px;height:200px">Four</div>
            <div style="width:320px;height:200px">Five</div>
            {{#if this.isMoreLoaded}}
              <div id="element6" style="width:320px;height:200px">Six</div>
              <div style="width:320px;height:200px">Seven</div>
              <div style="width:320px;height:200px">Eight</div>
              <div style="width:320px;height:200px">Nine</div>
              <div style="width:320px;height:200px">Ten</div>
            {{/if}}
          </LoadingScrollView>
        </div>
      
    */
    {
      "id": "KIvde1Wl",
      "block": "[[[1,\"\\n\"],[1,\"    \"],[10,0],[15,5,[28,[37,0],[[28,[37,1],[\"width:320px; height:\",[30,0,[\"viewportHeight\"]],\"px; position:relative\"],null]],null]],[12],[1,\"\\n      \"],[8,[39,2],null,[[\"@hasMore\",\"@isLoadingMore\",\"@loadMore\"],[[30,0,[\"hasMore\"]],[30,0,[\"isLoadingMore\"]],[30,0,[\"loadMore\"]]]],[[\"default\"],[[[[1,\"\\n        \"],[10,0],[14,1,\"element1\"],[14,5,\"width:320px;height:200px\"],[12],[1,\"One\"],[13],[1,\"\\n        \"],[10,0],[14,5,\"width:320px;height:200px\"],[12],[1,\"Two\"],[13],[1,\"\\n        \"],[10,0],[14,5,\"width:320px;height:200px\"],[12],[1,\"Three\"],[13],[1,\"\\n        \"],[10,0],[14,5,\"width:320px;height:200px\"],[12],[1,\"Four\"],[13],[1,\"\\n        \"],[10,0],[14,5,\"width:320px;height:200px\"],[12],[1,\"Five\"],[13],[1,\"\\n\"],[41,[30,0,[\"isMoreLoaded\"]],[[[1,\"          \"],[10,0],[14,1,\"element6\"],[14,5,\"width:320px;height:200px\"],[12],[1,\"Six\"],[13],[1,\"\\n          \"],[10,0],[14,5,\"width:320px;height:200px\"],[12],[1,\"Seven\"],[13],[1,\"\\n          \"],[10,0],[14,5,\"width:320px;height:200px\"],[12],[1,\"Eight\"],[13],[1,\"\\n          \"],[10,0],[14,5,\"width:320px;height:200px\"],[12],[1,\"Nine\"],[13],[1,\"\\n          \"],[10,0],[14,5,\"width:320px;height:200px\"],[12],[1,\"Ten\"],[13],[1,\"\\n\"]],[]],null],[1,\"      \"]],[]]]]],[1,\"\\n    \"],[13],[1,\"\\n  \"]],[],false,[\"html-safe\",\"concat\",\"loading-scroll-view\",\"if\"]]",
      "moduleName": "/Users/ylm/p/yapp/yapp-scroll-view/dummy/tests/integration/components/loading-scroll-view-test.js",
      "isStrictMode": false
    });
    (0, _qunit.test)('it renders', async function (assert) {
      (0, _testHelpers.render)(EXAMPLE_1_HBS);
      await (0, _testHelpers.waitFor)('.ScrollView');
      assert.dom(SCROLL_CONTAINER).containsText('Five');
      assert.dom(SCROLL_CONTAINER).doesNotContainText('Six');
      assert.equal((0, _scrolling.scrollPosition)((0, _testHelpers.find)(SCROLL_CONTAINER)), 0);
    });
    (0, _qunit.test)('it does not load more when scrolled down if hasMore is false', async function (assert) {
      assert.expect(0);
      this.set('hasMore', false);
      this.set('loadMore', function () {
        assert.ok(false, 'should not invoke loadMore');
      });
      await (0, _testHelpers.render)(EXAMPLE_1_HBS);
      await (0, _scrolling.scrollDown)('.ScrollView #element1', {
        amount: 500,
        duration: 300
      });
    });
    (0, _qunit.test)('it loads more when scrolled down if hasMore is true', async function (assert) {
      this.set('hasMore', true);
      this.set('loadMore', () => {
        this.set('isMoreLoaded', true);
        return _rsvp.default.resolve();
      });
      await (0, _testHelpers.render)(EXAMPLE_1_HBS);
      await (0, _scrolling.scrollDown)('.ScrollView #element1', {
        amount: 500,
        duration: 750
      });
      assert.dom(SCROLL_CONTAINER).containsText('Five');
      await (0, _testHelpers.settled)();
      assert.dom(SCROLL_CONTAINER).containsText('Ten');
      await (0, _scrolling.scrollDown)('.ScrollView #element6', {
        amount: 800,
        duration: 500
      });
      assert.ok((0, _scrolling.scrollPosition)((0, _testHelpers.find)(SCROLL_CONTAINER)) < -1000, 'can scroll down below previous boundary');
    });
    (0, _qunit.test)('it does not reinvoke loadMore when isLoadingMore is true', async function (assert) {
      this.set('hasMore', true);
      let loadMoreInvocationCount = 0;
      this.set('loadMore', () => {
        loadMoreInvocationCount++;
        this.set('isLoadingMore', true);
      });
      await (0, _testHelpers.render)(EXAMPLE_1_HBS);
      await (0, _scrolling.scrollDown)('.ScrollView #element1', {
        amount: 500,
        duration: 300
      });
      await (0, _testHelpers.settled)();
      await (0, _scrolling.scrollDown)('.ScrollView #element1', {
        amount: -500,
        duration: 300
      });
      await (0, _testHelpers.settled)();
      await (0, _scrolling.scrollDown)('.ScrollView #element1', {
        amount: 500,
        duration: 300
      });
      await (0, _testHelpers.settled)();
      assert.equal(loadMoreInvocationCount, 1, 'only invokes loadMore once');
    });
  });
});
define("dummy/tests/integration/components/scroll-view-test", ["qunit", "ember-qunit", "@ember/test-helpers", "rsvp", "ember-concurrency", "dummy/tests/helpers/scrolling", "@ember/template-factory"], function (_qunit, _emberQunit, _testHelpers, _rsvp, _emberConcurrency, _scrolling, _templateFactory) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"qunit",0,"ember-qunit",0,"@ember/test-helpers",0,"rsvp",0,"ember-concurrency",0,"dummy/tests/helpers/scrolling",0,"@ember/template-factory"eaimeta@70e063a35619d71f
  const SCROLL_CONTAINER = '[data-test-scroll-container]';
  const SCROLLBAR_THUMB = '[data-test-scroll-bar] [data-test-thumb]';
  (0, _qunit.module)('Integration | Component | scroll-view', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    hooks.beforeEach(function () {
      this.set('onClickLink', function () {});
      this.set('viewportHeight', 480);
      this.set('element3', null);
      this.set('scrollChange', null);
      this.set('clientSizeChange', null);
      this.set('scrolledToTopChange', null);
      this.set('scrollTopOffset', 0);
      this.set('initialScrollTop', null);
    });
    const EXAMPLE_1_HBS = (0, _templateFactory.createTemplateFactory)(
    /*
      
        {{!-- template-lint-disable no-inline-styles --}}
        <div style={{html-safe (concat "width:320px; height:" this.viewportHeight "px; position:relative")}}>
          <ScrollView
            @scrollChange={{this.scrollChange}}
            @clientSizeChange={{this.clientSizeChange}}
            @scrolledToTopChange={{this.scrolledToTopChange}}
           as |scrollViewApi|
          >
            <div id="element1" style="width:320px;height:200px">
              One
              <button
                {{on 'click' scrollViewApi.scrollToBottom}}
                type="button"
                data-test-scroll-to-bottom-button
              >
                Scroll to Bottom
              </button>
              <button
                {{on 'click' (fn scrollViewApi.scrollToElement this.element3)}}
                type="button"
                data-test-scroll-to-element-button
              >
                Scroll to Element 3
              </button>
            </div>
            <div style="width:320px;height:200px">Two</div>
            <div id="element3" style="width:320px;height:200px">Three</div>
            <a href="#" style={{html-safe "display:block;width:320px;height:200px"}} data-test-link {{on 'click' (fn this.onClickLink)}}>Four</a>
            <div style="width:320px;height:200px">
              Five
              <button
                {{on 'click' scrollViewApi.scrollToTop}}
                type="button"
                data-test-scroll-to-top-button
              >
                Scroll to Top
              </button>
            </div>
          </ScrollView>
        </div>
      
    */
    {
      "id": "9Dg9YKCG",
      "block": "[[[1,\"\\n\"],[1,\"    \"],[10,0],[15,5,[28,[37,0],[[28,[37,1],[\"width:320px; height:\",[30,0,[\"viewportHeight\"]],\"px; position:relative\"],null]],null]],[12],[1,\"\\n      \"],[8,[39,2],null,[[\"@scrollChange\",\"@clientSizeChange\",\"@scrolledToTopChange\"],[[30,0,[\"scrollChange\"]],[30,0,[\"clientSizeChange\"]],[30,0,[\"scrolledToTopChange\"]]]],[[\"default\"],[[[[1,\"\\n        \"],[10,0],[14,1,\"element1\"],[14,5,\"width:320px;height:200px\"],[12],[1,\"\\n          One\\n          \"],[11,\"button\"],[24,\"data-test-scroll-to-bottom-button\",\"\"],[24,4,\"button\"],[4,[38,3],[\"click\",[30,1,[\"scrollToBottom\"]]],null],[12],[1,\"\\n            Scroll to Bottom\\n          \"],[13],[1,\"\\n          \"],[11,\"button\"],[24,\"data-test-scroll-to-element-button\",\"\"],[24,4,\"button\"],[4,[38,3],[\"click\",[28,[37,4],[[30,1,[\"scrollToElement\"]],[30,0,[\"element3\"]]],null]],null],[12],[1,\"\\n            Scroll to Element 3\\n          \"],[13],[1,\"\\n        \"],[13],[1,\"\\n        \"],[10,0],[14,5,\"width:320px;height:200px\"],[12],[1,\"Two\"],[13],[1,\"\\n        \"],[10,0],[14,1,\"element3\"],[14,5,\"width:320px;height:200px\"],[12],[1,\"Three\"],[13],[1,\"\\n        \"],[11,3],[24,6,\"#\"],[16,5,[28,[37,0],[\"display:block;width:320px;height:200px\"],null]],[24,\"data-test-link\",\"\"],[4,[38,3],[\"click\",[28,[37,4],[[30,0,[\"onClickLink\"]]],null]],null],[12],[1,\"Four\"],[13],[1,\"\\n        \"],[10,0],[14,5,\"width:320px;height:200px\"],[12],[1,\"\\n          Five\\n          \"],[11,\"button\"],[24,\"data-test-scroll-to-top-button\",\"\"],[24,4,\"button\"],[4,[38,3],[\"click\",[30,1,[\"scrollToTop\"]]],null],[12],[1,\"\\n            Scroll to Top\\n          \"],[13],[1,\"\\n        \"],[13],[1,\"\\n      \"]],[1]]]]],[1,\"\\n    \"],[13],[1,\"\\n  \"]],[\"scrollViewApi\"],false,[\"html-safe\",\"concat\",\"scroll-view\",\"on\",\"fn\"]]",
      "moduleName": "/Users/ylm/p/yapp/yapp-scroll-view/dummy/tests/integration/components/scroll-view-test.js",
      "isStrictMode": false
    });
    (0, _qunit.test)('it renders', async function (assert) {
      await (0, _testHelpers.render)(EXAMPLE_1_HBS);
      assert.dom('.ScrollView').containsText('One');
      assert.dom(SCROLL_CONTAINER).containsText('One');
      assert.equal((0, _scrolling.scrollPosition)((0, _testHelpers.find)(SCROLL_CONTAINER)), 0);
    });
    (0, _qunit.test)('it scrolls with a swipe', async function (assert) {
      assert.expect(2);
      await (0, _testHelpers.render)(EXAMPLE_1_HBS);
      let scrollPromise = (0, _scrolling.scrollDown)('.ScrollView #element1');
      await (0, _scrolling.waitForOpacity)(SCROLLBAR_THUMB, '1');
      assert.close((0, _testHelpers.find)(SCROLLBAR_THUMB).offsetHeight, 228, 1);
      await scrollPromise;
      assert.ok((0, _scrolling.scrollPosition)((0, _testHelpers.find)(SCROLL_CONTAINER)) <= -190);
    });
    (0, _qunit.test)('it emits an action when scrolling', async function (assert) {
      let scrollChangeCount = 0;
      this.set('scrollChange', function /* scrollTop */
      () {
        scrollChangeCount++;
      });
      await (0, _testHelpers.render)(EXAMPLE_1_HBS);
      let scrollPromise = (0, _scrolling.scrollDown)('.ScrollView #element1');
      await (0, _emberConcurrency.timeout)(50);
      await scrollPromise;
      assert.ok(scrollChangeCount > 20, 'scrollChange action should be emitted a bunch');
    });
    (0, _qunit.test)('it emits an action when scrolling to top', async function (assert) {
      let scrolledToTopChangeCount = 0;
      let isAtTopValue = false;
      this.set('scrolledToTopChange', function (isAtTop) {
        scrolledToTopChangeCount++;
        isAtTopValue = isAtTop;
      });
      await (0, _testHelpers.render)(EXAMPLE_1_HBS);
      assert.equal(scrolledToTopChangeCount, 1, 'emits scrolledToTopChange on initial render');
      assert.true(isAtTopValue, 'is at top');
      await (0, _scrolling.scrollDown)('.ScrollView #element1', {
        amount: 100,
        duration: 200
      });
      assert.equal(scrolledToTopChangeCount, 2, 'emits scrolledToTopChange when scrolling down');
      assert.false(isAtTopValue, 'is not at top');
      await (0, _scrolling.scrollDown)('.ScrollView #element1', {
        amount: -100,
        duration: 200
      });
      await (0, _testHelpers.waitUntil)(() => scrolledToTopChangeCount === 3);
      assert.equal(scrolledToTopChangeCount, 3, 'emits scrolledToTopChange when scrolling back up');
      assert.true(isAtTopValue, 'is at top');
    });
    (0, _qunit.test)('it emits an action when scrolling to top, with scrollTopOffset set', async function (assert) {
      this.set('scrollTopOffset', 50);
      const template = (0, _templateFactory.createTemplateFactory)(
      /*
        
            {{!-- template-lint-disable no-inline-styles --}}
            <div style={{html-safe (concat "width:320px; height:" this.viewportHeight "px; position:relative")}}>
              <ScrollView @scrollTopOffset={{this.scrollTopOffset}} @scrolledToTopChange={{this.scrolledToTopChange}}>
                <div style="width:320px;height:400px">One</div>
                <div style="width:320px;height:400px">Two</div>
              </ScrollView>
            </div>
          
      */
      {
        "id": "aVdOZPVO",
        "block": "[[[1,\"\\n\"],[1,\"      \"],[10,0],[15,5,[28,[37,0],[[28,[37,1],[\"width:320px; height:\",[30,0,[\"viewportHeight\"]],\"px; position:relative\"],null]],null]],[12],[1,\"\\n        \"],[8,[39,2],null,[[\"@scrollTopOffset\",\"@scrolledToTopChange\"],[[30,0,[\"scrollTopOffset\"]],[30,0,[\"scrolledToTopChange\"]]]],[[\"default\"],[[[[1,\"\\n          \"],[10,0],[14,5,\"width:320px;height:400px\"],[12],[1,\"One\"],[13],[1,\"\\n          \"],[10,0],[14,5,\"width:320px;height:400px\"],[12],[1,\"Two\"],[13],[1,\"\\n        \"]],[]]]]],[1,\"\\n      \"],[13],[1,\"\\n    \"]],[],false,[\"html-safe\",\"concat\",\"scroll-view\"]]",
        "moduleName": "/Users/ylm/p/yapp/yapp-scroll-view/dummy/tests/integration/components/scroll-view-test.js",
        "isStrictMode": false
      });
      let scrolledToTopChangeCount = 0;
      let isAtTopValue = false;
      this.set('scrolledToTopChange', function (isAtTop) {
        scrolledToTopChangeCount++;
        isAtTopValue = isAtTop;
      });
      await (0, _testHelpers.render)(template);
      assert.equal(scrolledToTopChangeCount, 1, 'emits scrolledToTopChange on initial render');
      assert.true(isAtTopValue, 'is at top');
      assert.equal((0, _scrolling.scrollPosition)((0, _testHelpers.find)(SCROLL_CONTAINER)), -50, 'starts in scrollTopOffset position');
      await (0, _scrolling.scrollDown)(SCROLL_CONTAINER, {
        amount: 100,
        duration: 200
      });
      assert.equal(scrolledToTopChangeCount, 2, 'emits scrolledToTopChange when scrolling down');
      assert.false(isAtTopValue, 'is not at top');
      await (0, _scrolling.scrollDown)(SCROLL_CONTAINER, {
        amount: -125,
        duration: 200
      });
      await (0, _testHelpers.waitUntil)(() => scrolledToTopChangeCount === 3);
      assert.equal(scrolledToTopChangeCount, 3, 'emits scrolledToTopChange when scrolling back up');
      assert.true(isAtTopValue, 'is at top');
    });
    (0, _qunit.test)('it sets initial scrollTop to initialScrollTop value', async function (assert) {
      this.set('initialScrollTop', 50);
      const template = (0, _templateFactory.createTemplateFactory)(
      /*
        
            {{!-- template-lint-disable no-inline-styles --}}
            <div style={{html-safe (concat "width:320px; height:" this.viewportHeight "px; position:relative")}}>
              <ScrollView @initialScrollTop={{this.initialScrollTop}}>
                <div style="width:320px;height:400px">One</div>
                <div style="width:320px;height:400px">Two</div>
              </ScrollView>
            </div>
          
      */
      {
        "id": "0ylkKINK",
        "block": "[[[1,\"\\n\"],[1,\"      \"],[10,0],[15,5,[28,[37,0],[[28,[37,1],[\"width:320px; height:\",[30,0,[\"viewportHeight\"]],\"px; position:relative\"],null]],null]],[12],[1,\"\\n        \"],[8,[39,2],null,[[\"@initialScrollTop\"],[[30,0,[\"initialScrollTop\"]]]],[[\"default\"],[[[[1,\"\\n          \"],[10,0],[14,5,\"width:320px;height:400px\"],[12],[1,\"One\"],[13],[1,\"\\n          \"],[10,0],[14,5,\"width:320px;height:400px\"],[12],[1,\"Two\"],[13],[1,\"\\n        \"]],[]]]]],[1,\"\\n      \"],[13],[1,\"\\n    \"]],[],false,[\"html-safe\",\"concat\",\"scroll-view\"]]",
        "moduleName": "/Users/ylm/p/yapp/yapp-scroll-view/dummy/tests/integration/components/scroll-view-test.js",
        "isStrictMode": false
      });
      await (0, _testHelpers.render)(template);
      assert.equal((0, _scrolling.scrollPosition)((0, _testHelpers.find)(SCROLL_CONTAINER)), -50, 'starts in scrollTopOffset position');
    });
    (0, _qunit.test)('it shows the scrollbar until the user releases their finger', async function (assert) {
      await (0, _testHelpers.render)(EXAMPLE_1_HBS);
      let mouseUpDeferred = _rsvp.default.defer();
      (0, _scrolling.scrollDown)('.ScrollView #element1', {
        waitForMouseUp: mouseUpDeferred.promise
      });
      await (0, _testHelpers.waitUntil)(() => {
        return (0, _scrolling.scrollPosition)((0, _testHelpers.find)(SCROLL_CONTAINER)) <= -190;
      });
      assert.equal((0, _testHelpers.find)(SCROLLBAR_THUMB).style.opacity, '1', 'scrollbar visible while still touching');
      await (0, _emberConcurrency.timeout)(300);
      mouseUpDeferred.resolve();
      await (0, _scrolling.waitForOpacity)(SCROLLBAR_THUMB, '0');
      assert.equal((0, _testHelpers.find)(SCROLLBAR_THUMB).style.opacity, '0', 'scrollbar hides after no longer touching');
    });
    (0, _qunit.test)('it renders content with height less than the height of the scroll container OK', async function (assert) {
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
            {{!-- template-lint-disable no-inline-styles --}}
            <div style="width:320px; height:480px; position:relative">
              <ScrollView>
                <div style="width:320px;height:200px">One</div>
              </ScrollView>
            </div>
          
      */
      {
        "id": "s+T1eN4d",
        "block": "[[[1,\"\\n\"],[1,\"      \"],[10,0],[14,5,\"width:320px; height:480px; position:relative\"],[12],[1,\"\\n        \"],[8,[39,0],null,null,[[\"default\"],[[[[1,\"\\n          \"],[10,0],[14,5,\"width:320px;height:200px\"],[12],[1,\"One\"],[13],[1,\"\\n        \"]],[]]]]],[1,\"\\n      \"],[13],[1,\"\\n    \"]],[],false,[\"scroll-view\"]]",
        "moduleName": "/Users/ylm/p/yapp/yapp-scroll-view/dummy/tests/integration/components/scroll-view-test.js",
        "isStrictMode": false
      }));
      assert.equal((0, _testHelpers.find)(SCROLL_CONTAINER).offsetHeight, 480);
      assert.equal((0, _testHelpers.find)('[data-test-scroll-bar]').offsetHeight, 476);
    });
    (0, _qunit.test)('when scroll-view changes size, scrolling behavior follows suit', async function (assert) {
      await (0, _testHelpers.render)(EXAMPLE_1_HBS);
      this.set('viewportHeight', 1200);
      window.SIMULATE_SCROLL_VIEW_MEASUREMENT_LOOP();
      await (0, _testHelpers.waitUntil)(() => document.querySelector(SCROLL_CONTAINER).offsetHeight === 1200, {
        timeoutMessage: 'scroll-view should update its scroll container size'
      });
      assert.equal((0, _testHelpers.find)('[data-test-scroll-bar]').offsetHeight, 1196, 'scrollbar height is correct');
      await (0, _scrolling.scrollDown)('.ScrollView', {
        amount: 100,
        duration: 200
      });
      await (0, _testHelpers.waitUntil)(() => (0, _scrolling.scrollPosition)((0, _testHelpers.find)(SCROLL_CONTAINER)) === 0, {
        timeoutMessage: 'scroll position should bounce back to zero'
      });
    });
    (0, _qunit.test)('when scroll-view changes size, it emits an action', async function (assert) {
      let clientSizeChangeInvoked = false;
      let newClientHeight;
      this.set('clientSizeChange', function (clientWidth, clientHeight) {
        clientSizeChangeInvoked = true;
        newClientHeight = clientHeight;
      });
      await (0, _testHelpers.render)(EXAMPLE_1_HBS);
      this.set('viewportHeight', 1200);
      window.SIMULATE_SCROLL_VIEW_MEASUREMENT_LOOP();
      await (0, _testHelpers.waitUntil)(() => document.querySelector(SCROLL_CONTAINER).offsetHeight === 1200, {
        timeoutMessage: 'scroll-view should update its scroll container size'
      });
      assert.true(clientSizeChangeInvoked);
      assert.equal(newClientHeight, 1200);
    });
    (0, _qunit.test)('when content height changes, it scrolling behavior follows suit', async function (assert) {
      await (0, _testHelpers.render)(EXAMPLE_1_HBS);
      let el = document.createElement('div');
      el.style.height = '800px';
      el.textContent = 'Six!';
      (0, _testHelpers.find)(SCROLL_CONTAINER).appendChild(el);
      window.SIMULATE_SCROLL_VIEW_MEASUREMENT_LOOP();
      assert.equal((0, _testHelpers.find)(SCROLL_CONTAINER).offsetHeight, 1800);
      assert.equal((0, _testHelpers.find)('[data-test-scroll-bar]').offsetHeight, 476);
      await (0, _scrolling.scrollDown)('.ScrollView', {
        amount: 1000,
        duration: 200
      });
      await (0, _testHelpers.waitUntil)(() => (0, _scrolling.scrollPosition)((0, _testHelpers.find)(SCROLL_CONTAINER)) < -1000, {
        timeoutMessage: 'should allow scrolling to go beyond old dimensions'
      });
    });
    (0, _qunit.test)('yields scrollViewApi, which provides scrollTo methods', async function (assert) {
      assert.expect(3);
      this.captureScrollViewApi = api => {
        this.scrollViewApi = api;
      };
      const template = (0, _templateFactory.createTemplateFactory)(
      /*
        
            {{!-- template-lint-disable no-inline-styles --}}
            <div style={{html-safe (concat "width:320px; height:" this.viewportHeight "px; position:relative")}}>
              <ScrollView
                @scrollChange={{this.scrollChange}}
                @clientSizeChange={{this.clientSizeChange}}
                @scrolledToTopChange={{this.scrolledToTopChange}}
               as |scrollViewApi|
              >
                <div {{did-insert (fn this.captureScrollViewApi scrollViewApi)}}></div>
                <div id="element1" style="width:320px;height:200px">
                  One
                  <button
                    {{on 'click' scrollViewApi.scrollToBottom}}
                    type="button"
                    data-test-scroll-to-bottom-button
                  >
                    Scroll to Bottom
                  </button>
                  <button
                    {{on 'click' (fn scrollViewApi.scrollToElement this.element3)}}
                    type="button"
                    data-test-scroll-to-element-button
                  >
                    Scroll to Element 3
                  </button>
                </div>
                <div style="width:320px;height:200px">Two</div>
                <div id="element3" style="width:320px;height:200px">Three</div>
                <a href="#" style={{html-safe "display:block;width:320px;height:200px"}} data-test-link {{on 'click' (fn this.onClickLink)}}>Four</a>
                <div style="width:320px;height:200px">
                  Five
                  <button
                    {{on 'click' scrollViewApi.scrollToTop}}
                    type="button"
                    data-test-scroll-to-top-button
                  >
                    Scroll to Top
                  </button>
                </div>
              </ScrollView>
            </div>
          
      */
      {
        "id": "nXzD3fMj",
        "block": "[[[1,\"\\n\"],[1,\"      \"],[10,0],[15,5,[28,[37,0],[[28,[37,1],[\"width:320px; height:\",[30,0,[\"viewportHeight\"]],\"px; position:relative\"],null]],null]],[12],[1,\"\\n        \"],[8,[39,2],null,[[\"@scrollChange\",\"@clientSizeChange\",\"@scrolledToTopChange\"],[[30,0,[\"scrollChange\"]],[30,0,[\"clientSizeChange\"]],[30,0,[\"scrolledToTopChange\"]]]],[[\"default\"],[[[[1,\"\\n          \"],[11,0],[4,[38,3],[[28,[37,4],[[30,0,[\"captureScrollViewApi\"]],[30,1]],null]],null],[12],[13],[1,\"\\n          \"],[10,0],[14,1,\"element1\"],[14,5,\"width:320px;height:200px\"],[12],[1,\"\\n            One\\n            \"],[11,\"button\"],[24,\"data-test-scroll-to-bottom-button\",\"\"],[24,4,\"button\"],[4,[38,5],[\"click\",[30,1,[\"scrollToBottom\"]]],null],[12],[1,\"\\n              Scroll to Bottom\\n            \"],[13],[1,\"\\n            \"],[11,\"button\"],[24,\"data-test-scroll-to-element-button\",\"\"],[24,4,\"button\"],[4,[38,5],[\"click\",[28,[37,4],[[30,1,[\"scrollToElement\"]],[30,0,[\"element3\"]]],null]],null],[12],[1,\"\\n              Scroll to Element 3\\n            \"],[13],[1,\"\\n          \"],[13],[1,\"\\n          \"],[10,0],[14,5,\"width:320px;height:200px\"],[12],[1,\"Two\"],[13],[1,\"\\n          \"],[10,0],[14,1,\"element3\"],[14,5,\"width:320px;height:200px\"],[12],[1,\"Three\"],[13],[1,\"\\n          \"],[11,3],[24,6,\"#\"],[16,5,[28,[37,0],[\"display:block;width:320px;height:200px\"],null]],[24,\"data-test-link\",\"\"],[4,[38,5],[\"click\",[28,[37,4],[[30,0,[\"onClickLink\"]]],null]],null],[12],[1,\"Four\"],[13],[1,\"\\n          \"],[10,0],[14,5,\"width:320px;height:200px\"],[12],[1,\"\\n            Five\\n            \"],[11,\"button\"],[24,\"data-test-scroll-to-top-button\",\"\"],[24,4,\"button\"],[4,[38,5],[\"click\",[30,1,[\"scrollToTop\"]]],null],[12],[1,\"\\n              Scroll to Top\\n            \"],[13],[1,\"\\n          \"],[13],[1,\"\\n        \"]],[1]]]]],[1,\"\\n      \"],[13],[1,\"\\n    \"]],[\"scrollViewApi\"],false,[\"html-safe\",\"concat\",\"scroll-view\",\"did-insert\",\"fn\",\"on\"]]",
        "moduleName": "/Users/ylm/p/yapp/yapp-scroll-view/dummy/tests/integration/components/scroll-view-test.js",
        "isStrictMode": false
      });
      await (0, _testHelpers.render)(template);
      assert.strictEqual(typeof this.scrollViewApi.scrollToBottom, 'function');
      assert.strictEqual(typeof this.scrollViewApi.scrollToTop, 'function');
      assert.strictEqual(typeof this.scrollViewApi.scrollToElement, 'function');
    });
    (0, _qunit.test)('subscribes to requestScrollToTop event on window and scrolls to top when in viewport', async function (assert) {
      await (0, _testHelpers.render)(EXAMPLE_1_HBS);
      await (0, _testHelpers.click)('[data-test-scroll-to-bottom-button]');
      await (0, _testHelpers.waitUntil)(() => (0, _scrolling.scrollPosition)((0, _testHelpers.find)(SCROLL_CONTAINER)) < -500);
      await (0, _testHelpers.click)(SCROLL_CONTAINER);
      let bottomScrollPos = (0, _scrolling.scrollPosition)((0, _testHelpers.find)(SCROLL_CONTAINER));
      this.element.style.transform = 'translateX(-10000px)';
      window.dispatchEvent(new Event('requestScrollToTop'));
      assert.equal((0, _testHelpers.find)(SCROLLBAR_THUMB).style.opacity, '0', 'scrollbar is not shown');
      await (0, _emberConcurrency.timeout)(50);
      assert.equal((0, _scrolling.scrollPosition)((0, _testHelpers.find)(SCROLL_CONTAINER)), bottomScrollPos, 'does not scroll to top');
      this.element.style.transform = 'translateX(0px)';
      window.dispatchEvent(new Event('requestScrollToTop'));
      await (0, _emberConcurrency.timeout)(50);
      assert.equal((0, _testHelpers.find)(SCROLLBAR_THUMB).style.opacity, '1');
      await (0, _testHelpers.waitUntil)(() => (0, _scrolling.scrollPosition)((0, _testHelpers.find)(SCROLL_CONTAINER)) > -5, {
        timeoutMessage: 'should scroll to top'
      });
      assert.ok(true, 'Scrolled to top!');
    });
    (0, _qunit.test)('swiping on a textarea does not cause scrolling', async function (assert) {
      let template = (0, _templateFactory.createTemplateFactory)(
      /*
        
            {{!-- template-lint-disable no-inline-styles require-input-label --}}
            <div style={{html-safe (concat "width:320px; height:" this.viewportHeight "px; position:relative")}}>
              <ScrollView>
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
          
      */
      {
        "id": "1G4Og19s",
        "block": "[[[1,\"\\n\"],[1,\"      \"],[10,0],[15,5,[28,[37,0],[[28,[37,1],[\"width:320px; height:\",[30,0,[\"viewportHeight\"]],\"px; position:relative\"],null]],null]],[12],[1,\"\\n        \"],[8,[39,2],null,null,[[\"default\"],[[[[1,\"\\n          \"],[10,0],[14,5,\"width:320px;height:200px\"],[12],[1,\"\\n            \"],[10,\"textarea\"],[14,5,\"width:320px;height:200px\"],[12],[1,\"            \"],[13],[1,\"\\n          \"],[13],[1,\"\\n          \"],[10,0],[14,5,\"width:320px;height:200px\"],[12],[1,\"Two\"],[13],[1,\"\\n          \"],[10,0],[14,5,\"width:320px;height:200px\"],[12],[1,\"Three\"],[13],[1,\"\\n          \"],[10,0],[14,5,\"width:320px;height:200px\"],[12],[1,\"Four\"],[13],[1,\"\\n          \"],[10,0],[14,5,\"width:320px;height:200px\"],[12],[1,\"Five\"],[13],[1,\"\\n        \"]],[]]]]],[1,\"\\n        \"],[13],[1,\"\\n    \"]],[],false,[\"html-safe\",\"concat\",\"scroll-view\"]]",
        "moduleName": "/Users/ylm/p/yapp/yapp-scroll-view/dummy/tests/integration/components/scroll-view-test.js",
        "isStrictMode": false
      });
      await (0, _testHelpers.render)(template);
      await (0, _scrolling.scrollDown)('.ScrollView textarea');
      assert.equal((0, _testHelpers.find)(SCROLLBAR_THUMB).style.opacity, '0');
      assert.equal((0, _scrolling.scrollPosition)((0, _testHelpers.find)(SCROLL_CONTAINER)), 0);
    });
    (0, _qunit.test)('remembers scroll position based on key attribute', async function (assert) {
      const template = (0, _templateFactory.createTemplateFactory)(
      /*
        
            {{!-- template-lint-disable no-inline-styles --}}
            <div style={{html-safe (concat "width:320px; height:" this.viewportHeight "px; position:relative")}}>
              <ScrollView @key={{this.key}}>
                <div style="width:320px;height:400px">One</div>
                <div style="width:320px;height:400px">Two</div>
              </ScrollView>
            </div>
          
      */
      {
        "id": "H50gVpgY",
        "block": "[[[1,\"\\n\"],[1,\"      \"],[10,0],[15,5,[28,[37,0],[[28,[37,1],[\"width:320px; height:\",[30,0,[\"viewportHeight\"]],\"px; position:relative\"],null]],null]],[12],[1,\"\\n        \"],[8,[39,2],null,[[\"@key\"],[[30,0,[\"key\"]]]],[[\"default\"],[[[[1,\"\\n          \"],[10,0],[14,5,\"width:320px;height:400px\"],[12],[1,\"One\"],[13],[1,\"\\n          \"],[10,0],[14,5,\"width:320px;height:400px\"],[12],[1,\"Two\"],[13],[1,\"\\n        \"]],[]]]]],[1,\"\\n      \"],[13],[1,\"\\n    \"]],[],false,[\"html-safe\",\"concat\",\"scroll-view\"]]",
        "moduleName": "/Users/ylm/p/yapp/yapp-scroll-view/dummy/tests/integration/components/scroll-view-test.js",
        "isStrictMode": false
      });
      this.set('key', 'my-scroll-view');
      await (0, _testHelpers.render)(template);
      assert.equal((0, _scrolling.scrollPosition)((0, _testHelpers.find)(SCROLL_CONTAINER)), 0);
      await (0, _scrolling.scrollDown)('.ScrollView', {
        amount: 100,
        duration: 200
      });
      await (0, _testHelpers.click)(SCROLL_CONTAINER);
      let scrollPos = (0, _scrolling.scrollPosition)((0, _testHelpers.find)(SCROLL_CONTAINER));
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
      */
      {
        "id": "Bi9TQArk",
        "block": "[[],[],false,[]]",
        "moduleName": "/Users/ylm/p/yapp/yapp-scroll-view/dummy/tests/integration/components/scroll-view-test.js",
        "isStrictMode": false
      }));
      this.set('key', 'other-scroll-view');
      await (0, _testHelpers.render)(template);
      assert.equal((0, _scrolling.scrollPosition)((0, _testHelpers.find)(SCROLL_CONTAINER)), 0, 'previous scroll position is not restored when there key does not match');
      await (0, _testHelpers.render)((0, _templateFactory.createTemplateFactory)(
      /*
        
      */
      {
        "id": "Bi9TQArk",
        "block": "[[],[],false,[]]",
        "moduleName": "/Users/ylm/p/yapp/yapp-scroll-view/dummy/tests/integration/components/scroll-view-test.js",
        "isStrictMode": false
      }));
      this.set('key', 'my-scroll-view');
      await (0, _testHelpers.render)(template);
      assert.equal((0, _scrolling.scrollPosition)((0, _testHelpers.find)(SCROLL_CONTAINER)), scrollPos, 'previous scroll position is restored');
    });
    (0, _qunit.test)('when momentum scrolling, a tap stops the scroll', async function (assert) {
      await (0, _testHelpers.render)(EXAMPLE_1_HBS);
      let preventedClicks = 0;
      this.set('onClickLink', () => {
        preventedClicks++;
      });
      await (0, _scrolling.scrollDown)('.ScrollView');
      await (0, _emberConcurrency.timeout)(10);
      (0, _testHelpers.click)('[data-test-link]');
      await (0, _emberConcurrency.timeout)(5);
      let scrollPos = (0, _scrolling.scrollPosition)((0, _testHelpers.find)(SCROLL_CONTAINER));
      await (0, _emberConcurrency.timeout)(50);
      let newScrollPos = (0, _scrolling.scrollPosition)((0, _testHelpers.find)(SCROLL_CONTAINER));
      assert.strictEqual(preventedClicks, 1, 'should activate action when tapping while scrolling decelerates');
      assert.ok(Math.abs(scrollPos - newScrollPos) < 5, 'scrolling should stop when clicked');
      await (0, _emberConcurrency.timeout)(50);
      let linkClicked = false;
      this.set('onClickLink', function () {
        linkClicked = true;
      });
      await (0, _testHelpers.settled)();
      await (0, _testHelpers.click)('[data-test-link]');
      assert.ok(linkClicked, 'subsequent click should work');
    });
  });
});
define("dummy/tests/integration/components/vertical-scroll-bar-test", ["qunit", "ember-qunit", "@ember/test-helpers", "dummy/tests/helpers/scrolling", "@ember/template-factory"], function (_qunit, _emberQunit, _testHelpers, _scrolling, _templateFactory) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"qunit",0,"ember-qunit",0,"@ember/test-helpers",0,"dummy/tests/helpers/scrolling",0,"@ember/template-factory"eaimeta@70e063a35619d71f
  (0, _qunit.module)('Integration | Component | vertical-scroll-bar', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    hooks.beforeEach(function () {
      this.set('scrollerHeight', 484);
      this.set('contentHeight', 1000);
      this.callbacks = [];
      this.registerCallback = callback => {
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
    const EXAMPLE_1_HBS = (0, _templateFactory.createTemplateFactory)(
    /*
      
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
      
    */
    {
      "id": "3/AySjQM",
      "block": "[[[1,\"\\n\"],[1,\"    \"],[10,\"style\"],[12],[1,\"\\n      .VerticalScrollBar {\\n        position: absolute;\\n        bottom: \"],[1,[30,0,[\"verticalPadding\"]]],[1,\"px;\\n        top: \"],[1,[30,0,[\"verticalPadding\"]]],[1,\"px;\\n        width: 5px;\\n        right: 2px;\\n      }\\n    \"],[13],[1,\"\\n    \"],[10,0],[15,5,[28,[37,0],[[28,[37,1],[\"width:320px; height:\",[30,0,[\"scrollerHeight\"]],\"px; position:relative; border: 1px solid blue\"],null]],null]],[12],[1,\"\\n      \"],[8,[39,2],null,[[\"@contentHeight\",\"@scrollerHeight\",\"@registerWithScrollView\"],[[30,0,[\"contentHeight\"]],[30,0,[\"scrollerHeight\"]],[30,0,[\"registerCallback\"]]]],null],[1,\"\\n    \"],[13],[1,\"\\n  \"]],[],false,[\"html-safe\",\"concat\",\"vertical-scroll-bar\"]]",
      "moduleName": "/Users/ylm/p/yapp/yapp-scroll-view/dummy/tests/integration/components/vertical-scroll-bar-test.js",
      "isStrictMode": false
    });
    const THUMB = '[data-test-thumb]';
    function thumbPosition() {
      return Math.floor((0, _scrolling.scrollPosition)((0, _testHelpers.find)(THUMB)));
    }
    function thumbSize() {
      return (0, _testHelpers.find)(THUMB).offsetHeight;
    }
    (0, _qunit.test)('it renders with a thumb size proportional to content ratio', async function (assert) {
      await (0, _testHelpers.render)(EXAMPLE_1_HBS);
      this.simulateCallback(true, 100);
      assert.close(thumbSize(), 232, 1);
      assert.equal(thumbPosition(), 48);
      assert.equal((0, _testHelpers.find)(THUMB).style.opacity, '1');
    });
    (0, _qunit.test)('it renders full-size when contentHeight is less than scrollerHeight', async function (assert) {
      this.set('contentHeight', 100);
      await (0, _testHelpers.render)(EXAMPLE_1_HBS);
      this.simulateCallback(true, 5);
      this.simulateCallback(true, 0);
      assert.close(thumbSize(), 479, 1);
      assert.equal(thumbPosition(), 0);
      assert.equal((0, _testHelpers.find)(THUMB).style.opacity, '1');
    });
    (0, _qunit.test)('it has 0 opacity when not scrolling', async function (assert) {
      await (0, _testHelpers.render)(EXAMPLE_1_HBS);
      assert.equal((0, _testHelpers.find)(THUMB).style.opacity, '0');
    });
    (0, _qunit.test)('it has a minimum scrollbar length', async function (assert) {
      this.set('contentHeight', 100000);
      await (0, _testHelpers.render)(EXAMPLE_1_HBS);
      this.simulateCallback(true, 100);
      assert.close(thumbSize(), 15, 1);
    });
    (0, _qunit.test)('thumb is visible when isScrolling is true', async function (assert) {
      await (0, _testHelpers.render)(EXAMPLE_1_HBS);
      this.simulateCallback(true, 10);
      assert.equal((0, _testHelpers.find)(THUMB).style.opacity, '1');
      this.simulateCallback(false, 10);
      await (0, _scrolling.waitForOpacity)(THUMB, '0');
      assert.equal((0, _testHelpers.find)(THUMB).style.opacity, '0');
    });
    (0, _qunit.test)('compresses scrollbar when overscrolled at top', async function (assert) {
      await (0, _testHelpers.render)(EXAMPLE_1_HBS);
      this.simulateCallback(true, -100);
      assert.equal(thumbPosition(), 0, 'thumb is at top');
      assert.close(thumbSize(), 193, 1, 'thumb height is compressed');
    });
    (0, _qunit.test)('compresses scrollbar when overscrolled at bottom', async function (assert) {
      await (0, _testHelpers.render)(EXAMPLE_1_HBS);
      this.simulateCallback(true, 650);
      assert.close(thumbSize(), 183, 1, 'thumb height is compressed');
      assert.equal(thumbPosition(), 298, 'thumb is at bottom');
    });
    (0, _qunit.test)('compresses scrollbar when overscrolled at top, short content', async function (assert) {
      this.set('contentHeight', 300);
      await (0, _testHelpers.render)(EXAMPLE_1_HBS);
      this.simulateCallback(true, -100);
      assert.equal(thumbPosition(), 0, 'thumb is at top');
      assert.close(thumbSize(), 398, 1, 'thumb height is compressed');
    });
    (0, _qunit.test)('compresses scrollbar when overscrolled at bottom, short content', async function (assert) {
      this.set('contentHeight', 300);
      await (0, _testHelpers.render)(EXAMPLE_1_HBS);
      this.simulateCallback(true, 400);
      assert.close(thumbSize(), 263, 1, 'thumb height is compressed');
      assert.equal(thumbPosition(), 217, 'thumb is at bottom');
    });
    (0, _qunit.test)('behavior when content is less than scrollview height', async function (assert) {
      this.set('verticalPadding', 0);
      this.set('contentHeight', 900);
      this.set('scrollerHeight', 1000);
      await (0, _testHelpers.render)(EXAMPLE_1_HBS);

      // when scrolled past bottom by 5
      this.simulateCallback(true, 105);
      assert.equal(thumbPosition(), 95, 'thumb is at bottom');
      assert.close(thumbSize(), 906, 1, 'thumb is slightly compressed');

      // when scrolled past top by 5
      this.simulateCallback(true, -5);
      assert.equal(thumbPosition(), 0, 'thumb is at top');
      assert.close(thumbSize(), 995, 1, 'thumb is slightly compressed');

      // when scrolled past bottom by 100
      this.simulateCallback(true, 100);
      assert.equal(thumbPosition(), 90, 'thumb is at bottom');
      assert.close(thumbSize(), 910, 1, 'thumb is slightly compressed');

      // when scrolled past top by 100
      this.simulateCallback(true, -100);
      assert.equal(thumbPosition(), 0, 'thumb is at top');
      assert.close(thumbSize(), 909, 1, 'thumb is slightly compressed');
    });
    (0, _qunit.test)('behavior when content is equal to scrollview height', async function (assert) {
      this.set('verticalPadding', 0);
      this.set('contentHeight', 1000);
      this.set('scrollerHeight', 1000);
      await (0, _testHelpers.render)(EXAMPLE_1_HBS);

      // when scrolled past bottom by 5
      this.simulateCallback(true, 5);
      assert.equal(thumbPosition(), 4, 'thumb is at bottom');
      assert.close(thumbSize(), 996, 1, 'thumb is slightly compressed');

      // when scrolled past top by 5
      this.simulateCallback(true, -5);
      assert.equal(thumbPosition(), 0, 'thumb is at top');
      assert.close(thumbSize(), 995, 1, 'thumb is slightly compressed');

      // when scrolled past bottom by 100
      this.simulateCallback(true, 100);
      assert.equal(thumbPosition(), 90, 'thumb is at bottom');
      assert.close(thumbSize(), 910, 1, 'thumb is slightly compressed');

      // when scrolled past top by 100
      this.simulateCallback(true, -100);
      assert.equal(thumbPosition(), 0, 'thumb is at top');
      assert.close(thumbSize(), 909, 1, 'thumb is slightly compressed');
    });
    (0, _qunit.test)('behavior when content is slightly more than scrollview height', async function (assert) {
      this.set('verticalPadding', 0);
      this.set('contentHeight', 1000);
      this.set('scrollerHeight', 900);
      await (0, _testHelpers.render)(EXAMPLE_1_HBS);

      // when scrolled past bottom by 1
      this.simulateCallback(true, 101);
      assert.equal(thumbPosition(), 90, 'thumb is at bottom');
      assert.close(thumbSize(), 810, 1, 'thumb is slightly compressed');

      // when scrolled past top by 1
      this.simulateCallback(true, -1);
      assert.equal(thumbPosition(), 0, 'thumb is at top');
      assert.close(thumbSize(), 810, 1, 'thumb is slightly compressed');

      // when scrolled to center
      this.simulateCallback(true, 50);
      assert.equal(thumbPosition(), 45, 'thumb is in center');
      assert.close(thumbSize(), 811, 1, 'thumb height is not compressed');

      // when scrolled past bottom by 200
      this.simulateCallback(true, 300);
      assert.equal(thumbPosition(), 237, 'thumb is at bottom');
      assert.close(thumbSize(), 664, 1, 'thumb is heavily compressed');

      // when scrolled past top by 200
      this.simulateCallback(true, -200);
      assert.equal(thumbPosition(), 0, 'thumb is at top');
      assert.close(thumbSize(), 664, 1, 'thumb is heavily compressed');
    });
    (0, _qunit.test)('behavior when content is a lot more than scrollview height', async function (assert) {
      this.set('verticalPadding', 0);
      this.set('contentHeight', 2000);
      this.set('scrollerHeight', 500);
      await (0, _testHelpers.render)(EXAMPLE_1_HBS);

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
      assert.equal(thumbPosition(), 187, 'thumb is in center');
      assert.close(thumbSize(), 126, 1, 'thumb height is not compressed');

      // when scrolled past bottom by 100
      this.simulateCallback(true, 1600);
      assert.equal(thumbPosition(), 395, 'thumb is at bottom');
      assert.close(thumbSize(), 105, 1, 'thumb is heavily compressed');

      // when scrolled past top by 100
      this.simulateCallback(true, -100);
      assert.equal(thumbPosition(), 0, 'thumb is at top');
      assert.close(thumbSize(), 105, 1, 'thumb is heavily compressed');

      // when scrolled past bottom by 500
      this.simulateCallback(true, 2000);
      assert.equal(thumbPosition(), 437, 'thumb is at bottom');
      assert.close(thumbSize(), 63, 1, 'thumb is small');

      // when scrolled past top by 500
      this.simulateCallback(true, -500);
      assert.equal(thumbPosition(), 0, 'thumb is at top');
      assert.close(thumbSize(), 63, 1, 'thumb is small');
    });
    (0, _qunit.test)('calculations update when scrollerHeight changes', async function (assert) {
      this.set('verticalPadding', 0);
      this.set('contentHeight', 2000);
      this.set('scrollerHeight', 500);
      await (0, _testHelpers.render)(EXAMPLE_1_HBS);
      this.simulateCallback(true, 750);
      assert.equal(thumbPosition(), 187, 'thumb is in center');
      assert.close(thumbSize(), 126, 1, 'thumb height is not compressed');
      this.set('scrollerHeight', 1000);
      this.simulateCallback(true, 750);
      assert.equal(thumbPosition(), 375, 'thumb is in center');
      assert.close(thumbSize(), 501, 1, 'thumb height is not compressed');
    });
  });
});
define("dummy/tests/test-helper", ["dummy/app", "dummy/config/environment", "qunit", "@ember/test-helpers", "ember-qunit", "qunit-dom"], function (_app, _environment, QUnit, _testHelpers, _emberQunit, _qunitDom) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"dummy/app",0,"dummy/config/environment",0,"qunit",0,"@ember/test-helpers",0,"ember-qunit",0,"qunit-dom"eaimeta@70e063a35619d71f
  (0, _testHelpers.setApplication)(_app.default.create(_environment.default.APP));
  (0, _qunitDom.setup)(QUnit.assert);
  function _getPushContext(context) {
    var pushContext;
    if (context && typeof context.push === 'function') {
      // `context` is an `Assert` context
      pushContext = context;
    } else if (context && context.assert && typeof context.assert.pushResult === 'function') {
      // `context` is a `Test` context
      pushContext = context.assert;
    } else if (QUnit && QUnit.config && QUnit.config.current && QUnit.config.current.assert && typeof QUnit.config.current.assert.pushResult === 'function') {
      // `context` is an unknown context but we can find the `Assert` context via QUnit
      pushContext = QUnit.config.current.assert;
    } else if (QUnit && typeof QUnit.pushResult === 'function') {
      pushContext = QUnit.pushResult;
    } else {
      throw new Error('Could not find the QUnit `Assert` context to push results');
    }
    return pushContext;
  }
  QUnit.assert.close = function close(actual, expected, maxDifference, message) {
    var actualDiff = actual === expected ? 0 : Math.abs(actual - expected),
      result = actualDiff <= maxDifference,
      pushContext = _getPushContext(this);
    message = message || actual + ' should be within ' + maxDifference + ' (inclusive) of ' + expected + (result ? '' : '. Actual: ' + actualDiff);
    pushContext.pushResult({
      result,
      actual,
      expected,
      message
    });
  };
  (0, _emberQunit.start)();
});
define('dummy/config/environment', [], function() {
  var prefix = 'dummy';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(decodeURIComponent(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

require('dummy/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map
