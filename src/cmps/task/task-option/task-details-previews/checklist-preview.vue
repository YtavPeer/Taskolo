<template>
  <section class="checklist-preview flex column">
    <img src="@/assets/task-icon/trello-icon-pack/checkbox.svg" alt="" />
    <div class="checklist-title flex space-between">
      <h3>{{ checklist.title }}</h3>
      <button @click="toggleDeleteConfrimation">Delete</button>
      <base-task-modal title="Delete checklist?" v-if="isDeleteConfirmOpen">
        <checklist-delete-confirm @delete-checklist="deleteChecklist" />
      </base-task-modal>
    </div>
    <div class="checklist-items-container">
      <div class="checklist-bar-container flex align-center">
        <div class="status-txt">{{ percentagesToDisplay }}</div>
        <checklist-bar :percentages="percentages" />
      </div>

      <div
        v-for="todo in checklist.todos"
        :key="todo.id"
        class="todo-item flex align-center"
      >
        <el-checkbox
          type="checkbox"
          :checked="todo.isDone"
          @change="toggleTodoState(todo.id)"
        />
        <span
          v-if="!isEdit"
          :class="{ done: todo.isDone }"
          @click="selectEditItem"
          >{{ todo.txt }}</span
        >
        <el-input v-else type="text" v-model="todo.txt" ref="todoItem" />
      </div>
    </div>

    <div class="checklist-button flex column align-start">
      <button v-if="!isAddItemClicked && !isEdit" @click="addItemClicked">
        Add an item
      </button>
      <el-input
        type="text"
        v-if="isAddItemClicked"
        placeholder="Add an item"
        v-model="todo.txt"
        ref="addItem"
      />
      <div v-if="isAddItemClicked || isEdit" class="checklist-actions flex">
        <div class="checklist-button-container flex">
          <button v-if="!isEdit" @click="addToChecklist" class="flex center">
            Add
          </button>
          <button v-else @click="editItem" class="flex center">Save</button>
          <button @click="closeAddItemClicked" class="flex center">
            <img src="@/assets/task-icon/trello-icon-pack/close.svg" />
          </button>
        </div>

        <div class="text-actions flex"></div>
      </div>
    </div>
  </section>
</template>

<script>
import checklistDeleteConfirm from "../task-details/checklist-delete-confirm";
import baseTaskModal from "../../../base-task-modal";
import checklistBar from "../../../checklist-bar";
import { boardService } from "@/services/board.service.js";
export default {
  props: {
    checklistProp: {},
  },
  data() {
    return {
      checklist: null,
      todo: boardService.getEmptyTodo(),
      isAddItemClicked: false,
      isDeleteConfirmOpen: false,
      isEdit: false,
    };
  },
  methods: {
    addToChecklist() {
      if (this.todo.txt) {
        const todoToAdd = { ...this.todo };
        this.checklist.todos.push(todoToAdd);
        this.$emit("update-checklist", this.checklist);
        this.todo = boardService.getEmptyTodo();
        this.focusAddItemInput();
      }
    },
    toggleTodoState(todoId) {
      const todoIdx = this.checklist.todos.findIndex(
        (todo) => todoId === todo.id
      );
      this.checklist.todos[todoIdx].isDone =
        !this.checklist.todos[todoIdx].isDone;
      this.$emit("update-checklist", this.checklist);
    },
    deleteChecklist() {
      this.toggleDeleteConfrimation();
      this.$emit("delete-checklist", this.checklist.id);
    },
    toggleDeleteConfrimation() {
      this.isDeleteConfirmOpen = !this.isDeleteConfirmOpen;
    },
    closeAddItemClicked() {
      this.isAddItemClicked = false;
    },
    addItemClicked() {
      this.isAddItemClicked = true;
      this.focusAddItemInput();
    },
    selectEditItem() {
      this.isEdit = true;
      this.$nextTick(() => {
        console.log(this.$refs.todoItem[1]);
        this.$refs.todoItem[0].select();
      });
    },
    focusAddItemInput() {
      this.$nextTick(() => {
        this.$refs.addItem.focus();
      });
    },
  },
  computed: {
    percentages() {
      if (!this.checklist.todos.length) return 0;
      const unCompleted = this.checklist.todos.reduce((sum, todo) => {
        if (todo.isDone) sum += 1;
        return sum;
      }, 0);
      return ((unCompleted / this.checklist.todos.length) * 100).toFixed(2);
    },
    percentagesToDisplay() {
      return Math.floor(this.percentages) + "%";
    },
  },
  created() {
    this.checklist = this.$clone(this.checklistProp);
  },
  components: {
    checklistDeleteConfirm,
    baseTaskModal,
    checklistBar,
  },
};
</script>

<style>
</style>