/* global requirejs */

import require from 'require';
import config from 'ember-get-config';
import assert from './assert';
import { hasEmberData, isDsModel } from 'ember-cli-mirage/utils/ember-data';
import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

const {
  modulePrefix,
  podModulePrefix
} = config;

// Caches
let DsModels, Models;

/**
 * Get all ember data models under the app's namespaces
 *
 * @method getDsModels
 * @private
 * @hide
 * @return {Object} models
 */
export function getDsModels() {
  if (DsModels) {
    return DsModels;
  }

  let moduleMap = requirejs.entries;
  let classicModelMatchRegex = new RegExp(`^${modulePrefix}/models/(.*)$`, 'i');
  let podModelMatchRegex = new RegExp(`^${podModulePrefix || modulePrefix}/(.*)/model$`, 'i');

  DsModels = {};

  if (!hasEmberData) {
    return DsModels;
  }

  Object.keys(moduleMap)
    .forEach((path) => {
      let matches = path.match(classicModelMatchRegex) || path.match(podModelMatchRegex);
      if (matches && matches[1]) {
        let modelName = matches[1];

        let model = require(path, null, null, true).default;
        if (isDsModel(model)) {
          DsModels[modelName] = model;
        }
      }
    });

  return DsModels;
}

/**
 *
 * This will discover all of the ember data models and merge them with the mirage models with
 * the mirage models overriding the ember data ones.
 *
 * @method mergeEmberDataModels
 * @param mirageModels - the mirage models
 * @returns models - all the mirage models merged with the discovered ember data models
 */
export function mergeEmberDataModels(mirageModels) {
  let models;

  if (hasEmberData) {
    models = Object.assign({}, getModels(), mirageModels);
  }

  return models || mirageModels;
}

/**
 * Get all mirage models for each of the ember-data models
 *
 * @method getModels
 * @private
 * @hide
 * @return {Object} models
 */
export function getModels() {
  if (Models) {
    return Models;
  }

  let emberDataModels = getDsModels();
  Models = {};

  Object.keys(emberDataModels).forEach(modelName => {
    let model = emberDataModels[modelName];
    let attrs = {};

    model.eachRelationship((name, r) => {
      if (r.kind === 'belongsTo') {
        attrs[name] = belongsTo(r.type, r.options);
      } else if (r.kind === 'hasMany') {
        attrs[name] = hasMany(r.type, r.options);
      }
    });

    Models[modelName] = Model.extend(attrs);
  });

  return Models;
}

/**
 * A lookup method for an autogenerated model
 *
 * @method modelFor
 * @private
 * @param  {String} name
 * @return {Model}
 * @hide
 */
export function modelFor(name) {
  let models = getModels();
  assert(!!models[name], `Model of type '${name}' does not exist.`);
  return models[name];
}
