// Event presets — drinks/hr is the *average* per drinker over the whole event.
// Industry rule of thumb: 2 drinks in the first hour, ~1/hr after.
export const PRESETS = {
  cocktail: {
    name: 'Cocktail Party',
    emoji: '🍸',
    blurb: 'Heavy on spirits, lighter on beer.',
    drinksPerHour: 1.5,
    mix: { beer: 0.10, wine: 0.30, liquor: 0.60 },
  },
  wedding: {
    name: 'Wedding',
    emoji: '💒',
    blurb: 'Balanced bar, leans wine.',
    drinksPerHour: 1.25,
    mix: { beer: 0.30, wine: 0.40, liquor: 0.30 },
  },
  bbq: {
    name: 'BBQ / Backyard',
    emoji: '🔥',
    blurb: 'Mostly beer, some wine and spirits.',
    drinksPerHour: 1.25,
    mix: { beer: 0.70, wine: 0.15, liquor: 0.15 },
  },
  dinner: {
    name: 'Dinner Party',
    emoji: '🍷',
    blurb: 'Wine-forward, slower pace.',
    drinksPerHour: 1.0,
    mix: { beer: 0.10, wine: 0.70, liquor: 0.20 },
  },
  poker: {
    name: 'Poker / Game Night',
    emoji: '🃏',
    blurb: 'Beer and a couple bottles of brown.',
    drinksPerHour: 1.5,
    mix: { beer: 0.75, wine: 0.05, liquor: 0.20 },
  },
  birthday: {
    name: 'Birthday Party',
    emoji: '🎂',
    blurb: 'Mixed crowd, mixed bar.',
    drinksPerHour: 1.25,
    mix: { beer: 0.45, wine: 0.25, liquor: 0.30 },
  },
  casual: {
    name: 'Casual Hangout',
    emoji: '🛋️',
    blurb: 'Easy drinking, no rush.',
    drinksPerHour: 1.0,
    mix: { beer: 0.50, wine: 0.30, liquor: 0.20 },
  },
};

// Drinks per container (US standard)
//   beer can/bottle = 12 oz = 1 serving
//   wine 750ml      ≈ 25 oz / 5 oz pour    = 5 servings
//   spirits 750ml   ≈ 25 oz / 1.5 oz pour  ≈ 16 servings
export const SERVINGS = {
  beerPerCan: 1,
  beerPerCase: 24,
  winePerBottle: 5,
  liquorPerBottle: 16,
};

// Mid-tier US retail prices (USD), sourced from 2026 averages.
//   beer 24-pack domestic ~ $20–22 (BLS / state avgs)
//   wine 750 mL table     ~ $10–15 (BLS, $10.70/750mL)
//   spirits 750 mL        ~ $22–25 (Tito's $22, mid whiskey $25–28)
//   mixers 2 L            ~ $2.50–3.50 (FRED $2.20 soda avg; tonic ~$3)
//   ice 10 lb bag         ~ $2.50–3.99
//   16 oz Solo cup        ~ $0.15–0.25
export const PRICES = {
  beerCase: 22,
  wineBottle: 12,
  liquorBottle: 24,
  mixerBottle: 3,
  iceBag: 3,
  cup: 0.2,
};
