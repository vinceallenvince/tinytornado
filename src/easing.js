/**
 * Robert Penner's easing functions. http://gizma.com/easing/
 * @namespace
 */
var Easing = {};

/**
 * Simple linear tweening - no easing, no acceleration
 * @param  {number} t current time
 * @param  {number} b start value
 * @param  {number} c change in value
 * @param  {number} d duration
 * @return {number} The current easing value.
 */
Easing.linearTween = function (t, b, c, d) {
  return c * t / d + b;
};

/**
 * Quadratic easing in - accelerating from zero velocity
 * @param  {number} t current time
 * @param  {number} b start value
 * @param  {number} c change in value
 * @param  {number} d duration
 * @return {number} The current easing value.
 */
Easing.easeInQuad = function (t, b, c, d) {
  t /= d;
  return c * t * t + b;
};

/**
 * Quadratic easing out - decelerating to zero velocity
 * @param  {number} t current time
 * @param  {number} b start value
 * @param  {number} c change in value
 * @param  {number} d duration
 * @return {number} The current easing value.
 */
Easing.easeOutQuad = function (t, b, c, d) {
  t /= d;
  return -c * t *(t - 2) + b;
};

/**
 * Quadratic easing in/out - acceleration until halfway, then deceleration
 * @param  {number} t current time
 * @param  {number} b start value
 * @param  {number} c change in value
 * @param  {number} d duration
 * @return {number} The current easing value.
 */
Easing.easeInOutQuad = function (t, b, c, d) {
  t /= d / 2;
  if (t < 1) return c / 2 * t * t + b;
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
};

/**
 * Cubic easing in - accelerating from zero velocity
 * @param  {number} t current time
 * @param  {number} b start value
 * @param  {number} c change in value
 * @param  {number} d duration
 * @return {number} The current easing value.
 */
Easing.easeInCubic = function (t, b, c, d) {
  t /= d;
  return c * t * t * t + b;
};

/**
 * Cubic easing out - decelerating to zero velocity
 * @param  {number} t current time
 * @param  {number} b start value
 * @param  {number} c change in value
 * @param  {number} d duration
 * @return {number} The current easing value.
 */
Easing.easeOutCubic = function (t, b, c, d) {
  t /= d;
  t--;
  return c* (t * t * t + 1) + b;
};

/**
 * Cubic easing in/out - acceleration until halfway, then deceleration
 * @param  {number} t current time
 * @param  {number} b start value
 * @param  {number} c change in value
 * @param  {number} d duration
 * @return {number} The current easing value.
 */
Easing.easeInOutCubic = function (t, b, c, d) {
  t /= d / 2;
  if (t < 1) return c / 2 * t * t * t + b;
  t -= 2;
  return c / 2 * (t * t * t + 2) + b;
};

/**
 * Quartic easing in - accelerating from zero velocity
 * @param  {number} t current time
 * @param  {number} b start value
 * @param  {number} c change in value
 * @param  {number} d duration
 * @return {number} The current easing value.
 */
Easing.easeInQuart = function (t, b, c, d) {
  t /= d;
  return c * t * t * t * t + b;
};

/**
 * Quartic easing out - decelerating to zero velocity
 * @param  {number} t current time
 * @param  {number} b start value
 * @param  {number} c change in value
 * @param  {number} d duration
 * @return {number} The current easing value.
 */
Easing.easeOutQuart = function (t, b, c, d) {
  t /= d;
  t--;
  return -c * (t * t * t * t - 1) + b;
};

/**
 * Quartic easing in/out - acceleration until halfway, then deceleration
 * @param  {number} t current time
 * @param  {number} b start value
 * @param  {number} c change in value
 * @param  {number} d duration
 * @return {number} The current easing value.
 */
Easing.easeInOutQuart = function (t, b, c, d) {
  t /= d / 2;
  if (t < 1) return c / 2 * t * t * t * t + b;
  t -= 2;
  return -c / 2 * ( t * t * t * t - 2) + b;
};

/**
 * Quintic easing in - accelerating from zero velocity
 * @param  {number} t current time
 * @param  {number} b start value
 * @param  {number} c change in value
 * @param  {number} d duration
 * @return {number} The current easing value.
 */
Easing.easeInQuint = function (t, b, c, d) {
  t /= d;
  return c * t * t * t * t * t + b;
};

/**
 * Quintic easing out - decelerating to zero velocity
 * @param  {number} t current time
 * @param  {number} b start value
 * @param  {number} c change in value
 * @param  {number} d duration
 * @return {number} The current easing value.
 */
Easing.easeOutQuint = function (t, b, c, d) {
  t /= d;
  t--;
  return c * (t * t * t * t * st + 1) + b;
};

/**
 * Quintic easing in/out - acceleration until halfway, then deceleration
 * @param  {number} t current time
 * @param  {number} b start value
 * @param  {number} c change in value
 * @param  {number} d duration
 * @return {number} The current easing value.
 */
Easing.easeInOutQuint = function (t, b, c, d) {
  t /= d / 2;
  if (t < 1) return c / 2 * t * t * t * t * t + b;
  t -= 2;
  return c / 2 * (t * t * t * t * t + 2) + b;
};

/**
 * Sinusoidal easing in - accelerating from zero velocity
 * @param  {number} t current time
 * @param  {number} b start value
 * @param  {number} c change in value
 * @param  {number} d duration
 * @return {number} The current easing value.
 */
Easing.easeInSine = function (t, b, c, d) {
  return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
};

/**
 * Sinusoidal easing out - decelerating to zero velocity
 * @param  {number} t current time
 * @param  {number} b start value
 * @param  {number} c change in value
 * @param  {number} d duration
 * @return {number} The current easing value.
 */
Easing.easeOutSine = function (t, b, c, d) {
  return c * Math.sin(t / d * (Math.PI / 2)) + b;
};

/**
 * Sinusoidal easing in/out - accelerating until halfway, then decelerating
 * @param  {number} t current time
 * @param  {number} b start value
 * @param  {number} c change in value
 * @param  {number} d duration
 * @return {number} The current easing value.
 */
Easing.easeInOutSine = function (t, b, c, d) {
  return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
};

/**
 * Exponential easing in - accelerating from zero velocity
 * @param  {number} t current time
 * @param  {number} b start value
 * @param  {number} c change in value
 * @param  {number} d duration
 * @return {number} The current easing value.
 */
Easing.easeInExpo = function (t, b, c, d) {
  return c * Math.pow(2, 10 * (t / d - 1) ) + b;
};

/**
 * Exponential easing out - decelerating to zero velocity
 * @param  {number} t current time
 * @param  {number} b start value
 * @param  {number} c change in value
 * @param  {number} d duration
 * @return {number} The current easing value.
 */
Easing.easeOutExpo = function (t, b, c, d) {
  return c * (-Math.pow(2, -10 * t / d ) + 1 ) + b;
};

/**
 * Exponential easing in/out - accelerating until halfway, then decelerating
 * @param  {number} t current time
 * @param  {number} b start value
 * @param  {number} c change in value
 * @param  {number} d duration
 * @return {number} The current easing value.
 */
Easing.easeInOutExpo = function (t, b, c, d) {
  t /= d / 2;
  if (t < 1) return c / 2 * Math.pow(2, 10 * (t - 1) ) + b;
  t--;
  return c / 2 * (-Math.pow(2, -10 * t) + 2 ) + b;
};

/**
 * Circular easing in - accelerating from zero velocity
 * @param  {number} t current time
 * @param  {number} b start value
 * @param  {number} c change in value
 * @param  {number} d duration
 * @return {number} The current easing value.
 */
Easing.easeInCirc = function (t, b, c, d) {
  t /= d;
  return -c * (Math.sqrt(1 - t * t) - 1) + b;
};

/**
 * Circular easing out - decelerating to zero velocity
 * @param  {number} t current time
 * @param  {number} b start value
 * @param  {number} c change in value
 * @param  {number} d duration
 * @return {number} The current easing value.
 */
Easing.easeOutCirc = function (t, b, c, d) {
  t /= d;
  t--;
  return c * Math.sqrt(1 - t * t) + b;
};

/**
 * Circular easing in/out - acceleration until halfway, then deceleration
 * @param  {number} t current time
 * @param  {number} b start value
 * @param  {number} c change in value
 * @param  {number} d duration
 * @return {number} The current easing value.
 */
Easing.easeInOutCirc = function (t, b, c, d) {
  t /= d / 2;
  if (t < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
  t -= 2;
  return c / 2 * (Math.sqrt(1 - t * t) + 1) + b;
};

module.exports = Easing;
