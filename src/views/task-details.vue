<template>
  <section class="task-details flex justify-center">
    <div class="screen flex justify-center">
      <router-link
        class="close-screen"
        :to="`/board/${board._id}`"
      ></router-link>

      <section v-if="task" class="task-details-container">
        <div
          v-if="task.style.bgColor"
          class="cover"
          :style="{ backgroundColor: task.style.bgColor || '' }"
        >
          <a class="change-cover" href="#" @click="toggleSection('Cover')"
            >Cover</a
          >
        </div>

        <router-link
          class="close-modal-btn flex center"
          :to="`/board/${board._id}`"
          ><i class="el-icon-close"></i>
        </router-link>

        <div class="title flex align-start column">
          <h1 @click="openTitleInput" v-if="!isTitleOpen">
            {{ task.title }}
          </h1>
          <el-input
            v-if="isTitleOpen"
            ref="taskTitle"
            v-model="title"
            @keyup.enter="setTitle"
          />
          <h4>in list {{ group.title }}</h4>
          <button
            class="burger-menu flex center"
            @click="isOptionMenuOpen = !isOptionMenuOpen"
          >
            <img src="@/assets/task-icon/menu.svg" alt="" />
          </button>
        </div>

        <div class="task-details-grid">
          <section class="left-column">
            <div class="task-details-top flex">
              <members-preview
                v-if="task.members && task.members"
                :members="task.members"
                @addMember="isMembersOpen = true"
              />
              <labels-preview
                :labels="labelsPreview"
                v-if="labelsPreview"
                @label-clicked="isLabelsOpen = true"
              />

              <due-date-preview
                v-if="task.dueDate"
                :date="task.dueDate"
                @setDate="toggleSection('DueDate')"
              />
            </div>

            <description-preview
              @updateDesc="updateDescription"
              :task="this.task"
            />

            <attachment-preview
              :imgUrl="task.attachment"
              v-if="task.attachment"
            ></attachment-preview>

            <checklist-preview
              v-for="checklist in task.checklists"
              :key="checklist.id"
              @update-checklist="updateChecklist"
              @delete-checklist="deleteChecklist"
              :checklistProp="checklist"
            />

            <activity-preview
              :activites="taskActivites"
              @add-comment="addComment"
            />
          </section>
          <section
            class="right-column"
            :class="{ 'option-menu': isOptionMenuOpen }"
          >
            <div class="menu-column">
              <h3>Add to card</h3>

              <div class="menu-row">
                <a
                  :class="{ 'option-menu': isOptionMenuOpen }"
                  class="link-button"
                  href="#"
                  title="Members"
                  @click="toggleSection('Members')"
                >
                  <font-awesome-icon class="icon" :icon="['far', 'user']" />

                  <span>Members</span>
                </a>

                <base-task-modal
                  v-if="isMembersOpen"
                  title="Members"
                  @close-modal="isMembersOpen = false"
                >
                  <members
                    :members="board.members"
                    :taskMembers="task.members"
                    @add-member="addMember"
                  />
                </base-task-modal>

                <a
                  class="link-button"
                  href="#"
                  title="Labels"
                  @click="toggleSection('Labels')"
                >
                  <font-awesome-icon class="icon" :icon="['fas', 'tag']" />

                  <span>Labels</span>
                </a>

                <base-task-modal
                  v-if="isLabelsOpen"
                  title="Labels"
                  @close-modal="isLabelsOpen = false"
                >
                  <labels
                    :labels="board.labels"
                    :editedLabel="editedLabel"
                    :taskLabelIds="task.labelIds"
                    @open-label-edit="openLabelEdit"
                    @add-label="addLabel"
                  />
                </base-task-modal>

                <base-task-modal
                  v-if="isLabelsEditOpen"
                  title="Change label"
                  @close-modal="isLabelsEditOpen = false"
                >
                  <label-edit
                    :labels="board.labels"
                    :labelToEdit="labelToEdit"
                    @save-label="saveLabel"
                  />
                </base-task-modal>

                <a
                  class="link-button"
                  href="#"
                  title="Checklist"
                  @click="toggleSection('Checklist')"
                >
                  <img
                    class="task-prev-icon"
                    src="../assets/task-icon/check-box-new.svg"
                    alt=""
                  />

                  <span>Checklist</span>
                </a>

                <base-task-modal
                  v-if="isChecklistOpen"
                  title="Checklist"
                  @close-modal="isChecklistOpen = false"
                >
                  <checklist @add-checklist-title="addToChecklist" />
                </base-task-modal>
                <a
                  class="link-button"
                  href="#"
                  title="Due Date"
                  @click="toggleSection('DueDate')"
                >
                  <img
                    class="task-prev-icon clock-icon-watch"
                    src="../assets/task-icon/clock.svg"
                    alt=""
                  />

                  <span>Due Date</span>
                </a>
                <base-task-modal
                  v-if="isDueDateOpen"
                  title="Change due date"
                  @close-modal="isDueDateOpen = false"
                >
                  <due-date @setDate="setDate" />
                </base-task-modal>

                <a
                  class="link-button"
                  href="#"
                  title="Attachment"
                  @click="toggleSection('Attachment')"
                >
                  <font-awesome-icon
                    class="icon"
                    :icon="['fas', 'paperclip']"
                  />
                  <span>Attachment</span>
                </a>
                <base-task-modal
                  title="Attach from..."
                  v-if="isAttachmentOpen"
                  @close-modal="isAttachmentOpen = false"
                >
                  <attachment @add-url="addUrl" />
                </base-task-modal>

                <!-- COVER -->
                <a
                  class="link-button"
                  href="#"
                  title="Cover"
                  @click="toggleSection('Cover')"
                >
                  <img
                    class="task-prev-icon"
                    src="../assets/task-icon/header.svg"
                    alt=""
                  />
                  <span>Cover</span>
                </a>
                <base-task-modal
                  title="Cover"
                  v-if="isCoverOpen"
                  @close-modal="isCoverOpen = false"
                >
                  <cover :colors="coverColors" @update-cover="updateCover" />
                </base-task-modal>
              </div>

              <h3 class="actions-title">Actions</h3>
              <div class="menu-row">
                <a
                  class="link-button"
                  href="#"
                  title="Move card"
                  @click="toggleSection('Move')"
                >
                  <font-awesome-icon
                    class="icon"
                    :icon="['fas', 'arrow-right']"
                  />

                  <span>Move</span>
                </a>
                <base-task-modal
                  title="Move card"
                  v-if="isMoveCardOpen"
                  @close-modal="isMoveCardOpen = false"
                >
                  <move-card
                    :boards="boards"
                    :currBoard="board"
                    :currGroup="group"
                    @move-task="copyTask"
                  />
                </base-task-modal>
                <a
                  class="link-button"
                  href="#"
                  title="Copy card"
                  @click="toggleSection('Copy')"
                >
                  <img
                    class="task-prev-icon"
                    src="../assets/task-icon/copy.svg"
                    alt=""
                  />
                  <span>Copy</span>
                </a>
                <base-task-modal
                  title="Copy card"
                  v-if="isCopyCardOpen"
                  @close-modal="isCopyCardOpen = false"
                >
                  <copy-card
                    :boards="boards"
                    :currBoard="board"
                    :currGroup="group"
                    :titleProp="task.title"
                    @move-task="copyTask"
                  />
                </base-task-modal>
                <a
                  class="link-button"
                  href="#"
                  title="Delete card"
                  @click="toggleSection('Delete')"
                >
                  <font-awesome-icon class="icon" :icon="['fas', 'minus']" />

                  <span>Delete</span>
                </a>
                <base-task-modal
                  title="Delete card?"
                  v-if="isDeleteCardOpen"
                  @close-modal="isDeleteCardOpen = false"
                >
                  <delete-card @delete-card="deleteCard" />
                </base-task-modal>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  </section>
</template>

<script>
import membersPreview from "../cmps/task/task-option/task-details-previews/members-preview";
import labelsPreview from "../cmps/task/task-option/task-details-previews/labels-preview";
import descriptionPreview from "../cmps/task/task-option/task-details-previews/description-preview";
import checklistPreview from "../cmps/task/task-option/task-details-previews/checklist-preview";
import baseTaskModal from "../cmps/base-task-modal";
import activityPreview from "../cmps/task/activity-preview";
import dueDatePreview from "../cmps/task/task-option/task-details-previews/due-date-preview";
import attachmentPreview from "../cmps/task/task-option/task-details-previews/attachment-preview";

import members from "../cmps/task/task-option/task-details/members";
import dueDate from "../cmps/task/task-option/task-details/due-date";
import checklist from "../cmps/task/task-option/task-details/checklist";
import labels from "../cmps/task/task-option/task-details/labels.vue";
import labelEdit from "../cmps/task/task-option/task-details/labels_edit";
import attachment from "../cmps/task/task-option/task-details/task-attachment";
import cover from "../cmps/task/task-option/task-details/cover-color";
import copyCard from "../cmps/task/task-option/task-details/copy-card";
import moveCard from "../cmps/task/task-option/task-details/move-card";
import deleteCard from "../cmps/task/task-option/task-details/delete-card";

import { utilService } from "../services/util.service.js";
import { boardService } from "../services/board.service.js";
import BaseTaskModal from "../cmps/base-task-modal.vue";

export default {
  name: "task-details",
  data() {
    return {
      isMembersOpen: false,
      isLabelsOpen: false,
      isLabelsEditOpen: false,
      isChecklistOpen: false,
      isDueDateOpen: false,
      isAttachmentOpen: false,
      isDescriptionEdit: false,
      isCoverOpen: false,
      isCopyCardOpen: false,
      isDeleteCardOpen: false,
      isMoveCardOpen: false,
      isTitleOpen: false,
      labelToEdit: null,
      editedLabel: null,
      title: "",
      isOptionMenuOpen: false,
    };
  },
  methods: {
    toggleSection(sectionName) {
      switch (sectionName) {
        case "Members":
          this.isMembersOpen = !this.isMembersOpen;
          break;
        case "Labels":
          this.isLabelsOpen = !this.isLabelsOpen;
          break;
        case "Checklist":
          this.isChecklistOpen = !this.isChecklistOpen;
          break;
        case "DueDate":
          this.isDueDateOpen = !this.isDueDateOpen;
          break;
        case "Attachment":
          this.isAttachmentOpen = !this.isAttachmentOpen;
          break;
        case "Cover":
          this.isCoverOpen = !this.isCoverOpen;
          break;
        case "Copy":
          this.isCopyCardOpen = !this.isCopyCardOpen;
          break;
        case "Move":
          this.isMoveCardOpen = !this.isMoveCardOpen;
          break;
        case "Delete":
          this.isDeleteCardOpen = !this.isDeleteCardOpen;
          break;
        case "Title":
          this.isTitleOpen = !this.isTitleOpen;
          break;
        default:
          break;
      }
    },
    openTitleInput() {
      this.isTitleOpen = true;
      this.title = this.task.title;
      this.$nextTick(() => {
        this.$refs.taskTitle.select();
      });
    },
    setDate(date) {
      try {
        const taskCopy = this.$clone(Object.create(this.task));

        taskCopy.dueDate = date;
        this.toggleSection("DueDate");
        this.$store.dispatch({
          type: "updateTask",
          task: taskCopy,
          activityTxt: `added date`,
        });
      } catch (error) {
        console.log(err);
      }
    },
    setTitle() {
      if (!this.title) return;
      this.isTitleOpen = false;
      const taskCopy = this.$clone(Object.create(this.task));
      taskCopy.title = this.title;
      this.$store.dispatch({
        type: "updateTask",
        task: taskCopy,
        activityTxt: `changed title`,
      });
    },
    addMember(member) {
      try {
        const taskCopy = this.$clone(this.task);
        let taskMembers = taskCopy.members;
        if (!taskMembers) taskMembers = [];
        const isTaskMember = taskMembers.some(
          (taskMember) => taskMember._id === member._id
        );

        if (!isTaskMember) {
          taskMembers.push(member);
        } else {
          const memberIdx = taskMembers.findIndex((m) => m._id === member._id);
          taskMembers.splice(memberIdx, 1);
        }

        taskCopy.members = taskMembers;

        this.$store.dispatch({
          type: "updateTask",
          task: taskCopy,
          activityTxt: `added member`,
        });
      } catch (err) {
        console.log(err);
      }
    },
    updateChecklist(checklist) {
      const taskCopy = this.$clone(this.task);
      checklist = this.$clone(checklist);
      const isChecklistExist = taskCopy.checklists.some(
        (cl) => cl.id === checklist.id
      );
      if (!isChecklistExist) taskCopy.checklists.push(checklist);
      else {
        const checklistIdx = taskCopy.checklists.findIndex((cl) => {
          return cl.id === checklist.id;
        });

        taskCopy.checklists.splice(checklistIdx, 1, checklist);
      }
      this.$store.dispatch({
        type: "updateTask",
        task: taskCopy,
        activityTxt: `updated checklist`,
      });
    },
    addToChecklist(title) {
      const taskCopy = this.$clone(this.task);
      if (!taskCopy.checklists) {
        taskCopy.checklists = [];
      }
      const checklist = boardService.getEmptyCheckList();
      checklist.title = title;
      taskCopy.checklists.push(checklist);
      this.isChecklistOpen = false;
      this.$store.dispatch({
        type: "updateTask",
        task: taskCopy,
        activityTxt: `added item to checklist`,
      });
    },
    deleteChecklist(checklistId) {
      const taskCopy = this.$clone(this.task);
      const checklistIdx = taskCopy.checklists.findIndex(
        (checklist) => checklist.id === checklistId
      );
      taskCopy.checklists.splice(checklistIdx, 1);
      this.$store.dispatch({
        type: "updateTask",
        task: taskCopy,
        activityTxt: `checklist deleted`,
      });
    },
    openLabelEdit(label) {
      this.isLabelsOpen = false;
      this.isLabelsEditOpen = true;
      this.labelToEdit = label;
    },
    async saveLabel(label) {
      this.isLabelsOpen = true;
      this.isLabelsEditOpen = false;
      this.labelToEdit = null;
      this.editedLabel = label;
      const boardCopy = this.$clone(this.board);
      const labelIdx = boardCopy.labels.findIndex((l) => l.id === label.id);
      boardCopy.labels.splice(labelIdx, 1, label);
      try {
        await this.$store.dispatch({
          type: "updateBoard",
          board: boardCopy,
        });
      } catch (error) {}
    },
    addLabel(label) {
      const taskCopy = this.$clone(this.task);
      let taskLabelIds = taskCopy.labelIds;
      if (!taskLabelIds) taskLabelIds = [];
      const isTaskLabel = taskLabelIds.some(
        (taskLabelId) => taskLabelId === label.id
      );

      if (!isTaskLabel) {
        taskLabelIds.push(label.id);
      } else {
        const labelIdx = taskLabelIds.findIndex((tlId) => tlId === label.id);

        taskLabelIds.splice(labelIdx, 1);
      }

      taskCopy.labelIds = taskLabelIds;

      this.$store.dispatch({
        type: "updateTask",
        task: taskCopy,
        activityTxt: `added label`,
      });
    },
    labelsIdsToLabels() {
      if (!this.task.labelIds) return;
      //TODO: Find better way?
      const labels = [];
      this.board.labels.forEach((label) => {
        this.task.labelIds.forEach((labelId) => {
          if (label.id === labelId) labels.push(label);
        });
      });
      return labels;
    },
    addUrl(url) {
      const taskCopy = this.$clone(this.task);
      taskCopy.attachment = url;
      this.$store.dispatch({
        type: "updateTask",
        task: taskCopy,
        activityTxt: `added image`,
      });
    },
    async updateDescription(updateDescription) {
      const taskCopy = this.$clone(this.task);
      taskCopy.description = updateDescription;
      this.$store.dispatch({
        type: "updateTask",
        task: taskCopy,
        activityTxt: `updated description`,
      });
    },

    updateCover(cover) {
      const taskCopy = this.$clone(this.task);
      taskCopy.style = cover;
      this.$store.dispatch({
        type: "updateTask",
        task: taskCopy,
        activityTxt: `updated cover`,
      });
    },

    async copyTask(newCardPos) {
      const taskCopy = this.$clone(this.task);
      let groupIdx;
      let groupToCopy = this.board.groups.find((group, idx) => {
        groupIdx = idx;
        return group.id === newCardPos.copyTo.groupId;
      });

      groupToCopy = this.$clone(groupToCopy);

      if (newCardPos.isCopy) {
        taskCopy.id = utilService.makeId();
        taskCopy.title = newCardPos.copyTo.title;
      } else if (groupToCopy.id === this.group.id) return;

      groupToCopy.tasks.splice(newCardPos.copyTo.position, 0, taskCopy);

      if (!newCardPos.isCopy) this.deleteCard();
      const boardCopy = this.$clone(this.board);
      boardCopy.groups.splice(groupIdx, 1, groupToCopy);
      await this.$store.dispatch({
        type: "updateBoard",
        board: boardCopy,
        activityTxt: `copied task`,
      });
      newCardPos.isCopy
        ? (this.isCopyCardOpen = false)
        : (this.isMoveCardOpen = false);
    },

    async deleteCard() {
      const boardCopy = this.$clone(this.board);
      const groups = boardCopy.groups;

      const currGroupIdx = groups.findIndex(
        (group) => group.id === this.group.id
      );

      var currTaskIdx = groups[currGroupIdx].tasks.findIndex(
        (task) => task.id === this.task.id
      );

      boardCopy.groups[currGroupIdx].tasks.splice(currTaskIdx, 1);

      await this.$store.dispatch({
        type: "updateBoard",
        board: boardCopy,
        activityTxt: `deleted task`,
      });
      this.isDeleteCardOpen = false;
    },
    addComment(comment) {
      this.$store.dispatch({
        type: "addActivityData",
        activityTxt: comment,
      });
    },
  },
  computed: {
    task() {
      return this.$store.getters.currTask;
    },
    group() {
      return this.$store.getters.currGroup;
    },
    board() {
      return this.$store.getters.currBoard;
    },
    boards() {
      return this.$store.getters.boards;
    },
    groupName() {
      return this.$store.getters.groupName;
    },
    taskId() {
      return this.$route.params.taskId;
    },

    labelsPreview() {
      return this.labelsIdsToLabels();
    },

    coverColors() {
      const coverColors = this.board.labels.map((label) => {
        return label.color;
      });
      return coverColors;
    },
    taskActivites() {
      return this.board.activities.filter(
        (activity) => activity.task.id === this.task.id
      );
    },
  },
  components: {
    membersPreview,
    labelsPreview,
    activityPreview,
    descriptionPreview,
    checklistPreview,
    baseTaskModal,
    members,
    dueDate,
    dueDatePreview,
    checklist,
    labels,
    labelEdit,
    attachment,
    BaseTaskModal,
    cover,
    copyCard,
    deleteCard,
    moveCard,
    attachmentPreview,
  },

  watch: {
    taskId: {
      handler() {
        this.$store.commit({
          type: "setTaskById",
          taskId: this.taskId,
        });
      },
      immediate: true,
    },
  },
};
</script>

<style>
</style>