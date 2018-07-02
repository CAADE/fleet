
module.exports = {

  friendlyName: 'policy list',

  description: ' Add description ',

  inputs: {
    mode: {
      description: 'results format: json or html',
      type: 'string',
      required: false
    }
  },

  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'dc/graph'
    },
    json: {
      responseType: '', // with return json
    }
  },

  fn: async function (inputs, exits, env) {

    try {
      let policies = await Policy.find().populateAll();

      // Display the results
      if(inputs.mode === 'json') {
        // Return json
        return exits.json(policies);
      }
      else {
        // Display the welcome view.
        return exits.success(policies);
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

