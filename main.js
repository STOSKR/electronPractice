const path = require('path')
const { app, BrowserWindow, Menu } = require('electron')
const fs = require('fs');

// Para la app cuando se actualiza, instala o desinstala
if (require('electron-squirrel-startup')) {
    app.quit();
}

let loadingScreen

function createLoadingScreen() {
    loadingScreen = new BrowserWindow({
        width: 300,
        height: 300,
        titleBarStyle: 'hidden',
        frame: false,
        alwaysOnTop: true,
    })
    loadingScreen.removeMenu();
    loadingScreen.loadFile(path.join(__dirname, './loading/loading.html'));
    loadingScreen.show()
}

const createMainWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 690,
        show: false,
        backgroundColor: '#FFF',
        icon: path.join(__dirname, './img/icon.ico'),

        webPreferences: {
            preload: path.join(__dirname, 'PreloadMain.js'),
            nodeIntegration: true,
        },
    });

    mainWindow.once('ready-to-show', () => {
        setTimeout(() => {
            try {
                loadingScreen.destroy()
            } catch (e) { }

            mainWindow.show();
        }, 1000);
    });

    if (booleanoMain) {
        mainWindow.hide();
    }
    let [mainX1, mainY1] = mainWindow.getPosition();
    mainWindow.setResizable(false);
    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, 'Main.html'));
    // Open the DevTools.
    //mainWindow.webContents.openDevTools();
    mainWindow.removeMenu();

    ipcMain.on('Salir', (event, arg) => {
        mainWindow.hide();
    });
    ipcMain.on('ingresado2', (event, arg) => {
        mainWindow.show();
        mainWindow.webContents.send('ingresado2ReSend');

    });
    mainWindow.on('close', () => {
        app.quit();
    })
    ipcMain.on('Terminado', (event, arg) => {
        mainWindow.webContents.send('TerminadoReSend');
    });
    ipcMain.on('newProfile', (evento, argumento) => {
        mainWindow.webContents.send('newProfileReSend', argumento);

    });
    ipcMain.on('NumeroDePerfil', (evento, argumento) => {
        mainWindow.webContents.send('NumeroDePerfilReSend', argumento);

    });
    ipcMain.on('EnviarDatosAbarra', (evento, argumento) => {
        childWindow.webContents.send('EnviarDatosAbarraReSend', argumento);

    });
    // Cambiar la posición de la ventana sin efecto flash
    function setPositionWithoutFlash() {
        let [xMain, yMain] = mainWindow.getPosition();
        let [wMain, hMain] = mainWindow.getSize();
        // Ocultar la ventana
        mainWindow.setOpacity(0);

        // Cambiar la posición de la ventana
        mainWindow.setPosition(xMain + wMain + 43, yMain);

        // Mostrar la ventana nuevamente después de un breve retraso
        setTimeout(() => {
            mainWindow.setOpacity(1);
        }, 50);
    }
    let [xMain, yMain] = mainWindow.getPosition();
    function setPositionWithoutFlash2() {
        let [xMain, yMain] = mainWindow.getPosition();
        // Ocultar la ventana
        mainWindow.setOpacity(0);

        // Cambiar la posición de la ventana
        mainWindow.setPosition(xMain - 623, yMain);

        // Mostrar la ventana nuevamente después de un breve retraso
        setTimeout(() => {
            mainWindow.setOpacity(1);
        }, 50);
    }
    ipcMain.on('desplegar', (event, arg) => {
        mainWindow.setResizable(true);
        mainWindow.setMovable(false);
        mainWindow.setSize(1200, 690, true);
        setPositionWithoutFlash2()
        //mainWindow.setPosition(mainX1+160, mainY1);
        mainWindow.setResizable(false);
        mainWindow.setMovable(true);
    }); //ipcMain.on('ingresado')
    ipcMain.on('ocultar', (event, arg) => {
        mainWindow.setResizable(true);
        mainWindow.setMovable(false);
        //mainWindow.setPosition(mainX1+800, mainY1);
        mainWindow.setSize(580, 690, true);
        setPositionWithoutFlash()
        mainWindow.setResizable(false);
        mainWindow.setMovable(true);
    }); //ipcMain.on('ingresado')



    //________________________________________________________________________________________
    var heightChild = 173;
    var heightChild2 = 172;
    const childWindow = new BrowserWindow({
        width: 90,
        height: heightChild2,
        parent: mainWindow, // Set parent window
        frame: false,
        scrollbar: false,
        transparent: false, //IMPORTANTE CAMBIARLO LUEGO!!
        show: false,
        icon: path.join(__dirname, 'icon1.icns'),
        webPreferences: {
            preload: path.join(__dirname, 'PreloadPerfiles.js'),
            nodeIntegration: true
        }
    })
    childWindow.once('ready-to-show', () => {
        setTimeout(() => {
            childWindow.show(); // Maximiza la ventana
        }, 850); // Espera un segundo antes de mostrar la ventana
    });
    if (booleanoMain) {
        childWindow.hide();
    }
    childWindow.setResizable(false);

    ipcMain.on('desplazaUnPoco', () => {
        childWindow.setResizable(true);
        heightChild = heightChild + 100;
        childWindow.setSize(90, heightChild);
        childWindow.setResizable(false);
    });
    ipcMain.on('ingresado', (event, arg) => {
        childWindow.show();
        childWindow.webContents.send('SesionIniciada', arg);
    });
    ipcMain.on('Mutear', (event, arg) => {
        childWindow.webContents.send('MutearReSend', arg);

    });
    ipcMain.on('Salir', (event, arg) => {
        childWindow.hide();
    });
    ipcMain.on('perfilEliminado', (event, arg1, arg2) => {
        childWindow.setResizable(true);
        heightChild = heightChild - 100;
        childWindow.setSize(90, heightChild);

        fs.unlink(`./${arg1}/Perfil` + arg2 + '.json', (err) => {
            if (err) { console.log(err) };
            console.log('Se ha eliminado el archivo JSON');
        });


        childWindow.setResizable(false);
    });
    //childWindow.webContents.openDevTools(); childWindow.setResizable(true);
    childWindow.loadFile(path.join(__dirname, 'Perfiles.html'));
    var [mainX, mainY] = mainWindow.getPosition();
    mainWindow.setPosition(mainX1, mainY1);
    [mainX, mainY] = mainWindow.getPosition();
    var mainWidth = mainWindow.getSize()[0];
    var childWidth = childWindow.getSize()[0];
    var childX = mainX + mainWidth // Position to the right of main window
    var childY = mainY;
    childWindow.setPosition(childX - 3, childY);


    mainWindow.on('move', () => {
        var [mainX, mainY] = mainWindow.getPosition();
        var mainWidth = mainWindow.getSize()[0];
        var childWidth = childWindow.getSize()[0];
        var childX = mainX + mainWidth; // Position to the right of main window
        var childY = mainY;
        childWindow.setPosition(childX - 3, childY); // Adjust for any borders
        childWindow.setContentSize(90, heightChild)
    });


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

function initialize() {
    if (fs.existsSync('./datos.json')) {
        booleanoLogin = true;
    } else {
        booleanoMain = true;
    }
    createLoadingScreen();
    createMainWindow();
    createLoginWindow();
}



app.on('ready', initialize);

app.on('window-all-closed', () => {
    app.quit();
});

ipcMain.on('SalirApp', () => {
    app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createLoginWindow();
    }
});