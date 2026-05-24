<script setup>
import { computed, reactive, ref, watch, onMounted } from 'vue';
import { PRESETS } from './lib/presets.js';
import { calculate } from './lib/calculator.js';

const state = reactive({
  guests: 30,
  hours: 4,
  presetKey: 'birthday',
  drinkerPct: 90,
  strength: 1.0,
});
const shareStatus = ref('');

// Restore from URL on load so shared links work.
onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  for (const key of Object.keys(state)) {
    const raw = params.get(key);
    if (raw === null) continue;
    state[key] = isNaN(Number(raw)) ? raw : Number(raw);
  }
});

// Reflect state in the URL so it's shareable.
watch(state, (val) => {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(val)) params.set(k, v);
  history.replaceState(null, '', `?${params.toString()}`);
});

const preset = computed(() => PRESETS[state.presetKey]);
const result = computed(() => calculate(state));

const presetEntries = Object.entries(PRESETS);
const strengthOptions = [
  { label: 'Light', value: 0.75 },
  { label: 'Normal', value: 1.0 },
  { label: 'Heavy', value: 1.25 },
];

const strengthLabel = computed(() => {
  if (state.strength <= 0.85) return 'Light';
  if (state.strength >= 1.15) return 'Heavy';
  return 'Normal';
});

const mixPercent = computed(() => ({
  beer: Math.round(preset.value.mix.beer * 100),
  wine: Math.round(preset.value.mix.wine * 100),
  liquor: Math.round(preset.value.mix.liquor * 100),
}));

function shareLink() {
  const url = window.location.href;
  navigator.clipboard?.writeText(url);
  shareStatus.value = 'Shareable link copied to clipboard.';
}

function selectPreset(key) {
  state.presetKey = key;
}

function movePreset(currentIndex, direction) {
  const nextIndex = (currentIndex + direction + presetEntries.length) % presetEntries.length;
  state.presetKey = presetEntries[nextIndex][0];
}

function selectStrength(value) {
  state.strength = value;
}

function moveStrength(currentIndex, direction) {
  const nextIndex = (currentIndex + direction + strengthOptions.length) % strengthOptions.length;
  state.strength = strengthOptions[nextIndex].value;
}
</script>

<template>
  <header class="hero">
    <h1>
      <span class="emoji">🥃</span> drinkup
    </h1>
    <p class="tagline">
      Tell us about your party. We'll tell you exactly what to buy.
    </p>
  </header>

  <main class="layout">
    <!-- LEFT: form -->
    <section class="card form">
      <div class="field">
        <label id="guests-label">How many guests?</label>
        <div class="row">
          <input
            type="range"
            min="2"
            max="200"
            step="1"
            v-model.number="state.guests"
            aria-labelledby="guests-label"
            :aria-valuetext="`${state.guests} guests`"
          />
          <input
            type="number"
            min="1"
            max="1000"
            v-model.number="state.guests"
            class="num"
            aria-label="Number of guests"
          />
        </div>
      </div>

      <div class="field">
        <label id="hours-label">How long? <span class="unit">hours</span></label>
        <div class="row">
          <input
            type="range"
            min="1"
            max="12"
            step="0.5"
            v-model.number="state.hours"
            aria-labelledby="hours-label"
            :aria-valuetext="`${state.hours} hours`"
          />
          <input
            type="number"
            min="0.5"
            max="24"
            step="0.5"
            v-model.number="state.hours"
            class="num"
            aria-label="Number of hours"
          />
        </div>
      </div>

      <div class="field">
        <label id="event-kind-label">What kind of event?</label>
        <div class="presets" role="radiogroup" aria-labelledby="event-kind-label">
          <button
            v-for="([key, p], index) in presetEntries"
            :key="key"
            type="button"
            class="preset"
            role="radio"
            :class="{ active: state.presetKey === key }"
            :aria-checked="state.presetKey === key"
            @click="selectPreset(key)"
            @keydown.left.prevent="movePreset(index, -1)"
            @keydown.up.prevent="movePreset(index, -1)"
            @keydown.right.prevent="movePreset(index, 1)"
            @keydown.down.prevent="movePreset(index, 1)"
            @keydown.enter.prevent="selectPreset(key)"
            @keydown.space.prevent="selectPreset(key)"
          >
            <span class="preset-emoji" aria-hidden="true">{{ p.emoji }}</span>
            <span class="preset-name">{{ p.name }}</span>
          </button>
        </div>
        <p class="preset-blurb">{{ preset.blurb }}</p>
      </div>

      <div class="field">
        <label id="drinkers-label">
          Of your guests, what % actually drink?
          <span class="unit">{{ state.drinkerPct }}%</span>
        </label>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          v-model.number="state.drinkerPct"
          aria-labelledby="drinkers-label"
          :aria-valuetext="`${state.drinkerPct}% of guests drink`"
        />
      </div>

      <div class="field">
        <label id="strength-label">
          Pour strength <span class="unit">{{ strengthLabel }}</span>
        </label>
        <div class="strength" role="radiogroup" aria-labelledby="strength-label">
          <button
            v-for="(option, index) in strengthOptions"
            :key="option.value"
            type="button"
            role="radio"
            :class="{ active: state.strength === option.value }"
            :aria-checked="state.strength === option.value"
            @click="selectStrength(option.value)"
            @keydown.left.prevent="moveStrength(index, -1)"
            @keydown.up.prevent="moveStrength(index, -1)"
            @keydown.right.prevent="moveStrength(index, 1)"
            @keydown.down.prevent="moveStrength(index, 1)"
            @keydown.enter.prevent="selectStrength(option.value)"
            @keydown.space.prevent="selectStrength(option.value)"
          >
            {{ option.label }}
          </button>
        </div>
      </div>

      <div class="mix-preview">
        <div class="mix-label">Drink mix</div>
        <div class="mix-bar">
          <span class="mix-beer" :style="{ width: mixPercent.beer + '%' }">
            {{ mixPercent.beer }}% 🍺
          </span>
          <span class="mix-wine" :style="{ width: mixPercent.wine + '%' }">
            {{ mixPercent.wine }}% 🍷
          </span>
          <span class="mix-liquor" :style="{ width: mixPercent.liquor + '%' }">
            {{ mixPercent.liquor }}% 🥃
          </span>
        </div>
      </div>
    </section>

    <!-- RIGHT: shopping list -->
    <section class="card results">
      <div class="results-head">
        <div>
          <div class="total-drinks">{{ result.totalDrinks }} drinks</div>
          <div class="total-meta">
            for {{ result.drinkers }} drinker{{ result.drinkers === 1 ? '' : 's' }}
            <template v-if="result.nonDrinkers > 0">
              · {{ result.nonDrinkers }} non-drinker{{ result.nonDrinkers === 1 ? '' : 's' }}
            </template>
            · {{ state.hours }} h
          </div>
        </div>
        <div class="total-cost">
          <div class="cost-amount">${{ result.cost }}</div>
          <div class="cost-meta">est. cost</div>
        </div>
      </div>

      <ul class="shopping">
        <li v-if="result.beer.cases > 0" class="item beer">
          <div class="item-icon" aria-hidden="true">🍺</div>
          <div class="item-body">
            <div class="item-title">
              {{ result.beer.cases }} case{{ result.beer.cases === 1 ? '' : 's' }} of beer
            </div>
            <div class="item-detail">
              {{ result.beer.cans }} cans · {{ result.beer.drinks }} servings
            </div>
          </div>
        </li>

        <li v-if="result.wine.bottles > 0" class="item wine">
          <div class="item-icon" aria-hidden="true">🍷</div>
          <div class="item-body">
            <div class="item-title">
              {{ result.wine.bottles }} bottle{{ result.wine.bottles === 1 ? '' : 's' }} of wine
            </div>
            <div class="item-detail">
              {{ result.wine.red }} red · {{ result.wine.white }} white ·
              {{ result.wine.drinks }} servings
            </div>
          </div>
        </li>

        <li v-if="result.liquor.bottles > 0" class="item liquor">
          <div class="item-icon" aria-hidden="true">🥃</div>
          <div class="item-body">
            <div class="item-title">
              {{ result.liquor.bottles }} bottle{{ result.liquor.bottles === 1 ? '' : 's' }} of liquor
            </div>
            <div class="item-detail">
              750 mL each · {{ result.liquor.drinks }} servings
            </div>
          </div>
        </li>

        <li v-if="result.mixers > 0" class="item extra">
          <div class="item-icon" aria-hidden="true">🥤</div>
          <div class="item-body">
            <div class="item-title">
              {{ result.mixers }} bottle{{ result.mixers === 1 ? '' : 's' }} of mixers
            </div>
            <div class="item-detail">soda, tonic, juice — 2 L each</div>
          </div>
        </li>

        <li v-if="result.nonAlc > 0" class="item na">
          <div class="item-icon" aria-hidden="true">💧</div>
          <div class="item-body">
            <div class="item-title">
              {{ result.nonAlc }} bottle{{ result.nonAlc === 1 ? '' : 's' }} non-alcoholic
            </div>
            <div class="item-detail">water, soda — 2 L each</div>
          </div>
        </li>

        <li class="item extra">
          <div class="item-icon" aria-hidden="true">🧊</div>
          <div class="item-body">
            <div class="item-title">
              {{ result.ice }} bag{{ result.ice === 1 ? '' : 's' }} of ice
            </div>
            <div class="item-detail">10 lb each</div>
          </div>
        </li>

        <li class="item extra">
          <div class="item-icon" aria-hidden="true">🥤</div>
          <div class="item-body">
            <div class="item-title">{{ result.cups }} cups</div>
            <div class="item-detail">3 per guest</div>
          </div>
        </li>
      </ul>

      <div class="footer-row">
        <button class="share" @click="shareLink">
          <span aria-hidden="true">📋</span> Copy shareable link
        </button>
        <p class="sr-only" role="status" aria-live="polite">{{ shareStatus }}</p>
      </div>
    </section>
  </main>

  <footer class="foot">
    <p>
      Numbers based on standard pours: 12 oz beer · 5 oz wine · 1.5 oz spirit.
      Always round up — leftovers are better than running out.
    </p>
  </footer>
</template>

<style scoped>
.hero {
  text-align: center;
  margin-bottom: 32px;
}
.hero h1 {
  font-size: 56px;
  margin: 0 0 8px;
  letter-spacing: -0.02em;
  font-weight: 800;
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 60%, #fde68a 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.hero .emoji {
  -webkit-text-fill-color: initial;
}
.tagline {
  color: var(--text-dim);
  font-size: 18px;
  margin: 0;
}

.layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: start;
}
@media (max-width: 820px) {
  .layout {
    grid-template-columns: 1fr;
  }
}

.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
  box-shadow: var(--shadow);
}

/* form */
.field {
  margin-bottom: 24px;
}
.field label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-dim);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.unit {
  color: var(--accent);
  font-weight: 700;
  margin-left: 6px;
  text-transform: none;
  letter-spacing: 0;
}
.row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.row input[type='range'] {
  flex: 1;
}
.num {
  width: 80px;
  padding: 8px 12px;
  background: var(--bg-elev);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
}
input[type='range'] {
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  background: var(--bg-elev);
  border-radius: 999px;
  outline: none;
}
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background: var(--accent);
  border-radius: 50%;
  cursor: pointer;
  border: 3px solid var(--bg-card);
  box-shadow: 0 0 0 1px var(--accent);
}
input[type='range']::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: var(--accent);
  border-radius: 50%;
  cursor: pointer;
  border: 3px solid var(--bg-card);
}
button:focus-visible,
input:focus-visible {
  outline: 3px solid var(--accent-soft);
  outline-offset: 3px;
}

.presets {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 8px;
}
.preset {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  background: var(--bg-elev);
  border: 1px solid var(--border);
  border-radius: 12px;
  transition: all 0.15s ease;
}
.preset:hover {
  border-color: var(--accent);
  transform: translateY(-1px);
}
.preset.active {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.05));
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent);
}
.preset-emoji {
  font-size: 22px;
}
.preset-name {
  font-size: 12px;
  font-weight: 600;
}
.preset-blurb {
  font-size: 13px;
  color: var(--text-dim);
  margin: 8px 0 0;
  font-style: italic;
}

.strength {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.strength button {
  padding: 10px;
  background: var(--bg-elev);
  border: 1px solid var(--border);
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.15s ease;
}
.strength button:hover {
  border-color: var(--accent);
}
.strength button.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #1a1a1a;
}

.mix-preview {
  margin-top: 8px;
  padding-top: 16px;
  border-top: 1px dashed var(--border);
}
.mix-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-dim);
  margin-bottom: 8px;
  font-weight: 600;
}
.mix-bar {
  display: flex;
  height: 32px;
  border-radius: 8px;
  overflow: hidden;
  font-size: 12px;
  font-weight: 700;
  color: white;
}
.mix-bar span {
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  min-width: 0;
  transition: width 0.3s ease;
}
.mix-beer { background: var(--beer); color: #1a1a1a; }
.mix-wine { background: var(--wine); }
.mix-liquor { background: var(--liquor); }

/* results */
.results-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px dashed var(--border);
}
.total-drinks {
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.02em;
}
.total-meta {
  font-size: 13px;
  color: var(--text-dim);
  margin-top: 2px;
}
.total-cost {
  text-align: right;
}
.cost-amount {
  font-size: 32px;
  font-weight: 800;
  color: var(--accent);
}
.cost-meta {
  font-size: 12px;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.shopping {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  background: var(--bg-elev);
  border: 1px solid var(--border);
  border-radius: 12px;
  border-left-width: 4px;
}
.item.beer { border-left-color: var(--beer); }
.item.wine { border-left-color: var(--wine); }
.item.liquor { border-left-color: var(--liquor); }
.item.na { border-left-color: var(--na); }
.item.extra { border-left-color: var(--extra); }

.item-icon {
  font-size: 24px;
  flex-shrink: 0;
}
.item-body {
  flex: 1;
  min-width: 0;
}
.item-title {
  font-weight: 700;
  font-size: 16px;
}
.item-detail {
  font-size: 13px;
  color: var(--text-dim);
  margin-top: 2px;
}

.footer-row {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
.share {
  padding: 10px 18px;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--text-dim);
  font-weight: 600;
  font-size: 13px;
  transition: all 0.15s ease;
}
.share:hover {
  color: var(--text);
  border-color: var(--accent);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.foot {
  text-align: center;
  margin-top: 32px;
  color: var(--text-dim);
  font-size: 13px;
}
.foot p {
  max-width: 540px;
  margin: 0 auto;
}
</style>
