var Burner = require('burner');
var Mover = require('./mover');
var Oscillator = require('./oscillator');
var Particle = require('./particle');
var Utils = require('drawing-utils-lib');
var Vector = require('vector2d-lib');
var SimplexNoise = require('quietriot');
var Easing = require('./easing');

/**
 * Creates a new TinyTornado.
 *
 * A TinyTornado has three main components, a base,
 * a series of joints, and a series of pillows.
 *
 * Joints are parented to the base. Pillows are parented
 * to and oscillate around specific joints.
 *
 * @constructor
 */
function TinyTornado() {

}

/**
 * Holds a Perlin noise value.
 * @type {Number}
 * @memberof TinyTornado
 */
TinyTornado.noise = 0;

/**
 * Initializes an instance of TinyTornado.
 * @param {Object} [opt_world_options=] A map of initial world properties.
 * @param {Object} [opt_world_options.el = document.body] World's DOM object.
 * @param {number} [opt_world_options.width = 800] World width in pixels.
 * @param {number} [opt_world_options.height = 600] World height in pixels.
 * @param {number} [opt_world_options.borderWidth = 1] World border widthin pixels.
 * @param {string} [opt_world_options.borderStyle = 'solid'] World border style.
 * @param {Object} [opt_world_options.borderColor = 0, 0, 0] World border color.
 * @param {Object} [opt_base_options=] A map of initial base properties.
 * @param {boolean} [opt_base_options.baseWidth = 10] Base width.
 * @param {boolean} [opt_base_options.baseHeight = 10] Base height.
 * @param {boolean} [opt_base_options.baseColor = 0] Base color.
 * @param {boolean} [opt_base_options.basePerlin = true] Set to true to move the base via perlin noise.
 * @param {number} [opt_base_options.basePerlinSpeed = 0.0001] Base perlin speed.
 * @param {number} [opt_base_options.basePerlinTime = 100] Initial base perlin time.
 * @param {Object} [opt_base_options.baseInitialLocation = bottom middle of the world] Initial base location.
 * @param {Object} [opt_base_options.baseAmplitude = world.width / 4, 0] Limit of the base location.
 * @param {number} [opt_base_options.baseOpacity = 0] Base Opacity.
 * @param {Object} [opt_base_options.particleOptions=] A map of particleOptions.
 * @param {number} [opt_base_options.particleOptions.width = 0] Particle width.
 * @param {number} [opt_base_options.particleOptions.height = 0] Particle height.
 * @param {number} [opt_base_options.particleOptions.sizeMin = 1] Minimum particle size.
 * @param {number} [opt_base_options.particleOptions.sizeMax = 3] Maximum particle size.
 * @param {number} [opt_base_options.particleOptions.speedMin = 1] Minimum particle speed.
 * @param {number} [opt_base_options.particleOptions.speedMax = 20] Maximum particle speed.
 * @param {number} [opt_base_options.particleOptions.opacityMin = 0.1] Minimum opacity.
 * @param {number} [opt_base_options.particleOptions.opacityMax = 0.2] Maximum opacity.
 * @param {number} [opt_base_options.particleOptions.colorMin = 100] Minimum color. Valid values bw 0 - 255.
 * @param {number} [opt_base_options.particleOptions.colorMax = 200] Maximum color. Valid values bw 0 - 255.
 * @param {Object} [opt_joint_options=] A map of initial joint properties.
 * @param {number} [opt_joint_options.jointDensity = 25] Determines number of joints in the funnel. Lower values = more joints.
 * @param {number} [opt_joint_options.jointOpacity = 0] Joint opacity.
 * @param {string} [opt_joint_options.jointEasing = 'easeInCirc'] An easing function to determine joint distribution along the funnel. See Easing docs for possible values.
 * @param {number} [opt_joint_options.jointWidth = 10] Joint width.
 * @param {number} [opt_joint_options.jointHeight = 10] Joint height.
 * @param {Object} [opt_pillow_options=] A map of initial pillow properties.
 * @param {number} [opt_pillow_options.funnelMinWidth = 5] Minium width of the funnel base.
 * @param {number} [opt_pillow_options.pillowWidth = 0] Pillow width.
 * @param {number} [opt_pillow_options.pillowHeight = 0] Pillow height.
 * @param {number} [opt_pillow_options.pillowOpacity = 0] Pillow opacity.
 * @param {number} [opt_pillow_options.pillowBlur = 350] Pillow blur. Recommended values bw 300 - 400.
 * @param {number} [opt_pillow_options.pillowSpread = 250] Pillow spread. Recommended values bw 200 - 300.
 * @param {string} [opt_pillow_options.pillowEasing = 'easeInExpo'] An easing function to determine pillow shape along the funnel. See Easing docs for possible values.
 * @param {number} [opt_pillow_options.pillowColorMin = 50] Minimum color. Valid values bw 0 - 255.
 * @param {number} [opt_pillow_options.pillowColorMax = 255] Maximum color. Valid values bw 0 - 255.
 * @memberof TinyTornado
 */
TinyTornado.prototype.init = function(opt_world_options, opt_base_options, opt_joint_options, opt_pillow_options) {

  var world_options = opt_world_options || {},
      base_options = opt_base_options || {},
      joint_options = opt_joint_options || {},
      pillow_options = opt_pillow_options || {};

  Burner.System.Classes = {
    Mover: Mover,
    Oscillator: Oscillator,
    Particle: Particle
  };

  Burner.System.setup(this._setupCallback.bind(this, world_options, base_options, joint_options, pillow_options));
  Burner.System.clock = 10000; // advance the clock so we start deeper in the noise space
  Burner.System.loop(this._getNoise.bind(this));
};

/**
 * Sets up the world and items.
 * @param  {Object} world_options World options.
 * @param  {Object} base_options Base options.
 * @param  {Object} joint_options Joint options.
 * @memberof TinyTornado
 * @private
 */
TinyTornado.prototype._setupCallback = function(world_options, base_options, joint_options, pillow_options) {

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
  var baseWidth = typeof base_options.baseWidth !== 'undefined' ? base_options.baseWidth : 10,
      baseHeight = typeof base_options.baseHeight !== 'undefined' ? base_options.baseHeight : 10,
      baseColor = typeof base_options.baseHeight !== 'undefined' ? base_options.baseColor : 0,
      basePerlin = typeof base_options.basePerlin !== 'undefined' ? base_options.basePerlin : true,
      basePerlinSpeed = base_options.basePerlinSpeed || 0.0001,
      basePerlinTime = base_options.basePerlinTime || 100,
      baseInitialLocation = base_options.baseInitialLocation || new Vector(this.world.width / 2, this.world.height),
      baseAmplitude = base_options.baseAmplitude || new Vector(this.world.width / 4, 0),
      baseOpacity = base_options.baseOpacity || 0,
      particleOptions = base_options.particleOptions || {};

  this.base = Burner.System.add('Oscillator', {
    width: baseWidth,
    height: baseHeight,
    color: [baseColor, baseColor, baseColor],
    perlin: basePerlin,
    perlinSpeed: basePerlinSpeed,
    perlinTime: basePerlinTime,
    initialLocation: baseInitialLocation,
    amplitude: baseAmplitude,
    acceleration: new Vector(),
    aVelocity: new Vector(),
    opacity: baseOpacity,
    afterStep: this._baseAfterStep.bind(this, particleOptions)
  });

  // JOINTS and PILLOWS
  var jointDensity = joint_options.jointDensity || 25,
      jointOpacity = joint_options.jointOpacity || 0,
      jointEasing = joint_options.jointEasing || 'easeInCirc',
      jointWidth = joint_options.jointWidth || 10,
      jointHeight = joint_options.jointHeight || 10;

  var funnelMinWidth = typeof pillow_options.funnelMinWidth !== 'undefined' ? pillow_options.funnelMinWidth : 5,
      pillowWidth = pillow_options.pillowWidth || 0,
      pillowHeight = pillow_options.pillowHeight || 0,
      pillowOpacity = typeof pillow_options.pillowOpacity !== 'undefined' ? pillow_options.pillowOpacity : 0.75,
      pillowBlur = typeof pillow_options.pillowBlur !== 'undefined' ? pillow_options.pillowBlur : 350,
      pillowSpread = typeof pillow_options.pillowSpread !== 'undefined' ? pillow_options.pillowSpread : 250,
      pillowEasing = pillow_options.pillowEasing || 'easeInExpo',
      pillowColorMin = typeof pillow_options.pillowColorMin !== 'undefined' ? pillow_options.pillowColorMin : 50,
      pillowColorMax = typeof pillow_options.pillowColorMax !== 'undefined' ? pillow_options.pillowColorMax : 255;

  for (var i = 0, max = Math.floor(this.world.height / jointDensity); i < max; i++) {

    var ease = Easing[jointEasing].call(null, i, 0, 1, max - 1);

    // joints
    var joint = Burner.System.add('Mover', {
      width: jointWidth,
      height: jointHeight,
      parent: this.base,
      offsetDistance: ease * this.world.height,
      offsetAngle: 270,
      opacity: jointOpacity,
      afterStep: this._jointAfterStep
    });
    joint.index = i;

    // use Perlin noise to generate the parent node's offset from the funnel's y-axis
    // use easing so the effect is amplified
    joint.offsetFromCenter = Math.easeInSine(i, 0, 1, max - 1) *
        SimplexNoise.noise(i * 0.1, 0) * 20;

    // pillows
    var easePillowShape = Easing[pillowEasing].call(null, i, 0, 1, max - 1);

    var colorNoise = Math.floor(Utils.map(SimplexNoise.noise(i * 0.05, 0),
        -1, 1, pillowColorMin, pillowColorMax));

    Burner.System.add('Oscillator', {
      parent: joint,
      width: pillowWidth,
      height: pillowHeight,
      opacity: pillowOpacity,
      color: [colorNoise, colorNoise, colorNoise],
      boxShadowBlur: (easePillowShape * pillowBlur) + funnelMinWidth,
      boxShadowSpread: (easePillowShape * pillowSpread) + funnelMinWidth,
      boxShadowColor: [colorNoise, colorNoise, colorNoise],
      perlin: false,
      initialLocation: new Vector(this.world.width / 2, this.world.height),
      amplitude: new Vector((2 - easePillowShape) * 1, 0),
      acceleration: new Vector(1 / (i + 1), 0)
    });
  }

  // MASKS
  var maskWidth = (document.body.scrollWidth - this.world.width) / 2,
    maskHeight = (document.body.scrollHeight - this.world.height) / 2;

  this._createMask({ // top
    location: new Burner.Vector(this.world.width/2, -1 - maskHeight / 2),
    width: this.world.width + 10,
    height: maskHeight
  });

  this._createMask({ // bottom
    location: new Burner.Vector(this.world.width/2, this.world.height + 1 + maskHeight / 2),
    width: this.world.width + 10,
    height: maskHeight
  });

  this._createMask({ // left
    location: new Burner.Vector(-1 - maskWidth / 2, this.world.height / 2),
    width: maskWidth,
    height: document.body.scrollHeight
  });

  this._createMask({ // right
    location: new Burner.Vector(this.world.width + 1 + maskWidth / 2, this.world.height / 2),
    width: maskWidth,
    height: document.body.scrollHeight
  });
};

/**
 * Creates div elements around the world to mask
 * the TinyTornado's overflow.
 * @param {Object} options A map of properties.
 * @param {Object} options.location Location.
 * @param {Object} options.width Width.
 * @param {Object} options.height Height.
 * @memberof TinyTornado
 * @private
 */
TinyTornado.prototype._createMask = function(options) {
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

/**
 * Called at the end of the base's step function.
 * @memberof TinyTornado
 * @private
 */
TinyTornado.prototype._baseAfterStep = function(options) {

  var base = this.base;

  // use life to throttle particle system
  if ((Burner.System.clock % 3) === 0) {

    var accel = new Vector(1, 1);
    accel.normalize();
    accel.mult(Utils.getRandomNumber(0.01, 0.1, true));
    accel.rotate(Utils.degreesToRadians(Utils.getRandomNumber(150, 300)));

    var width = options.width || 0;
    var height = options.height || 0;

    var sizeMin = typeof options.sizeMin !== 'undefined' ? options.sizeMin : 1;
    var sizeMax = typeof options.sizeMax !== 'undefined' ? options.sizeMax : 3;
    var size = Utils.getRandomNumber(sizeMin, sizeMax, sizeMin || sizeMax);

    var speedMin = typeof options.speedMin !== 'undefined' ? options.speedMin : 1;
    var speedMax = typeof options.speedMax !== 'undefined' ? options.speedMax : 20;
    var maxSpeed = Utils.getRandomNumber(speedMin, speedMax, true);

    var opacityMin = typeof options.opacityMin !== 'undefined' ? options.opacityMin : 0.1;
    var opacityMax = typeof options.opacityMax !== 'undefined' ? options.opacityMax : 0.2;
    var opacity = Utils.getRandomNumber(opacityMin, opacityMax, true);

    var lifespanMin = typeof options.lifespanMin !== 'undefined' ? options.lifespanMin : 70;
    var lifespanMax = typeof options.lifespanMax !== 'undefined' ? options.lifespanMax : 120;
    var lifespan = Utils.getRandomNumber(lifespanMin, lifespanMax);

    var colorMin = typeof options.colorMin !== 'undefined' ? options.colorMin : 100;
    var colorMax = typeof options.colorMax !== 'undefined' ? options.colorMax : 200;
    var color = Utils.getRandomNumber(colorMin, colorMax);

    Burner.System.add('Particle', {
      location: new Vector(base.location.x, base.location.y),
      acceleration: accel,
      width: width,
      height: height,
      color: [color, color, color],
      borderWidth: 0,
      boxShadowBlur: size * 10,
      boxShadowSpread: size * 3,
      boxShadowColor: [color, color, color],
      maxSpeed: maxSpeed,
      opacity: opacity,
      lifespan: lifespan
    });
  }
};

/**
 * Called at the end of the joints' step function.
 * @memberof TinyTornado
 * @private
 */
TinyTornado.prototype._jointAfterStep = function() {
  var offset = this.index * this.offsetFromCenter * TinyTornado.noise;
  this.location.x = this.location.x + (offset);
};

/**
 * Called at the end of each animation frame.
 * @memberof TinyTornado
 * @private
 */
TinyTornado.prototype._getNoise = function() {
  TinyTornado.noise = SimplexNoise.noise(Burner.System.clock * 0.0001, 0);
};

module.exports = TinyTornado;
