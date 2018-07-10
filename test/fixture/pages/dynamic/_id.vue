<template>
  <div>
    Dynamic page: {{ $route.params.id }}
    {{ $t('hello-world') }}
  </div>
</template>

<script>
  export default {
    name: 'Dynamic-page'
  }
</script>
