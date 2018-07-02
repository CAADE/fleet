module.exports = {
  friendlyName: 'Add Trigger',
  description: 'Add Trigger',
  inputs: {
    name: {
      description: 'Name of the trigger',
      type: 'string',
      required: false
    },
    events: {
      description: 'Name of the Events to monitor',
      type: 'string',
      required: false
    },
    condition: {
      description: 'Condition to meet (events > 100',
      type: 'string',
      required: false
    },
    action: {
      description: 'Action to take sails.helpers.incService(\'ingress\', 100);',
      type: 'string',
      required: false
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
    }
  },

  fn: async function (inputs, exits) {
    try {
      // Try and find the trigger by name first.
      let trigger = await Trigger.findOne({name: inputs.name});
      if (!trigger) {
        trigger = await Trigger.create({name: inputs.name, fired: false}).fetch();
      }
      // Now find the events that we are monitoring.
      let events = await Events.findOrCreate({name: inputs.events},{name:inputs.events});
      trigger = await Trigger.update({id: trigger.id}, {
        event: events.id,
        condition: inputs.condition,
        action: inputs.action
      }).fetch();

      sails.sockets.broadcast('fleet', 'trigger', trigger[0]);
      // Display the results
      if (inputs.mode === 'json') {
        // Return json
        return exits.json(trigger[0]);
      }
      else {
        // Display the welcome view.
        return exits.success(trigger[0]);
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

