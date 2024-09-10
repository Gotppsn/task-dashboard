const API_URL = 'http://localhost:5000/api';

// Elements
const loginContainer = document.getElementById('loginContainer');
const dashboardContainer = document.getElementById('dashboardContainer');
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');
const createTaskForm = document.getElementById('createTaskForm');
const todoTasks = document.getElementById('todoTasks');
const inProgressTasks = document.getElementById('inProgressTasks');
const doneTasks = document.getElementById('doneTasks');

// 1. Handle User Login
loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      // Store token and show dashboard
      localStorage.setItem('token', data.token);
      loginContainer.style.display = 'none';
      dashboardContainer.style.display = 'block';
      loadTasks();
    } else {
      loginMessage.textContent = data.message || 'Login failed';
    }
  } catch (error) {
    console.error('Error logging in:', error);
  }
});

// 2. Handle Task Creation
createTaskForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const title = document.getElementById('taskTitle').value;
  const description = document.getElementById('taskDescription').value;
  const status = document.getElementById('taskStatus').value;

  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ title, description, status }),
    });

    if (response.ok) {
      // Reload tasks
      loadTasks();
    }
  } catch (error) {
    console.error('Error creating task:', error);
  }
});

// 3. Load Tasks
async function loadTasks() {
  try {
    const response = await fetch(`${API_URL}/tasks`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const tasks = await response.json();

    // Clear current tasks
    todoTasks.innerHTML = '';
    inProgressTasks.innerHTML = '';
    doneTasks.innerHTML = '';

    // Display tasks in appropriate columns
    tasks.forEach(task => {
      const taskElement = document.createElement('div');
      taskElement.classList.add('task-card');
      taskElement.innerHTML = `
        <h5>${task.title}</h5>
        <p>${task.description}</p>
        <button onclick="deleteTask('${task._id}')">Delete</button>
      `;

      if (task.status === 'To Do') {
        todoTasks.appendChild(taskElement);
      } else if (task.status === 'In Progress') {
        inProgressTasks.appendChild(taskElement);
      } else {
        doneTasks.appendChild(taskElement);
      }
    });
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
}

// 4. Delete Task
async function deleteTask(taskId) {
  try {
    await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    // Reload tasks after deletion
    loadTasks();
  } catch (error) {
    console.error('Error deleting task:', error);
  }
}
