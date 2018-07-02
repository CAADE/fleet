module.exports = {

  friendlyName: 'policy add',

  description: ' Add description ',

  inputs: {
    name: {
      description: 'Add Policy to the Data Center',
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
      let data = this.req.body.policy;
      await sails.helpers.addPolicy.with({policy: data, name: inputs.name});
      return exits.json('Ok');
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

