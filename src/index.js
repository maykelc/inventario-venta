const { createWindow } = require('./main/main')
const { app } = require('electron')

require('./main/db')


app.whenReady().then(createWindow);