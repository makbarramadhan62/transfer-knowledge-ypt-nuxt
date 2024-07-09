<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

const task = ref<{ id: number; task: string; status: string }[]>([]);
const newTask = ref('');
const newStatus = ref('Pending');
const taskID = ref(1);
const currentTab = ref('All');
const editingTask = ref<{ id: number; task: string; status: string } | null>(null);

onMounted(() => {
  const savedTask = localStorage.getItem('task');
  if (savedTask) {
    task.value = JSON.parse(savedTask);
    taskID.value = task.value.length > 0 ? task.value[task.value.length - 1].id + 1 : 1;
  }
});

const saveTask = () => {
  localStorage.setItem('task', JSON.stringify(task.value));
};

const addTask = () => {
  if (editingTask.value) {
    const index = task.value.findIndex(t => t.id === editingTask.value!.id);
    if (index !== -1) {
      task.value[index] = { ...editingTask.value, task: newTask.value, status: newStatus.value };
    }
    editingTask.value = null;
  } else {
    task.value.push({ id: taskID.value++, task: newTask.value, status: newStatus.value });
  }
  saveTask();
  newTask.value = '';
  newStatus.value = 'Pending';
};

const deleteTask = (id: number) => {
  task.value = task.value.filter(task => task.id !== id);
  saveTask();
};

const updateTask = (taskToEdit: { id: number; task: string; status: string }) => {
  editingTask.value = taskToEdit;
  newTask.value = taskToEdit.task;
  newStatus.value = taskToEdit.status;
};

const filteredTasks = computed(() => {
  if (currentTab.value === 'All') {
    return task.value;
  }
  return task.value.filter(t => t.status === currentTab.value);
});
</script>

<template>
  <div class="container-fluid">
    <h1>To Do List</h1>
    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
      <button type="button" class="btn btn-secondary text-white" data-bs-toggle="modal" data-bs-target="#taskModal">{{ editingTask ? 'Edit' : 'Add' }}</button>
    </div>

    <div class="modal fade" id="taskModal" tabindex="-1" aria-labelledby="taskModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="taskModalLabel">{{ editingTask ? 'Edit Task' : 'Add Task' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="taskInput" class="form-label">Task</label>
              <input type="text" class="form-control" id="taskInput" v-model="newTask" placeholder="Enter Task">
            </div>
            <div class="mb-3">
              <label for="statusSelect" class="form-label">Status</label>
              <select class="form-select" id="statusSelect" v-model="newStatus">
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-warning" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click="addTask" data-bs-dismiss="modal">{{ editingTask ? 'Save changes' : 'Add Task' }}</button>
          </div>
        </div>
      </div>
    </div>

    <div class="row mb-3">
      <div class="col">
        <ul class="nav nav-pills">
          <li class="nav-item">
            <a class="nav-link" :class="{ active: currentTab === 'All' }" @click="currentTab = 'All'">All</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" :class="{ active: currentTab === 'Pending' }" @click="currentTab = 'Pending'">Pending</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" :class="{ active: currentTab === 'In Progress' }" @click="currentTab = 'In Progress'">In Progress</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" :class="{ active: currentTab === 'Done' }" @click="currentTab = 'Done'">Done</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Task</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tasks in filteredTasks" :key="tasks.id">
              <td>{{ tasks.task }}</td>
              <td>{{ tasks.status }}</td>
              <td>
                <button class="btn btn-warning text-white me-2" @click="updateTask(tasks)" data-bs-toggle="modal" data-bs-target="#taskModal">Edit</button>
                <button class="btn btn-danger" @click="deleteTask(tasks.id)">Remove</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop.show {
  display: none;
}
</style>