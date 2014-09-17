var BitShadowMachine = require('bitshadowmachine');
var Mover = require('bitshadowitems').Mover;
var Oscillator = require('bitshadowitems').Oscillator;
var Particle = require('bitshadowitems').Particle;
var Utils = require('burner').Utils;
var Vector = require('burner').Vector;
var SimplexNoise = require('quietriot');
var Easing = require('../easing');

/**
 * Creates a new RunnerBit.
 * @param {Object} base A map of properties describing the base of the tornado.
 * @param {Object} debris A map of properties describing the debris at the base of the tornado.
 * @param {Object} spine A map of properties describing the tornado's spine.
 * @param {Object} shell A map of properties describing the tornado's shell (funnel).
 * @constructor
 */
function RunnerBit(base, debris, spine, shell) {
  this.base = base;
  this.debris = debris;
  this.spine = spine;
  this.shell = shell;
}

/**
 * Holds a Perlin noise value.
 * @type {Number}
 * @memberof RunnerBit
 */
RunnerBit.noise = 0;

/**
 * Initializes an instance of RunnerBit.
 * @param {Object} [opt_options=] A map of initial world properties.
 * @param {Object} [opt_options.el = document.body] World's DOM object.
 * @param {number} [opt_options.width = 800] World width in pixels.
 * @param {number} [opt_options.height = 600] World height in pixels.
 * @param {number} [opt_options.borderWidth = 1] World border widthin pixels.
 * @param {string} [opt_options.borderStyle = 'solid'] World border style.
 * @param {Object} [opt_options.borderColor = 0, 0, 0] World border color.
 * @memberof RunnerBit
 */
RunnerBit.prototype.init = function(opt_options) {

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
 * @memberof RunnerBit
 * @private
 */
RunnerBit.prototype._setupCallback = function(options) {

  var rand = Utils.getRandomNumber,
      map = Utils.map;

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

  // DEBRIS
  this.debris.configure({
    parent: myBase
  });
  BitShadowMachine.System.add('Mover', this.debris);

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
        SimplexNoise.noise(i * 0.1, 0) * 10;

    // pillows
    var easeShellShape = Easing[this.shell.easing].call(null, i, 0, 1, max - 1);

    var colorNoise = Math.floor(Utils.map(SimplexNoise.noise(i * 0.05, 0),
        -1, 1, this.shell.colorMin, this.shell.colorMax));

    for (var j = 0; j < (i + 1) * 4; j++) {

      var scale = (easeShellShape * this.shell.maxScale) + this.shell.minScale;
      BitShadowMachine.System.add('Oscillator', {
        perlin: false,
        parent: joint,
        blur: easeShellShape,
        color: [colorNoise, colorNoise, colorNoise],
        opacity: Utils.map(scale, this.shell.minScale, this.shell.maxScale, 0.3, 0.1),
        scale: scale,
        amplitude: new Vector(Utils.map(easeShellShape, 0, 1, 1, rand(50, 100)),
            Utils.map(easeShellShape, 0, 1, 1, rand(10, 64))),
        acceleration: new BitShadowMachine.Vector(2 / (i + 1), 0.05),
        aVelocity: new BitShadowMachine.Vector(rand(0, 40), rand(0, 40))
      });
    }
  }
};

/**
 * Called at the end of the joints' step function.
 * @memberof RunnerBit
 * @private
 */
RunnerBit.prototype._jointAfterStep = function() {
  var offset = this.index * this.offsetFromCenter * RunnerBit.noise;
  this.location.x = this.location.x + offset;
};

/**
 * Called at the end of each animation frame.
 * @memberof RunnerBit
 * @private
 */
RunnerBit.prototype._getNoise = function() {
  RunnerBit.noise = SimplexNoise.noise(BitShadowMachine.System.clock * 0.0001, 0);
};

module.exports = RunnerBit;
