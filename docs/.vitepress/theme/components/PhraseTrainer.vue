<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { withBase } from "vitepress";

type Phrase = {
  id?: string;
  fr: string;
  meaning_en?: string;
  es?: string;
  ar_tr?: string;   // arabic transliteration
  ar?: string;      // arabic script (optional)
  teacher_es?: string;
  teacher_ar_tr?: string;
};

type PhraseFile = {
  title?: string;
  subtitle?: string;
  phrases: Phrase[];
};

const props = defineProps<{
  src: string; // "/lessons-data/phrases_a0.json"
}>();

const deck = ref<PhraseFile | null>(null);
const idx = ref(0);
const showMeaning = ref(true);
const support = ref<"none"|"es"|"ar_tr"|"ar">("es");
const mode = ref<"learner"|"teacher">("teacher");

const loading = ref(true);
const error = ref<string | null>(null);

async function load() {
  loading.value = true;
  error.value = null;
  try {
    const url = withBase(props.src);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} while loading ${props.src}`);
    const data = (await res.json()) as PhraseFile;
    if (!data?.phrases?.length) throw new Error("Phrase JSON has no phrases");
    deck.value = data;
    idx.value = Math.min(idx.value, data.phrases.length - 1);
  } catch (e: any) {
    error.value = e?.message ?? String(e);
  } finally {
    loading.value = false;
  }
}

onMounted(load);
watch(() => props.src, load);

const phrase = computed(() => deck.value?.phrases?.[idx.value] ?? null);
const total = computed(() => deck.value?.phrases?.length ?? 0);

function next(){ if(deck.value) idx.value = Math.min(idx.value+1, deck.value.phrases.length-1); }
function prev(){ if(deck.value) idx.value = Math.max(idx.value-1, 0); }
function shuffle(){
  if (!deck.value) return;
  const arr = [...deck.value.phrases];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  deck.value = { ...deck.value, phrases: arr };
  idx.value = 0;
}

const supportLine = computed(() => {
  if (!phrase.value) return "";
  if (support.value === "es") return phrase.value.es ?? "";
  if (support.value === "ar_tr") return phrase.value.ar_tr ?? "";
  if (support.value === "ar") return phrase.value.ar ?? "";
  return "";
});

const teacherCue = computed(() => {
  if (!phrase.value) return "";
  if (support.value === "es") return phrase.value.teacher_es ?? "";
  if (support.value === "ar_tr") return phrase.value.teacher_ar_tr ?? "";
  // If they select Arabic script, still show transliteration cue if available
  if (support.value === "ar") return phrase.value.teacher_ar_tr ?? "";
  return "";
});
</script>

<template>
  <div class="pt">
    <div v-if="loading" class="pt__muted">Loading…</div>
    <div v-else-if="error" class="pt__error">
      <div><strong>Could not load phrases.</strong></div>
      <div class="pt__muted">{{ error }}</div>
    </div>

    <div v-else-if="deck && phrase" class="pt__card">
      <div class="pt__head">
        <div>
          <div class="pt__kicker">{{ deck.title }}</div>
          <div class="pt__h">{{ deck.subtitle }}</div>
        </div>
        <div class="pt__muted">{{ idx + 1 }} / {{ total }}</div>
      </div>

      <div class="pt__controls">
        <label class="pt__label">
          Mode
          <select class="pt__select" v-model="mode">
            <option value="teacher">Teacher cue</option>
            <option value="learner">Learner view</option>
          </select>
        </label>

        <label class="pt__label">
          Support
          <select class="pt__select" v-model="support">
            <option value="none">None</option>
            <option value="es">Spanish</option>
            <option value="ar_tr">Arabic (transliteration)</option>
            <option value="ar">Arabic (script)</option>
          </select>
        </label>

        <label class="pt__check">
          <input type="checkbox" v-model="showMeaning" />
          Show meaning
        </label>
      </div>

      <div class="pt__body">
        <div class="pt__fr">{{ phrase.fr }}</div>

        <div v-if="showMeaning && phrase.meaning_en" class="pt__meaning">
          {{ phrase.meaning_en }}
        </div>

        <div v-if="support !== 'none' && supportLine" class="pt__support">
          <div class="pt__supportLabel">Support</div>
          <div class="pt__supportLine">{{ supportLine }}</div>
        </div>

        <div v-if="mode === 'teacher' && teacherCue" class="pt__cue">
          <div class="pt__supportLabel">You say</div>
          <div class="pt__cueLine">{{ teacherCue }}</div>
          <div class="pt__muted" style="margin-top:6px;">(Then point and ask them to say the French line.)</div>
        </div>
      </div>

      <div class="pt__nav">
        <button class="pt__btn" @click="prev" :disabled="idx===0">Back</button>
        <button class="pt__btn pt__btnGhost" @click="shuffle">Shuffle</button>
        <button class="pt__btn pt__btnPrimary" @click="next" :disabled="idx===total-1">Next</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pt{
  border:1px solid var(--vp-c-divider);
  border-radius:14px;
  padding:14px;
  background: var(--vp-c-bg-soft);
  box-shadow: 0 6px 20px rgba(0,0,0,.04);
}
.pt__muted{ color: var(--vp-c-text-2); font-size: .95rem; }
.pt__error{ color: var(--vp-c-danger-1); }
.pt__card{ display:flex; flex-direction:column; gap:12px; }
.pt__head{ display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap; align-items:flex-start; }
.pt__kicker{ color: var(--vp-c-text-2); font-size: .85rem; }
.pt__h{ font-size: 1.1rem; font-weight: 800; }
.pt__controls{ display:flex; gap:12px; flex-wrap:wrap; align-items:end; }
.pt__label{ display:flex; flex-direction:column; gap:6px; font-weight:700; font-size:.95rem; }
.pt__select{
  border:1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border-radius:10px;
  padding:8px 10px;
}
.pt__check{ display:flex; gap:8px; align-items:center; font-weight:700; }
.pt__body{ display:flex; flex-direction:column; gap:10px; }
.pt__fr{ font-size: 1.55rem; font-weight: 900; }
.pt__meaning{ color: var(--vp-c-text-2); font-size: 1rem; }
.pt__support{ padding:10px; border:1px dashed var(--vp-c-divider); border-radius:12px; background: var(--vp-c-bg); }
.pt__cue{ padding:10px; border:1px solid var(--vp-c-divider); border-radius:12px; background: var(--vp-c-bg); }
.pt__supportLabel{ font-weight: 900; margin-bottom: 6px; }
.pt__supportLine, .pt__cueLine{ font-size: 1.05rem; }
.pt__nav{ display:flex; gap:10px; justify-content:flex-end; flex-wrap:wrap; }
.pt__btn{
  border:1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  padding:8px 12px;
  border-radius:10px;
  cursor:pointer;
  font-weight:800;
}
.pt__btn:disabled{ opacity:.5; cursor:not-allowed; }
.pt__btnPrimary{
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: white;
}
.pt__btnGhost{ background: transparent; }
</style>