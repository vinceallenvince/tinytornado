var Burner = require('burner');
var Mover = require('./mover');
var Oscillator = require('./oscillator');
var Particle = require('./particle');
var Utils = require('drawing-utils-lib');
var Vector = require('vector2d-lib');
var SimplexNoise = require('quietriot');

var JOINT_DETAIL = 25; // higher value = less joints
var FUNNEL_MIN_WIDTH = 5;

function TinyTornado() {
  this.name = 'TinyTornado';
  this.joints = [];
  this.noise = 0; // reference for a single Perlin noise pattern for the entire funnel
}

TinyTornado.prototype.init = function(opt_world_options, opt_base_options) {

  var world_options = opt_world_options || {},
      base_options = opt_base_options || {};

  Burner.System.Classes = {
    Mover: Mover,
    Oscillator: Oscillator,
    Particle: Particle
  };

  Burner.System.setup(this.setupCallback.bind(this, world_options, base_options));

  Burner.System.loop();
};

TinyTornado.prototype.setupCallback = function(world_options, base_options) {

  this.world = Burner.System.add('World', {
    el: world_options.el || document.body,
    color: world_options.color || [40, 40, 40],
    width: world_options.width || 800,
    height: world_options.height || 600,
    borderWidth: world_options.borderWidth || 1,
    borderStyle: world_options.borderStyle || 'solid',
    borderColor: world_options.borderColor || [100, 100, 100],
    gravity: new Vector(0, 0),
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


  var world = this.world;
  var noise = this.noise;
  var base = this.base;

  // FUNNEL
  for (var i = 0, max = Math.floor(this.world.height / JOINT_DETAIL); i < max; i++) {

    var ease = Math.easeInCirc(i, 0, 1, max - 1);

    // funnel joints
    var joint = Burner.System.add('Mover', {
      parent: base,
      offsetDistance: ease * world.height,
      offsetAngle: 270,
      opacity: 0,
      afterStep: function() {
        // TODO: why can't joints increments their own noise here?
        var offset = this.index * this.offsetFromCenter * this.noise;
        this.location.x = this.location.x + (offset);
      }
    });
    joint.index = i;
    joint.noise = 0;

    // use Perlin noise to generate the parent node's offset from the funnel's y-axis
    // use easing so the effect is amplified
    joint.offsetFromCenter = Math.easeInSine(i, 0, 1, max - 1) *
        SimplexNoise.noise(i * 0.1, 0) * 20;

    this.joints.push(joint);

    // funnel body
    var easeFunnelShape = Math.easeInExpo(i, 0, 1, max - 1);

    var colorNoise = Math.floor(Utils.map(SimplexNoise.noise(i * 0.05, 0),
        -1, 1, 50, 255));

    Burner.System.add('Oscillator', {
      parent: joint,
      width: 0,
      height: 0,
      boxShadowBlur: (easeFunnelShape * 250) + FUNNEL_MIN_WIDTH, // 400
      boxShadowSpread: (easeFunnelShape * 250) + FUNNEL_MIN_WIDTH, // 300
      boxShadowColor: [colorNoise, colorNoise, colorNoise],
      perlin: false,
      perlinSpeed: 0.001,
      initialLocation: new Vector(this.world.width / 2, this.world.height),
      amplitude: new Vector((1 - easeFunnelShape) * 1, 0),
      acceleration: new Vector(1 / (i + 1), 0)
    });
  }
};

TinyTornado.prototype.baseAfterStep = function() {

  var base = this.base;

  base.life += 1;

  // increment the shared noise pattern
  this.noise = SimplexNoise.noise(base.perlinTime, 0);

  // update joints' noise
  for (var i = 0, max = this.joints.length; i < max; i++) {
    this.joints[i].noise = this.noise;
  }

  // use life to throttle particle system
  if ((base.life % 3) === 0) {

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

module.exports = TinyTornado;
