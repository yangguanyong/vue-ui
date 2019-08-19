<template>
    <div class="area-loading">
      <svg class="area-loading__circular" viewBox="25 25 50 50">
        <circle class="area-loading__path" cx="50" cy="50" r="20" fill="none"/>
      </svg>
    </div>
</template>

<script>
export default {
  data () {
    return {
      visible: true
    }
  }
}
</script>