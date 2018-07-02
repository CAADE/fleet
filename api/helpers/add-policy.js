module.exports = {


  friendlyName: 'Add Policy',


  description: 'Add Policy',


  inputs: {
    policy: {
      description: 'policy description',
      type: 'json',
      required: true
    },
    name: {
      description: 'name of the policy',
      type: 'string',
      required: true
    },
    mode: {
      description: 'mode to return',
      type: 'string',
      required: false
    }
  },


  exits: {
    success: {
      responseType: 'model',
    },
    notEnoughHardware: {
      description: 'Not enough resources available'
    }
  },

  fn: async function (inputs, exits) {

    // All done.
    try {
      let data = inputs.policy;
      // Create the app first.
      let policy = await Policy.create({name: inputs.name, disabled: false}).fetch();
      // Now create the resources in the cloud for the application.
      let i = 0;
      for (let id in data.triggers) {
        let name = inputs.name + i;
        let tdata = data.triggers[id];
        let trigger = await sails.helpers.addTrigger.with({
          name: name,
          events: tdata.events,
          condition: tdata.condition,
          action: tdata.action
        });
        trigger = await Trigger.update({id: trigger.id}, {fired: false, policy: policy.id}).fetch();
        i++;
      }
      policy = await Policy.findOne({id: policy.id}).populateAll();
      sails.sockets.broadcast('fleet', 'policy', policy);
      return exits.success('Ok');
    }
    catch (e) {
      console.error('Error');
      console.error(e);
      return exits.error(e);
    }
  }
};

