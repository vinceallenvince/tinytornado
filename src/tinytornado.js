var Burner = require('burner');
var Mover = require('./mover');
var Oscillator = require('./oscillator');
var Particle = require('./particle');
var Utils = require('drawing-utils-lib');
var Vector = require('vector2d-lib');
var SimplexNoise = require('quietriot');

/**
 * Creates a new TinyTornado.
 * @constructor
 */
function TinyTornado() {

}

/**
 * Minium width of the funnel base.
 * @type {Number}
 * @memberof TinyTornado
 */
TinyTornado.FUNNEL_MIN_WIDTH = 5;

/**
 * Holds a Perlin noise value.
 * @type {Number}
 * @memberof TinyTornado
 */
TinyTornado.noise = 0;

/**
 * Initializes an instance of TinyTornado.
 * @memberof TinyTornado
 * @param {Object} [opt_world_options=] A map of initial world properties.
 * @param {Object} [opt_world_options.el = document.body] The world's DOM object.
 * @param {number} [opt_world_options.width = 800] The world width in pixels.
 * @param {number} [opt_world_options.height = 600] The world height in pixels.
 * @param {number} [opt_world_options.borderWidth = 1] The world border widthin pixels.
 * @param {string} [opt_world_options.borderStyle = 'solid'] The world border style.
 * @param {Object} [opt_world_options.borderColor = 0, 0, 0] The world border color.
 * @param {Object} [opt_base_options=] A map of initial base properties.
 * @param {boolean} [opt_base_options.perlin = true] Set to true to move the base via perlin noise.
 * @param {number} [opt_base_options.perlinSpeed = 0.0001] The base perlin speed.
 * @param {number} [opt_base_options.perlinTime = 100] The initial base perlin time.
 * @param {Object} [opt_base_options.initialLocation = bottom middle of the world] The initial base location.
 * @param {Object} [opt_base_options.amplitude = world.width / 4, 0] The limit of the base location.
 * @param {Object} [opt_joint_options=] A map of initial joint properties.
 * @param {number} [opt_joint_options.jointDensity = 25] The number of joints in the funnel.
 */
TinyTornado.prototype.init = function(opt_world_options, opt_base_options, opt_joint_options) {

  var world_options = opt_world_options || {},
      base_options = opt_base_options || {},
      joint_options = opt_joint_options || {};

  Burner.System.Classes = {
    Mover: Mover,
    Oscillator: Oscillator,
    Particle: Particle
  };

  Burner.System.setup(this.setupCallback.bind(this, world_options, base_options, joint_options));
  Burner.System.clock = 10000; // advance the clock so we get deeper in the noise space
  Burner.System.loop(this.getNoise.bind(this));
};

TinyTornado.prototype.setupCallback = function(world_options, base_options, joint_options) {

  this.world = Burner.System.add('World', {
    el: world_options.el || document.body,
    color: world_options.color || [40, 40, 40],
    width: world_options.width || 800,
    height: world_options.height || 600,
    borderWidth: world_options.borderWidth || 1,
    borderStyle: world_options.borderStyle || 'solid',
    borderColor: world_options.borderColor || [0, 0, 0],
    gravity: new Vector(),
    c: 0
  });

  // BASE
  this.base = Burner.System.add('Oscillator', {
    perlin: typeof base_options.perlin !== 'undefined' ? base_options.perlin : true,
    perlinSpeed: base_options.perlinSpeed || 0.0001,
    perlinTime: base_options.perlinTime || 100,
    initialLocation: base_options.initialLocation ||
        new Vector(this.world.width / 2, this.world.height),
    amplitude: base_options.amplitude || new Vector(this.world.width / 4, 0),
    acceleration: new Vector(),
    aVelocity: new Vector(),
    opacity: 0,
    life: 1,
    afterStep: this.baseAfterStep.bind(this)
  });


  // FUNNEL

  var jointDensity = joint_options.jointDensity || 25;

  for (var i = 0, max = Math.floor(this.world.height / jointDensity); i < max; i++) {

    var ease = Math.easeInCirc(i, 0, 1, max - 1);

    // joints
    var joint = Burner.System.add('Mover', {
      parent: this.base,
      offsetDistance: ease * this.world.height,
      offsetAngle: 270,
      opacity: 0,
      afterStep: this.jointAfterStep
    });
    joint.index = i;

    // use Perlin noise to generate the parent node's offset from the funnel's y-axis
    // use easing so the effect is amplified
    joint.offsetFromCenter = Math.easeInSine(i, 0, 1, max - 1) *
        SimplexNoise.noise(i * 0.1, 0) * 20;

    // body
    var easeFunnelShape = Math.easeInExpo(i, 0, 1, max - 1);

    var colorNoise = Math.floor(Utils.map(SimplexNoise.noise(i * 0.05, 0),
        -1, 1, 50, 255));

    Burner.System.add('Oscillator', {
      parent: joint,
      width: 0,
      height: 0,
      boxShadowBlur: (easeFunnelShape * 350) + TinyTornado.FUNNEL_MIN_WIDTH, // 400
      boxShadowSpread: (easeFunnelShape * 250) + TinyTornado.FUNNEL_MIN_WIDTH, // 300
      boxShadowColor: [colorNoise, colorNoise, colorNoise],
      perlin: false,
      initialLocation: new Vector(this.world.width / 2, this.world.height),
      amplitude: new Vector((2 - easeFunnelShape) * 1, 0),
      acceleration: new Vector(1 / (i + 1), 0)
    });
  }

  // MASKS

  var maskWidth = (document.body.scrollWidth - this.world.width) / 2,
    maskHeight = (document.body.scrollHeight - this.world.height) / 2;

  this.createMask({ // top
    location: new Burner.Vector(this.world.width/2, -1 - maskHeight / 2),
    width: this.world.width + 10,
    height: maskHeight
  });

  this.createMask({ // bottom
    location: new Burner.Vector(this.world.width/2, this.world.height + 1 + maskHeight / 2),
    width: this.world.width + 10,
    height: maskHeight
  });

  this.createMask({ // left
    location: new Burner.Vector(-1 - maskWidth / 2, this.world.height / 2),
    width: maskWidth,
    height: document.body.scrollHeight
  });

  this.createMask({ // right
    location: new Burner.Vector(this.world.width + 1 + maskWidth / 2, this.world.height / 2),
    width: maskWidth,
    height: document.body.scrollHeight
  });

};

TinyTornado.prototype.createMask = function(opt_options) {

  var options = opt_options || {};

  Burner.System.add('Mover', {
    location: options.location,
    width: options.width,
    height: options.height,
    isStatic: true,
    borderRadius: 0,
    borderWidth: 0,
    zIndex: 100,
    color: [20, 20, 20]
  });
};

TinyTornado.prototype.baseAfterStep = function() {

  var base = this.base;

  // use life to throttle particle system
  if ((Burner.System.clock % 3) === 0) {

    var accel = new Vector(1, 1);
    accel.normalize();
    accel.mult(Utils.getRandomNumber(0.01, 0.1, true));
    accel.rotate(Utils.degreesToRadians(Utils.getRandomNumber(150, 300)));

    var size = Utils.getRandomNumber(1, 3, true);
    var color = Utils.getRandomNumber(100, 200);

    Burner.System.add('Particle', {
      location: new Vector(base.location.x, base.location.y),
      acceleration: accel,
      width: 0,
      height: 0,
      borderWidth: 0,
      boxShadowBlur: size * 10,
      boxShadowSpread: size * 3,
      boxShadowColor: [color, color, color],
      maxSpeed: Utils.getRandomNumber(1, 20, true),
      opacity: Utils.getRandomNumber(0.1, 0.2, true),
      lifespan: Utils.getRandomNumber(70, 120)
    });
  }
};

TinyTornado.prototype.jointAfterStep = function() {
  var offset = this.index * this.offsetFromCenter * TinyTornado.noise;
  this.location.x = this.location.x + (offset);
};

TinyTornado.prototype.getNoise = function() {
  TinyTornado.noise = SimplexNoise.noise(Burner.System.clock * 0.0001, 0);
};

module.exports = TinyTornado;
