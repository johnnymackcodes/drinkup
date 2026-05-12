import { PRESETS, SERVINGS, PRICES } from './presets.js';

// One source of truth for the math. Returns a flat, render-friendly object.
export function calculate({ guests, hours, presetKey, drinkerPct, strength, customMix }) {
  const preset = PRESETS[presetKey] ?? PRESETS.casual;
  const mix = normalizeMix(customMix ?? preset.mix);

  const drinkers = Math.max(0, Math.round(guests * (drinkerPct / 100)));
  const nonDrinkers = Math.max(0, guests - drinkers);

  // strength: 0.75 (light) | 1.0 (normal) | 1.25 (heavy)
  const totalDrinks = drinkers * hours * preset.drinksPerHour * strength;

  const beerDrinks = totalDrinks * mix.beer;
  const wineDrinks = totalDrinks * mix.wine;
  const liquorDrinks = totalDrinks * mix.liquor;

  const beerCans = Math.ceil(beerDrinks);
  const beerCases = Math.ceil(beerCans / SERVINGS.beerPerCase);
  const wineBottles = Math.ceil(wineDrinks / SERVINGS.winePerBottle);
  // Split wine 50/50 red/white as a sensible default.
  const wineRed = Math.ceil(wineBottles / 2);
  const wineWhite = wineBottles - wineRed;

  const liquorBottles = Math.ceil(liquorDrinks / SERVINGS.liquorPerBottle);
  // Mixer rule: ~1 bottle (2 L) of mixer per bottle of liquor.
  // A 750 mL spirit makes ~16 cocktails × ~4 oz mixer ≈ 64 oz ≈ one 2 L bottle.
  const mixerBottles = liquorBottles === 0 ? 0 : Math.max(1, Math.ceil(liquorBottles * 1.0));

  // Non-alcoholic: 2 servings/hr for non-drinkers, 0.5/hr for drinkers (hydration).
  // One 2 L bottle ≈ 8 servings.
  const naServings = nonDrinkers * hours * 2 + drinkers * hours * 0.5;
  const naBottles = Math.ceil(naServings / 8);

  // Ice: ~1 lb per person + 0.5 lb per beer + 1 lb per cocktail. 10 lb/bag.
  const icePounds = guests + beerCans * 0.5 + liquorDrinks * 1;
  const iceBags = Math.max(1, Math.ceil(icePounds / 10));

  // Cups: ~3 per person.
  const cups = guests * 3;

  // Cost estimate (USD)
  const cost = Math.round(
    beerCases * PRICES.beerCase +
      wineBottles * PRICES.wineBottle +
      liquorBottles * PRICES.liquorBottle +
      mixerBottles * PRICES.mixerBottle +
      naBottles * PRICES.mixerBottle +
      iceBags * PRICES.iceBag +
      cups * PRICES.cup
  );

  return {
    totalDrinks: Math.ceil(totalDrinks),
    drinkers,
    nonDrinkers,
    beer: { drinks: Math.ceil(beerDrinks), cans: beerCans, cases: beerCases },
    wine: {
      drinks: Math.ceil(wineDrinks),
      bottles: wineBottles,
      red: wineRed,
      white: wineWhite,
    },
    liquor: { drinks: Math.ceil(liquorDrinks), bottles: liquorBottles },
    mixers: mixerBottles,
    nonAlc: naBottles,
    ice: iceBags,
    cups,
    cost,
  };
}

function normalizeMix(mix) {
  const total = mix.beer + mix.wine + mix.liquor;
  if (total === 0) return { beer: 0, wine: 0, liquor: 0 };
  return {
    beer: mix.beer / total,
    wine: mix.wine / total,
    liquor: mix.liquor / total,
  };
}
