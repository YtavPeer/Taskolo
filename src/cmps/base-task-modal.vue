<template>
  <section class="task-modal">
    <header class="header">
      <span class="title">{{ title }}</span>
      <a href="#" @click="closeModal" class="close-btn"
        ><img src="@/assets/task-icon/trello-icon-pack/close.svg"
      /></a>
    </header>
    <hr />
    <slot></slot>
  </section>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  methods: {
    closeModal() {
      this.$emit("close-modal");
    },
  },
};
</script>

<style>
</style>