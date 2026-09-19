import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    columns: [
      { id: "col-1", title: "Por hacer", cardIds: [] },
      { id: "col-2", title: "En progreso", cardIds: [] },
      { id: "col-3", title: "Hecho", cardIds: [] },
    ],
    cards: {},
  },
  mutations: {
    ADD_CARD(state, { columnId, card }) {
      Vue.set(state.cards, card.id, card);
      const column = state.columns.find((c) => c.id === columnId);
      column.cardIds.push(card.id);
    },
    REMOVE_CARD(state, { columnId, cardId }) {
      const column = state.columns.find((c) => c.id === columnId);
      column.cardIds = column.cardIds.filter((id) => id !== cardId);
      Vue.delete(state.cards, cardId);
    },
    UPDATE_CARD_TITLE(state, { cardId, title }) {
      state.cards[cardId].title = title;
    },
    MOVE_CARD(state, { cardId, toColumnId, toIndex }) {
      const toColumn = state.columns.find((c) => c.id === toColumnId);

      //Sacar la tarjeta de la columna donde esté ahora(sin importar cuál sea)
      state.columns.forEach((column) => {
        const idx = column.cardIds.indexOf(cardId);
        if (idx !== -1) {
          column.cardIds.splice(idx, 1);
        }
      });
      // Insertarla en la columna destino, en la posición indicada
      toColumn.cardIds.splice(toIndex, 0, cardId);
    },
    ADD_CHECKLIST_ITEM(state, { cardId, item }) {
      state.cards[cardId].checklist.push(item);
    },
    TOGGLE_CHECKLIST_ITEM(state, { cardId, itemId }) {
      const item = state.cards[cardId].checklist.find((i) => i.id === itemId);
      item.done = !item.done;
    },
    REMOVE_CHECKLIST_ITEM(state, { cardId, itemId }) {
      const card = state.cards[cardId];
      card.checklist = card.checklist.filter((i) => i.id !== itemId);
    },
  },
  actions: {
    addCard({ commit }, { columnId, title }) {
      commit("ADD_CARD", {
        columnId,
        card: {
          id: `card-${Date.now()}`,
          title,
          createdAt: Date.now(),
          checklist: [],
        },
      });
    },
    removeCard({ commit }, payload) {
      commit("REMOVE_CARD", payload);
    },
    updateCardTitle({ commit }, payload) {
      commit("UPDATE_CARD_TITLE", payload);
    },
    moveCard({ commit }, payload) {
      commit("MOVE_CARD", payload);
    },
    addChecklistItem({ commit }, { cardId, text }) {
      commit("ADD_CHECKLIST_ITEM", {
        cardId,
        item: { id: `item-${Date.now()}`, text, done: false },
      });
    },
    toggleChecklistItem({ commit }, payload) {
      commit("TOGGLE_CHECKLIST_ITEM", payload);
    },
    removeChecklistItem({ commit }, payload) {
      commit("REMOVE_CHECKLIST_ITEM", payload);
    },
  },
  getters: {
    cardsByColumn: (state) => (columnId) => {
      const column = state.columns.find((c) => c.id === columnId);
      return column.cardIds.map((id) => state.cards[id]);
    },
  },
});
