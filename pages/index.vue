<template>
    <h1 class="text-center m-5">To Do List</h1>
    <div class="container">
      <div class="d-flex align-content-center">
        <form class="d-flex" @submit.prevent="addTask">
          <div class="mb-4 mx-5">
            <label class="form-label">New Task</label>
            <input v-model="newTask.task" type="text" class="d-flex rounded-2 shadow border border-2 p-2" placeholder="Add New Task">
          </div>
          <div class="mb-4">
            <label class="form-label">Status</label>
            <select v-model="newTask.status" name="status" id="status" class="form-select form-select-sm shadow border-2 p-2">
              <option value="pending">Pending</option>
              <option value="onProgress">On Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div class="align-content-center mt-1 mx-3">
            <ButtonAdd/>
          </div>
        </form>
      </div>
      
      <div class="d-flex justify-content-start my-3">
        <button class="btn btn-secondary mx-1" @click="filterTasks('all')">All</button>
        <button class="btn btn-secondary mx-1" @click="filterTasks('pending')">Pending</button>
        <button class="btn btn-secondary mx-1" @click="filterTasks('onProgress')">On Progress</button>
        <button class="btn btn-secondary mx-1" @click="filterTasks('done')">Done</button>
      </div>
  
      <table class="table">
        <thead class="text-start">
          <tr>
            <th scope="col">Task</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody class="text-start">
          <tr v-for="(task, index) in filteredTasks" :key="index">
            <td>{{ task.task }}</td>
            <td>{{ task.status }}</td>
            <td>
              <ButtonEdit @click="editTask(index)" class="me-2"/>
              <ButtonRemove @click="removeTask(index)"/>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Edit Modal -->
      <div v-if="isEditing" class="modal fade show d-block" tabindex="-1" role="dialog" aria-labelledby="editModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="editModalLabel">Edit Task</h5>
            </div>
            <div class="modal-body">
              <div class="mb-4">
                <label class="form-label">Task</label>
                <input v-model="editTaskData.task" type="text" class="form-control" placeholder="Edit Task">
              </div>
              <div class="mb-4">
                <label class="form-label">Status</label>
                <select v-model="editTaskData.status" class="form-select">
                  <option value="pending">Pending</option>
                  <option value="onProgress">On Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <ButtonClose @click="closeModal"/>
              <ButtonEditModal @click="saveTask"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  

  <script setup>
  import { ref, onMounted, watch } from 'vue'
  
  const tasks = ref([])
  const newTask = ref({ task: '', status: 'pending' })
  const filteredTasks = ref([])
  const currentFilter = ref('all')
  const isEditing = ref(false)
  const editTaskData = ref({ task: '', status: 'pending' })
  const editTaskIndex = ref(null)
  
  onMounted(() => {
    const storedTasks = localStorage.getItem('tasks')
    if (storedTasks) {
      tasks.value = JSON.parse(storedTasks)
      filterTasks(currentFilter.value)
    }
  })
  
  watch(tasks, (newTasks) => {
    localStorage.setItem('tasks', JSON.stringify(newTasks))
    filterTasks(currentFilter.value)
  }, { deep: true })
  
  const addTask = () => {
    if (newTask.value.task.trim() !== '') {
      tasks.value.push({ ...newTask.value })
      newTask.value.task = ''
      newTask.value.status = 'pending'
    }
  }
  
  const removeTask = (index) => {
    tasks.value.splice(index, 1)
  }
  
  const editTask = (index) => {
    editTaskIndex.value = index
    editTaskData.value = { ...tasks.value[index] }
    isEditing.value = true
  }
  
  const closeModal = () => {
    isEditing.value = false
  }
  
  const saveTask = () => {
    if (editTaskIndex.value !== null) {
      tasks.value[editTaskIndex.value] = { ...editTaskData.value }
      closeModal()
    }
  }
  
  const filterTasks = (status) => {
    currentFilter.value = status
    if (status === 'all') {
      filteredTasks.value = tasks.value
    } else {
      filteredTasks.value = tasks.value.filter(task => task.status === status)
    }
  }
  </script>
  
<style scoped>
@import '/assets/css/styles.scss';
</style>