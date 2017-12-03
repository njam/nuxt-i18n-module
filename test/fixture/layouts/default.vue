<template>
  <div>
    <nav>
      <nuxt-link :to="localePath('/foo')">foo</nuxt-link>
      <nuxt-link :to="localePath('/bar')">bar</nuxt-link>
    </nav>
    <nuxt/>
  </div>
</template>
