var Burner = require('burner');
var Mover = require('./items/mover');
var Oscillator = require('./items/oscillator');
var Particle = require('./items/particle');
var Utils = require('burner').Utils;
var Vector = require('burner').Vector;
var SimplexNoise = require('quietriot');
var Easing = require('./easing');
var Mask = require('./mask');

/**
 * Creates a new Runner.
 * @param {Object} base A map of properties describing the base of the tornado.
 * @param {Object} debris A map of properties describing the debris at the base of the tornado.
 * @param {Object} spine A map of properties describing the tornado's spine.
 * @param {Object} shell A map of properties describing the tornado's shell (funnel).
 * @constructor
 */
function Runner(base, opt_debris, opt_spine, opt_shell) {
  if (!base) {
    throw new Error('Runner requires a \'base\' parameter.');
  }
  this.base = base;
  this.debris = opt_debris || null;
  this.spine = opt_spine || null;
  this.shell = opt_shell || null;
}

/**
 * Holds a Perlin noise value.
 * @type {number}
 * @memberof Runner
 */
Runner.noise = 0;

/**
 * Initializes an instance of Runner.
 * @param {Object} [opt_options=] A map of initial world properties.
 * @param {Object} [opt_options.el = document.body] World's DOM object.
 * @param {number} [opt_options.width = 800] World width in pixels.
 * @param {number} [opt_options.height = 600] World height in pixels.
 * @param {number} [opt_options.borderWidth = 1] World border widthin pixels.
 * @param {string} [opt_options.borderStyle = 'solid'] World border style.
 * @param {Object} [opt_options.borderColor = 0, 0, 0] World border color.
 * @memberof Runner
 */
Runner.prototype.init = function(opt_options) {

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
 * @memberof Runner
 * @private
 */
Runner.prototype._setupCallback = function(options) {

  var radionado = options.radionado;

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

  // DEBRIS
  if (this.debris) {
    this.debris.configure({
      parent: myBase
    });
    Burner.System.add('Mover', this.debris);
  }

  // SPINE
  if (this.spine) {
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
      joint.offsetFromAxis = this.spine.offsetFromAxis;

      // use Perlin noise to generate the parent node's offset from the funnel's y-axis
      // use easing so the effect is amplified
      joint.offsetFromCenter = Easing.easeInSine(i, 0, 1, max - 1) *
          SimplexNoise.noise(i * 0.1, 0) * 20;

      // pillows
      if (this.shell) {
        var easeShellShape = Easing[this.shell.easing].call(null, i, 0, 1, max - 1);

        var colorNoise = Math.floor(Utils.map(SimplexNoise.noise(i * 0.05, 0),
            -1, 1, this.shell.colorMin, this.shell.colorMax));

        if (radionado) {
          for (var j = 0; j < (i + 1) * 1; j++) {

            Burner.Item.baseElement = 'input';
            Burner.Item.baseElementAttributes = {
              type: 'radio'
            };

            var rand = Utils.getRandomNumber;
            var osc = Burner.System.add('Oscillator', {
              perlin: false,
              parent: joint,
              blur: easeShellShape,
              color: [colorNoise, colorNoise, colorNoise],
              opacity: 1,
              scale: easeShellShape * 1,
              amplitude: new Vector(Utils.map(easeShellShape, 0, 1, 1, rand(50, 200)),
                  Utils.map(easeShellShape, 0, 1, 1, rand(10, 64))),
              acceleration: new Burner.Vector(2 / (i + 1), 0.05),
              aVelocity: new Burner.Vector(rand(0, 40), rand(0, 40))
            });
            if (rand(1, 2) === 1) {
              osc.el.checked = 'checked';
            }
          }
        } else {
          Burner.System.add('Oscillator', {
            width: this.shell.width,
            height: this.shell.height,
            parent: joint,
            opacity: this.shell.opacity,
            color: [colorNoise, colorNoise, colorNoise],
            boxShadowBlur: (easeShellShape * this.shell.blur) + this.shell.minFunnelWidth,
            boxShadowSpread: (easeShellShape * this.shell.spread) + this.shell.minFunnelWidth,
            boxShadowColor: [colorNoise, colorNoise, colorNoise],
            perlin: false,
            amplitude: new Vector((2 - easeShellShape) * 1, 0),
            acceleration: new Vector(1 / (i + 1), 0)
          });
        }
      }
    }
  }
};

/**
 * Called at the end of the joints' step function.
 * @memberof Runner
 * @private
 */
Runner.prototype._jointAfterStep = function() {
  if (this.offsetFromAxis) {
    var offset = this.index * this.offsetFromCenter * Runner.noise;
    this.location.x = this.location.x + (offset);
  }
};

/**
 * Called at the end of each animation frame.
 * @memberof Runner
 * @private
 */
Runner.prototype._getNoise = function() {
  Runner.noise = SimplexNoise.noise(Burner.System.clock * 0.0001, 0);
};

module.exports = Runner;
