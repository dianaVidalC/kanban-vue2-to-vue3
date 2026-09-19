<template>
  <div class="card">
    <div class="card-header">
      <EditableTitle :title="card.title" @title-change="handleTitleChange" />
      <button class="remove-btn" @click="handleRemove">✕</button>
    </div>
    <Checklist :items="card.checklist" :card-id="card.id" />
    <small class="created-at">{{ formatTimeAgo(card.createdAt) }}</small>
  </div>
</template>

<script>
import EditableTitle from "./EditableTitle.vue";
import Checklist from "./Checklist.vue";
import timeFormat from "../mixins/timeFormat";

export default {
  name: "Card",
  mixins: [timeFormat],
  components: { EditableTitle, Checklist },
  props: {
    card: {
      type: Object,
      required: true,
    },
    columnId: {
      type: String,
      required: true,
    },
  },

  methods: {
    handleRemove() {
      this.$store.dispatch("removeCard", {
        columnId: this.columnId,
        cardId: this.card.id,
      });
    },
    handleTitleChange(newTitle) {
      this.$store.dispatch("updateCardTitle", {
        cardId: this.card.id,
        title: newTitle,
      });
    },
  },
};
</script>

<style scoped>
.card {
  background: #fafbff;
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 10px;
  border: 1px solid #eef0f6;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background-color: transparent;
  gap: 8px;
}
.remove-btn {
  border: none;
  background: transparent;
  color: #cbd5e1;
  cursor: pointer;
  flex-shrink: 0;
  font-size: 0.9rem;
}
.remove-btn:hover {
  color: #ef4444;
}
.created-at {
  display: block;
  margin-top: 8px;
  color: #94a3b8;
  font-size: 0.72rem;
}
</style>
