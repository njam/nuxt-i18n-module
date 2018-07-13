<template>
  <ul class="language-switcher">
    <li v-for="(lang) in Object.keys($i18n.messages)" :key="lang">
      <nuxt-link :to="{ params: {lang: lang} }" exact>{{ lang }}</nuxt-link>
    </li>
  </ul>
</template>
