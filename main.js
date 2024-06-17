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

const createLoginWindow = () => {
    const login = new BrowserWindow({
        width: 360,
        height: 601,
        titleBarStyle: 'hidden',
        frame: false,
        show: false,
        icon: path.join(__dirname, 'icon.icns'),
        webPreferences: {
            preload: path.join(__dirname, 'PreloadLogin.js'),
            nodeIntegration: true,
        },
    });
    login.once('ready-to-show', () => {
        setTimeout(() => {
            try {
                loadingScreen.destroy()
            } catch (e) { }
            login.show(); // Maximiza la ventana
        }, 500); // Espera un segundo antes de mostrar la ventana
    });
    login.removeMenu();
    if (booleanoLogin) {
        login.hide();
    }
    login.setResizable(false);
    // and load the index.html of the app.
    login.loadFile(path.join(__dirname, 'Login.html'));
    // Open the DevTools.
    //login.webContents.openDevTools();
    ipcMain.on('ingresado', (event, arg) => {
        login.hide();
    });
    ipcMain.on('Salir2', (event, arg) => {
        login.show();
    });
    login.on('close', () => {
        app.quit();
    })


}

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createLoginWindow();
    }
});

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