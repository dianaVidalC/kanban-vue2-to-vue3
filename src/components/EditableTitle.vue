<template>
    <div class="editable-title">
        <span v-if="!editing" @click="startEdit">{{ title }}</span>
        <input v-else ref="input" v-bind="$attrs" v-on="$listeners" :value="localValue"
            @input="localValue = $event.target.value" @blur="commitEdit" @keyup.enter="commitEdit" />
    </div>
</template>

<script>

export default {
    name: "EditableTitle",
    inheritAttrs: false,
    props: {
        title: {
            type: String,
            required: true,
        }
    },
    data() {
        return {
            editing: false,
            localValue: this.title
        }
    },
    methods: {
        startEdit() {
            this.localValue = this.title
            this.editing = true
            this.$nextTick(() => this.$refs.input.focus())
        },
        commitEdit() {
            this.editing = false
            const trimmed = this.localValue.trim()
            if (trimmed && trimmed !== this.title) {
                this.$emit('title-change', trimmed)
            }
        }
    }
}
</script>

<style scoped>
.editable-title span {
    cursor: text;
}

.editable-title input {
    width: 100%;
    border: 1px solid #4f46e5;
    border-radius: 4px;
    padding: 2px 4px;
    font: inherit;
}
</style>