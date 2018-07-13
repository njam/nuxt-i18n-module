<template>
  <nav class="language-switcher">
    <template v-for="(lang, i) in Object.keys($i18n.messages)">
      <nuxt-link :to="{ params: {lang: lang} }" exact>{{ lang }}</nuxt-link>
    </template>
  </nav>
</template>
