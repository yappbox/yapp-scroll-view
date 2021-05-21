import Route from '@ember/routing/route';
import makeModel from '../utils/make-model';

export default class extends Route {
  model = makeModel(500, 'remoteImages')
}
