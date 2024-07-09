<template>
    <div>
      <h1>To Do List</h1>
    </div>
    <div>
      <div class="d-flex justify-content-between align-items-center mt-3 px-4">
        <div>
          <button @click="setFilter('all')" class="btn btn-secondary me-2">All</button>
          <button @click="setFilter('Pending')" class="btn btn-secondary me-2">Pending</button>
          <button @click="setFilter('On Progress')" class="btn btn-secondary me-2">On Progress</button>
          <button @click="setFilter('Done')" class="btn btn-secondary">Done</button>
        </div>
        <div class="px-3">
          <button @click="showAddModal" class="btn btn-primary">Add Task</button>
        </div>
      </div>
      <TodoListTable :todos="filteredTodos" @start-editing="startEditing" @remove-todo="removeTodo" />
    
      <AddModal
        v-if="showAdd"
        :newTodo="newTodo"
        :newTodoStatus="newTodoStatus"
        @update:newTodo="newTodo = $event"
        @update:newTodoStatus="newTodoStatus = $event"
        @add-todo="addTodo"
        @cancel-add="cancelAdd"
      />
  
      <EditModal
        v-if="editingIndex !== null"
        :editingTodo="editingTodo"
        @update:editingTodo="editingTodo = $event"
        @save-edit="saveEdit"
        @cancel-edit="cancelEdit"
      />
    </div>
  </template>
  
  <script>
  import AddModal from '/components/addModal.vue';
  import EditModal from '/components/editModal.vue';
  import TodoListTable from '/components/to-do-list-table.vue';
  
  export default {
    components: {
      AddModal,
      EditModal,
      TodoListTable
    },
    data() {
      return {
        newTodo: '',
        newTodoStatus: '',
        todos: [],
        editingIndex: null,
        editingTodo: {
          text: '',
          status: ''
        },
        showAdd: false,
        filter: 'all'
      };
    },
    computed: {
      filteredTodos() {
        if (this.filter === 'all') {
          return this.todos;
        } else {
          return this.todos.filter(todo => todo.status === this.filter);
        }
      }
    },
    mounted() {
      const savedTodos = localStorage.getItem('todos');
      if (savedTodos) {
        this.todos = JSON.parse(savedTodos);
      }
    },
    methods: {
      showAddModal() {
        this.showAdd = true;
      },
      cancelAdd() {
        this.showAdd = false;
        this.newTodo = '';
        this.newTodoStatus = '';
      },
      addTodo() {
        if (this.newTodo.trim() !== '' && this.newTodoStatus !== '') {
          this.todos.push({ text: this.newTodo, status: this.newTodoStatus });
          this.newTodo = '';
          this.newTodoStatus = '';
          this.showAdd = false;
          this.saveTodos();
        }
      },
      removeTodo(index) {
        this.todos.splice(index, 1);
        this.saveTodos();
      },
      saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
      },
      startEditing(index) {
        this.editingIndex = index;
        this.editingTodo = { ...this.todos[index] };
      },
      saveEdit() {
        if (this.editingTodo.text.trim() !== '' && this.editingTodo.status !== '') {
          this.todos.splice(this.editingIndex, 1, this.editingTodo);
          this.editingIndex = null;
          this.editingTodo = { text: '', status: '' };
          this.saveTodos();
        }
      },
      cancelEdit() {
        this.editingIndex = null;
        this.editingTodo = { text: '', status: '' };
      },
      setFilter(filter) {
        this.filter = filter;
      }
    }
  };
  </script>
  
  <style scoped>
  @import '/assets/scss/style.scss';
  </style>
  