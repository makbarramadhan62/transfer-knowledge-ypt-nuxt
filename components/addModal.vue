<template>
  <div class="modal fade show" style="display: block;" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add New Task</h5>
          <button type="button" class="btn-close" @click="$emit('cancel-add')"></button>
        </div>
        <div class="modal-body d-flex flex-column align-items-center">
          <input 
            :value="newTodo" 
            @input="$emit('update:newTodo', $event.target.value)" 
            class="form-control mb-3" 
            placeholder="Task Title" 
            style="width: 80%;" 
          />
          <select 
            :value="newTodoStatus" 
            @change="$emit('update:newTodoStatus', $event.target.value)" 
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
          <button type="button" class="btn btn-secondary" @click="$emit('cancel-add')">Cancel</button>
          <button type="button" class="btn btn-success ms-2" @click="addTodo">Add</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    newTodo: String,
    newTodoStatus: String
  },
  methods: {
    addTodo() {
      this.$emit('add-todo');
    }
  }
};
</script>

<style scoped>
@import '/assets/scss/style.scss';
</style>
