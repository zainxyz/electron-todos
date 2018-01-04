const electron = require('electron');
const { ipcRenderer } = electron;

/**
 * The submit form function, when the user is ready to add a new todo
 *
 * @method submitForm
 * @param  {Object}   event The event
 */
const submitForm = event => {
  event.stopPropagation();
  // Extract the value from the 'input'
  const { value } = document.querySelector('input');
  // Fire a 'todo:ADD' event and send the value in
  ipcRenderer.send('todo:ADD', value);
};

// Add an event listener to the form, on the 'submit' event
document.querySelector('form').addEventListener('submit', submitForm);
