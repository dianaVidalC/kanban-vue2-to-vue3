<template>
  <div id="app">
    <header class="app-header">
      <h1>📋 Kanban</h1>
    </header>
    <Board />
  </div>
</template>

<script>
import Board from './components/Board.vue'

export default {
  name: 'App',
  components: { Board }
}
</script>

<style>
* {
  box-sizing: border-box;
}
:root {
  --bs-primary: #4f46e5;
  --bs-primary-rgb: 79, 70, 229;
}
body {
  margin: 0;
  background: linear-gradient(135deg, #f0f4ff 0%, #f8fafc 100%);
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}
.app-header {
  padding: 32px 24px 8px;
  text-align: center;
}
.app-header h1 {
  margin: 10px 0 40px 0;
  font-size: 1.8rem;
  color: #312e81;
}
</style>