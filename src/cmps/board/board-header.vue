<template>
  <header v-if="this.currBoard" class="board-header flex align-center">
    <el-select v-model="chossenBoard" placeholder="Boards">
      <el-option
        v-for="board in getBoards"
        :key="board._id"
        :label="board.title"
        :value="board._id"
      >
      </el-option>
    </el-select>
    <div class="board-title">
      <h1 v-if="!isEdititle">
        {{ this.currBoard.title }}
      </h1>
    </div>

    <span class="seperate">|</span>
    <ul class="members-list flex clean-list align-center">
      <li
        v-for="member in this.currBoard.members"
        :key="member._id"
        class="flex align-center"
      >
        <img :src="member.imgUrl" alt="-" />
      </li>
      <button class="add-member-btn" @click="isMembersOpen = !isMembersOpen">
        Invite
      </button>
    </ul>

    <base-task-modal
      @close-modal="isMembersOpen = false"
      v-if="isMembersOpen"
      title="Invite to board"
    >
      <invite-members />
    </base-task-modal>

    <button class="show-menu-btn" @click="openMenu">
      <i class="el-icon-more"></i> Show Menu
    </button>

    <button  class="show-menu-btn-mobile" @click="openMenu">
      <i class="el-icon-more"></i> 
    </button>


  </header>
</template>

<script>
import members from "../task/task-option/task-details/members";
import baseTaskModal from "../base-task-modal";
import inviteMembers from "../invite-members";

export default {
  name: "board-header",
  props: {
  },
  data() {
    return {
      chossenBoard: "",
      isMembersOpen: false,
      isEdititle: false,
    };
  },
  computed: {
    getBoards() {
      return this.$store.getters.boards;
    },
    getUsers() {
      return this.$store.getters.users;
    },
    currBoard() {
      return this.$clone(this.$store.getters.currBoard);
    },
  },
  methods: {
    changeBoardTitle() {
      newBoard.title = this.currBoard.title;
      this.$store.dispatch({ type: "updateBoard", board: newBoard });
      this.isEdititle = false;
    },
    editTitle() {
      this.isEdititle = true;
      this.$nextTick(() => {
        this.$refs.title.select();
      });
    },

    openMenu() {
      this.$emit("open");
    },
  },
  components: {
    members,
    baseTaskModal,
    inviteMembers,
  },
};
</script>

<style>
</style>