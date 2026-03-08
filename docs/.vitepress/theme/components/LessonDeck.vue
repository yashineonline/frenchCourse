<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { withBase } from "vitepress";

type Card = {
  title?: string;
  fr?: string;
  note?: string;
  table?: { headers: string[]; rows: string[][] };
  examples?: string[];
  drill?: { prompt: string; answer: string }[];
};

type DeckFile = {
  title?: string;
  subtitle?: string;
  cards: Card[];
};

const props = defineProps<{
  src: string;              // e.g. "/lessons-data/verbs_a0.json"
  startAt?: number;         // default 0
  showProgress?: boolean;   // default true
}>();

const deck = ref<DeckFile | null>(null);
const idx = ref(Math.max(0, props.startAt ?? 0));
const showNote = ref(false);

const loading = ref(true);
const error = ref<string | null>(null);

async function load() {
  loading.value = true;
  error.value = null;
  try {
    const url = withBase(props.src);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} while loading ${props.src}`);
    const data = (await res.json()) as DeckFile;
    if (!data?.cards?.length) throw new Error("Deck JSON has no cards");
    deck.value = data;
    idx.value = Math.min(idx.value, data.cards.length - 1);
  } catch (e: any) {
    error.value = e?.message ?? String(e);
  } finally {
    loading.value = false;
  }
}

onMounted(load);
watch(() => props.src, load);

const card = computed(() => deck.value?.cards?.[idx.value] ?? null);
const total = computed(() => deck.value?.cards?.length ?? 0);

function next() {
  if (!deck.value) return;
  idx.value = Math.min(idx.value + 1, deck.value.cards.length - 1);
  showNote.value = false;
}
function prev() {
  if (!deck.value) return;
  idx.value = Math.max(idx.value - 1, 0);
  showNote.value = false;
}
function reset() {
  idx.value = 0;
  showNote.value = false;
}
</script>

<template>
  <div class="deck">
    <div v-if="loading" class="deck__muted">Loading…</div>
    <div v-else-if="error" class="deck__error">
      <div><strong>Could not load lesson.</strong></div>
      <div class="deck__muted">{{ error }}</div>
    </div>

    <div v-else-if="deck && card" class="deck__card">
      <div class="deck__head">
        <div class="deck__title">
          <div class="deck__kicker">{{ deck.title }}</div>
          <div class="deck__h">{{ card.title || `Card ${idx+1}` }}</div>
          <div v-if="deck.subtitle" class="deck__sub">{{ deck.subtitle }}</div>
        </div>

        <div v-if="showProgress !== false" class="deck__progress">
          <div class="deck__muted">{{ idx + 1 }} / {{ total }}</div>
          <div class="deck__bar">
            <div class="deck__barFill" :style="{ width: ((idx+1)/total*100)+'%' }"></div>
          </div>
        </div>
      </div>

      <div class="deck__body">
        <div v-if="card.fr" class="deck__fr">{{ card.fr }}</div>

        <div v-if="card.table" class="deck__tableWrap">
          <table class="deck__table">
            <thead>
              <tr>
                <th v-for="h in card.table.headers" :key="h">{{ h }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(r, i) in card.table.rows" :key="i">
                <td v-for="(c, j) in r" :key="j">{{ c }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="card.examples?.length" class="deck__block">
          <div class="deck__label">Examples</div>
          <ul class="deck__ul">
            <li v-for="(ex, i) in card.examples" :key="i">{{ ex }}</li>
          </ul>
        </div>

        <div v-if="card.drill?.length" class="deck__block">
          <div class="deck__label">Quick drill</div>
          <div class="deck__drill">
            <div v-for="(q, i) in card.drill" :key="i" class="deck__qa">
              <div class="deck__q">{{ q.prompt }}</div>
              <details class="deck__a">
                <summary>Show answer</summary>
                <div class="deck__ans">{{ q.answer }}</div>
              </details>
            </div>
          </div>
        </div>

        <div v-if="card.note" class="deck__block">
          <button class="deck__btn deck__btnGhost" @click="showNote = !showNote">
            {{ showNote ? "Hide note" : "Show note" }}
          </button>
          <div v-if="showNote" class="deck__note">{{ card.note }}</div>
        </div>
      </div>

      <div class="deck__nav">
        <button class="deck__btn" @click="prev" :disabled="idx===0">Back</button>
        <button class="deck__btn deck__btnGhost" @click="reset" :disabled="idx===0">Restart</button>
        <button class="deck__btn deck__btnPrimary" @click="next" :disabled="idx===total-1">Next</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.deck{
  border:1px solid var(--vp-c-divider);
  border-radius:14px;
  padding:14px;
  background: var(--vp-c-bg-soft);
  box-shadow: 0 6px 20px rgba(0,0,0,.04);
}
.deck__muted{ color: var(--vp-c-text-2); font-size: .95rem; }
.deck__error{ color: var(--vp-c-danger-1); }
.deck__card{ display:flex; flex-direction:column; gap:12px; }
.deck__head{ display:flex; align-items:flex-start; justify-content:space-between; gap:12px; flex-wrap:wrap; }
.deck__kicker{ color: var(--vp-c-text-2); font-size: .85rem; }
.deck__h{ font-size: 1.25rem; font-weight: 700; line-height: 1.2; }
.deck__sub{ color: var(--vp-c-text-2); margin-top: 4px; font-size: .95rem; }
.deck__progress{ min-width: 160px; }
.deck__bar{ height: 8px; background: var(--vp-c-divider); border-radius: 999px; overflow:hidden; margin-top:6px; }
.deck__barFill{ height:100%; background: var(--vp-c-brand-1); }
.deck__body{ display:flex; flex-direction:column; gap:12px; }
.deck__fr{ font-size: 1.35rem; font-weight: 700; }
.deck__label{ font-weight: 700; margin-bottom: 6px; }
.deck__ul{ margin: 0; padding-left: 18px; }
.deck__tableWrap{ overflow:auto; }
.deck__table{ width:100%; border-collapse:collapse; font-size: .98rem; }
.deck__table th, .deck__table td{ border-bottom:1px solid var(--vp-c-divider); padding:8px 10px; text-align:left; white-space:nowrap; }
.deck__table th{ color: var(--vp-c-text-2); font-weight:700; }
.deck__block{ padding:10px; border:1px dashed var(--vp-c-divider); border-radius:12px; background: var(--vp-c-bg); }
.deck__drill{ display:flex; flex-direction:column; gap:8px; }
.deck__qa{ padding:8px; border:1px solid var(--vp-c-divider); border-radius:10px; background: var(--vp-c-bg-soft); }
.deck__q{ font-weight: 700; }
.deck__a summary{ cursor:pointer; color: var(--vp-c-brand-1); }
.deck__ans{ margin-top:6px; }
.deck__note{ margin-top:10px; color: var(--vp-c-text-2); }
.deck__nav{ display:flex; gap:10px; justify-content:flex-end; flex-wrap:wrap; }
.deck__btn{
  border:1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  padding:8px 12px;
  border-radius:10px;
  cursor:pointer;
  font-weight:700;
}
.deck__btn:disabled{ opacity:.5; cursor:not-allowed; }
.deck__btnPrimary{
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: white;
}
.deck__btnGhost{
  background: transparent;
}
</style>