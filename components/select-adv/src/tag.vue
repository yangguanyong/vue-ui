<template>
  <div class="tag">
    <span class="inner">
      <slot></slot>
    </span>
    <i @click="$emit('remove')">&times;</i>
  </div>
</template>

