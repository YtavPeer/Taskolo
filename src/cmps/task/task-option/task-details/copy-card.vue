<template>
    <section class="copy-card flex column align-start">
        <h3 for="title">Title</h3>
        <textarea ref="title" name="title" v-model="title"></textarea>
        <h3 for="select">Copy to...</h3>
        <select-card-position
            :boards="boards"
            :currBoard="currBoard"
            :currGroup="currGroup"
            @task-position-changed="positionChanged"
        />
        <el-button type="success" @click="copyTask">Create card</el-button>
    </section>
</template>

<script>
import selectCardPosition from "../../../select-card-position.vue";

export default {
    props: {
        boards: {
            type: Array,
        },
        currBoard: {
            type: Object,
        },
        currGroup: {
            type: Object,
        },
        titleProp: {
            type: String,
        },
    },
    data() {
        return {
            title: JSON.parse(JSON.stringify(this.titleProp)),
            copyTo: {
                boardId: this.currBoard._id,
                groupId: this.currGroup.id,
                position: 1,
            },
        };
    },
    methods: {
        positionChanged(copyTo) {
            this.copyTo = copyTo;
            copyTo.title = this.title;
        },
        copyTask() {
            this.copyTo.title = this.title;
            this.$emit("move-task", {
                copyTo: this.copyTo,
                isCopy: true,
            });
        },
    },
    components: {
        selectCardPosition,
    },
    mounted() {
        this.$nextTick(() => {
            this.$refs.title.select();
        });
    },
};
</script>

<style>
</style>