<template>
  <section class="members-modal">
    <el-input type="text" placeholder="Search members..." />
    <h3 class="member-title">board members</h3>
    <div
      v-for="member in members"
      :key="member._id"
      @click="addMember(member)"
      class="member-container flex align-center space-between"
    >
      <div class="member-data flex align-center">
        <img class="member" :src="member.imgUrl" alt="-" />
        <h3 class="member-fullname">{{ member.fullname }}</h3>
      </div>
      <a v-show="isAlreadyTaskMember(member._id)" href="#"
        ><i class="el-icon-check"></i>
      </a>
    </div>
  </section>
</template>

<script>
export default {
  name: "members",
  props: {
    members: {},
    taskMembers: {},
  },
  methods: {
    addMember(member) {
      this.$emit("add-member", member);
    },
    isAlreadyTaskMember(memberId) {
      let isInTask = false;
      if (this.taskMembers) {
        this.taskMembers.forEach((member) => {
          if (member._id === memberId) isInTask = true;
        });
      }
      return isInTask;
    },
  },
  computed: {},
};
</script>

<style>
</style>