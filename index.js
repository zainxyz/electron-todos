import { app, BrowserWindow, ipcMain, Menu } from 'electron';

// Define the needed windows for better reusability later
let mainWindow;
let addTodoWindow;

/**
 * Main function which runs when the electron app is ready to receive events / actions
 *
 * @type {BrowserWindow}
 */
app.on('ready', () => {
  mainWindow = new BrowserWindow({});
  // Load the main HTML file to show the main window
  mainWindow.loadURL(`file://${__dirname}/main.html`);
  // If the user closes the main window, then we want the user to quit the application
  mainWindow.on('closed', () => app.quit());
  // Build the menu from the provided menu template
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

/**
 * Create a window for the 'Add New Todo' actions
 *
 * @method createAddTodoWindow
 */
const createAddTodoWindow = () => {
  addTodoWindow = new BrowserWindow({
    height: 200,
    title: 'Add New Todo',
    width: 500
  });
  // Load the addTodo HTML file to show the add todo window
  addTodoWindow.loadURL(`file://${__dirname}/addTodo.html`);
  // Help JS garbage collect correctly
  addTodoWindow.on('closed', () => (addTodoWindow = null));
};

/**
 * Clear all the todos by firing a 'todo:CLEAR' actions
 *
 * @method clearAllTodos
 */
const clearAllTodos = () => {
  // Fire a simple action on the main window to clear all the todos
  mainWindow.webContents.send('todo:CLEAR');
};

/**
 * Listen to the 'todo:ADD' event and run required actions
 *
 * @type {Function}
 */
ipcMain.on('todo:ADD', (event, todoValue) => {
  mainWindow.webContents.send('todo:ADD', todoValue);
  // Close the addTodo window
  addTodoWindow.close();
});

/**
 * The main menu template for the main menu...
 *
 * @type {Array}
 */
const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New Todo',
        accelerator: process.platform === 'darwin' ? 'Cmd+N' : 'Ctrl+N',
        click() {
          createAddTodoWindow();
        }
      },
      {
        label: 'Clear All Todos',
        accelerator: process.platform === 'darwin' ? 'Cmd+Backspace' : 'Ctrl+Delete',
        click() {
          clearAllTodos();
        }
      },
      {
        label: 'Quit',
        // Electron takes in either a string defining the hotkeys for the
        // menu option, or an IIFE function.
        // accelerator: 'Cmd+Q',
        // accelerator: (() => {})(),
        accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
        click() {
          app.quit();
        }
      }
    ]
  }
];

// Add an empty option to the menu when the user is running on OSX
if (process.platform === 'darwin') {
  menuTemplate.unshift({});
}

// Add in a Developer menu if we're not running in production environment
if (process.env.NODE_ENV !== 'production') {
  menuTemplate.push({
    label: 'Developer',
    submenu: [
      {
        // Electron has pre-built roles so you can add back in the default functionality
        // when needed.
        role: 'reload'
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Alt+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      }
    ]
  });
}
