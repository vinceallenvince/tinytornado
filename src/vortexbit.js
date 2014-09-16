var BitShadowMachine = require('bitshadowmachine');
var Mover = require('bitshadowitems').Mover;
var Oscillator = require('bitshadowitems').Oscillator;
var Particle = require('bitshadowitems').Particle;
var Utils = require('burner').Utils;
var Vector = require('burner').Vector;
var SimplexNoise = require('quietriot');
var Easing = require('./easing');
var Mask = require('./mask');

/**
 * Creates a new VortexBit.
 * @param {Object} base A map of properties describing the base of the tornado.
 * @param {Object} storm A map of properties describing the storm at the base of the tornado.
 * @param {Object} spine A map of properties describing the tornado's spine.
 * @param {Object} shell A map of properties describing the tornado's shell (funnel).
 * @constructor
 */
function VortexBit(base, storm, spine, shell) {
  this.base = base;
  this.storm = storm;
  this.spine = spine;
  this.shell = shell;
}

/**
 * Holds a Perlin noise value.
 * @type {Number}
 * @memberof VortexBit
 */
VortexBit.noise = 0;

/**
 * Initializes an instance of VortexBit.
 * @param {Object} [opt_options=] A map of initial world properties.
 * @param {Object} [opt_options.el = document.body] World's DOM object.
 * @param {number} [opt_options.width = 800] World width in pixels.
 * @param {number} [opt_options.height = 600] World height in pixels.
 * @param {number} [opt_options.borderWidth = 1] World border widthin pixels.
 * @param {string} [opt_options.borderStyle = 'solid'] World border style.
 * @param {Object} [opt_options.borderColor = 0, 0, 0] World border color.
 * @memberof VortexBit
 */
VortexBit.prototype.init = function(opt_options) {

  var options = opt_options || {};

  BitShadowMachine.System.Classes = {
    Mover: Mover,
    Oscillator: Oscillator,
    Particle: Particle
  };
  BitShadowMachine.System.setup(this._setupCallback.bind(this, options));
  BitShadowMachine.System.clock = 10000; // advance the clock so we start deeper in the noise space
  BitShadowMachine.System.loop(this._getNoise.bind(this));
};

/**
 * Sets up the world and items.
 * @param {Object} options World options.
 * @memberof VortexBit
 * @private
 */
VortexBit.prototype._setupCallback = function(options) {

  var world = BitShadowMachine.System.add('World', {
    el: options.el || document.body,
    resolution: options.resolution || 4,
    color: options.color || [40, 40, 40],
    width: options.width || 800,
    height: options.height || 600,
    gravity: new Vector(),
    c: 0
  });

  // BASE
  this.base.configure(world);
  var myBase = BitShadowMachine.System.add('Oscillator', this.base);

  // STORM
  this.storm.configure({
    parent: myBase
  });
  BitShadowMachine.System.add('Mover', this.storm);

  // SPINE
  for (var i = 0, max = Math.floor(world.height / this.spine.density); i < max; i++) {

    var ease = Easing[this.spine.easing].call(null, i, 0, 1, max - 1);

    // joints
    var joint = BitShadowMachine.System.add('Mover', {
      parent: myBase,
      offsetDistance: ease * world.height,
      offsetAngle: 270,
      opacity: this.spine.opacity,
      afterStep: this._jointAfterStep
    });
    joint.index = i;

    // use Perlin noise to generate the parent node's offset from the funnel's y-axis
    // use easing so the effect is amplified
    joint.offsetFromCenter = Easing.easeInSine(i, 0, 1, max - 1) *
        SimplexNoise.noise(i * 0.1, 0) * 20;

    // pillows
    var easeShellShape = Easing[this.shell.easing].call(null, i, 0, 1, max - 1);

    var colorNoise = Math.floor(Utils.map(SimplexNoise.noise(i * 0.05, 0),
        -1, 1, this.shell.colorMin, this.shell.colorMax));

    for (var j = 0; j < (i + 1) * 5; j++) {
      console.log(easeShellShape);
      BitShadowMachine.System.add('Oscillator', {
        parent: joint,
        opacity: this.shell.opacity,
        color: [colorNoise, colorNoise, colorNoise],
        blur: (easeShellShape * this.shell.blur) + this.shell.minWidth,
        perlin: false,
        amplitude: new Vector(Utils.map(easeShellShape, 0, 1, 1, 100), Utils.map(easeShellShape, 0, 1, 1, 24)),
        acceleration: new BitShadowMachine.Vector(1 / (i + 1), 0.05),
        aVelocity: new BitShadowMachine.Vector(Utils.getRandomNumber(0, 40), Utils.getRandomNumber(0, 40))
        //acceleration: new Vector(1 / (i + 1), 0.01)
      });
    }

  }

  // MASKS
  /*var maskWidth = (document.body.scrollWidth - world.width) / 2,
    maskHeight = (document.body.scrollHeight - world.height) / 2;

  var maskTop = new Mask();
  maskTop.configure({
    location: new Vector(world.width/2, -1 - maskHeight / 2),
    world: world,
    width: world.width + 10,
    height: maskHeight
  });
  BitShadowMachine.System.add('Mover', maskTop);

  var maskBottom = new Mask();
  maskBottom.configure({
    location: new BitShadowMachine.Vector(world.width/2, world.height + 1 + maskHeight / 2),
    world: world,
    width: world.width + 10,
    height: maskHeight
  });
  BitShadowMachine.System.add('Mover', maskBottom);

  var maskLeft = new Mask();
  maskLeft.configure({
    location: new BitShadowMachine.Vector(-1 - maskWidth / 2, world.height / 2),
    world: world,
    width: maskWidth,
    height: document.body.scrollHeight
  });
  BitShadowMachine.System.add('Mover', maskLeft);

  var maskRight = new Mask();
  maskRight.configure({
    location: new BitShadowMachine.Vector(world.width + 1 + maskWidth / 2, world.height / 2),
    world: world,
    width: maskWidth,
    height: document.body.scrollHeight
  });
  BitShadowMachine.System.add('Mover', maskRight);*/
};

/**
 * Called at the end of the joints' step function.
 * @memberof VortexBit
 * @private
 */
VortexBit.prototype._jointAfterStep = function() {
  var offset = this.index * this.offsetFromCenter * VortexBit.noise;
  this.location.x = this.location.x + offset;
};

/**
 * Called at the end of each animation frame.
 * @memberof VortexBit
 * @private
 */
VortexBit.prototype._getNoise = function() {
  VortexBit.noise = SimplexNoise.noise(BitShadowMachine.System.clock * 0.0001, 0);
};

module.exports = VortexBit;
