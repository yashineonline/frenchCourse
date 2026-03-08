<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { withBase } from "vitepress";

type Line = {
  who: "A" | "B";
  fr: string;
  meaning_en?: string;
  es?: string;
  ar_tr?: string;
};

type Dialog = {
  title: string;
  goal?: string;
  lines: Line[];
};

type DialogFile = {
  title?: string;
  subtitle?: string;
  dialogs: Dialog[];
};

const props = defineProps<{ src: string }>();

const data = ref<DialogFile | null>(null);
const dialogIdx = ref(0);
const reveal = ref(0); // number of lines shown
const support = ref<"none"|"es"|"ar_tr">("es");

const loading = ref(true);
const error = ref<string | null>(null);

async function load(){
  loading.value = true;
  error.value = null;
  try{
    const url = withBase(props.src);
    const res = await fetch(url);
    if(!res.ok) throw new Error(`HTTP ${res.status} while loading ${props.src}`);
    const json = (await res.json()) as DialogFile;
    if(!json?.dialogs?.length) throw new Error("Dialogs JSON has no dialogs");
    data.value = json;
    dialogIdx.value = Math.min(dialogIdx.value, json.dialogs.length-1);
    reveal.value = 0;
  }catch(e:any){
    error.value = e?.message ?? String(e);
  }finally{
    loading.value = false;
  }
}

onMounted(load);
watch(() => props.src, load);

const dialog = computed(() => data.value?.dialogs?.[dialogIdx.value] ?? null);
const total = computed(() => data.value?.dialogs?.length ?? 0);

function nextDialog(){
  if(!data.value) return;
  dialogIdx.value = Math.min(dialogIdx.value+1, data.value.dialogs.length-1);
  reveal.value = 0;
}
function prevDialog(){
  if(!data.value) return;
  dialogIdx.value = Math.max(dialogIdx.value-1, 0);
  reveal.value = 0;
}

function showNextLine(){
  if(!dialog.value) return;
  reveal.value = Math.min(reveal.value + 1, dialog.value.lines.length);
}
function showAll(){
  if(!dialog.value) return;
  reveal.value = dialog.value.lines.length;
}
function restart(){
  reveal.value = 0;
}
</script>

<template>
  <div class="mdk">
    <div v-if="loading" class="mdk__muted">Loading…</div>
    <div v-else-if="error" class="mdk__error">
      <div><strong>Could not load dialogs.</strong></div>
      <div class="mdk__muted">{{ error }}</div>
    </div>

    <div v-else-if="data && dialog" class="mdk__card">
      <div class="mdk__head">
        <div>
          <div class="mdk__kicker">{{ data.title }}</div>
          <div class="mdk__h">{{ dialog.title }}</div>
          <div v-if="dialog.goal" class="mdk__muted">{{ dialog.goal }}</div>
        </div>
        <div class="mdk__muted">{{ dialogIdx + 1 }} / {{ total }}</div>
      </div>

      <div class="mdk__controls">
        <label class="mdk__label">
          Support
          <select class="mdk__select" v-model="support">
            <option value="none">None</option>
            <option value="es">Spanish</option>
            <option value="ar_tr">Arabic (transliteration)</option>
          </select>
        </label>

        <div class="mdk__btnRow">
          <button class="mdk__btn" @click="showNextLine" :disabled="reveal >= dialog.lines.length">Reveal next</button>
          <button class="mdk__btn mdk__btnGhost" @click="showAll" :disabled="reveal >= dialog.lines.length">Reveal all</button>
          <button class="mdk__btn mdk__btnGhost" @click="restart" :disabled="reveal === 0">Restart</button>
        </div>
      </div>

      <div class="mdk__lines">
        <div v-for="(ln, i) in dialog.lines.slice(0, reveal)" :key="i" class="mdk__line" :class="ln.who==='A' ? 'mdk__a' : 'mdk__b'">
          <div class="mdk__who">{{ ln.who }}</div>
          <div class="mdk__text">
            <div class="mdk__fr">{{ ln.fr }}</div>
            <div v-if="ln.meaning_en" class="mdk__muted">{{ ln.meaning_en }}</div>
            <div v-if="support==='es' && ln.es" class="mdk__support">ES: {{ ln.es }}</div>
            <div v-if="support==='ar_tr' && ln.ar_tr" class="mdk__support">AR: {{ ln.ar_tr }}</div>
          </div>
        </div>
      </div>

      <div class="mdk__nav">
        <button class="mdk__btn" @click="prevDialog" :disabled="dialogIdx===0">Prev dialog</button>
        <button class="mdk__btn mdk__btnPrimary" @click="nextDialog" :disabled="dialogIdx===total-1">Next dialog</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mdk{
  border:1px solid var(--vp-c-divider);
  border-radius:14px;
  padding:14px;
  background: var(--vp-c-bg-soft);
  box-shadow: 0 6px 20px rgba(0,0,0,.04);
}
.mdk__muted{ color: var(--vp-c-text-2); font-size:.95rem; }
.mdk__error{ color: var(--vp-c-danger-1); }
.mdk__card{ display:flex; flex-direction:column; gap:12px; }
.mdk__head{ display:flex; justify-content:space-between; align-items:flex-start; gap:12px; flex-wrap:wrap; }
.mdk__kicker{ color: var(--vp-c-text-2); font-size:.85rem; }
.mdk__h{ font-size:1.2rem; font-weight:900; }
.mdk__controls{ display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap; align-items:end; }
.mdk__label{ display:flex; flex-direction:column; gap:6px; font-weight:800; }
.mdk__select{
  border:1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border-radius:10px;
  padding:8px 10px;
}
.mdk__btnRow{ display:flex; gap:10px; flex-wrap:wrap; }
.mdk__lines{ display:flex; flex-direction:column; gap:10px; }
.mdk__line{
  display:grid;
  grid-template-columns: 30px 1fr;
  gap:10px;
  padding:10px;
  border:1px solid var(--vp-c-divider);
  border-radius:12px;
  background: var(--vp-c-bg);
}
.mdk__a{ border-left: 6px solid var(--vp-c-brand-1); }
.mdk__b{ border-left: 6px solid var(--vp-c-brand-2, var(--vp-c-brand-1)); }
.mdk__who{ font-weight:900; color: var(--vp-c-text-2); }
.mdk__fr{ font-size:1.05rem; font-weight:900; }
.mdk__support{ margin-top:4px; font-size:.95rem; color: var(--vp-c-text-2); }
.mdk__nav{ display:flex; gap:10px; justify-content:flex-end; flex-wrap:wrap; }
.mdk__btn{
  border:1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  padding:8px 12px;
  border-radius:10px;
  cursor:pointer;
  font-weight:800;
}
.mdk__btn:disabled{ opacity:.5; cursor:not-allowed; }
.mdk__btnPrimary{
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color:white;
}
.mdk__btnGhost{ background: transparent; }
</style>