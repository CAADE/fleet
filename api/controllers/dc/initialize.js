var YAML = require('yamljs');

async function addClouds() {
  let cloud = await Cloud.create({name:'FM1',disabled:false}).fetch();
  await addHardware(cloud);
  sails.sockets.broadcast('fleet', 'cloud', cloud);
  cloud = await Cloud.create({name:'SC12',disabled:false}).fetch();
  await addHardware(cloud);
  sails.sockets.broadcast('fleet', 'cloud', cloud);
  cloud = await Cloud.create({name:'JF5',disabled:false}).fetch();
  await addHardware(cloud);
  sails.sockets.broadcast('fleet', 'cloud', cloud);
}

async function addHardware(cloud) {
  for (let i = 0; i < 10; i++) {
    let item = {
      name: cloud.name + '-Compute' + i,
      type: 'compute',
      available: 28,
      capacity: 28,
      disabled: false,
      cloud: cloud.id
    };
    let hardware = await Hardware.create(item).fetch();
    sails.sockets.broadcast('fleet', 'hardware', hardware);
  }
  for (let i = 0; i < 5; i++) {
    let item = {
      name: cloud.name + '-Storage' + i,
      type: 'storage',
      available: 100000,
      capacity: 100000,
      cloud: cloud.id,
      disabled: false
    };
    let hardware = await Hardware.create(item).fetch();
    sails.sockets.broadcast('fleet', 'hardware', hardware);
  }
  for (let i = 0; i < 5; i++) {
    let item = {
      name: cloud.name + '-Network' + i,
      type: 'network',
      available: 254,
      capacity: 254,
      cloud: cloud.id,
      disabled: false
    };
    let hardware = await Hardware.create(item).fetch();
    sails.sockets.broadcast('fleet', 'hardware', hardware);
  }
}

async function addApplications() {
  const app1 = YAML.load('assets/app.yaml');
  await sails.helpers.addApplication.with(app1);
  const app2 = YAML.load('assets/app2.yaml');
  await sails.helpers.addApplication.with(app2);
}

async function addEvents() {
  let event = await Events.findOrCreate({name: 'accident'}, {name: 'accident', value: 0});
  sails.sockets.broadcast('fleet', 'events', event);
  event = await Events.findOrCreate({name: 'ingestion'}, {name: 'ingestion', value: 0});
  sails.sockets.broadcast('fleet', 'events', event);
  event = await Events.findOrCreate({name: 'tps'}, {name: 'tps', value: 0});
  sails.sockets.broadcast('fleet', 'events', event);
  event = await Events.findOrCreate({name: 'util'}, {name: 'util', value: 0});
  sails.sockets.broadcast('fleet', 'events', event);
  event = await Events.findOrCreate({name: 'compute'}, {name: 'compute', value: 0});
  sails.sockets.broadcast('fleet', 'events', event);

  event = await Events.findOrCreate({name: 'instances'}, {name: 'instances', value: 0});
  sails.sockets.broadcast('fleet', 'events', event);

  event = await Events.findOrCreate({name: 'services'}, {name: 'services', value: 0});
  sails.sockets.broadcast('fleet', 'events', event);

  event = await Events.findOrCreate({name: 'apps'}, {name: 'apps', value: 0});
  sails.sockets.broadcast('fleet', 'events', event);
}

async function addPolicies() {
  const policy1 = YAML.load('assets/policy.yaml');
  policy1.name = 'accident';
  await sails.helpers.addPolicy.with(policy1);

  const policy2 = YAML.load('assets/policy2.yaml');
  policy2.name = 'ingestion';
  await sails.helpers.addPolicy.with(policy2);

  const policy3 = YAML.load('assets/policy3.yaml');
  policy3.name = 'thruput';
  await sails.helpers.addPolicy.with(policy3);
}

module.exports = {

  friendlyName: 'dc initialize',
  description: 'DC Initialize Data Center',
  inputs: {
    mode: {
      description: 'results format: json or html',
      type: 'string',
      required: false
    }
  },

  exits: {
    success: {
      responseType: 'redirect',
    },
    json: {
      responseType: '', // with return json
    },
    notFound: {
      description: 'No user with the specified ID was found in the database.',
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits, env) {

    try {
      await Application.destroy({});
      await Cloud.destroy({});
      await CloudResource.destroy({});
      await Events.destroy({});
      await Hardware.destroy({});
      await Service.destroy({});
      await ServiceInstance.destroy({});
      await Policy.destroy({});
      await Trigger.destroy({});
      await Vehicle.destroy({});
      await Cloud.destroy({});
      await addClouds();
      await addApplications();
      await addEvents();
      await addPolicies();

      // Display the results
      if (inputs.mode === 'json') {
        // Return json
        return exits.json('OK');
      }
      else {
        // Display the welcome view.
        return exits.success('/dc/graph');
      }
    }
    catch (e) {
      return exits.error(e);
    }
  },
};

