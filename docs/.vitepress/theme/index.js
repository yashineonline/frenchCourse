import DefaultTheme from 'vitepress/theme'

// If you have custom components, register them here.
// (Adjust names/paths to whatever you actually have.)
import LessonDeck from './components/LessonDeck.vue'
import PhraseTrainer from './components/PhraseTrainer.vue'
import MiniDialogDeck from './components/MiniDialogDeck.vue'

export default {
  extends: DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp?.(ctx)
    ctx.app.component('LessonDeck', LessonDeck)
    ctx.app.component('PhraseTrainer', PhraseTrainer)
    ctx.app.component('MiniDialogDeck', MiniDialogDeck)
  }
}
