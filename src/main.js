/*module.exports = {
  Base: require('./base'),
  Storm: require('./storm'),
  //StormBit: require('./stormbit'),
  Spine: require('./spine'),
  Shell: require('./shell'),
  //ShellBit: require('./shellbit'),
  Vortex: require('./vortex'),
  //VortexBit: require('./vortexbit')
};*/

// TODO:

module.exports = {
  Funnel: {
    Base: require('./base'),
    Storm: require('./storm'),
    Spine: require('./spine'),
    Shell: require('./shell'),
    Vortex: require('./vortex')
  },
  Vortex: {
    Base: require('./base'),
    StormBit: require('./stormbit'),
    Spine: require('./spine'),
    ShellBit: require('./shellbit'),
    VortexBit: require('./vortexbit')
  }
};
