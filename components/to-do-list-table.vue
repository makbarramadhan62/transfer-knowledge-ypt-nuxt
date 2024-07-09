<template>
    <table class="table mt-3">
      <thead>
        <tr>
          <th scope="col">To Do</th>
          <th scope="col">Status</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(todo, index) in todos" :key="index">
          <td>{{ todo.text }}</td>
          <td>{{ todo.status }}</td>
          <td>
            <button @click="$emit('start-editing', index)" class="btn btn-warning">Edit</button>
            <button @click="$emit('remove-todo', index)" class="btn btn-danger ms-2">Remove</button>
          </td>
        </tr>
      </tbody>
    </table>
  </template>
  
  <script>
  export default {
    props: {
      todos: Array
    }
  };
  </script>
  
  <style scoped>
  @import '/assets/scss/style.scss';
  </style>
  