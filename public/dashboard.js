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
        title: newTask,
        date: newTaskDate,
        completed: false
    };

    // Save the entry by a HTTP request to http://localhost:3000/tasks
    fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTaskObj)
    }).then(response => {
        if (response.ok) {
            return response.json();
        }
    }).then(data => {
        console.log(data);
        displayTodo(data);
    }).catch(error => { })

    newTaskInputField.value = '';
    taskDateInputField.value = '';
});

/**
 * Saves a todo task by creating an HTML element and appending it to the todo list display.
 *
 * @param {Object} taskObject - The task object containing the id, task, and date of the todo task.
 * @return {void} This function does not return a value.
 */
const displayTodo = (taskObject) => {
    const todo = document.createElement('li');
    todo.classList.add('date-style-todo-item');
    todo.innerHTML = `
        <input type="checkbox" name="${taskObject.id}-todo-checkbox" id="${taskObject.id}-todo-checkbox">
            <div>
                <p>${taskObject.title}</p>
                <h5><i class='bx bxs-calendar'></i>${new Date(taskObject.date).toString().split(' ').splice(0, 4).join(' ')}</h5>
            </div>
        <i class='bx bx-trash'></i>
    `;

    document.querySelector('#todo-list-display').appendChild(todo);
    updateTasksCount();
}

// Deletes a todo task from the list of displayed todo task.
todoListDisplay.addEventListener('click', (event) => {
    const target = event.target;
    if (target.tagName === 'I' && target.classList.contains('bx-trash')) {
        const todoItem = target.closest('.date-style-todo-item');
        const taskId = todoItem.querySelector('input').id.split('-')[0];
        if (todoItem) {
            if (confirm("Are you sure that you want to delete this task?")) {
                todoItem.remove();

                // Send a HTTP request to delete that particular task from http://localhost:3000/tasks
                fetch(`http://localhost:3000/tasks/${taskId}`, {
                    method: 'DELETE'
                }).then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                }).catch(error => { })
            }
        }
    }

    updateTasksCount();
});

/**
 * Updates the tasks count by setting the innerHTML of the tasksCount element to the number of child elements of the todoListDisplay element.
 *
 * @param {none} - This function does not take any parameters.
 * @return {none} - This function does not return any value.
 */
const updateTasksCount = () => {
    tasksCount.innerHTML = todoListDisplay.childElementCount;
}
updateTasksCount();

/**
 * Fetches the latest tasks data from the server and updates the UI.
 *
 * @return {void} This function does not return a value.
 */
const fetchLatestTasksData = (filter) => {
    fetch('http://localhost:3000/tasks')
        .then(response => response.json())
        .then(data => {

            let today = new Date();
            let tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1)

            data.forEach((task) => {
                switch (filter) {
                    case "All":
                        displayTodo(task);
                        break;
                    case "Today":
                        if (today.toString().split(' ').splice(0, 4).join(' ') === new Date(task.date).toString().split(' ').splice(0, 4).join(' '))
                            displayTodo(task);
                        break;
                    case "Tomorrow":
                        if (tomorrow.toString().split(' ').splice(0, 4).join(' ') === new Date(task.date).toString().split(' ').splice(0, 4).join(' '))
                            displayTodo(task);
                        break;
                    case "Completed":
                        displayTodo(task);
                        break;
                }
            })
            updateTasksCount();
        });
}
fetchLatestTasksData('All');

const asideHeading = document.querySelector('#main-section-heading h1');
const viewTypeButtons = document.querySelectorAll('#aside-tasks-days li');
viewTypeButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
        const target = event.currentTarget;

        // Check if the clicked button is already active
        if (!target.classList.contains('active')) {
            // Remove 'active' class from all buttons
            viewTypeButtons.forEach((btn) => {
                btn.classList.remove('active');
            });

            // Add 'active' class to the clicked button
            target.classList.add('active');

            // Change the main section heading as per view type selection
            asideHeading.textContent = target.textContent;
            todoListDisplay.innerHTML = "";
            fetchLatestTasksData(target.textContent);
        }
    });
});