const taskInput = document.getElementById('new-task');
const addTaskButton = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const clearCompletedButton = document.getElementById('clear-completed');

function getTasksFromLocalStorage() {
  const storedTasks = localStorage.getItem('tasks');
  return storedTasks ? JSON.parse(storedTasks) : [];
}

function saveTasksToLocalStorage(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  const tasks = getTasksFromLocalStorage();
  taskList.innerHTML = ''; // Clear the list

  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.draggable = true;
    li.dataset.index = index;

    const taskText = task.text;

    li.innerHTML = `<span>${taskText}</span><button class="delete-btn"><i class="fas fa-trash-alt"></i></button>`;

    if (task.completed) {
      li.querySelector('span').style.textDecoration = 'line-through';
    }

    taskList.appendChild(li);

    const deleteButton = li.querySelector('.delete-btn');
    deleteButton.addEventListener('click', () => {
      const updatedTasks = getTasksFromLocalStorage().filter((_, i) => i !== index);
      saveTasksToLocalStorage(updatedTasks);
      renderTasks();
    });
  });
}

addTaskButton.addEventListener('click', () => {
  const taskText = taskInput.value.trim();
  if (taskText !== '') {
    const tasks = getTasksFromLocalStorage();
    tasks.push({ text: taskText, completed: false });
    saveTasksToLocalStorage(tasks);
    renderTasks();  // Call renderTasks to update the list!
    taskInput.value = '';
  }
});

taskInput.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    addTaskButton.click();
  }
});

// Drag and Drop
let draggedItem = null;

taskList.addEventListener('dragstart', (e) => {
  draggedItem = e.target;
  draggedItem.classList.add('dragging');
  e.dataTransfer.setData('text/plain', draggedItem.dataset.index);
});

taskList.addEventListener('dragover', (e) => {
  e.preventDefault();
  const afterElement = getDragAfterElement(taskList, e.clientY);
  if (afterElement == null) {
    taskList.appendChild(draggedItem);
  } else {
    taskList.insertBefore(draggedItem, afterElement);
  }
});

taskList.addEventListener('dragend', () => {
  draggedItem.classList.remove('dragging');
  draggedItem = null;

  const newTasks = [];
  Array.from(taskList.children).forEach(li => {
    const index = parseInt(li.dataset.index);
    const tasks = getTasksFromLocalStorage();
    newTasks.push(tasks[index]);
  });
  saveTasksToLocalStorage(newTasks);
  renderTasks();
});

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Clear Completed
clearCompletedButton.addEventListener('click', () => {
  const tasks = getTasksFromLocalStorage().filter(task => !task.completed);
  saveTasksToLocalStorage(tasks);
  renderTasks();
});

// Mark as Complete
taskList.addEventListener('click', (event) => {
  if (event.target.tagName === 'SPAN') {
    const index = parseInt(event.target.parentElement.dataset.index);
    const tasks = getTasksFromLocalStorage();
    tasks[index].completed = !tasks[index].completed;
    saveTasksToLocalStorage(tasks);
    renderTasks();
  }
});

renderTasks(); // Initial render
