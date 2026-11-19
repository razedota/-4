const API_URL = 'https://6aff0c363a0e70bc8d54813c.mockapi.io/comments';

const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');

async function getTasks() {
    try {
        let response = await fetch(API_URL);
        if (!response.ok) throw new Error('Помилка завантаження');
        
        let tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        console.error('Помилка:', error);
    }
}

function renderTasks(tasks) {
    taskList.innerHTML = '';
    
    tasks.forEach(task => {
        let li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        let span = document.createElement('span');
        span.textContent = task.name || 'Без назви';
        span.addEventListener('click', () => toggleTask(task));
        
        let deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Видалити';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        
        li.appendChild(span);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

async function addTask() {
    let text = taskInput.value.trim();
    if (!text) return;

    let newTask = {
        name: text,
        completed: false
    };

    try {
        let response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask)
        });

        if (!response.ok) throw new Error('Помилка додавання');

        taskInput.value = '';
        getTasks(); 
    } catch (error) {
        console.error('Помилка:', error);
    }
}

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

async function toggleTask(task) {
    try {
        let response = await fetch(`${API_URL}/${task.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: !task.completed })
        });

        if (!response.ok) throw new Error('Помилка оновлення');

        getTasks();
    } catch (error) {
        console.error('Помилка:', error);
    }
}
async function deleteTask(id) {
    try {
        let response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Помилка видалення');

        getTasks();
    } catch (error) {
        console.error('Помилка:', error);
    }
}

getTasks();
