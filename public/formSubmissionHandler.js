const addNewTaskForm = document.querySelector('#add-to-tasks-form');
const newTaskInputField = document.querySelector('#NewTaskInputField');
const taskDateInputField = document.querySelector('#TaskDateInputField');

/**
 * Handles the form submission event.
 *
 * @param {type} event - The form submission event.
 * @return {type} The return value is not specified.
 */
export default function formSubmissionHandler() {
    addNewTaskForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const newTask = newTaskInputField.value;
        const newTaskDate = taskDateInputField.value;

        const newTaskObj = {
            id: Math.random() * 1000000,
            task: newTask,
            date: newTaskDate
        };

        saveTodo(newTaskObj);

        newTaskInputField.value = '';
        taskDateInputField.value = '';
    });
}