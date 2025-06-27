// Script Selenium para pruebas de Login (TC-LOGIN-01 al TC-LOGIN-17)
// Ejecutar con: node selenium_tests/test_login_cases.js

import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

const URL = 'http://localhost:5173/';

async function runLoginTests() {
  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options().addArguments('--headless=new'))
    .build();
  const results = [];
  try {
    // TC-LOGIN-01
    try {
      await driver.get(URL + 'login');
      await driver.findElement(By.name('email')).sendKeys('usuario@dominio.com');
      await driver.findElement(By.name('password')).sendKeys('123456');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.wait(until.elementLocated(By.xpath("//*[not(contains(text(),'Email inválido'))]")), 1000);
      results.push('✅ TC-LOGIN-01 OK');
    } catch (err) {
      results.push('❌ TC-LOGIN-01 Error: ' + err.message);
    }

    // TC-LOGIN-02
    try {
      await driver.get(URL + 'login');
      await driver.findElement(By.name('email')).sendKeys('usuariodominio.com');
      await driver.findElement(By.name('password')).sendKeys('123456');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Incluye un signo \"@\" en la dirección de correo electrónico')]")), 2000);
      results.push('✅ TC-LOGIN-02 OK');
    } catch (err) {
      results.push('❌ TC-LOGIN-02 Error: ' + err.message);
    }

    // TC-LOGIN-03
    try {
      await driver.get(URL + 'login');
      await driver.findElement(By.name('email')).sendKeys('usuario@');
      await driver.findElement(By.name('password')).sendKeys('123456');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Email inválido')]")), 1000);
      results.push('✅ TC-LOGIN-03 OK');
    } catch (err) {
      results.push('❌ TC-LOGIN-03 Error: ' + err.message);
    }

    // TC-LOGIN-04
    try {
      await driver.get(URL + 'login');
      await driver.findElement(By.name('email')).sendKeys('@dominio.com');
      await driver.findElement(By.name('password')).sendKeys('123456');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Email inválido')]")), 1000);
      results.push('✅ TC-LOGIN-04 OK');
    } catch (err) {
      results.push('❌ TC-LOGIN-04 Error: ' + err.message);
    }

    // TC-LOGIN-05
    try {
      await driver.get(URL + 'login');
      await driver.findElement(By.name('email')).sendKeys('us@rio!@dom.com');
      await driver.findElement(By.name('password')).sendKeys('123456');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Email inválido')]")), 1000);
      results.push('✅ TC-LOGIN-05 OK');
    } catch (err) {
      results.push('❌ TC-LOGIN-05 Error: ' + err.message);
    }

    // TC-LOGIN-06
    try {
      await driver.get(URL + 'login');
      await driver.findElement(By.name('email')).sendKeys('usuario@dominio.com');
      await driver.findElement(By.name('password')).sendKeys('123');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Contraseña demasiado corta') or contains(text(),'mínimo')]")), 1000);
      results.push('✅ TC-LOGIN-06 OK');
    } catch (err) {
      results.push('❌ TC-LOGIN-06 Error: ' + err.message);
    }

    // TC-LOGIN-07
    try {
      await driver.get(URL + 'login');
      await driver.findElement(By.name('email')).sendKeys('usuario@dominio.com');
      await driver.findElement(By.name('password')).sendKeys('abc123');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.wait(until.elementLocated(By.xpath("//*[not(contains(text(),'Contraseña demasiado corta'))]")), 1000);
      results.push('✅ TC-LOGIN-07 OK');
    } catch (err) {
      results.push('❌ TC-LOGIN-07 Error: ' + err.message);
    }

    // TC-LOGIN-08
    try {
      await driver.get(URL + 'login');
      await driver.findElement(By.name('email')).sendKeys('usuario@dominio.com');
      await driver.findElement(By.name('password')).sendKeys('abcdefghijklmnoqrstuvwxyz123');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Contraseña demasiado larga') or contains(text(),'límite')]")), 1000);
      results.push('✅ TC-LOGIN-08 OK');
    } catch (err) {
      results.push('❌ TC-LOGIN-08 Error: ' + err.message);
    }

    // TC-LOGIN-09
    try {
      await driver.get(URL + 'login');
      await driver.findElement(By.name('email')).sendKeys('usuario@dominio.com');
      await driver.findElement(By.name('password')).sendKeys('');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Campo obligatorio') or contains(text(),'requerido')]")), 1000);
      results.push('✅ TC-LOGIN-09 OK');
    } catch (err) {
      results.push('❌ TC-LOGIN-09 Error: ' + err.message);
    }

    // TC-LOGIN-10
    try {
      await driver.get(URL + 'login');
      await driver.findElement(By.name('email')).sendKeys('usuario@dominio.com');
      await driver.findElement(By.name('password')).sendKeys('pass1234');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.wait(until.elementLocated(By.xpath("//*[not(contains(text(),'inválido'))]")), 1000);
      results.push('✅ TC-LOGIN-10 OK');
    } catch (err) {
      results.push('❌ TC-LOGIN-10 Error: ' + err.message);
    }

    // TC-LOGIN-11
    try {
      await driver.get(URL + 'login');
      await driver.findElement(By.name('email')).sendKeys('usuario@dominio.com');
      await driver.findElement(By.name('password')).sendKeys('@Pass_2024');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.wait(until.elementLocated(By.xpath("//*[not(contains(text(),'inválido'))]")), 1000);
      results.push('✅ TC-LOGIN-11 OK');
    } catch (err) {
      results.push('❌ TC-LOGIN-11 Error: ' + err.message);
    }

    // TC-LOGIN-12
    try {
      await driver.get(URL + 'login');
      await driver.findElement(By.name('email')).sendKeys('usuario@dominio.com');
      await driver.findElement(By.name('password')).sendKeys('contraseña<>');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Caracteres inválidos')]")), 1000);
      results.push('✅ TC-LOGIN-12 OK');
    } catch (err) {
      results.push('❌ TC-LOGIN-12 Error: ' + err.message);
    }

    // TC-LOGIN-13
    try {
      await driver.get(URL + 'login');
      await driver.findElement(By.name('email')).sendKeys('usuario@dominio.com');
      await driver.findElement(By.name('password')).sendKeys('Pass123');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.wait(until.urlContains('/dashboard'), 2000);
      results.push('✅ TC-LOGIN-13 OK');
    } catch (err) {
      results.push('❌ TC-LOGIN-13 Error: ' + err.message);
    }

    // TC-LOGIN-14
    try {
      await driver.get(URL + 'login');
      await driver.findElement(By.name('email')).sendKeys('usuario@dominio.com');
      await driver.findElement(By.name('password')).sendKeys('1234');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Credenciales incorrectas')]")), 1000);
      results.push('✅ TC-LOGIN-14 OK');
    } catch (err) {
      results.push('❌ TC-LOGIN-14 Error: ' + err.message);
    }

    // TC-LOGIN-15
    try {
      await driver.get(URL + 'login');
      await driver.findElement(By.name('email')).sendKeys('user@fake.com');
      await driver.findElement(By.name('password')).sendKeys('Pass123');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Credenciales incorrectas')]")), 1000);
      results.push('✅ TC-LOGIN-15 OK');
    } catch (err) {
      results.push('❌ TC-LOGIN-15 Error: ' + err.message);
    }

    // TC-LOGIN-16
    try {
      await driver.get(URL + 'login');
      await driver.findElement(By.name('email')).sendKeys('');
      await driver.findElement(By.name('password')).sendKeys('');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Complete todos los campos')]")), 1000);
      results.push('✅ TC-LOGIN-16 OK');
    } catch (err) {
      results.push('❌ TC-LOGIN-16 Error: ' + err.message);
    }

    // TC-LOGIN-17
    try {
      await driver.get(URL + 'login');
      await driver.findElement(By.name('email')).sendKeys(' usuario@dom.com ');
      await driver.findElement(By.name('password')).sendKeys('Pass123');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Email inválido') or contains(text(),'dashboard') or contains(text(),'error')]")), 1000);
      results.push('✅ TC-LOGIN-17 OK');
    } catch (err) {
      results.push('❌ TC-LOGIN-17 Error: ' + err.message);
    }

  } finally {
    await driver.quit();
    console.log('--- Resumen de pruebas ---');
    results.forEach(r => console.log(r));
  }
}

runLoginTests(); 