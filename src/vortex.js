var Burner = require('burner');
var Mover = require('./mover');
var Oscillator = require('./oscillator');
var Particle = require('./particle');
var Utils = require('drawing-utils-lib');
var Vector = require('vector2d-lib');
var SimplexNoise = require('quietriot');
var Easing = require('./easing');

function Vortex(base, spine, shell) {
  this.base = base;
  this.spine = spine;
  this.shell = shell;
}

/**
 * Holds a Perlin noise value.
 * @type {Number}
 * @memberof Vortex
 */
Vortex.noise = 0;

/**
 * Initializes an instance of Vortex.
 * @param {Object} [opt_world_options=] A map of initial world properties.
 * @param {Object} [opt_world_options.el = document.body] World's DOM object.
 * @param {number} [opt_world_options.width = 800] World width in pixels.
 * @param {number} [opt_world_options.height = 600] World height in pixels.
 * @param {number} [opt_world_options.borderWidth = 1] World border widthin pixels.
 * @param {string} [opt_world_options.borderStyle = 'solid'] World border style.
 * @param {Object} [opt_world_options.borderColor = 0, 0, 0] World border color.
 * @memberof Vortex
 */
Vortex.prototype.init = function(opt_options) {

  var options = opt_options || {};

  Burner.System.Classes = {
    Mover: Mover,
    Oscillator: Oscillator,
    Particle: Particle
  };
  Burner.System.setup(this._setupCallback.bind(this, options));
  Burner.System.clock = 10000; // advance the clock so we start deeper in the noise space
  Burner.System.loop(this._getNoise.bind(this));
};

/**
 * Sets up the world and items.
 * @param {Object} options World options.
 * @memberof Vortex
 * @private
 */
Vortex.prototype._setupCallback = function(options) {

  var world = Burner.System.add('World', {
    el: options.el || document.body,
    color: options.color || [40, 40, 40],
    width: options.width || 800,
    height: options.height || 600,
    borderWidth: options.borderWidth || 1,
    borderStyle: options.borderStyle || 'solid',
    borderColor: options.borderColor || [0, 0, 0],
    gravity: new Vector(),
    c: 0
  });

  // BASE
  this.base.configure(world);
  var myBase = Burner.System.add('Oscillator', this.base);

  // SPINE
  for (var i = 0, max = Math.floor(world.height / this.spine.density); i < max; i++) {

    var ease = Easing[this.spine.easing].call(null, i, 0, 1, max - 1);

    // joints
    var joint = Burner.System.add('Mover', {
      parent: myBase,
      offsetDistance: ease * world.height,
      offsetAngle: 270,
      opacity: this.spine.opacity,
      afterStep: this._jointAfterStep
    });
    joint.index = i;

    // use Perlin noise to generate the parent node's offset from the funnel's y-axis
    // use easing so the effect is amplified
    joint.offsetFromCenter = Math.easeInSine(i, 0, 1, max - 1) *
        SimplexNoise.noise(i * 0.1, 0) * 20;

    // pillows
    var easeShellShape = Easing[this.shell.easing].call(null, i, 0, 1, max - 1);

    var colorNoise = Math.floor(Utils.map(SimplexNoise.noise(i * 0.05, 0),
        -1, 1, this.shell.colorMin, this.shell.colorMax));

    Burner.System.add('Oscillator', {
      width: 0,
      height: 0,
      parent: joint,
      opacity: this.shell.opacity,
      color: [colorNoise, colorNoise, colorNoise],
      boxShadowBlur: (easeShellShape * this.shell.blur) + this.shell.minWidth,
      boxShadowSpread: (easeShellShape * this.shell.spread) + this.shell.minWidth,
      boxShadowColor: [colorNoise, colorNoise, colorNoise],
      perlin: false,
      amplitude: new Vector((2 - easeShellShape) * 1, 0),
      acceleration: new Vector(1 / (i + 1), 0)
    });
  }
};

/**
 * Called at the end of the joints' step function.
 * @memberof Vortex
 * @private
 */
Vortex.prototype._jointAfterStep = function() {
  var offset = this.index * this.offsetFromCenter * Vortex.noise;
  this.location.x = this.location.x + (offset);
};

/**
 * Called at the end of each animation frame.
 * @memberof Vortex
 * @private
 */
Vortex.prototype._getNoise = function() {
  Vortex.noise = SimplexNoise.noise(Burner.System.clock * 0.0001, 0);
};

module.exports = Vortex;