const electron = require('electron');
const { ipcRenderer } = electron;

// Define the main todosList as a top level constant
const list = document.getElementById('todosList');

/**
 * Listen to the 'todo:ADD' event and update the UI as needed
 *
 * @type {Function}
 */
ipcRenderer.on('todo:ADD', (event, todoValue) => {
  const li = document.createElement('li');
  const text = document.createTextNode(todoValue);
  // Add in the bootstrap class name
  li.className = 'list-group-item';
  // Append the text element to the <li>
  li.appendChild(text);
  // Append the <li> to the list
  list.appendChild(li);
});

/**
 * Clear out the list once the user fires the 'todo:CLEAR' event.
 *
 * @type {Function}
 */
ipcRenderer.on('todo:CLEAR', event => {
  list.innerHTML = '';
});
