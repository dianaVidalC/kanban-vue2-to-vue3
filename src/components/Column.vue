<template>
  <div class="column" :class="columnAccentClass">
    <h3>{{ column.title }}</h3>

    <draggable :list="cards" group="cards" @change="handleChange">
      <transition-group name="card-fade" tag="div" class="cards">
        <Card
          v-for="card in cards"
          :key="card.id"
          :card="card"
          :column-id="column.id"
        />
      </transition-group>
    </draggable>

    <form class="add-form" @submit.prevent="handleAdd">
      <input v-model="newCardTitle" placeholder="Nueva tarjeta..." />
      <button type="submit" class="btn btn-primary">+</button>
    </form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Card from "./Card.vue";
import draggable from "vuedraggable";

export default {
  name: "Column",
  components: { Card, draggable },
  props: {
    column: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      newCardTitle: "",
    };
  },
  computed: {
    ...mapGetters(["cardsByColumn"]),
    cards() {
      return this.cardsByColumn(this.column.id);
    },
    columnAccentClass() {
      const map = {
        "col-1": "accent-todo",
        "col-2": "accent-progress",
        "col-3": "accent-done",
      };
      return map[this.column.id] || "";
    },
  },
  methods: {
    handleAdd() {
      const title = this.newCardTitle.trim();
      if (!title) return;
      this.$store.dispatch("addCard", { columnId: this.column.id, title });
      this.newCardTitle = "";
    },
    handleChange(evt) {
      if (evt.added) {
        this.$store.dispatch("moveCard", {
          cardId: evt.added.element.id,
          toColumnId: this.column.id,
          toIndex: evt.added.newIndex,
        });
      } else if (evt.moved) {
        this.$store.dispatch("moveCard", {
          cardId: evt.moved.element.id,
          toColumnId: this.column.id,
          toIndex: evt.moved.newIndex,
        });
      }
    },
  },
};
</script>

<style scoped>
.column {
  background: white;
  border-radius: 14px;
  padding: 16px;
  width: 300px;
  flex-shrink: 0;
  box-shadow: 0 4px 16px rgba(30, 41, 59, 0.06);
  border-top: 4px solid #cbd5e1;
}
.column.accent-todo {
  border-top-color: #f59e0b;
}
.column.accent-progress {
  border-top-color: #4f46e5;
}
.column.accent-done {
  border-top-color: #16a34a;
}
.column h3 {
  margin: 4px 0 14px;
  color: #334155;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.cards {
  min-height: 8px;
}
.add-form {
  display: flex;
  gap: 6px;
  margin-top: 10px;
}
.add-form input {
  flex: 1;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  font-size: 0.9rem;
}
.add-form input:focus {
  outline: none;
  border-color: #4f46e5;
}
</style>

<style>
.card-fade-enter-active,
.card-fade-leave-active {
  transition: all 0.2s ease;
}
.card-fade-enter,
.card-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>