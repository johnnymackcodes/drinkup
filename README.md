# drinkup 🥃

A party drink calculator. Tell it about your event — guest count, duration,
crowd type — and it spits out exactly how much beer, wine, liquor, mixers,
ice, and cups to buy, plus a rough cost estimate.

Built with **Vue 3 + Vite**. No backend, no tracking, no signup. State lives
in the URL so the shopping list is shareable.

## Features

- 7 event presets — Cocktail Party, Wedding, BBQ, Dinner, Poker Night,
  Birthday, Casual — each with its own drinks/hour rate and beer/wine/liquor
  mix.
- Drinker-percentage slider so non-drinkers and DDs don't inflate the total.
- Pour strength: Light / Normal / Heavy.
- Live shopping list: cases of beer, bottles of wine (split red/white),
  bottles of liquor, mixers, non-alcoholic, ice bags, cups.
- Rough cost estimate based on mid-tier US retail prices.
- Shareable URL — every input is reflected in the query string.

## How the math works

- Drinks per person per hour comes from the event preset (1.0 – 1.5).
- Mix percentages (beer / wine / liquor) come from the preset.
- Strength multiplier scales total drinks (Light 0.75× / Normal 1.0× / Heavy 1.25×).
- Servings:
  - Beer: 1 can/bottle (12 oz) = 1 drink, 24 to a case
  - Wine: 1 bottle (750 mL) ≈ 5 pours at 5 oz
  - Liquor: 1 bottle (750 mL) ≈ 16 pours at 1.5 oz
- Mixers: ~1 bottle (2 L) per bottle of liquor.
- Ice: 1 lb/guest + 0.5 lb/beer + 1 lb/cocktail, in 10 lb bags.
- Cups: 3 per guest.
- Non-alcoholic: 2 servings/hr for non-drinkers, 0.5/hr for drinkers
  (hydration), 2 L bottles.
- Prices are 2026 mid-tier US retail (BLS / FRED / national avgs) —
  tweak them in [src/lib/presets.js](src/lib/presets.js).

### Pricing sources

- [How Much is a Case of Beer? — Make Beer Easy](https://makebeereasy.com/how-much-is-a-case-of-beer/)
- [24-Pack Beer Prices by State — Visual Capitalist](https://www.visualcapitalist.com/mapped-how-much-a-24-pack-of-beer-costs-in-each-u-s-state/)
- [Avg Price: Wine per Liter, U.S. City Avg — BLS / FRED](https://fred.stlouisfed.org/series/APU0000720311)
- [Avg Price: Soft Drinks per 2 L, U.S. City Avg — BLS / FRED](https://fred.stlouisfed.org/series/APU0000FN1101)
- [Average Cost of a Bottle of Wine — Graham + Fisk's](https://grahamandfisk.com/blogs/news/average-cost-of-a-bottle-of-wine-what-to-expect-by-type-region-and-quality)
- [Kroger 10 lb Bagged Ice — Ralphs](https://www.ralphs.com/p/kroger-bagged-ice/0001111002660)
- [DART Solo 16 oz Cups, 50-Pack — Home Depot](https://www.homedepot.com/p/DART-Solo-16-oz-Red-Disposable-Plastic-Cups-Party-Cold-Drinks-50-Pack-DCCP16RPK/318967096)

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # → dist/
npm run preview   # serve the production build
```

Node 18+ recommended.

## Project layout

```
src/
├── App.vue              # the whole UI
├── main.js              # Vue app entry
├── style.css            # global theme tokens
└── lib/
    ├── presets.js       # event presets, serving sizes, prices
    └── calculator.js    # the math
```

## License

[MIT](LICENSE) © 2026 johnnymackcodes
