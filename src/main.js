module.exports = {
  Funnel: {
    Base: require('./base'),
    Debris: require('./debris'),
    Spine: require('./spine'),
    Shell: require('./shell'),
    Runner: require('./runner')
  },
  Vortex: {
    Base: require('./base'),
    DebrisBit: require('./bitshadow/debrisbit'),
    Spine: require('./spine'),
    ShellBit: require('./bitshadow/shellbit'),
    RunnerBit: require('./bitshadow/runnerbit')
  }
};
