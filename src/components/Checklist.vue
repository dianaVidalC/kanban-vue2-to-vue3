<template>
    <div class="checklist">
        <ul>
            <li v-for="item in items" :key="item.id" :class="{ done: item.done }">
                <input type="checkbox" :checked="item.done" @change="handleToggle(item.id)" />
                <span>{{ item.text }}</span>
                <button class="btn btn-sm btn-outline-danger" @click="handleRemoveItem(item.id)">✕</button>
            </li>
        </ul>

        <form class="add-item-form" @submit.prevent="handleAddItem">
            <input v-model="newItemText" placeholder="Nueva subtarea..." />
            <button type="submit" class="btn btn-primary">+</button>
        </form>
    </div>
</template>

<script>
export default {
    name: 'Checklist',
    props: {
        items: {
            type: Array,
            required: true
        },
        cardId: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            newItemText: ''
        }
    },
    methods: {
        handleAddItem() {
            const text = this.newItemText.trim()
            if (!text) return
            this.$store.dispatch('addChecklistItem', { cardId: this.cardId, text })
            this.newItemText = ''
        },
        handleToggle(itemId) {
            this.$store.dispatch('toggleChecklistItem', { cardId: this.cardId, itemId })
        },
        handleRemoveItem(itemId) {
            this.$store.dispatch('removeChecklistItem', { cardId: this.cardId, itemId })
        }
    }
}
</script>

<style scoped>
.checklist ul {
    list-style: none;
    margin: 6px 0;
    padding: 0;
}

.checklist li {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.85rem;
    padding: 2px 0;
}

.checklist li span {
    width: 100%;
    text-align: left;
}

.checklist li.done span {
    text-decoration: line-through;
    color: #94a3b8;
    width: 100%;
}

.remove-item {
    margin-left: auto;
    border: none;
    background: transparent;
    color: #cbd5e1;
    cursor: pointer;
    font-size: 0.75rem;
}

.add-item-form {
    display: flex;
    gap: 4px;
}

.add-item-form input {
    flex: 1;
    font-size: 0.85rem;
    padding: 4px 6px;
    border-radius: 4px;
    border: 1px solid #cbd5e1;
}
</style>