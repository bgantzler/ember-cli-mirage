# Server configuration

The MirageJS server is configured for you by ember-cli-mirage. However, if you need to customize the server you can by creating a makeServer function in the config.js.

The makeServer function receives a config parameter that is the same format as the MirageJS hash that is passed the MirageJS `Server` with the following properties already defined:

    models       = hash of all mirage models defined in the models directory
    serializers  = hash of all mirage serializers defined in the serializers directory
    factories    = hash of all mirage factories defined in the factories directory
    routes       = function that is exported as default from the mirage/config.js or undefined if there is no default export function

The config would look like this. 
```js
// mirage/config.js
import { createServer } from 'miragejs';

export function makeServer(config) {
  return createServer(config);
}

export default function() {
  this.resource('users')
}
```

You can configure this server according to the [MirageJS documentation](https://).

Ember Data models automatic discovery has been part of ember-cli-mirage for quite sometime and was enabled by default. If you define a makeServer function, the Ember Data models are no longer controlled by the discoverEmberDataModels environment variable, you are now configuring the server. You will need to add the discovery to your configuration by importing and calling the mergeEmberDataModels function. This will merge the ember data models with the mirage defined models. If there is a mirage model and an ember data model, the mirage model will be the one in the merged set.

```js
// mirage/config.js
import { Server } from 'miragejs';
import { mergeEmberDataModels } from 'ember-cli-mirage';

export function makeServer(config) {
  config.models = mergeEmberDataModels(config.models);
  return new Server(config);
}

export default function() {
  this.resource('users')
}
```
