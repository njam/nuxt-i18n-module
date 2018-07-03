<template>
  <a :href="'/' + lang" @click.prevent="processLink">
    <slot></slot>
  </a>
</template>

<script>
import Vue from 'vue'

export default {
  name: 'nuxt-i18n-link',
  props: {
      lang: {
        type: String,
        required: true,
        validator (value) {
          return Vue.availableLanguages.indexOf(value) !== -1
        }
      }
    },
    methods: {
      processLink () {
        this.$router.replace({params: {lang: this.lang}})
      }
    }
}
</script>
