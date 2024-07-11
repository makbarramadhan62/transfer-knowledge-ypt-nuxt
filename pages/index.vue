<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

const tasks = ref<{ id: number; task: string; status: string }[]>([]);
const taskInput = ref('');
const taskStatus = ref('Pending');
const taskCounter = ref(1);
const selectedTab = ref('All');
const taskBeingEdited = ref<{ id: number; task: string; status: string } | null>(null);

onMounted(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks.value = JSON.parse(storedTasks);
        taskCounter.value = tasks.value.length > 0 ? tasks.value[tasks.value.length - 1].id + 1 : 1;
    }
});

const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks.value));
};

const createTask = () => {
    if (taskBeingEdited.value) {
        const index = tasks.value.findIndex(t => t.id === taskBeingEdited.value!.id);
        if (index !== -1) {
            tasks.value[index] = { ...taskBeingEdited.value, task: taskInput.value, status: taskStatus.value };
        }
        taskBeingEdited.value = null;
    } else {
        tasks.value.push({ id: taskCounter.value++, task: taskInput.value, status: taskStatus.value });
    }
    saveTasks();
    taskInput.value = '';
    taskStatus.value = 'Pending';
};

const removeTask = (id: number) => {
    tasks.value = tasks.value.filter(task => task.id !== id);
    saveTasks();
};

const editTask = (taskToEdit: { id: number; task: string; status: string }) => {
    taskBeingEdited.value = taskToEdit;
    taskInput.value = taskToEdit.task;
    taskStatus.value = taskToEdit.status;
};

const filterTasks = computed(() => {
    if (selectedTab.value === 'All') {
        return tasks.value;
    }
    return tasks.value.filter(t => t.status === selectedTab.value);
});
</script>

<template>
    <div class="container-fluid">
        <h1 class="text-center mb-4">To Do List</h1>
        <div class="d-grid gap-2 d-md-flex justify-content-md-end mb-4">
            <button type="button" class="btn btn-secondary text-white" data-bs-toggle="modal"
                data-bs-target="#taskModal">{{ taskBeingEdited ? 'Edit' : 'Add' }}</button>
        </div>

        <div class="modal fade" id="taskModal" tabindex="-1" aria-labelledby="taskModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="taskModalLabel">{{ taskBeingEdited ? 'Edit Task' : 'Add Task' }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="taskInput" class="form-label">Task</label>
                            <input type="text" class="form-control" id="taskInput" v-model="taskInput"
                                placeholder="Enter Task">
                        </div>
                        <div class="mb-3">
                            <label for="statusSelect" class="form-label">Status</label>
                            <select class="form-select" id="statusSelect" v-model="taskStatus">
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-warning" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" @click="createTask" data-bs-dismiss="modal">{{
                            taskBeingEdited ? 'Save changes' : 'Add Task' }}</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mb-3">
            <div class="col">
                <ul class="nav nav-pills justify-content-center">
                    <li class="nav-item">
                        <a class="nav-link" :class="{ active: selectedTab === 'All' }"
                            @click="selectedTab = 'All'">All</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" :class="{ active: selectedTab === 'Pending' }"
                            @click="selectedTab = 'Pending'">Pending</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" :class="{ active: selectedTab === 'In Progress' }"
                            @click="selectedTab = 'In Progress'">In Progress</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" :class="{ active: selectedTab === 'Done' }"
                            @click="selectedTab = 'Done'">Done</a>
                    </li>
                </ul>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <table class="table table-bordered table-striped">
                    <thead class="table-dark">
                        <tr>
                            <th scope="col">Task</th>
                            <th scope="col">Status</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="task in filterTasks" :key="task.id">
                            <td>{{ task.task }}</td>
                            <td>{{ task.status }}</td>
                            <td>
                                <button class="btn btn-warning text-white me-2" @click="editTask(task)"
                                    data-bs-toggle="modal" data-bs-target="#taskModal">Edit</button>
                                <button class="btn btn-danger" @click="removeTask(task.id)">Remove</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container-fluid {
    max-width: 800px;
    margin: auto;
    padding: 20px;
    background-color: #EEEDEB;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h1 {
    font-family: 'Arial', sans-serif;
    color: #2F3645;
}

.nav-pills .nav-link {
    cursor: pointer;
    background-color: #E6B9A6;
    color: #2F3645;
    margin: 0 5px;
}

.nav-pills .nav-link.active {
    background-color: #2F3645;
    color: #EEEDEB;
}

.table {
    background-color: #fff;
}

.table thead th {
    background-color: #2F3645;
    color: #EEEDEB;
}

.table td {
    vertical-align: middle;
}

.table-bordered {
    border: 1px solid #939185;
}

.table-striped tbody tr:nth-of-type(odd) {
    background-color: #EEEDEB;
}

.modal-content {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.modal-header {
    border-bottom: 1px solid #939185;
}

.modal-footer {
    border-top: 1px solid #939185;
}

.btn-warning {
    background-color: #E6B9A6;
    border: none;
}

.btn-primary {
    background-color: #2F3645;
    border: none;
}

.btn-danger {
    background-color: #939185;
    border: none;
}
</style>
