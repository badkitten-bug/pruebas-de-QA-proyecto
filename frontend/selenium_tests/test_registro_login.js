// Script Selenium para pruebas de Registro y Login (TC01-TC08)
// Ejecutar con: node selenium_tests/test_registro_login.js

import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

const URL = 'http://localhost:5173/';

async function runTests() {
  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options().addArguments('--headless=new'))
    .build();
  try {
    // TC01: Registro con datos válidos
    await driver.get(URL + 'register');
    await driver.findElement(By.name('name')).sendKeys('Juan');
    await driver.findElement(By.name('apellido')).sendKeys('Pérez');
    await driver.findElement(By.name('email')).sendKeys('juanperez@gmail.com');
    await driver.findElement(By.name('retypeEmail')).sendKeys('juanperez@gmail.com');
    await driver.findElement(By.name('password')).sendKeys('123456');
    await driver.findElement(By.name('rePassword')).sendKeys('123456');
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Registro exitoso')]")), 3000);
    console.log('✅ TC01: Registro con datos válidos OK');

    // TC02: Registro con campos vacíos
    await driver.get(URL + 'register');
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'obligatorio') or contains(text(),'requerido') or contains(text(),'no coinciden') or contains(text(),'inválido') or contains(text(),'caracteres') or contains(text(),'error') ]")), 3000);
    console.log('✅ TC02: Registro con campos vacíos OK');

    // TC03: Registro con datos inválidos
    await driver.get(URL + 'register');
    await driver.findElement(By.name('name')).sendKeys('1');
    await driver.findElement(By.name('apellido')).sendKeys('1');
    await driver.findElement(By.name('email')).sendKeys('juan@com');
    await driver.findElement(By.name('retypeEmail')).sendKeys('juan@com');
    await driver.findElement(By.name('password')).sendKeys('1');
    await driver.findElement(By.name('rePassword')).sendKeys('1');
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'inválido') or contains(text(),'no coinciden') or contains(text(),'caracteres') or contains(text(),'error') ]")), 3000);
    console.log('✅ TC03: Registro con datos inválidos OK');

    // TC04: Registro con correo no existente y contraseña válida
    await driver.get(URL + 'register');
    await driver.findElement(By.name('name')).sendKeys('Ana');
    await driver.findElement(By.name('apellido')).sendKeys('García');
    await driver.findElement(By.name('email')).sendKeys('ana_noexiste@gmail.com');
    await driver.findElement(By.name('retypeEmail')).sendKeys('ana_noexiste@gmail.com');
    await driver.findElement(By.name('password')).sendKeys('123456');
    await driver.findElement(By.name('rePassword')).sendKeys('123456');
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Registro exitoso')]")), 3000);
    console.log('✅ TC04: Registro con correo no existente OK');

    // TC05: Login con datos válidos (usuario recién registrado)
    await driver.get(URL + 'login');
    await driver.findElement(By.name('email')).sendKeys('juanperez@gmail.com');
    await driver.findElement(By.name('password')).sendKeys('123456');
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(until.urlContains('/dashboard'), 3000);
    console.log('✅ TC05: Login con datos válidos OK');

    // TC06: Login con campos vacíos
    await driver.get(URL + 'login');
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'obligatorio') or contains(text(),'requerido') or contains(text(),'error')]")), 3000);
    console.log('✅ TC06: Login con campos vacíos OK');

    // TC07: Login con correo sin formato y contraseña incompleta
    await driver.get(URL + 'login');
    await driver.findElement(By.name('email')).sendKeys('elyermad@com');
    await driver.findElement(By.name('password')).sendKeys('1');
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'inválido') or contains(text(),'incorrecto') or contains(text(),'error')]")), 3000);
    console.log('✅ TC07: Login con datos inválidos OK');

    // TC08: Login con correo no existente y contraseña válida
    await driver.get(URL + 'login');
    await driver.findElement(By.name('email')).sendKeys('noexiste@gmail.com');
    await driver.findElement(By.name('password')).sendKeys('123456');
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'error') or contains(text(),'incorrecto') or contains(text(),'no existe')]")), 3000);
    console.log('✅ TC08: Login con correo no existente OK');

  } catch (err) {
    console.error('❌ Error en pruebas:', err);
  } finally {
    await driver.quit();
  }
}

runTests(); 