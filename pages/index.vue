<template>
  <div class="container">
    <h1 class="my-4">To-Do List</h1>
    <div class="d-flex mb-4">
      <button class="btn btn-outline-primary me-2" @click="filterTasks('Pending')">Pending</button>
      <button class="btn btn-outline-primary me-2" @click="filterTasks('Done')">Done</button>
      <button class="btn btn-outline-primary me-2" @click="filterTasks('In Progress')">In Progress</button>
      <button class="btn btn-outline-primary me-2" @click="filterTasks('All')">All</button>
      <button class="btn btn-primary ms-auto" @click="openAddTaskModal">Add Task</button>
    </div>

    <table class="table text-center">
      <thead>
        <tr>
          <th style="width: 40%;">Task</th>
          <th style="width: 20%;">Status</th>
          <th style="width: 40%;">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="paginatedTasks.length === 0">
          <td colspan="3">Tidak ada Task</td>
        </tr>
        <tr v-for="(task, index) in paginatedTasks" :key="index">
          <td>{{ task.title }}</td>
          <td>{{ task.status }}</td>
          <td>
            <button class="btn btn-secondary m-2" @click="openEditTaskModal(index)">Edit</button>
            <button class="btn btn-danger" @click="removeTask(index)">Remove</button>
          </td>
        </tr>
      </tbody>
    </table>

    <nav>
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="goToPage(currentPage - 1)">Previous</a>
        </li>
        <li class="page-item" :class="{ active: currentPage === page }" v-for="page in pageCount" :key="page">
          <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === pageCount }">
          <a class="page-link" href="#" @click.prevent="goToPage(currentPage + 1)">Next</a>
        </li>
      </ul>
    </nav>

    <div v-if="isModalOpen">
      <div class="modal-backdrop"></div>
      <div class="modal d-block">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ isEditing ? 'Edit Task' : 'Add Task' }}</h5>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label for="task-title" class="form-label">Task</label>
                <input id="task-title" v-model="taskTitle" type="text" class="form-control" required />
                <span v-if="error" class="text-danger">{{ error }}</span>
              </div>
              <div class="mb-3">
                <label for="task-status" class="form-label">Status</label>
                <select id="task-status" v-model="taskStatus" class="form-select">
                  <option>Pending</option>
                  <option>Done</option>
                  <option>In Progress</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-primary me-2" @click="closeModal">Cancel</button>
              <button type="button" class="btn btn-primary" @click="isEditing ? editTask() : addTask()">
                {{ isEditing ? 'Save Changes' : 'Add Task' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const tasks = ref([
  { title: 'Transfer Knowledge', status: 'Pending' },
  { title: 'First Meet', status: 'Done' },
  { title: 'Implementasi UI', status: 'In Progress' },
]);

const taskTitle = ref('');
const taskStatus = ref('Pending');
const isModalOpen = ref(false);
const isEditing = ref(false);
const currentTaskIndex = ref(-1);
const currentFilter = ref('All');
const error = ref('');
const currentPage = ref(1);
const tasksPerPage = 5;

const filteredTasks = computed(() => {
  if (currentFilter.value === 'All') {
    return tasks.value;
  }
  return tasks.value.filter((task) => task.status === currentFilter.value);
});

const paginatedTasks = computed(() => {
  const start = (currentPage.value - 1) * tasksPerPage;
  const end = start + tasksPerPage;
  return filteredTasks.value.slice(start, end);
});

const pageCount = computed(() => {
  const count = Math.ceil(filteredTasks.value.length / tasksPerPage);
  return count > 0 ? count : 1; 
});

const openAddTaskModal = () => {
  taskTitle.value = '';
  taskStatus.value = 'Pending';
  isEditing.value = false;
  isModalOpen.value = true;
  error.value = '';
};

const openEditTaskModal = (index: number) => {
  const fullIndex = tasks.value.findIndex(task => task.title === paginatedTasks.value[index].title && task.status === paginatedTasks.value[index].status);
  currentTaskIndex.value = fullIndex;
  taskTitle.value = tasks.value[fullIndex].title;
  taskStatus.value = tasks.value[fullIndex].status;
  isEditing.value = true;
  isModalOpen.value = true;
  error.value = '';
};

const closeModal = () => {
  isModalOpen.value = false;
};

const validateTask = () => {
  if (!taskTitle.value.trim()) {
    error.value = 'Task wajib diisi.';
    return false;
  }
  return true;
};

const addTask = () => {
  if (!validateTask()) return;
  
  tasks.value.push({
    title: taskTitle.value,
    status: taskStatus.value,
  });
  closeModal();
};

const editTask = () => {
  if (!validateTask()) return;

  if (currentTaskIndex.value !== -1) {
    tasks.value[currentTaskIndex.value] = {
      title: taskTitle.value,
      status: taskStatus.value,
    };
  }
  closeModal();
};

const removeTask = (index: number) => {
  const fullIndex = tasks.value.findIndex(task => task.title === paginatedTasks.value[index].title && task.status === paginatedTasks.value[index].status);
  tasks.value.splice(fullIndex, 1);
};

const filterTasks = (status: string) => {
  currentFilter.value = status;
  currentPage.value = 1;
};

const goToPage = (page: number) => {
  if (page > 0 && page <= pageCount.value) {
    currentPage.value = page;
  }
};
</script>