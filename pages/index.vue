<script setup lang="ts">
import { computed, ref } from 'vue';

const tasks = ref<{ id: number, name: string, status: string }[]>([
    { id: 1, name: 'Task 1', status: 'Pending' },
    { id: 2, name: 'Task 2', status: 'Done' }
]);

const newTaskName = ref('');
const newTaskStatus = ref('Pending');

const addTask = () => {
    if (newTaskName.value.trim()) {
        tasks.value.push({
            id: tasks.value.length + 1,
            name: newTaskName.value,
            status: newTaskStatus.value
        });

        newTaskName.value = '';
        newTaskStatus.value = 'Pending';
    }
};

const editingTask = ref<{ id: number, name: string, status: string } | null>(null);

const startEditTask = (task: { id: number, name: string, status: string }) => {
    editingTask.value = { ...task };
};

const saveTaskChanges = () => {
    if (editingTask.value) {
        const index = tasks.value.findIndex(task => task.id === editingTask.value!.id);
        if (index !== -1) {
            tasks.value[index] = { ...editingTask.value };
        }
        editingTask.value = null;
    }
};

const deleteTask = (id: number) => {
    tasks.value = tasks.value.filter(task => task.id !== id);
};

const filterStatus = ref('All');

const editingTaskName = computed({
    get: () => editingTask.value?.name ?? '',
    set: (name: string) => { if (editingTask.value) editingTask.value.name = name; }
});

const editingTaskStatus = computed({
    get: () => editingTask.value?.status ?? 'Pending',
    set: (status: string) => { if (editingTask.value) editingTask.value.status = status; }
});

const filteredTasks = computed(() => {
    if (filterStatus.value === 'All') {
        return tasks.value;
    }
    return tasks.value.filter(task => task.status === filterStatus.value);
});

const currentPage = ref(1);
const pageSize = ref(5);

const paginatedTasks = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return filteredTasks.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(filteredTasks.value.length / pageSize.value));

const goToPage = (page: number) => {
    if (page > 0 && page <= totalPages.value) {
        currentPage.value = page;
    }
};

const setFilterStatus = (status: string) => {
    filterStatus.value = status;
    currentPage.value = 1;
};
</script>

<template>
    <div class="container mt-5">
        <h1>To-Do List</h1>
        <ul class="nav nav-pills mb-3">
            <li class="nav-item me-2">
                <a class="nav-link" :class="{ active: filterStatus === 'Pending' }" @click="setFilterStatus('Pending')"
                    href="#">
                    Pending
                </a>
            </li>
            <li class="nav-item me-2">
                <a class="nav-link" :class="{ active: filterStatus === 'Done' }" @click="setFilterStatus('Done')"
                    href="#">
                    Done
                </a>
            </li>
            <li class="nav-item me-2">
                <a class="nav-link" :class="{ active: filterStatus === 'In Progress' }"
                    @click="setFilterStatus('In Progress')" href="#">
                    In Progress
                </a>
            </li>
            <li class="nav-item me-2">
                <a class="nav-link" :class="{ active: filterStatus === 'All' }" @click="setFilterStatus('All')"
                    href="#">
                    All
                </a>
            </li>
        </ul>
        <button type="button" class="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#addTaskModal">
            Add Task
        </button>

        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Task</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="task in paginatedTasks" :key="task.id">
                    <td>{{ task.name }}</td>
                    <td>{{ task.status }}</td>
                    <td>
                        <button type="button" class="btn btn-secondary btn-sm me-2" data-bs-toggle="modal"
                            :data-bs-target="'#editTaskModal'" @click="startEditTask(task)">
                            Edit
                        </button>
                        <button type="button" class="btn btn-danger btn-sm" @click="deleteTask(task.id)">
                            Delete
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

        <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center mt-3">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <button class="page-link" @click="goToPage(currentPage - 1)">Previous</button>
                </li>
                <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: page === currentPage }">
                    <button class="page-link" @click="goToPage(page)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <button class="page-link" @click="goToPage(currentPage + 1)">Next</button>
                </li>
            </ul>
        </nav>

        <div class="modal fade" id="addTaskModal" tabindex="-1" aria-labelledby="addTaskModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addTaskModalLabel">New Task</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="mb-3">
                                <label for="task-name" class="col-form-label">Task:</label>
                                <input type="text" class="form-control" id="task-name" v-model="newTaskName">
                            </div>
                            <div class="mb-3">
                                <label for="task-status" class="col-form-label">Status:</label>
                                <select class="form-select" id="task-status" v-model="newTaskStatus">
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Done">Done</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="addTask">Add
                            Task</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="editTaskModal" tabindex="-1" aria-labelledby="editTaskModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editTaskModalLabel">Edit Task</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="mb-3">
                                <label for="edit-task-name" class="col-form-label">Task:</label>
                                <input type="text" class="form-control" id="edit-task-name" v-model="editingTaskName"
                                    placeholder="Enter task name" />
                                <label for="edit-task-name" class="col-form-label">Status:</label>
                                <select class="form-select" id="edit-task-status" v-model="editingTaskStatus">
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Done">Done</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" @click="saveTaskChanges">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.table {
    text-align: center;
}

.table th,
.table td {
    vertical-align: middle;
}
</style>