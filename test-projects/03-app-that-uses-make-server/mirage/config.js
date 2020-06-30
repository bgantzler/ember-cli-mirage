import { Server } from 'miragejs';
import { discoverEmberDataModels } from 'ember-cli-mirage';

export function makeServer(options) {
  options.routes = routeHandlers;
  options.models = discoverEmberDataModels(options.models);
  return new Server(options)
}

function routeHandlers() {
  this.resource('user');
}
