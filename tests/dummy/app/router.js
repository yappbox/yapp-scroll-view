import EmberRouter from '@ember/routing/router';
import config from 'dummy/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('virtual');
  this.route('images');
  this.route('scroll-view');
  this.route('loading-scroll-view');
});
