<template>
  <section>
    <div
      class="task-container"
      v-if="task"
      @click="openTaskPreview"
      @mouseover="isEdit = true"
      @mouseleave="isEdit = false"
    >
      <div class="edit-btn">
        <div class="editing">
          <img
            v-show="isEdit"
            @click.stop="openTaskPreview"
            class="task-edit-img"
            src="../../assets/task-icon/pen.png"
            alt="sadf"
          />

          <font-awesome-icon
            v-show="isEdit"
            @click.stop="deleteTask"
            class="task-delete"
            :icon="['fas', 'trash-alt']"
          />
        </div>
      </div>

      <div
        class="task-main cover"
        v-if="task.style.isCover"
        :style="{ 'background-color': task.style.bgColor }"
      >
        <div class="title-cover">
          {{ task.title }}
        </div>
      </div>

      <div v-else>
        <div class="task-header">
          <div
            v-if="task.style.bgColor"
            class="task-color"
            :style="{ 'background-color': task.style.bgColor }"
          ></div>
        </div>

        <div class="task-main">
          <div v-if="task.attachment" class="attachment flex center">
            <img
              :src="task.attachment"
              alt="picture"
              class="picture-preview"
              style="width: auto"
            />
          </div>

          <ul class="flex labels" v-if="task.labelIds">
            <li
              class="label"
              v-for="(label, index) in task.labelIds"
              :key="index"
            >
              <div
                class="taskLabel"
                :style="{
                  'background-color': getTaskColor(label),
                }"
              ></div>
            </li>
          </ul>

          <div class="title">
            {{ task.title }}
          </div>

          <div class="badges flex">
            <div class="watch flex center" v-if="task.watch">
              <img
                class="task-prev-icon"
                src="@/assets/task-icon/trello-icon-pack/watch.svg"
                alt=""
              />
            </div>

            <div
              class="dute-date flex align-center space-between"
              v-if="task.dueDate"
              :class="timeStatus"
              @mouseover="dueDateIcon = task.isDone ? 'check-square' : 'square'"
              @mouseout="dueDateIcon = 'clock'"
              @click.stop="isDoneToggle"
            >
              <font-awesome-icon
                class="due-date-icon"
                :icon="['far', dueDateIcon]"
              />

              <span class="time-display"> {{ timeForDisplay }}</span>
            </div>

            <div class="desc" v-if="task.description">
              <img
                class="task-prev-icon"
                src="../../assets/task-icon/left-alignment.svg"
                alt=""
              />
            </div>

            <div class="comments" v-if="task.comments">
              <font-awesome-icon :icon="['far', 'comment']" />
            </div>

            <div class="checklist flex align-center" v-if="task.checklists">
              <img
                class="task-prev-icon"
                src="@/assets/task-icon/trello-icon-pack/checkbox.svg"
                alt=""
              />
              <span class="checklist-display"> {{ checklistForDisplay }}</span>
            </div>

            <div class="members flex" v-if="task.members">
              <li
                class="memeber"
                v-for="member in task.members"
                :key="member._id"
              >
                <img
                  v-if="isBoardMember(member._id)"
                  class="task-prev-icon member"
                  :src="member.imgUrl"
                  alt=""
                />
              </li>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    boardId: {},
    group: {},
    task: {},
  },
  name: "task-preview",
  data() {
    return {
      labels: this.task.labelIds,
      isEdit: false,
      dueDateIcon: "clock",
      icon: "clock",
    };
  },
  computed: {
    currBoard() {
      return this.$store.getters.currBoard;
    },
    timeForDisplay() {
      return this.$moment(this.task.dueDate).format("MMM D");
    },
    checklistForDisplay() {
      let size = 0;
      let dones = 0;

      this.task.checklists.forEach((checklist) => {
        checklist.todos.forEach((todo) => {
          size++;
          if (todo.isDone) dones++;
        });
      });
      return `${dones}/${size}`;
    },
    getBoard() {
      return this.$store.getters.currBoard;
    },
    timeStatus() {
      return {
        isTimePass:
          this.$moment().isAfter(this.task.dueDate) && !this.task.isDone,
        isToday: this.$moment().isSame(this.task.dueDate, "day"),
        isDone: this.task.isDone,
      };
    },
    dateIcon() {
      let icon = [];
      switch (this.dueDateIcon) {
        case "notDone":
          icon = ["far", "square"];
          break;
        case "done":
          icon = ["far", "check-square"];
          break;
        case "clock":
          icon = ["far", "clock"];
          break;
        default:
          break;
      }
      return icon;
    },
  },
  methods: {
    async openTaskPreview() {
      this.$router.push(`/board/${this.boardId}/task/${this.task.id}`);
    },
    getTaskColor(taskLabelId) {
      let labels = this.currBoard.labels;
      let currLabel = labels.find((label) => label.id === taskLabelId);
      return currLabel.color;
    },
    openEditModal() {},
    async deleteTask() {
      try {
        const boardCopy = this.$clone(this.getBoard);
        var groups = boardCopy.groups;

        var currGroupIdx = groups.findIndex(
          (group) => group.id === this.group.id
        );

        var currTaskIdx = groups[currGroupIdx].tasks.findIndex(
          (task) => task.id === this.task.id
        );

        boardCopy.groups[currGroupIdx].tasks.splice(currTaskIdx, 1);
        await this.$store.dispatch({ type: "updateBoard", board: boardCopy });
      } catch (error) {
        console.log("task-preview cmp: error with delete task", error);
      }
    },
    async isDoneToggle() {
      console.log('***IsDoenToggle',this.task );
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
    onDateHover() {
      this.dueDateIcon = this.task.isDone ? "check-square" : "square";
    },
    isBoardMember(memberId) {
      try {
        return this.currBoard.members.some(
          (taskMember) => taskMember._id === memberId
        );
      } catch (error) {
        console.log("user is not exist in curr task", error);
      }
    },
    openPreviewModal() {
      this.$emit("task-modal-open", this.task);
    },
  },
  created() {
    console.log('***here***', this.task);
  },
};
</script>
