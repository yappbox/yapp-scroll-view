'use strict';



;define("dummy/app", ["exports", "@ember/application", "ember-resolver", "ember-load-initializers", "dummy/config/environment"], function (_exports, _application, _emberResolver, _emberLoadInitializers, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  0; //eaimeta@70e063a35619d71f0,"@ember/application",0,"ember-resolver",0,"ember-load-initializers",0,"dummy/config/environment"eaimeta@70e063a35619d71f
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  class App extends _application.default {
    constructor(...args) {
      super(...args);
      _defineProperty(this, "modulePrefix", _environment.default.modulePrefix);
      _defineProperty(this, "podModulePrefix", _environment.default.podModulePrefix);
      _defineProperty(this, "Resolver", _emberResolver.default);
    }
  }
  _exports.default = App;
  (0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);
});
;define("dummy/component-managers/glimmer", ["exports", "@glimmer/component/-private/ember-component-manager"], function (_exports, _emberComponentManager) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _emberComponentManager.default;
    }
  });
  0; //eaimeta@70e063a35619d71f0,"@glimmer/component/-private/ember-component-manager"eaimeta@70e063a35619d71f
});
;define("dummy/components/collection-scroll-view/index", ["exports", "yapp-scroll-view/components/collection-scroll-view/index"], function (_exports, _index) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _index.default;
    }
  });
  0; //eaimeta@70e063a35619d71f0,"yapp-scroll-view/components/collection-scroll-view/index"eaimeta@70e063a35619d71f
});
;define("dummy/components/loading-scroll-view", ["exports", "yapp-scroll-view/components/loading-scroll-view"], function (_exports, _loadingScrollView) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _loadingScrollView.default;
    }
  });
  0; //eaimeta@70e063a35619d71f0,"yapp-scroll-view/components/loading-scroll-view"eaimeta@70e063a35619d71f
});
;define("dummy/components/scroll-view", ["exports", "yapp-scroll-view/components/scroll-view"], function (_exports, _scrollView) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _scrollView.default;
    }
  });
  0; //eaimeta@70e063a35619d71f0,"yapp-scroll-view/components/scroll-view"eaimeta@70e063a35619d71f
});
;define("dummy/components/vertical-scroll-bar", ["exports", "yapp-scroll-view/components/vertical-scroll-bar"], function (_exports, _verticalScrollBar) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _verticalScrollBar.default;
    }
  });
  0; //eaimeta@70e063a35619d71f0,"yapp-scroll-view/components/vertical-scroll-bar"eaimeta@70e063a35619d71f
});
;define("dummy/controllers/images", ["exports", "@ember/controller", "@glimmer/tracking", "@ember/object"], function (_exports, _controller, _tracking, _object) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;
  0; //eaimeta@70e063a35619d71f0,"@ember/controller",0,"@glimmer/tracking",0,"@ember/object"eaimeta@70e063a35619d71f
  function _initializerDefineProperty(e, i, r, l) { r && Object.defineProperty(e, i, { enumerable: r.enumerable, configurable: r.configurable, writable: r.writable, value: r.initializer ? r.initializer.call(l) : void 0 }); }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  function _applyDecoratedDescriptor(i, e, r, n, l) { var a = {}; return Object.keys(n).forEach(function (i) { a[i] = n[i]; }), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = !0), a = r.slice().reverse().reduce(function (r, n) { return n(i, e, r) || r; }, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a; }
  function _initializerWarningHelper(r, e) { throw Error("Decorating class property failed. Please ensure that transform-class-properties is enabled and runs after the decorators transform."); }
  function shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }
  let _class = _exports.default = (_class2 = class _class2 extends _controller.default {
    constructor(...args) {
      super(...args);
      _initializerDefineProperty(this, "itemWidth", _descriptor, this);
      _initializerDefineProperty(this, "itemHeight", _descriptor2, this);
      _initializerDefineProperty(this, "containerWidth", _descriptor3, this);
      _initializerDefineProperty(this, "containerHeight", _descriptor4, this);
    }
    updateContainerWidth(ev) {
      this.containerWidth = parseInt(ev.target.value, 10);
    }
    updateContainerHeight(ev) {
      this.containerHeight = parseInt(ev.target.value, 10);
    }
    shuffle() {
      this.model = shuffle(this.model.slice(0));
    }
  }, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "itemWidth", [_tracking.tracked], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return 200;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "itemHeight", [_tracking.tracked], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return 100;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "containerWidth", [_tracking.tracked], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return 300;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "containerHeight", [_tracking.tracked], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return 600;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "updateContainerWidth", [_object.action], Object.getOwnPropertyDescriptor(_class2.prototype, "updateContainerWidth"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "updateContainerHeight", [_object.action], Object.getOwnPropertyDescriptor(_class2.prototype, "updateContainerHeight"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "shuffle", [_object.action], Object.getOwnPropertyDescriptor(_class2.prototype, "shuffle"), _class2.prototype), _class2);
});
;define("dummy/controllers/loading-scroll-view", ["exports", "@ember/controller", "@ember/runloop", "@ember/array", "@ember/object", "@glimmer/tracking"], function (_exports, _controller, _runloop, _array, _object, _tracking) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _class2, _descriptor;
  /* eslint-disable ember/avoid-leaking-state-in-ember-objects */
  0; //eaimeta@70e063a35619d71f0,"@ember/controller",0,"@ember/runloop",0,"@ember/array",0,"@ember/object",0,"@glimmer/tracking"eaimeta@70e063a35619d71f
  function _initializerDefineProperty(e, i, r, l) { r && Object.defineProperty(e, i, { enumerable: r.enumerable, configurable: r.configurable, writable: r.writable, value: r.initializer ? r.initializer.call(l) : void 0 }); }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  function _applyDecoratedDescriptor(i, e, r, n, l) { var a = {}; return Object.keys(n).forEach(function (i) { a[i] = n[i]; }), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = !0), a = r.slice().reverse().reduce(function (r, n) { return n(i, e, r) || r; }, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a; }
  function _initializerWarningHelper(r, e) { throw Error("Decorating class property failed. Please ensure that transform-class-properties is enabled and runs after the decorators transform."); }
  let _class = _exports.default = (_class2 = class _class2 extends _controller.default {
    constructor(...args) {
      super(...args);
      _defineProperty(this, "unloadedStrings", (0, _array.A)(['H. Next level +1 keytar schlitz cred af. Bitters lumbersexual enamel pin williamsburg meggings lyft tofu jean shorts dreamcatcher taiyaki artisan vice sartorial. Hot chicken vaporware vexillologist polaroid, shoreditch skateboard readymade knausgaard whatever letterpress scenester viral cronut butcher. Kinfolk master cleanse neutra dreamcatcher.', 'I. Drinking vinegar sartorial kitsch organic, seitan migas kombucha tofu adaptogen crucifix unicorn. Woke palo santo kombucha gochujang DIY man bun. Cred tbh whatever, craft beer mixtape chicharrones selfies microdosing seitan. Tattooed banh mi hella semiotics green juice hammock tbh gastropub YOLO tacos roof party artisan kitsch.', "J. Fam bespoke whatever salvia enamel pin church-key humblebrag pinterest. Stumptown four dollar toast crucifix, 90's everyday carry fingerstache iPhone. Poutine stumptown typewriter iceland gastropub. Leggings literally disrupt, skateboard tote bag thundercats mlkshk ennui poke VHS biodiesel tilde portland. Pabst food truck wayfarers mixtape single-origin coffee knausgaard swag wolf. Four dollar toast shabby chic pour-over hella portland, cloud bread try-hard slow-carb shoreditch.", 'K. Kinfolk helvetica waistcoat, tote bag PBR&B paleo vice shabby chic migas. Fanny pack af deep v biodiesel cornhole chambray freegan gochujang pug whatever stumptown lomo. Try-hard XOXO heirloom, lyft mlkshk vape PBR&B vegan pour-over chillwave meggings ramps poke bitters. Cardigan vegan copper mug pickled man bun, activated charcoal truffaut kinfolk shoreditch ugh letterpress leggings roof party single-origin coffee ennui.', 'L. Bicycle rights disrupt yr cornhole celiac, mixtape slow-carb retro locavore pork belly lumbersexual squid hot chicken single-origin coffee. Tacos pitchfork pork belly seitan aesthetic. Ethical tousled flannel, letterpress slow-carb shaman tilde kogi lumbersexual next level microdosing kitsch. Chambray wolf air plant fanny pack put a bird on it. Franzen cornhole narwhal artisan lyft, skateboard bicycle rights kitsch tattooed subway tile biodiesel wayfarers. Neutra plaid franzen VHS salvia.', 'M. Freegan mumblecore man braid poke. Next level VHS pour-over hoodie sartorial forage health goth shoreditch quinoa cronut banh mi locavore everyday carry blog craft beer. Shoreditch kombucha raclette before they sold out copper mug irony truffaut yr, pitchfork fingerstache tumblr quinoa austin taxidermy. Pok pok pitchfork sartorial biodiesel tumblr narwhal. Narwhal cliche schlitz shoreditch vexillologist lumbersexual vape chia salvia forage.', "N. Kogi crucifix la croix, 90's blog normcore church-key. Flannel pitchfork kickstarter vegan. Kombucha truffaut pitchfork freegan marfa narwhal, ennui pabst yr whatever franzen neutra street art af. Direct trade portland hella, iPhone tumeric tumblr butcher prism enamel pin cred cray +1 succulents cornhole four loko. Microdosing you probably haven't heard of them synth tacos, heirloom food truck vexillologist tote bag typewriter.", 'O. Tumeric copper mug ugh poke, activated charcoal squid gochujang franzen. Biodiesel bespoke drinking vinegar aesthetic, offal next level jianbing poutine master cleanse af lumbersexual blue bottle meh crucifix. Echo park af craft beer literally. Bitters woke direct trade activated charcoal quinoa man braid austin truffaut blue bottle chillwave dreamcatcher pug raw denim. Schlitz drinking vinegar hot chicken butcher taxidermy vinyl lomo hexagon tacos. Vegan messenger bag tumeric tote bag quinoa, polaroid succulents tilde yuccie tousled snackwave pug viral.', 'P. Semiotics meditation man bun bespoke sartorial normcore chicharrones fingerstache four dollar toast helvetica. Sartorial shabby chic pinterest, blue bottle la croix pop-up activated charcoal small batch leggings neutra crucifix before they sold out. +1 banjo wolf bitters, chicharrones hoodie snackwave raclette blue bottle taiyaki tattooed church-key poke. Schlitz occupy hella, street art hashtag trust fund art party. Selvage swag cold-pressed vexillologist next level chia green juice microdosing enamel pin offal succulents selfies kitsch.', "Q. Vinyl snackwave DIY kombucha tousled, godard biodiesel tote bag semiotics. You probably haven't heard of them trust fund tacos tofu wolf direct trade 8-bit chillwave farm-to-table small batch vaporware roof party. Church-key banjo meggings live-edge austin ugh portland enamel pin artisan godard lo-fi typewriter shoreditch air plant. Truffaut mixtape austin keytar hell of raclette. Disrupt echo park cornhole direct trade DIY palo santo iceland. 90's quinoa put a bird on it raw denim, bushwick twee chartreuse.", 'R. Retro pug mixtape hashtag la croix. XOXO asymmetrical street art, cronut taxidermy selvage la croix iceland readymade fingerstache activated charcoal coloring book. Taiyaki messenger bag affogato, af XOXO pour-over selfies flexitarian. Jianbing iceland paleo, coloring book humblebrag hammock cronut enamel pin blog air plant PBR&B 3 wolf moon flannel prism. Shaman keytar direct trade street art. Brooklyn try-hard kinfolk etsy shoreditch affogato fixie.', 'S. Wolf cred austin, pok pok scenester lyft unicorn cornhole vexillologist everyday carry twee. Truffaut scenester synth aesthetic mustache hashtag biodiesel lomo. Vice man braid authentic kale chips, waistcoat jean shorts knausgaard kombucha. Enamel pin freegan intelligentsia tacos wayfarers chillwave banjo pickled semiotics.', "T. Salvia vegan sartorial, williamsburg four loko knausgaard glossier pok pok helvetica lyft. Celiac hashtag twee gluten-free bushwick tumeric actually, hoodie thundercats hexagon tattooed. Jianbing cornhole shoreditch, blog intelligentsia man bun actually pour-over chillwave you probably haven't heard of them synth. Gastropub salvia hell of butcher blue bottle, tumeric tbh vaporware poke wayfarers slow-carb edison bulb vape. Quinoa edison bulb roof party, tacos chicharrones meditation crucifix direct trade flexitarian lumbersexual cardigan organic ramps. Retro tofu direct trade flexitarian craft beer DIY squid trust fund cronut pop-up kale chips flannel."]));
      _defineProperty(this, "loadedStrings", (0, _array.A)(["A. Lorem ipsum dolor amet yr sustainable yuccie, bespoke hexagon woke brunch iPhone franzen health goth. Pork belly bushwick tumeric authentic. Cred pour-over venmo cardigan seitan fanny pack vaporware asymmetrical keytar beard migas trust fund ethical. Celiac banh mi post-ironic swag vape. Activated charcoal lyft next level mixtape post-ironic 90's. 90's XOXO austin whatever, health goth portland flannel retro air plant kinfolk.", 'B. Photo booth actually fingerstache, keffiyeh brooklyn lumbersexual fashion axe cred taiyaki tattooed palo santo schlitz flannel. Bitters four loko church-key try-hard, kogi plaid biodiesel. Iceland poke kogi biodiesel, adaptogen sriracha glossier drinking vinegar chia tattooed shabby chic iPhone disrupt cloud bread. Williamsburg schlitz selvage fingerstache flexitarian affogato swag subway tile poke af chillwave pok pok unicorn jean shorts pug. 3 wolf moon tousled dreamcatcher sartorial master cleanse small batch vice tofu taiyaki. Pabst adaptogen sartorial +1 occupy tumblr jean shorts pop-up yr edison bulb tumeric next level.', 'C. Pour-over wolf +1 selvage kombucha, salvia dreamcatcher iPhone umami whatever chia banjo four dollar toast. Yr vexillologist occupy, godard lyft typewriter cornhole. Waistcoat cornhole taxidermy, keytar post-ironic prism food truck banh mi 8-bit air plant mixtape distillery blue bottle. Semiotics flannel truffaut, seitan twee air plant offal snackwave tattooed banjo small batch microdosing cloud bread. Neutra pabst sartorial, PBR&B tattooed synth letterpress four dollar toast disrupt meditation waistcoat vice vexillologist.', "D. Vexillologist everyday carry taxidermy mixtape, health goth coloring book ennui tumblr portland farm-to-table paleo plaid viral. Four loko gentrify vaporware hexagon tote bag +1 semiotics bushwick occupy cornhole stumptown swag raw denim venmo you probably haven't heard of them. Try-hard portland coloring book mumblecore everyday carry. Bicycle rights knausgaard taiyaki, organic swag vegan godard PBR&B banjo slow-carb VHS heirloom next level. Knausgaard banh mi iceland marfa tattooed farm-to-table lyft waistcoat austin tumeric. Tumeric cornhole next level, fashion axe fam small batch prism mustache meggings cloud bread cronut twee man bun marfa. Meggings pop-up quinoa, succulents leggings hoodie gluten-free meditation trust fund chartreuse.", "E. Four loko live-edge VHS typewriter small batch bespoke pickled marfa listicle 90's photo booth. Whatever crucifix vegan unicorn leggings kinfolk. Food truck roof party scenester fanny pack intelligentsia salvia next level thundercats truffaut. Shaman actually mumblecore chambray meditation hashtag kinfolk four loko austin meggings keffiyeh meh.", 'F. Portland tote bag XOXO, af organic yuccie chartreuse kogi beard kickstarter. YOLO banjo fingerstache health goth intelligentsia crucifix. Gluten-free kogi roof party iceland tousled cardigan polaroid readymade affogato. Gentrify selvage roof party vice sartorial. +1 wayfarers man braid franzen jean shorts.', 'G. Plaid shoreditch heirloom authentic bushwick. Small batch XOXO meditation plaid woke tattooed. Vice umami tote bag, YOLO banh mi wolf yr flannel. Knausgaard everyday carry meh, succulents pabst cred literally four loko hoodie fingerstache heirloom. Fam YOLO enamel pin, vinyl vaporware chia sartorial master cleanse iceland.']));
      _initializerDefineProperty(this, "isLoadingMore", _descriptor, this);
    }
    get hasMore() {
      return this.unloadedStrings.length > 0;
    }
    loadMore() {
      this.isLoadingMore = true;
      (0, _runloop.later)(this, () => {
        for (var i = 0; i < 5; i++) {
          if (this.unloadedStrings.length > 0) {
            this.loadedStrings.pushObject(this.unloadedStrings.shiftObject());
          }
        }
        this.isLoadingMore = false;
      }, 2000);
    }
  }, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "isLoadingMore", [_tracking.tracked], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return false;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "loadMore", [_object.action], Object.getOwnPropertyDescriptor(_class2.prototype, "loadMore"), _class2.prototype), _class2);
});
;define("dummy/controllers/scroll-view", ["exports", "@ember/controller", "@glimmer/tracking", "@ember/object"], function (_exports, _controller, _tracking, _object) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _class2, _descriptor;
  /* eslint-disable ember/avoid-leaking-state-in-ember-objects */
  0; //eaimeta@70e063a35619d71f0,"@ember/controller",0,"@glimmer/tracking",0,"@ember/object"eaimeta@70e063a35619d71f
  function _initializerDefineProperty(e, i, r, l) { r && Object.defineProperty(e, i, { enumerable: r.enumerable, configurable: r.configurable, writable: r.writable, value: r.initializer ? r.initializer.call(l) : void 0 }); }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  function _applyDecoratedDescriptor(i, e, r, n, l) { var a = {}; return Object.keys(n).forEach(function (i) { a[i] = n[i]; }), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = !0), a = r.slice().reverse().reduce(function (r, n) { return n(i, e, r) || r; }, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a; }
  function _initializerWarningHelper(r, e) { throw Error("Decorating class property failed. Please ensure that transform-class-properties is enabled and runs after the decorators transform."); }
  let _class = _exports.default = (_class2 = class _class2 extends _controller.default {
    constructor(...args) {
      super(...args);
      _initializerDefineProperty(this, "isShort", _descriptor, this);
    }
    toggleIsShort() {
      this.isShort = !this.isShort;
    }
  }, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "isShort", [_tracking.tracked], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return false;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "toggleIsShort", [_object.action], Object.getOwnPropertyDescriptor(_class2.prototype, "toggleIsShort"), _class2.prototype), _class2);
});
;define("dummy/controllers/virtual", ["exports", "@ember/controller", "dummy/utils/make-model", "@ember/object", "@glimmer/tracking"], function (_exports, _controller, _makeModel, _object, _tracking) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;
  0; //eaimeta@70e063a35619d71f0,"@ember/controller",0,"dummy/utils/make-model",0,"@ember/object",0,"@glimmer/tracking"eaimeta@70e063a35619d71f
  function _initializerDefineProperty(e, i, r, l) { r && Object.defineProperty(e, i, { enumerable: r.enumerable, configurable: r.configurable, writable: r.writable, value: r.initializer ? r.initializer.call(l) : void 0 }); }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  function _applyDecoratedDescriptor(i, e, r, n, l) { var a = {}; return Object.keys(n).forEach(function (i) { a[i] = n[i]; }), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = !0), a = r.slice().reverse().reduce(function (r, n) { return n(i, e, r) || r; }, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a; }
  function _initializerWarningHelper(r, e) { throw Error("Decorating class property failed. Please ensure that transform-class-properties is enabled and runs after the decorators transform."); }
  function shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }
  let _class = _exports.default = (_class2 = class _class2 extends _controller.default {
    constructor(...args) {
      super(...args);
      _initializerDefineProperty(this, "itemWidth", _descriptor, this);
      _initializerDefineProperty(this, "itemHeight", _descriptor2, this);
      _initializerDefineProperty(this, "containerWidth", _descriptor3, this);
      _initializerDefineProperty(this, "containerHeight", _descriptor4, this);
      _defineProperty(this, "_isFullLengthCollection", true);
    }
    updateContainerWidth(ev) {
      this.containerWidth = parseInt(ev.target.value, 10);
    }
    updateContainerHeight(ev) {
      this.containerHeight = parseInt(ev.target.value, 10);
    }
    shuffle() {
      this.model = shuffle(this.model.slice(0));
    }
    makeSquare() {
      this.itemWidth = 100;
      this.itemHeight = 100;
    }
    makeRow() {
      this.itemWidth = 300;
      this.itemHeight = 100;
    }
    makeLongRect() {
      this.itemWidth = 100;
      this.itemHeight = 50;
    }
    makeTallRect() {
      this.itemWidth = 50;
      this.itemHeight = 100;
    }
    swapCollection() {
      this._isFullLengthCollection = !this._isFullLengthCollection;
      const numItems = this._isFullLengthCollection ? 1000 : 500;
      this.model = (0, _makeModel.default)(numItems)();
    }
  }, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "itemWidth", [_tracking.tracked], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return 100;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "itemHeight", [_tracking.tracked], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return 100;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "containerWidth", [_tracking.tracked], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return 300;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "containerHeight", [_tracking.tracked], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return 600;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "updateContainerWidth", [_object.action], Object.getOwnPropertyDescriptor(_class2.prototype, "updateContainerWidth"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "updateContainerHeight", [_object.action], Object.getOwnPropertyDescriptor(_class2.prototype, "updateContainerHeight"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "shuffle", [_object.action], Object.getOwnPropertyDescriptor(_class2.prototype, "shuffle"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "makeSquare", [_object.action], Object.getOwnPropertyDescriptor(_class2.prototype, "makeSquare"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "makeRow", [_object.action], Object.getOwnPropertyDescriptor(_class2.prototype, "makeRow"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "makeLongRect", [_object.action], Object.getOwnPropertyDescriptor(_class2.prototype, "makeLongRect"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "makeTallRect", [_object.action], Object.getOwnPropertyDescriptor(_class2.prototype, "makeTallRect"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "swapCollection", [_object.action], Object.getOwnPropertyDescriptor(_class2.prototype, "swapCollection"), _class2.prototype), _class2);
});
;define("dummy/helpers/cancel-all", ["exports", "ember-concurrency/helpers/cancel-all"], function (_exports, _cancelAll) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _cancelAll.default;
    }
  });
  0; //eaimeta@70e063a35619d71f0,"ember-concurrency/helpers/cancel-all"eaimeta@70e063a35619d71f
});
;define("dummy/helpers/dynamic-image", ["exports", "yapp-scroll-view/helpers/dynamic-image"], function (_exports, _dynamicImage) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _dynamicImage.default;
    }
  });
  0; //eaimeta@70e063a35619d71f0,"yapp-scroll-view/helpers/dynamic-image"eaimeta@70e063a35619d71f
});
;define("dummy/helpers/emitter-action", ["exports", "yapp-scroll-view/helpers/emitter-action"], function (_exports, _emitterAction) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _emitterAction.default;
    }
  });
  0; //eaimeta@70e063a35619d71f0,"yapp-scroll-view/helpers/emitter-action"eaimeta@70e063a35619d71f
});
;define("dummy/helpers/html-safe", ["exports", "yapp-scroll-view/helpers/html-safe"], function (_exports, _htmlSafe) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _htmlSafe.default;
    }
  });
  0; //eaimeta@70e063a35619d71f0,"yapp-scroll-view/helpers/html-safe"eaimeta@70e063a35619d71f
});
;define("dummy/helpers/perform", ["exports", "ember-concurrency/helpers/perform"], function (_exports, _perform) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _perform.default;
    }
  });
  0; //eaimeta@70e063a35619d71f0,"ember-concurrency/helpers/perform"eaimeta@70e063a35619d71f
});
;define("dummy/helpers/task", ["exports", "ember-concurrency/helpers/task"], function (_exports, _task) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _task.default;
    }
  });
  0; //eaimeta@70e063a35619d71f0,"ember-concurrency/helpers/task"eaimeta@70e063a35619d71f
});
;define("dummy/modifiers/did-insert", ["exports", "@ember/render-modifiers/modifiers/did-insert"], function (_exports, _didInsert) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _didInsert.default;
    }
  });
  0; //eaimeta@70e063a35619d71f0,"@ember/render-modifiers/modifiers/did-insert"eaimeta@70e063a35619d71f
});
;define("dummy/modifiers/did-update", ["exports", "@ember/render-modifiers/modifiers/did-update"], function (_exports, _didUpdate) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _didUpdate.default;
    }
  });
  0; //eaimeta@70e063a35619d71f0,"@ember/render-modifiers/modifiers/did-update"eaimeta@70e063a35619d71f
});
;define("dummy/modifiers/will-destroy", ["exports", "@ember/render-modifiers/modifiers/will-destroy"], function (_exports, _willDestroy) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _willDestroy.default;
    }
  });
  0; //eaimeta@70e063a35619d71f0,"@ember/render-modifiers/modifiers/will-destroy"eaimeta@70e063a35619d71f
});
;define("dummy/router", ["exports", "@ember/routing/router", "dummy/config/environment"], function (_exports, _router, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  0; //eaimeta@70e063a35619d71f0,"@ember/routing/router",0,"dummy/config/environment"eaimeta@70e063a35619d71f
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  class Router extends _router.default {
    constructor(...args) {
      super(...args);
      _defineProperty(this, "location", _environment.default.locationType);
      _defineProperty(this, "rootURL", _environment.default.rootURL);
    }
  }
  _exports.default = Router;
  Router.map(function () {
    this.route('virtual');
    this.route('images');
    this.route('scroll-view');
    this.route('loading-scroll-view');
  });
});
;define("dummy/routes/images", ["exports", "@ember/routing/route", "dummy/utils/make-model"], function (_exports, _route, _makeModel) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  0; //eaimeta@70e063a35619d71f0,"@ember/routing/route",0,"dummy/utils/make-model"eaimeta@70e063a35619d71f
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  class _default extends _route.default {
    constructor(...args) {
      super(...args);
      _defineProperty(this, "model", (0, _makeModel.default)(500, 'remoteImages'));
    }
  }
  _exports.default = _default;
});
;define("dummy/routes/scroll-position", ["exports", "@ember/routing/route", "dummy/utils/make-model"], function (_exports, _route, _makeModel) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  0; //eaimeta@70e063a35619d71f0,"@ember/routing/route",0,"dummy/utils/make-model"eaimeta@70e063a35619d71f
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  class _default extends _route.default {
    constructor(...args) {
      super(...args);
      _defineProperty(this, "model", (0, _makeModel.default)());
    }
  }
  _exports.default = _default;
});
;define("dummy/routes/virtual", ["exports", "@ember/routing/route", "dummy/utils/make-model"], function (_exports, _route, _makeModel) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  0; //eaimeta@70e063a35619d71f0,"@ember/routing/route",0,"dummy/utils/make-model"eaimeta@70e063a35619d71f
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  class _default extends _route.default {
    constructor(...args) {
      super(...args);
      _defineProperty(this, "model", (0, _makeModel.default)(1000));
    }
  }
  _exports.default = _default;
});
;define("dummy/services/scroll-position-memory", ["exports", "yapp-scroll-view/services/scroll-position-memory"], function (_exports, _scrollPositionMemory) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _scrollPositionMemory.default;
    }
  });
  0; //eaimeta@70e063a35619d71f0,"yapp-scroll-view/services/scroll-position-memory"eaimeta@70e063a35619d71f
});
;define("dummy/templates/application", ["exports", "@ember/template-factory"], function (_exports, _templateFactory) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  0; //eaimeta@70e063a35619d71f0,"@ember/template-factory"eaimeta@70e063a35619d71f
  var _default = _exports.default = (0, _templateFactory.createTemplateFactory)(
  /*
    <h2 id="title">yapp-scroll-view demos</h2>
  <div>
  <LinkTo @route='scroll-view'>ScrollView</LinkTo>
  | <LinkTo @route='loading-scroll-view'>LoadingScrollView</LinkTo>
  | <LinkTo @route='virtual'>CollectionScrollView</LinkTo>
  | <LinkTo @route='images'>CollectionScrollView w/ Images</LinkTo>
  </div>
  {{outlet}}
  
  */
  {
    "id": "ywSggWG7",
    "block": "[[[10,\"h2\"],[14,1,\"title\"],[12],[1,\"yapp-scroll-view demos\"],[13],[1,\"\\n\"],[10,0],[12],[1,\"\\n\"],[8,[39,0],null,[[\"@route\"],[\"scroll-view\"]],[[\"default\"],[[[[1,\"ScrollView\"]],[]]]]],[1,\"\\n| \"],[8,[39,0],null,[[\"@route\"],[\"loading-scroll-view\"]],[[\"default\"],[[[[1,\"LoadingScrollView\"]],[]]]]],[1,\"\\n| \"],[8,[39,0],null,[[\"@route\"],[\"virtual\"]],[[\"default\"],[[[[1,\"CollectionScrollView\"]],[]]]]],[1,\"\\n| \"],[8,[39,0],null,[[\"@route\"],[\"images\"]],[[\"default\"],[[[[1,\"CollectionScrollView w/ Images\"]],[]]]]],[1,\"\\n\"],[13],[1,\"\\n\"],[46,[28,[37,2],null,null],null,null,null],[1,\"\\n\"]],[],false,[\"link-to\",\"component\",\"-outlet\"]]",
    "moduleName": "dummy/templates/application.hbs",
    "isStrictMode": false
  });
});
;define("dummy/templates/images", ["exports", "@ember/template-factory"], function (_exports, _templateFactory) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  0; //eaimeta@70e063a35619d71f0,"@ember/template-factory"eaimeta@70e063a35619d71f
  var _default = _exports.default = (0, _templateFactory.createTemplateFactory)(
  /*
    {{!-- template-lint-disable require-input-label --}}
  <h3>Images</h3>
  <button type="button" {{on 'click' this.shuffle}}>Shuffle</button>
  <p>
    Container Width: <input type='range' min="200" max="1000" value={{this.containerWidth}} oninput={{this.updateContainerWidth}}> {{this.containerWidth}}
    Container Height: <input type='range' min="200" max="1000" value={{this.containerHeight}} oninput={{this.updateContainerHeight}}> {{this.containerHeight}}
  </p>
  <p>
  Item Height: {{this.itemHeight}}
  Item Width: {{this.itemWidth}}
  </p>
  <hr />
  
  <div class="simple-list" style={{html-safe (concat 'position:relative;width:' this.containerWidth 'px;height:' this.containerHeight 'px;')}}>
    <CollectionScrollView
      @items={{this.model}}
      @estimated-height={{this.containerHeight}}
      @estimated-width={{this.containerWidth}}
      @buffer={{1}}
      @cell-layout={{fixed-grid-layout this.itemWidth this.itemHeight}}
    >
      <:row as |item|>
        <div class="list-item">
          {{dynamic-image item.imageSrc width=50 height=50}}
          {{item.name}}
        </div>
      </:row>
    </CollectionScrollView>
  </div>
  
  */
  {
    "id": "RS50aZ4d",
    "block": "[[[10,\"h3\"],[12],[1,\"Images\"],[13],[1,\"\\n\"],[11,\"button\"],[24,4,\"button\"],[4,[38,0],[\"click\",[30,0,[\"shuffle\"]]],null],[12],[1,\"Shuffle\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"\\n  Container Width: \"],[10,\"input\"],[14,\"min\",\"200\"],[14,\"max\",\"1000\"],[15,2,[30,0,[\"containerWidth\"]]],[15,\"oninput\",[30,0,[\"updateContainerWidth\"]]],[14,4,\"range\"],[12],[13],[1,\" \"],[1,[30,0,[\"containerWidth\"]]],[1,\"\\n  Container Height: \"],[10,\"input\"],[14,\"min\",\"200\"],[14,\"max\",\"1000\"],[15,2,[30,0,[\"containerHeight\"]]],[15,\"oninput\",[30,0,[\"updateContainerHeight\"]]],[14,4,\"range\"],[12],[13],[1,\" \"],[1,[30,0,[\"containerHeight\"]]],[1,\"\\n\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"\\nItem Height: \"],[1,[30,0,[\"itemHeight\"]]],[1,\"\\nItem Width: \"],[1,[30,0,[\"itemWidth\"]]],[1,\"\\n\"],[13],[1,\"\\n\"],[10,\"hr\"],[12],[13],[1,\"\\n\\n\"],[10,0],[14,0,\"simple-list\"],[15,5,[28,[37,1],[[28,[37,2],[\"position:relative;width:\",[30,0,[\"containerWidth\"]],\"px;height:\",[30,0,[\"containerHeight\"]],\"px;\"],null]],null]],[12],[1,\"\\n  \"],[8,[39,3],null,[[\"@items\",\"@estimated-height\",\"@estimated-width\",\"@buffer\",\"@cell-layout\"],[[30,0,[\"model\"]],[30,0,[\"containerHeight\"]],[30,0,[\"containerWidth\"]],1,[28,[37,4],[[30,0,[\"itemWidth\"]],[30,0,[\"itemHeight\"]]],null]]],[[\"row\"],[[[[1,\"\\n      \"],[10,0],[14,0,\"list-item\"],[12],[1,\"\\n        \"],[1,[28,[35,5],[[30,1,[\"imageSrc\"]]],[[\"width\",\"height\"],[50,50]]]],[1,\"\\n        \"],[1,[30,1,[\"name\"]]],[1,\"\\n      \"],[13],[1,\"\\n    \"]],[1]]]]],[1,\"\\n\"],[13],[1,\"\\n\"]],[\"item\"],false,[\"on\",\"html-safe\",\"concat\",\"collection-scroll-view\",\"fixed-grid-layout\",\"dynamic-image\"]]",
    "moduleName": "dummy/templates/images.hbs",
    "isStrictMode": false
  });
});
;define("dummy/templates/loading-scroll-view", ["exports", "@ember/template-factory"], function (_exports, _templateFactory) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  0; //eaimeta@70e063a35619d71f0,"@ember/template-factory"eaimeta@70e063a35619d71f
  var _default = _exports.default = (0, _templateFactory.createTemplateFactory)(
  /*
    {{!-- template-lint-disable no-inline-styles --}}
  <div style="height:640px; width: 500px; overflow: hidden; position: relative">
    <LoadingScrollView
      @hasMore={{this.hasMore}}
      @isLoadingMore={{this.isLoadingMore}}
      @loadMore={{this.loadMore}}
      @threshold={{100}}
    >
      {{#each this.loadedStrings as |string|}}
        <p>{{string}}</p>
      {{/each}}
    </LoadingScrollView>
  </div>
  {{#if this.isLoadingMore}}
  <div style="color:red">
    LOADING MORE...
  </div>
  {{/if}}
  
  */
  {
    "id": "JooEWOuh",
    "block": "[[[10,0],[14,5,\"height:640px; width: 500px; overflow: hidden; position: relative\"],[12],[1,\"\\n  \"],[8,[39,0],null,[[\"@hasMore\",\"@isLoadingMore\",\"@loadMore\",\"@threshold\"],[[30,0,[\"hasMore\"]],[30,0,[\"isLoadingMore\"]],[30,0,[\"loadMore\"]],100]],[[\"default\"],[[[[1,\"\\n\"],[42,[28,[37,2],[[28,[37,2],[[30,0,[\"loadedStrings\"]]],null]],null],null,[[[1,\"      \"],[10,2],[12],[1,[30,1]],[13],[1,\"\\n\"]],[1]],null],[1,\"  \"]],[]]]]],[1,\"\\n\"],[13],[1,\"\\n\"],[41,[30,0,[\"isLoadingMore\"]],[[[10,0],[14,5,\"color:red\"],[12],[1,\"\\n  LOADING MORE...\\n\"],[13],[1,\"\\n\"]],[]],null]],[\"string\"],false,[\"loading-scroll-view\",\"each\",\"-track-array\",\"if\"]]",
    "moduleName": "dummy/templates/loading-scroll-view.hbs",
    "isStrictMode": false
  });
});
;define("dummy/templates/scroll-view", ["exports", "@ember/template-factory"], function (_exports, _templateFactory) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  0; //eaimeta@70e063a35619d71f0,"@ember/template-factory"eaimeta@70e063a35619d71f
  var _default = _exports.default = (0, _templateFactory.createTemplateFactory)(
  /*
    {{!-- template-lint-disable no-inline-styles require-input-label --}}
  <button type="button" {{on 'click' this.toggleIsShort}}>Toggle short content</button>
  <div style="height:640px; width: 320px; overflow: hidden; position: relative; border: 1px solid gray">
    <ScrollView>
      <p>
      Accumsan augue ac vehicula convallis sed nam lacus sociosqu ex sapien penatibus, cursus nisi mauris facilisi lectus facilisis sem luctus pharetra. Duis montes tincidunt egestas vitae ultricies habitant eleifend molestie, litora natoque maximus purus tristique magna semper, aliquam eu parturient cras quam consectetur class. Quis ornare ut pulvinar malesuada semper non sollicitudin mattis consectetur, hendrerit tristique placerat ante tincidunt vel eleifend netus amet praesent, lorem curabitur auctor sit sed ad quam class. Montes vehicula proin aptent faucibus a est tellus potenti semper class, hendrerit integer adipiscing torquent magna quisque parturient aliquam dictum nascetur, magnis pharetra varius et etiam maecenas enim porttitor elit. Praesent nam in sit montes est curabitur mauris, congue phasellus augue proin non tortor suspendisse vulputate, nulla inceptos potenti commodo sollicitudin laoreet. Lacus curae class auctor ullamcorper sociosqu proin ut, nostra venenatis aenean vitae sit dis tempus, ornare consectetur sodales malesuada magna praesent.
      </p>
      {{#unless this.isShort}}
        <p>
        Turpis in a dolor vivamus bibendum vel, maximus quam laoreet accumsan imperdiet ac lacus, sodales felis montes nullam lorem. Volutpat duis vivamus integer lorem feugiat bibendum suspendisse pretium in eu, vestibulum morbi hac dapibus facilisi leo ut blandit vulputate. Turpis urna at phasellus sociosqu imperdiet nec taciti primis, justo purus duis penatibus aliquam ligula cras maecenas magna, tristique mollis aptent dolor dictumst id nisi. Rhoncus sagittis per a pretium dapibus cubilia laoreet, velit placerat inceptos eleifend quisque lacus libero, cras aliquam hac arcu scelerisque mus. Rhoncus orci consequat ullamcorper arcu quis vivamus commodo integer facilisis, pharetra suspendisse erat enim ad non etiam maecenas, viverra ante consectetur imperdiet amet tincidunt sit conubia. Sollicitudin tempus platea fames penatibus conubia porta suspendisse condimentum bibendum aliquam nunc ex enim, placerat aliquet efficitur amet habitant iaculis ultricies finibus in nibh luctus inceptos. Egestas vel cursus commodo congue ridiculus rhoncus platea tristique praesent leo, sapien morbi ac metus magnis arcu nec mollis placerat magna vestibulum, fusce eros nisl risus lorem iaculis feugiat litora augue.
        </p>
        <textarea rows="8" cols="80"></textarea>
        <p>
        Pellentesque sit vitae rhoncus nostra leo <a href="https://en.wiktionary.org/wiki/taciti" target="_blank" rel="noopener noreferrer">taciti</a> nascetur consectetur auctor conubia, aenean faucibus vivamus potenti penatibus sociosqu mauris nam laoreet rutrum, vel magna porttitor turpis nec elementum lacinia quisque nunc. Magna iaculis ligula at volutpat lacus ante sociosqu fringilla tincidunt netus dapibus duis etiam blandit dignissim, ex accumsan habitant nisi est cursus augue mauris tortor felis suscipit auctor suspendisse. Nibh sapien hendrerit semper dolor phasellus duis malesuada facilisis penatibus vestibulum ligula, iaculis enim eu sit proin dictumst purus maecenas sodales viverra. Habitant turpis mattis fames facilisis dictumst curae mi lobortis, cras ex viverra lorem fringilla parturient duis ultricies, vivamus ipsum erat ridiculus hendrerit tempus maximus.
        </p>
        <p>
        Nulla fringilla erat ridiculus etiam curabitur auctor integer, placerat nunc aliquam lobortis nam praesent maecenas augue, feugiat vulputate sollicitudin finibus a varius. Lectus tincidunt congue platea morbi ultrices dignissim vestibulum sed fames mauris, nostra massa facilisis tristique arcu himenaeos id nunc blandit fusce, cras dis molestie laoreet vulputate egestas gravida ultricies conubia. Lacus imperdiet diam dignissim mollis augue ridiculus nascetur habitant, odio commodo malesuada et pretium at volutpat, nunc a adipiscing ante rutrum gravida fusce. Gravida volutpat felis tellus erat parturient justo montes hac porttitor ad, class mi lobortis augue vitae condimentum porta diam sapien, dolor leo magna vivamus fermentum facilisis aliquam platea phasellus. Iaculis est inceptos risus interdum dapibus pulvinar lacus felis primis dignissim, aenean diam gravida molestie lectus ac integer blandit facilisi turpis lobortis, libero ornare montes nam class venenatis fusce mattis platea.
        </p>
        <p>
        Feugiat magna nec tortor sem fusce libero in sodales, ridiculus integer penatibus mi maecenas sed nibh. Metus condimentum elit tristique justo cursus orci elementum, cras faucibus non scelerisque adipiscing cubilia nullam dis, nascetur consequat torquent magna eleifend dui.
        </p>
        <p>
        Risus sollicitudin pulvinar consectetur ultrices fusce imperdiet purus, pharetra ultricies vel habitant lacus tellus arcu enim, mollis non venenatis eu a condimentum. Nunc diam nibh vivamus ornare faucibus ante pellentesque duis porta nec elementum mauris, vitae elit donec potenti luctus libero nullam odio ullamcorper facilisis. Venenatis inceptos quam nam lacus varius ultrices tortor ex vitae, nisi sagittis purus montes pretium a penatibus. Ornare ex primis velit ac morbi non condimentum facilisi nam, tincidunt duis in pretium elit massa sollicitudin mollis. Ante suspendisse tempus lectus cras pharetra pellentesque ligula, proin id blandit magna torquent. Mus malesuada convallis natoque sit vulputate varius porttitor, consectetur himenaeos eu morbi arcu enim lobortis, sapien laoreet sodales non mollis ante. Imperdiet hendrerit eros aenean nulla, sodales tempor scelerisque pellentesque, leo nascetur mauris.
        </p>
        <p>
        Quam ante leo ipsum massa nunc interdum, donec elementum mauris varius vulputate litora et, luctus tellus fermentum maximus laoreet. Rhoncus vivamus tristique himenaeos pretium faucibus adipiscing class natoque euismod sagittis, ullamcorper eu senectus quis cras elit neque auctor penatibus, etiam mi convallis accumsan ex erat felis potenti nisi. Interdum tortor mollis dis duis integer imperdiet volutpat curabitur ultrices, ligula taciti etiam parturient gravida nunc cubilia proin purus cras, fusce placerat pretium donec lacus sagittis pellentesque penatibus facilisi, scelerisque nulla semper primis fringilla nascetur leo eget. Pulvinar tristique proin sollicitudin diam fermentum ornare est magna dis, finibus ac accumsan ligula nisl cras rutrum suspendisse curae parturient, nunc bibendum integer non libero ante felis gravida. Ex facilisi natoque quam interdum vulputate egestas non fusce scelerisque, nisi ultrices sodales tempus ullamcorper venenatis phasellus condimentum sit, vehicula parturient quisque malesuada mauris velit ante iaculis.
        </p>
        <p>
        Ut ex sagittis natoque habitant erat metus aptent, consequat tempor hendrerit dolor nulla. Diam massa fermentum phasellus lobortis habitant purus porttitor leo sagittis, nunc habitasse cras augue cursus lorem eros a sem, luctus ultricies hac adipiscing tempor amet libero dictum. Nulla vitae sodales felis nostra primis venenatis nec, diam aliquam etiam suspendisse facilisis cubilia hac morbi, et faucibus consectetur bibendum elit finibus.
        </p>
        <p>
        Libero nisi leo commodo nec nibh felis erat sociosqu mi rhoncus, donec imperdiet aliquet sem vestibulum interdum sollicitudin ex velit litora nostra, rutrum mollis orci torquent dis curae iaculis conubia turpis. Vel urna id egestas vestibulum pharetra sem potenti commodo interdum turpis, libero dignissim lacinia tempus dolor accumsan cursus iaculis nibh, diam eget metus est rutrum fusce consequat curae massa. Penatibus aptent curabitur rhoncus cras taciti maecenas commodo aliquet himenaeos felis, quisque nisi dictumst quis congue rutrum efficitur lobortis augue donec pulvinar, non id vel nullam eleifend faucibus a ante semper. Dui tortor eleifend eget sapien consectetur, augue volutpat netus dictum dapibus torquent, vitae cras ex parturient.
        </p>
        <p>
        Vivamus pharetra pellentesque cubilia vehicula nunc curabitur ad metus, sollicitudin aptent orci aliquet ornare justo commodo, rhoncus molestie tempus venenatis penatibus donec hendrerit. Tempor donec tincidunt id amet tortor maecenas curabitur dictumst duis eu vulputate leo ipsum ultricies, neque fames rhoncus cursus nibh aenean magna venenatis purus hendrerit quam nisl. Volutpat primis class lorem euismod vivamus, taciti ante sed vestibulum, tristique eu orci sapien. Mi arcu molestie nullam ligula proin leo efficitur eros pretium dolor, quam nisl posuere facilisis blandit fringilla eleifend sit. Magna interdum ultrices diam sit adipiscing faucibus blandit ac, sagittis magnis mauris tellus velit iaculis vitae tristique, parturient porttitor volutpat inceptos suscipit cursus himenaeos. Et porta amet adipiscing habitant mi consectetur hac proin ridiculus ultricies ultrices, tempus torquent sollicitudin cubilia porttitor suspendisse tellus ornare dis at, accumsan placerat elit quis cras sed nostra massa vitae purus.
        </p>
      {{/unless}}
    </ScrollView>
  </div>
  
  */
  {
    "id": "CbfWLsr+",
    "block": "[[[11,\"button\"],[24,4,\"button\"],[4,[38,0],[\"click\",[30,0,[\"toggleIsShort\"]]],null],[12],[1,\"Toggle short content\"],[13],[1,\"\\n\"],[10,0],[14,5,\"height:640px; width: 320px; overflow: hidden; position: relative; border: 1px solid gray\"],[12],[1,\"\\n  \"],[8,[39,1],null,null,[[\"default\"],[[[[1,\"\\n    \"],[10,2],[12],[1,\"\\n    Accumsan augue ac vehicula convallis sed nam lacus sociosqu ex sapien penatibus, cursus nisi mauris facilisi lectus facilisis sem luctus pharetra. Duis montes tincidunt egestas vitae ultricies habitant eleifend molestie, litora natoque maximus purus tristique magna semper, aliquam eu parturient cras quam consectetur class. Quis ornare ut pulvinar malesuada semper non sollicitudin mattis consectetur, hendrerit tristique placerat ante tincidunt vel eleifend netus amet praesent, lorem curabitur auctor sit sed ad quam class. Montes vehicula proin aptent faucibus a est tellus potenti semper class, hendrerit integer adipiscing torquent magna quisque parturient aliquam dictum nascetur, magnis pharetra varius et etiam maecenas enim porttitor elit. Praesent nam in sit montes est curabitur mauris, congue phasellus augue proin non tortor suspendisse vulputate, nulla inceptos potenti commodo sollicitudin laoreet. Lacus curae class auctor ullamcorper sociosqu proin ut, nostra venenatis aenean vitae sit dis tempus, ornare consectetur sodales malesuada magna praesent.\\n    \"],[13],[1,\"\\n\"],[41,[51,[30,0,[\"isShort\"]]],[[[1,\"      \"],[10,2],[12],[1,\"\\n      Turpis in a dolor vivamus bibendum vel, maximus quam laoreet accumsan imperdiet ac lacus, sodales felis montes nullam lorem. Volutpat duis vivamus integer lorem feugiat bibendum suspendisse pretium in eu, vestibulum morbi hac dapibus facilisi leo ut blandit vulputate. Turpis urna at phasellus sociosqu imperdiet nec taciti primis, justo purus duis penatibus aliquam ligula cras maecenas magna, tristique mollis aptent dolor dictumst id nisi. Rhoncus sagittis per a pretium dapibus cubilia laoreet, velit placerat inceptos eleifend quisque lacus libero, cras aliquam hac arcu scelerisque mus. Rhoncus orci consequat ullamcorper arcu quis vivamus commodo integer facilisis, pharetra suspendisse erat enim ad non etiam maecenas, viverra ante consectetur imperdiet amet tincidunt sit conubia. Sollicitudin tempus platea fames penatibus conubia porta suspendisse condimentum bibendum aliquam nunc ex enim, placerat aliquet efficitur amet habitant iaculis ultricies finibus in nibh luctus inceptos. Egestas vel cursus commodo congue ridiculus rhoncus platea tristique praesent leo, sapien morbi ac metus magnis arcu nec mollis placerat magna vestibulum, fusce eros nisl risus lorem iaculis feugiat litora augue.\\n      \"],[13],[1,\"\\n      \"],[10,\"textarea\"],[14,\"rows\",\"8\"],[14,\"cols\",\"80\"],[12],[13],[1,\"\\n      \"],[10,2],[12],[1,\"\\n      Pellentesque sit vitae rhoncus nostra leo \"],[10,3],[14,6,\"https://en.wiktionary.org/wiki/taciti\"],[14,\"target\",\"_blank\"],[14,\"rel\",\"noopener noreferrer\"],[12],[1,\"taciti\"],[13],[1,\" nascetur consectetur auctor conubia, aenean faucibus vivamus potenti penatibus sociosqu mauris nam laoreet rutrum, vel magna porttitor turpis nec elementum lacinia quisque nunc. Magna iaculis ligula at volutpat lacus ante sociosqu fringilla tincidunt netus dapibus duis etiam blandit dignissim, ex accumsan habitant nisi est cursus augue mauris tortor felis suscipit auctor suspendisse. Nibh sapien hendrerit semper dolor phasellus duis malesuada facilisis penatibus vestibulum ligula, iaculis enim eu sit proin dictumst purus maecenas sodales viverra. Habitant turpis mattis fames facilisis dictumst curae mi lobortis, cras ex viverra lorem fringilla parturient duis ultricies, vivamus ipsum erat ridiculus hendrerit tempus maximus.\\n      \"],[13],[1,\"\\n      \"],[10,2],[12],[1,\"\\n      Nulla fringilla erat ridiculus etiam curabitur auctor integer, placerat nunc aliquam lobortis nam praesent maecenas augue, feugiat vulputate sollicitudin finibus a varius. Lectus tincidunt congue platea morbi ultrices dignissim vestibulum sed fames mauris, nostra massa facilisis tristique arcu himenaeos id nunc blandit fusce, cras dis molestie laoreet vulputate egestas gravida ultricies conubia. Lacus imperdiet diam dignissim mollis augue ridiculus nascetur habitant, odio commodo malesuada et pretium at volutpat, nunc a adipiscing ante rutrum gravida fusce. Gravida volutpat felis tellus erat parturient justo montes hac porttitor ad, class mi lobortis augue vitae condimentum porta diam sapien, dolor leo magna vivamus fermentum facilisis aliquam platea phasellus. Iaculis est inceptos risus interdum dapibus pulvinar lacus felis primis dignissim, aenean diam gravida molestie lectus ac integer blandit facilisi turpis lobortis, libero ornare montes nam class venenatis fusce mattis platea.\\n      \"],[13],[1,\"\\n      \"],[10,2],[12],[1,\"\\n      Feugiat magna nec tortor sem fusce libero in sodales, ridiculus integer penatibus mi maecenas sed nibh. Metus condimentum elit tristique justo cursus orci elementum, cras faucibus non scelerisque adipiscing cubilia nullam dis, nascetur consequat torquent magna eleifend dui.\\n      \"],[13],[1,\"\\n      \"],[10,2],[12],[1,\"\\n      Risus sollicitudin pulvinar consectetur ultrices fusce imperdiet purus, pharetra ultricies vel habitant lacus tellus arcu enim, mollis non venenatis eu a condimentum. Nunc diam nibh vivamus ornare faucibus ante pellentesque duis porta nec elementum mauris, vitae elit donec potenti luctus libero nullam odio ullamcorper facilisis. Venenatis inceptos quam nam lacus varius ultrices tortor ex vitae, nisi sagittis purus montes pretium a penatibus. Ornare ex primis velit ac morbi non condimentum facilisi nam, tincidunt duis in pretium elit massa sollicitudin mollis. Ante suspendisse tempus lectus cras pharetra pellentesque ligula, proin id blandit magna torquent. Mus malesuada convallis natoque sit vulputate varius porttitor, consectetur himenaeos eu morbi arcu enim lobortis, sapien laoreet sodales non mollis ante. Imperdiet hendrerit eros aenean nulla, sodales tempor scelerisque pellentesque, leo nascetur mauris.\\n      \"],[13],[1,\"\\n      \"],[10,2],[12],[1,\"\\n      Quam ante leo ipsum massa nunc interdum, donec elementum mauris varius vulputate litora et, luctus tellus fermentum maximus laoreet. Rhoncus vivamus tristique himenaeos pretium faucibus adipiscing class natoque euismod sagittis, ullamcorper eu senectus quis cras elit neque auctor penatibus, etiam mi convallis accumsan ex erat felis potenti nisi. Interdum tortor mollis dis duis integer imperdiet volutpat curabitur ultrices, ligula taciti etiam parturient gravida nunc cubilia proin purus cras, fusce placerat pretium donec lacus sagittis pellentesque penatibus facilisi, scelerisque nulla semper primis fringilla nascetur leo eget. Pulvinar tristique proin sollicitudin diam fermentum ornare est magna dis, finibus ac accumsan ligula nisl cras rutrum suspendisse curae parturient, nunc bibendum integer non libero ante felis gravida. Ex facilisi natoque quam interdum vulputate egestas non fusce scelerisque, nisi ultrices sodales tempus ullamcorper venenatis phasellus condimentum sit, vehicula parturient quisque malesuada mauris velit ante iaculis.\\n      \"],[13],[1,\"\\n      \"],[10,2],[12],[1,\"\\n      Ut ex sagittis natoque habitant erat metus aptent, consequat tempor hendrerit dolor nulla. Diam massa fermentum phasellus lobortis habitant purus porttitor leo sagittis, nunc habitasse cras augue cursus lorem eros a sem, luctus ultricies hac adipiscing tempor amet libero dictum. Nulla vitae sodales felis nostra primis venenatis nec, diam aliquam etiam suspendisse facilisis cubilia hac morbi, et faucibus consectetur bibendum elit finibus.\\n      \"],[13],[1,\"\\n      \"],[10,2],[12],[1,\"\\n      Libero nisi leo commodo nec nibh felis erat sociosqu mi rhoncus, donec imperdiet aliquet sem vestibulum interdum sollicitudin ex velit litora nostra, rutrum mollis orci torquent dis curae iaculis conubia turpis. Vel urna id egestas vestibulum pharetra sem potenti commodo interdum turpis, libero dignissim lacinia tempus dolor accumsan cursus iaculis nibh, diam eget metus est rutrum fusce consequat curae massa. Penatibus aptent curabitur rhoncus cras taciti maecenas commodo aliquet himenaeos felis, quisque nisi dictumst quis congue rutrum efficitur lobortis augue donec pulvinar, non id vel nullam eleifend faucibus a ante semper. Dui tortor eleifend eget sapien consectetur, augue volutpat netus dictum dapibus torquent, vitae cras ex parturient.\\n      \"],[13],[1,\"\\n      \"],[10,2],[12],[1,\"\\n      Vivamus pharetra pellentesque cubilia vehicula nunc curabitur ad metus, sollicitudin aptent orci aliquet ornare justo commodo, rhoncus molestie tempus venenatis penatibus donec hendrerit. Tempor donec tincidunt id amet tortor maecenas curabitur dictumst duis eu vulputate leo ipsum ultricies, neque fames rhoncus cursus nibh aenean magna venenatis purus hendrerit quam nisl. Volutpat primis class lorem euismod vivamus, taciti ante sed vestibulum, tristique eu orci sapien. Mi arcu molestie nullam ligula proin leo efficitur eros pretium dolor, quam nisl posuere facilisis blandit fringilla eleifend sit. Magna interdum ultrices diam sit adipiscing faucibus blandit ac, sagittis magnis mauris tellus velit iaculis vitae tristique, parturient porttitor volutpat inceptos suscipit cursus himenaeos. Et porta amet adipiscing habitant mi consectetur hac proin ridiculus ultricies ultrices, tempus torquent sollicitudin cubilia porttitor suspendisse tellus ornare dis at, accumsan placerat elit quis cras sed nostra massa vitae purus.\\n      \"],[13],[1,\"\\n\"]],[]],null],[1,\"  \"]],[]]]]],[1,\"\\n\"],[13],[1,\"\\n\"]],[],false,[\"on\",\"scroll-view\",\"unless\"]]",
    "moduleName": "dummy/templates/scroll-view.hbs",
    "isStrictMode": false
  });
});
;define("dummy/templates/virtual", ["exports", "@ember/template-factory"], function (_exports, _templateFactory) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  0; //eaimeta@70e063a35619d71f0,"@ember/template-factory"eaimeta@70e063a35619d71f
  var _default = _exports.default = (0, _templateFactory.createTemplateFactory)(
  /*
    {{!-- template-lint-disable require-input-label --}}
  <h3>Simple Virtual</h3>
  <button type="button" {{on 'click' this.makeSquare}}>Square</button>
  <button type="button" {{on 'click' this.makeRow}}>Row</button>
  <button type="button" {{on 'click' this.makeLongRect}}>Long Rectangle</button>
  <button type="button" {{on 'click' this.makeTallRect}}>Tall Rectangle</button>
  <button type="button" {{on 'click' this.shuffle}}>Shuffle</button>
  <button type="button" {{on 'click' this.swapCollection}}>Swap for another collection half the length</button>
  <p>
    Container Width: <input type='range' min="200" max="1000" value={{this.containerWidth}} oninput={{this.updateContainerWidth}}> {{this.containerWidth}}
    Container Height: <input type='range' min="200" max="1000" value={{this.containerHeight}} oninput={{this.updateContainerHeight}}> {{this.containerHeight}}
  </p>
  <p>
  Item Height: {{this.itemHeight}}
  Item Width: {{this.itemWidth}}
  </p>
  <hr />
  
  <div class="simple-list" style={{html-safe (concat 'position:relative;width:' this.containerWidth 'px;height:' this.containerHeight 'px;')}}>
    <CollectionScrollView
       @items={{this.model}}
       @estimated-height={{this.containerHeight}}
       @estimated-width={{this.containerWidth}}
       @buffer={{1}}
       @cell-layout={{fixed-grid-layout this.itemWidth this.itemHeight}}
    >
      <:row as |item|>
        <div class="list-item">
          {{item.name}}
        </div>
      </:row>
    </CollectionScrollView>
  </div>
  
  */
  {
    "id": "0ihPuQ8h",
    "block": "[[[10,\"h3\"],[12],[1,\"Simple Virtual\"],[13],[1,\"\\n\"],[11,\"button\"],[24,4,\"button\"],[4,[38,0],[\"click\",[30,0,[\"makeSquare\"]]],null],[12],[1,\"Square\"],[13],[1,\"\\n\"],[11,\"button\"],[24,4,\"button\"],[4,[38,0],[\"click\",[30,0,[\"makeRow\"]]],null],[12],[1,\"Row\"],[13],[1,\"\\n\"],[11,\"button\"],[24,4,\"button\"],[4,[38,0],[\"click\",[30,0,[\"makeLongRect\"]]],null],[12],[1,\"Long Rectangle\"],[13],[1,\"\\n\"],[11,\"button\"],[24,4,\"button\"],[4,[38,0],[\"click\",[30,0,[\"makeTallRect\"]]],null],[12],[1,\"Tall Rectangle\"],[13],[1,\"\\n\"],[11,\"button\"],[24,4,\"button\"],[4,[38,0],[\"click\",[30,0,[\"shuffle\"]]],null],[12],[1,\"Shuffle\"],[13],[1,\"\\n\"],[11,\"button\"],[24,4,\"button\"],[4,[38,0],[\"click\",[30,0,[\"swapCollection\"]]],null],[12],[1,\"Swap for another collection half the length\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"\\n  Container Width: \"],[10,\"input\"],[14,\"min\",\"200\"],[14,\"max\",\"1000\"],[15,2,[30,0,[\"containerWidth\"]]],[15,\"oninput\",[30,0,[\"updateContainerWidth\"]]],[14,4,\"range\"],[12],[13],[1,\" \"],[1,[30,0,[\"containerWidth\"]]],[1,\"\\n  Container Height: \"],[10,\"input\"],[14,\"min\",\"200\"],[14,\"max\",\"1000\"],[15,2,[30,0,[\"containerHeight\"]]],[15,\"oninput\",[30,0,[\"updateContainerHeight\"]]],[14,4,\"range\"],[12],[13],[1,\" \"],[1,[30,0,[\"containerHeight\"]]],[1,\"\\n\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"\\nItem Height: \"],[1,[30,0,[\"itemHeight\"]]],[1,\"\\nItem Width: \"],[1,[30,0,[\"itemWidth\"]]],[1,\"\\n\"],[13],[1,\"\\n\"],[10,\"hr\"],[12],[13],[1,\"\\n\\n\"],[10,0],[14,0,\"simple-list\"],[15,5,[28,[37,1],[[28,[37,2],[\"position:relative;width:\",[30,0,[\"containerWidth\"]],\"px;height:\",[30,0,[\"containerHeight\"]],\"px;\"],null]],null]],[12],[1,\"\\n  \"],[8,[39,3],null,[[\"@items\",\"@estimated-height\",\"@estimated-width\",\"@buffer\",\"@cell-layout\"],[[30,0,[\"model\"]],[30,0,[\"containerHeight\"]],[30,0,[\"containerWidth\"]],1,[28,[37,4],[[30,0,[\"itemWidth\"]],[30,0,[\"itemHeight\"]]],null]]],[[\"row\"],[[[[1,\"\\n      \"],[10,0],[14,0,\"list-item\"],[12],[1,\"\\n        \"],[1,[30,1,[\"name\"]]],[1,\"\\n      \"],[13],[1,\"\\n    \"]],[1]]]]],[1,\"\\n\"],[13],[1,\"\\n\"]],[\"item\"],false,[\"on\",\"html-safe\",\"concat\",\"collection-scroll-view\",\"fixed-grid-layout\"]]",
    "moduleName": "dummy/templates/virtual.hbs",
    "isStrictMode": false
  });
});
;define("dummy/utils/images", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  0; //eaimeta@70e063a35619d71feaimeta@70e063a35619d71f
  var images = ['images/ebryn.jpg', 'images/iterzic.jpg', 'images/kselden.jpg', 'images/machty.jpg', 'images/rwjblue.jpg', 'images/stefanpenner.jpg', 'images/tomdale.jpg', 'images/trek.jpg', 'images/wagenet.jpg', 'images/wycats.jpg'];
  var smallImages = ['images/small/Ba_Gua_Feng-Shui-Mirror.gif', 'images/small/Bonsai.gif', 'images/small/Chouchin_Reinensai_Lantern.gif', 'images/small/Chouchin_Kuroshiro_Lantern_.gif', 'images/small/Chouchin_Shinku_Lantern.gif', 'images/small/Fuurin_Glass_Wind_Chime.gif', 'images/small/Geta_Wooden_Sandal_.gif', 'images/small/Gunsen_Fan_.gif', 'images/small/iChing_Kouka_Heads-Coin.gif', 'images/small/iChing_Kouka_Tails_Coin.gif', 'images/small/Ishidourou_Snow_Lantern.gif', 'images/small/Kakejiku_Hanging_Scroll.gif', 'images/small/Katana_and_Sheath.gif', 'images/small/Kimono_Buru_Blue.gif', 'images/small/Kimono_Chairo_Tan.gif', 'images/small/Koi.gif', 'images/small/Shamisen.gif', 'images/small/Shodou_Calligraphy.gif', 'images/small/Torii.gif', 'images/small/Tsukubai_Water_Basin.gif'];
  var strangeRatios = ['images/strange-ratios/horizontal-rectangle.jpg', 'images/strange-ratios/square.jpg', 'images/strange-ratios/vertical-rectangle.jpg'];
  var remoteImages = ['http://placecats.com/50/50', 'http://placecats.com/51/50', 'http://placecats.com/52/50', 'http://placecats.com/53/50', 'http://placecats.com/54/50', 'http://placecats.com/55/50', 'http://placecats.com/56/50', 'http://placecats.com/57/50', 'http://placecats.com/58/50', 'http://placecats.com/59/50', 'http://placecats.com/50/51', 'http://placecats.com/50/52', 'http://placecats.com/50/53', 'http://placecats.com/50/54', 'http://placecats.com/50/55', 'http://placecats.com/50/56', 'http://placecats.com/50/57', 'http://placecats.com/50/58', 'http://placecats.com/50/59', 'http://placecats.com/60/50', 'http://placecats.com/61/50', 'http://placecats.com/62/50', 'http://placecats.com/63/50', 'http://placecats.com/64/50', 'http://placecats.com/65/50', 'http://placecats.com/66/50', 'http://placecats.com/67/50', 'http://placecats.com/68/50', 'http://placecats.com/69/50', 'http://placecats.com/50/60', 'http://placecats.com/50/61', 'http://placecats.com/50/62', 'http://placecats.com/50/63', 'http://placecats.com/50/64', 'http://placecats.com/50/65', 'http://placecats.com/50/66', 'http://placecats.com/50/67', 'http://placecats.com/50/68', 'http://placecats.com/50/69'];
  var _default = _exports.default = {
    images,
    smallImages,
    strangeRatios,
    remoteImages
  };
});
;define("dummy/utils/make-model", ["exports", "dummy/utils/images"], function (_exports, _images) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = makeModel;
  0; //eaimeta@70e063a35619d71f0,"dummy/utils/images"eaimeta@70e063a35619d71f
  function makeModel(count = 1000, imageArrayName = 'images') {
    var imagesArray = _images.default[imageArrayName];
    return function model() {
      var result = [];
      for (var i = 0; i < count; i++) {
        result.push({
          name: `Item ${i + 1}`,
          imageSrc: imagesArray[i % imagesArray.length]
        });
      }
      return result;
    };
  }
});
;

;define('dummy/config/environment', [], function() {
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

;
          if (!runningTests) {
            require("dummy/app")["default"].create({"LOG_ACTIVE_GENERATION":false,"LOG_VIEW_LOOKUPS":false,"rootElement":"#ember-testing","autoboot":false});
          }
        
//# sourceMappingURL=dummy.map
