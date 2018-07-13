module.exports = {


  friendlyName: 'Buildstuff',


  description: 'Buildstuff something.',


  inputs: {
    name: {
      description: "Name of the script",
      type: 'string',
    }

  },


  fn: async function (inputs, exits) {

    sails.log('Running custom shell script... (`buildstuff`)');
    sails.log(inputs);

    // All done.
    return exits.success();

  }


};

