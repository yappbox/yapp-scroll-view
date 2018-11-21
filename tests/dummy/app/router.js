import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('virtual');
  this.route('images');
  this.route('scroll-view');
  this.route('loading-scroll-view');
});

export default Router;
