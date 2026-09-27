(function(root){
  'use strict';
  const cents = value => Math.round(Number(value) * 100);
  function eligible(source, target) {
    return Number.isFinite(source) && Number.isFinite(target) && source > 0 && cents(target) - cents(source) >= 100;
  }
  function chance(source, target) {
    if (!eligible(source, target)) return 0;
    return Math.round(cents(source) / cents(target) * 10000) / 100;
  }
  function resolve(source, target, random) {
    if (!eligible(source, target)) throw new Error('Target must be worth at least 1.00 credit more.');
    if (!Number.isFinite(random) || random < 0 || random >= 1) throw new Error('Random draw must be in [0, 1).');
    const probability = chance(source, target);
    return {chance: probability, roll: random * 100, success: random * 100 < probability, angle: random * 360};
  }
  const engine = Object.freeze({eligible, chance, resolve});
  if(typeof module !== 'undefined' && module.exports) module.exports = engine;
  root.UpgradeEngine = engine;
})(globalThis);
