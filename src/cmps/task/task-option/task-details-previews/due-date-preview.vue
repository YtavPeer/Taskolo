<template>
  <section class="due-date-preview flex column align-start">
    <div
      v-if="date.start"
      class="date-preview-range flex align-start"
      @click="openDueDateModal"
    >
      <div class="start-date flex column align-start">
        <h3>Start Date</h3>
        <span class="date">
          {{ dateToShow.start | moment("MMM Do h:mm A") }}
        </span>
      </div>
      <div class="end-date flex column align-start">
        <h3>Due Date</h3>
        <span class="date">
          {{ dateToShow.end | moment("MMM Do h:mm A") }}
        </span>
      </div>
    </div>
    <div
      v-else
      class="date-preview flex column align-start"
      @click="openDueDateModal"
    >
      <h3>Due Date</h3>
      <span class="date">
        {{ dateToShow | moment("MMM Do h:mm A") }}
      </span>
    </div>
  </section>
</template>

<script>
export default {
  name: "due-date-preview",
  props: {
    date: {},
  },
  computed: {
    dateToShow() {
      return this.date;
    },
  },
  methods: {
    openDueDateModal() {
      this.$emit("setDate");
    },
  },
};
</script>

<style>
</style>