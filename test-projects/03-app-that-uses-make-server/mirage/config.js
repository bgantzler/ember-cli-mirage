import { createServer } from 'miragejs';
import { mergeEmberDataModels } from 'ember-cli-mirage';

export function makeServer(options) {
  options.models = mergeEmberDataModels(options.models);
  return createServer(options)
}

export default function() {
  this.resource('user');
}
