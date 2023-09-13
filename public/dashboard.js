const addNewTaskForm = document.querySelector('#add-to-tasks-form');
const newTaskInputField = document.querySelector('#NewTaskInputField');
const taskDateInputField = document.querySelector('#TaskDateInputField');
const todoListDisplay = document.querySelector("#todo-list-display");
const tasksCount = document.querySelector("#tasks-count h1");

addNewTaskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const newTask = newTaskInputField.value;
    const newTaskDate = taskDateInputField.value;

    const newTaskObj = {
        id: Math.random() * 1000000,
        task: newTask,
        date: newTaskDate
    };

    saveTodo(newTaskObj)

    newTaskInputField.value = '';
    taskDateInputField.value = '';
});

/**
 * Saves a todo task by creating an HTML element and appending it to the todo list display.
 *
 * @param {Object} taskObject - The task object containing the id, task, and date of the todo task.
 * @return {void} This function does not return a value.
 */
const saveTodo = (taskObject) => {
    const todo = document.createElement('li');
    todo.classList.add('no-date-style-todo-item');
    todo.innerHTML = `
        <input type="checkbox" name="${taskObject.id}-todo-checkbox" id="${taskObject.id}-todo-checkbox">
            <div>
                <p>${taskObject.task}</p>
                <h5><i class='bx bxs-calendar'></i>${new Date(taskObject.date)}</h5>
            </div>
        <i class='bx bx-trash'></i>
    `;

    document.querySelector('#todo-list-display').appendChild(todo);

    updateTasksCount();
}

console.log(todoListDisplay)
// Deletes a todo task from the list of displayed todo task.
todoListDisplay.addEventListener('click', (event) => {
    const target = event.target;
    
    if (target.tagName === 'I' && target.classList.contains('bx-trash')) {
        const todoItem = target.closest('.no-date-style-todo-item');
        if (todoItem) {
            if(confirm("Are you sure that you want to delete this task?"))
            todoItem.remove();
        }
    }

    updateTasksCount();
});

const updateTasksCount = () => {
    tasksCount.innerHTML = todoListDisplay.childElementCount
}
updateTasksCount();