<template>
  <section class="attachmnet-preview flex column">
    <img src="@/assets/task-icon/attachment.svg" alt="" />
    <div class="title-container flex align-center">
      <h3>Attachment</h3>
    </div>
    <img class="attach-img" :src="imgUrl" alt="" />
  </section>
</template>

<script>
export default {
  props: { imgUrl: {} },
};
</script>

<style>
</style>