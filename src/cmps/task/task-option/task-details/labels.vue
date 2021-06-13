<template>
  <section class="task-labels">
    <el-input type="text" placeholder="Search labels..." />
    <h3>Labels</h3>
    <div
      v-for="label in labelsFromProp"
      :key="label.id"
      class="flex"
      @click="addLabel(label)"
    >
      <div
        class="label flex align-center"
        :style="{ backgroundColor: label.color }"
      >
        <span class="label-title">{{ label.title }}</span>
        <a class="v-icon" v-show="isAlreadyTaskLabel(label.id)" href="#"
          ><i class="el-icon-check"></i
        ></a>
      </div>
      <span class="label-edit flex center" @click="openLabelsEdit(label)">
        <img
          src="@/assets/task-icon/trello-icon-pack/edit-pencil-slate-blue.svg"
        />
      </span>
    </div>
  </section>
</template>

<script>
export default {
  name: "labels",
  props: {
    labels: {},
    editedLabel: {},
    taskLabelIds: {},
  },
  data() {
    return {
      labelsFromProp: null,
    };
  },
  methods: {
    openLabelsEdit(label) {
      this.$emit("open-label-edit", label);
    },
    setEditedLabel() {
      if (!this.editedLabel) return;
      const labelIdx = this.labelsFromProp.findIndex((label) => {
        return label.id === this.editedLabel.id;
      });
      this.labelsFromProp.splice(labelIdx, 1, this.editedLabel);
    },
    addLabel(label) {
      this.$emit("add-label", label);
    },
    isAlreadyTaskLabel(labelId) {
      let isInTask = false;
      if (this.taskLabelIds) {
        this.taskLabelIds.forEach((lId) => {
          if (lId === labelId) isInTask = true;
        });
      }
      return isInTask;
    },
  },
  created() {
    this.labelsFromProp = JSON.parse(JSON.stringify(this.labels));
    this.setEditedLabel();
  },
};
</script>

<style>
</style>