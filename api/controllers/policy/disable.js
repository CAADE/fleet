
module.exports = {

  friendlyName: 'policy disable',

  description: ' Add description ',

  inputs: {
    name: {
      description: 'Disable policy based on name',
      type: 'string',
      required: true
    },
    mode: {
      description: 'results format: json or html',
      type: 'string',
      required: false
    }
  },

  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'welcome'
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
      let policy = await Policy.findOne({name: inputs.name}).populateAll();
      if(policy) {
        for(id in policy.triggers) {
          let trigger = policy.triggers[id];
          await Trigger.update({id:trigger.id}, {disabled: true});
        }
        Policy.update({id:policy.id}, {disabled: true});
      }
      else {
        return exits.notFound(inputs);
      }

      // Display the results
      if(inputs.mode === 'json') {
        // Return json
        return exits.json({policy});
      }
      else {
        // Display the welcome view.
        return exits.success({policy});
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

