<template>
  <ul class="language-switcher">
    <li v-for="(lang) in Object.keys($i18n.messages)" :key="lang">
      <nuxt-link class="language-switcher-link" :to="{ params: {lang: i18nLangParam(lang)} }" exact>{{ lang }}</nuxt-link>
    </li>
  </ul>
</template>
