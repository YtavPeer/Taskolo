<template>
  <section class="activity">
    <ul class="clean-list activity-list flex column">
      <li v-for="activity in this.board.activities" :key="activity.id" class="flex">
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  props: {
    board: {
      type: Object,
    },
  },
  name: "activity-list",
  computed:{
    userImg(activity){
      return activity.byMember.imgUrl
    }
  }
};
</script>

<style>
</style>