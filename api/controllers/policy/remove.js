
module.exports = {

  friendlyName: 'policy remove',

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
    },
    notFound: {
      description: 'No user with the specified ID was found in the database.',
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits, env) {

    try {
      let policy = await Policy.findOne({name:inputs.name});
      if (!policy) {return exits.notFound('/dc/graph');}
      for(let i in policy.triggers) {
        await Trigger.destroy({id:policy.triggers[i].id});
      }
      await Policy.destroy({id:policy.id});
      sails.sockets.broadcast('fleet', 'policy-destroy', policy);

      // Display the results
      if(inputs.mode === 'json') {
        // Return json
        return exits.json("OK");
      }
      else {
        // Display the welcome view.
        return exits.success("OK");
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

