<template>
  <section class="members-modal" v-if="currBoard">
    <input type="text" placeholder="Search user..." />
    <section class="member-invite-container">
      <div
        v-for="user in users"
        :key="user._id"
        @click="addUser(user)"
        class="member-container flex align-center space-between"
      >
        <div class="user-data flex align-center space-between">
          <img class="member" :src="user.imgUrl" alt="-" />
          <h3>{{ user.fullname }}</h3>
        </div>
        <a v-if="isAlreadyTaskUser(user)" href="#"
          ><i class="el-icon-check"></i>
        </a>
      </div>
    </section>
  </section>
</template>

<script>
export default {
  name: "users",
  computed: {
    currBoard() {
      return this.$clone(this.$store.getters.currBoard);
    },
    users() {
      return this.$store.getters.users;
    },
  },
  methods: {
    addUser(user) {
      try {
        let members = this.currBoard.members;
        const isBoardUser = members.some((member) => member._id === user._id);

        if (!isBoardUser) {
          members.push(user);
        } else {
          const userIdx = members.findIndex((m) => {
            return m._id === user._id;
          });
          members.splice(userIdx, 1);
        }

        // // change values
        this.$store.dispatch({ type: "updateBoard", board: this.currBoard });
      } catch (err) {
        console.log(err);
      }
    },
    isAlreadyTaskUser(user) {
      return this.currBoard.members.some((member) => member._id === user._id);
    },
  },
  created() {
    this.$store.dispatch({ type: "loadUsers" });
  },
};
</script>

<style>
</style>