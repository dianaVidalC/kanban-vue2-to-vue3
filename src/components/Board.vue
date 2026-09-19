<template>
  <div class="board">
    <Column
      v-for="column in columns"
      :key="column.id"
      :column="column"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Column from './Column.vue'

export default {
  name: 'Board',
  components: { Column },
  computed: {
    ...mapState(['columns'])
  }
}
</script>

<style scoped>
.board {
  display: flex;
  gap: 20px;
  padding: 8px 24px 40px;
  overflow-x: auto;
  align-items: flex-start;
  justify-content: center;
}
</style>