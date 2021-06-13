<template>
  <section class="side-menu-container flex column">
    <button @click="closeMenu" class="close-menu flex center">
      <img src="@/assets/task-icon/trello-icon-pack/close.svg" />
    </button>
    <h1 class="menu-title flex center">Menu</h1>

    <section class="side-menu-content flex column align-center">
      <ul class="clean-list">
        <li>
          <div class="side-menu-option" @click="changeOption('activity')">
            <img
              class="side-menu-list-icon"
              src="../../assets/task-icon/list.svg"
              alt=""
            />
            Activities
          </div>
        </li>

        <li>
          <label for="background-input">
            <div class="side-menu-option" @click="changeOption('background')">
              <div
                class="background-icon"
                :style="{ background: board.style }"
              ></div>
              Change Background
            </div>
          </label>
        </li>
        <li>
          <div class="side-menu-option" @click="moveToDashBoard">
            <img
              class="side-menu-list-icon"
              src="../../assets/task-icon/bar-chart.svg"
              alt=""
            />
            Dashboard
          </div>
          <div class="aboutThisBoard"></div>
        </li>
      </ul>

      <div v-if="isActivitiesShow" class="menu-activities">
        <activity-preview :activites="board.activities" />
      </div>

      <div v-if="isBackgroundShow" class="menu-activities">
        <change-background @setBackground="changeBackground" />
      </div>
    </section>
  </section>
</template>

<script>
import activityList from "./activity-list";
import activityPreview from "../task/activity-preview";
import ChangeBackground from "../board/change-background";

export default {
  props: {
    board: {
      type: Object,
    },
  },
  name: "side-menu",
  data() {
    return {
      isActivitiesShow: true,
      isBackgroundShow: false,
    };
  },
  methods: {
    closeMenu() {
      this.$emit("close");
    },
    changeBackground(background) {
      const newBoard = this.$clone(this.board);
      newBoard.style = background;
      this.$store.dispatch({ type: "updateBoard", board: newBoard });
    },
    moveToDashBoard() {
      this.$router.push(`/board/${this.board._id}/dashboard`);
    },
    changeOption(option) {
      if (option === "activity") {
        this.isActivitiesShow = true;
        this.isBackgroundShow = false;
      }
      if (option === "background") {
        this.isActivitiesShow = false;
        this.isBackgroundShow = true;
      }
    },
  },
  components: {
    activityList,
    activityPreview,
    ChangeBackground,
  },
};
</script>