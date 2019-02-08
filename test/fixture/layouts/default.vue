<template>
  <div>
    <nav>
      <nuxt-link :to="localePath('/foo')">foo</nuxt-link>
      <nuxt-link :to="localePath('/bar')">bar</nuxt-link>
    </nav>

    <div>i18n/getLanguage={{ $store.getters['i18n/getLanguage'] }}</div>

    <nuxt/>

    <footer>
      <i18n-switcher/>
    </footer>
  </div>
</template>

<style>
  .nuxt-link-active {
    font-weight: bold;
  }

  nav a:not(:last-child) {
    margin-right: 5px;
  }
</style>
