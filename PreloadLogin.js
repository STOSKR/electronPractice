const { electron, contextBridge, ipcRenderer } = require('electron');

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const { executablePath } = require('puppeteer');
const fs = require('fs').promises;
const nodemailer = require('nodemailer');
const crypto = require('crypto-js');


const fss = require('fs');
const path = require('path');
// Expose the requires to the renderer process
contextBridge.exposeInMainWorld('myAPI', {
    puppeteer,
    executablePath,
    fs,
    nodemailer,
    fss,
    path,
    crypto,
    ipcRenderer,
});

contextBridge.exposeInMainWorld('myAPI3', {
    fss,
    path,
});

contextBridge.exposeInMainWorld('myAPI2', {
    tuputisimamadre: async function () {
        const datos = await fs.readFile('./datos.json');
        const datos2 = JSON.parse(datos);
        const nie1 = datos2[0];
        return nie1;
    },
    horariosGuardadosLectura: async function () {
        const nombreAbuscar2 = await fs.readFile('./datos.json');
        const nombreAbuscar3 = JSON.parse(nombreAbuscar2);
        nie = nombreAbuscar3[0];
        const nombreAbuscar4 = './' + nie + '.json'

        const horariosGuardados = await fs.readFile(nombreAbuscar4);
        const horariosGuardados2 = JSON.parse(horariosGuardados);
        return horariosGuardados2;
    },
    mainPrincipal: async function (IngresaUsuario, Ingresacontraseña) {
        //long lines code here

        const url = "https://intranet.upv.es/pls/soalu/est_intranet.NI_Dual?P_IDIOMA=c";

        //---------------------------------------------------------------------------------------
        //"DATOS REQUERIDOS PARA TOMAR CITA"
        const nie = IngresaUsuario;
        const contraseña = Ingresacontraseña;

        const userName = process.env.USERNAME;
        const execPath = "C:/Program Files/Google/Chrome/Application/chrome.exe";
        const usData = "C:/Users/" + userName + "/AppData/Local/Google/Chrome/User Data/Default";

        /*
        Mostrar o no la página de internet mientras buscas, true = mostrar  / false = no mostrar
        */
        const mostrar = false;
        //---------------------------------------------------------------------------------------
        //"CODIGO"
        main();

        async function main() {
            const page = await start();
            await iniciarSesion(page);
        }

        async function start() {
            const browser = await puppeteer.launch({
                headless: !mostrar,
                executablePath: execPath,
                userDataDir: usData,
            });
            const [page] = await browser.pages();
            await page.goto(url);
            return page;
        }
        async function delay(time) {
            return new Promise(function (resolve) {
                setTimeout(resolve, time)
            });
        }
        async function iniciarSesion(page) {
            const input1 = await page.$("input[name='dni']");
            await input1.click({ clickCount: 3 });
            await input1.type(nie);
            const input2 = await page.$("input[name='clau']");
            await input2.click({ clickCount: 3 });
            await input2.type(contraseña);
            await Promise.all([
                page.waitForNavigation(),
                page.$eval("input[class='upv_btsubmit']", elem => elem.click())
            ]);
            if (await page.$('a[title="ir a Actividades y Escuelas: reserva de plaza semanal e inscripción / Consulta de disponibilidad"]') != null
                || await page.$('a[title="ir a Actividades y Escuelas: reserva de plaza semanal e inscripción / Consulta de disponibilidad"]') != undefined
                || await page.$('a[href="est_intranet.AvisoAlumnos?P_IDIOMA=c&P_ViSTA=&P_CUA=&P_PARAM="]') != null
                || await page.$('a[href="est_intranet.AvisoAlumnos?P_IDIOMA=c&P_ViSTA=&P_CUA=&P_PARAM="]') != undefined
            ) {
                const image1 = document.getElementsByClassName('patito');
                image1[0].src = './diseños/aceptar.png'
                await delay(1600);
                saveUser();
                image1[0].style.display = "none";
                await page.close();
            } else {
                const spanErrores = document.getElementById('errorLogin');
                spanErrores.innerHTML = "Credenciales incorrectas";
                const image1 = document.getElementsByClassName('patito');
                image1[0].src = './diseños/cancelar.png'
                image1[0].width = 2;
                await page.close();
            }
        }
        function saveUser() {
            var arreglo = [IngresaUsuario, Ingresacontraseña, 'verify'];
            console.log(arreglo);
            console.log("guardando");
            const jsonString = JSON.stringify(arreglo, null, 2);
            fss.writeFileSync('./datos.json', jsonString);
            ipcRenderer.send('ingresado');
            ipcRenderer.send('ingresado2');
        };
    },
});