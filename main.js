const path = require('path')
const { app, BrowserWindow, Menu } = require('electron')

const isDev = process.env.NODE_ENV !== 'production'
const isMac = process.platform === 'darwin'

// Initialize main window
const creatMainWindow = () => {
    const mainWindow = new BrowserWindow({
        title: 'RankUp',
        width: 800,
        height: 600,
        minWidth: 400,
        minHeight: 300,
    });

    // Open DevTools if in dev env
    if (isDev) {
        mainWindow.webContents.openDevTools()
    }

    mainWindow.loadFile(path.join(__dirname, './index.html'))
}

// App ready
app.whenReady().then(() => {
    creatMainWindow()

    // Implement menu
    const mainMenu = Menu.buildFromTemplate(menu)
    Menu.setApplicationMenu(mainMenu)

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            creatMainWindow()
        }
    })
})

// Menu template
const menu = [
    ...(isMac ? [{
        label: app.name,
        submenu: [
            {
                label: 'About'
            }
        ]
    }] : []),
    {
        role: 'fileMenu',
    },
    ...(!isMac ? [
        {
            label: 'Help',
            submenu: [
                {
                    label: 'About'
                }
            ]
        }
    ] : []),
]

app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit()
    }
})