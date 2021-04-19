<template>
  <div
    class="dute-date flex align-center space-between"
    v-if="task.dueDate"
    :class="timeStatus"
    @mouseover="dueDateIcon = task.isDone ? 'check-square' : 'square'"
    @mouseout="dueDateIcon = 'clock'"
    @click.stop="isDoneToggle"
  >
    <font-awesome-icon class="due-date-icon" :icon="['far', dueDateIcon]" />

    <span class="time-display"> {{ timeForDisplay }}</span>
  </div>
</template>

<script>
export default {
  computed: {
    timeStatus() {
      return {
        isTimePass:
          this.$moment().isAfter(this.task.dueDate) && !this.task.isDone,
        isToday: this.$moment().isSame(this.task.dueDate, "day"),
        isDone: this.task.isDone,
      };
    },
  },
  methods: {
    async isDoneToggle() {
      try {
        await this.$store.commit({
          type: "setTaskById",
          taskId: this.task.id,
        });
        let taskCopy = this.$clone(this.task);
        taskCopy.isDone = !taskCopy.isDone;
        await this.$store.dispatch({ type: "updateTask", task: taskCopy });
        this.onDateHover();
      } catch (error) {
        console.log("cant toggle is done", error);
      }
    },
  },
};
</script>

<style>
</style>