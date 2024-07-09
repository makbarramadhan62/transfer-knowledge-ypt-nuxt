<template>
  <div class="modal fade show" style="display: block;" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit Task</h5>
          <button type="button" class="btn-close" @click="$emit('cancel-edit')"></button>
        </div>
        <div class="modal-body d-flex flex-column align-items-center">
          <input 
            :value="editingTodo.text" 
            @input="$emit('update:editingTodo', { ...editingTodo, text: $event.target.value })" 
            class="form-control mb-3" 
            placeholder="Edit task text" 
            style="width: 80%;" 
          />
          <select 
            :value="editingTodo.status" 
            @change="$emit('update:editingTodo', { ...editingTodo, status: $event.target.value })" 
            class="form-select mb-3" 
            style="width: 80%;" 
          >
            <option disabled value="">Status</option>
            <option value="Pending">Pending</option>
            <option value="On Progress">On Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
        <div class="modal-footer d-flex justify-content-center">
          <button type="button" class="btn btn-secondary" @click="$emit('cancel-edit')">Cancel</button>
          <button type="button" class="btn btn-success ms-2" @click="saveEdit">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    editingTodo: Object
  },
  methods: {
    saveEdit() {
      this.$emit('save-edit');
    }
  }
};
</script>

<style scoped>
@import '/assets/scss/style.scss';
</style>
