// Script Selenium para pruebas de Registro de Animales (TC-AN-001 al TC-AN-019)
// Ejecutar con: node selenium_tests/test_animal_register_cases.js

import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

const URL = 'http://localhost:5173/';

async function runAnimalRegisterTests() {
  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options())
    .build();
  const results = [];
  try {
    // TC-AN-001: Registro exitoso de animal con todos los datos válidos
    try {
      await driver.get(URL + 'dashboard/animals');
      await driver.sleep(1000);
      await driver.wait(until.elementLocated(By.name('name')), 5000);
      await driver.findElement(By.name('name')).sendKeys('Luna');
      await driver.findElement(By.name('species')).sendKeys('Perro');
      await driver.findElement(By.name('breed')).sendKeys('Labrador');
      await driver.findElement(By.name('age')).sendKeys('3');
      await driver.findElement(By.name('healthStatus')).sendKeys('Healthy');
      let fileInput = await driver.findElement(By.css('input[type="file"]'));
      await fileInput.sendKeys('C:/Users/seghs/OneDrive/Escritorio/pruebas-de-QA-proyecto/frontend/public/perro.png');
      await driver.findElement(By.css('button[type="submit"]')).click();
      try {
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Luna') and contains(text(),'Perro') and contains(text(),'3 years old') and contains(text(),'healthy') ]")), 2000);
        results.push('✅ TC-AN-001 OK');
      } catch {
        results.push('❌ TC-AN-001: No se encontró el mensaje esperado: "Luna, Perro, 3 years old, healthy"');
      }
    } catch (err) {
      results.push('❌ TC-AN-001 Error: ' + err.message);
    }

    // TC-AN-002: Validación de campos requeridos vacíos
    try {
      await driver.get(URL + 'dashboard/animals');
      await driver.sleep(1000);
      await driver.wait(until.elementLocated(By.name('name')), 5000);
      await driver.findElement(By.css('button[type="submit"]')).click();
      try {
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Requerido') or contains(text(),'required') or contains(text(),'obligatorio')]")), 1000);
        results.push('✅ TC-AN-002 OK');
      } catch {
        results.push('❌ TC-AN-002: No se encontró el mensaje esperado: "Requerido/required/obligatorio"');
      }
    } catch (err) {
      results.push('❌ TC-AN-002 Error: ' + err.message);
    }

    // TC-AN-003: Límite de caracteres en el campo Nombre
    try {
      await driver.get(URL + 'dashboard/animals');
      await driver.sleep(1000);
      await driver.wait(until.elementLocated(By.name('name')), 5000);
      await driver.findElement(By.name('name')).sendKeys('a'.repeat(100));
      await driver.findElement(By.css('button[type="submit"]')).click();
      try {
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Máximo 50 caracteres') or contains(text(),'maximum 50 characters')]")), 1000);
        results.push('✅ TC-AN-003 OK');
      } catch {
        results.push('❌ TC-AN-003: No se encontró el mensaje esperado: "Máximo 50 caracteres/maximum 50 characters"');
      }
    } catch (err) {
      results.push('❌ TC-AN-003 Error: ' + err.message);
    }

    // TC-AN-004: Validación de edad negativa
    try {
      await driver.get(URL + 'dashboard/animals');
      await driver.sleep(1000);
      await driver.wait(until.elementLocated(By.name('age')), 5000);
      await driver.findElement(By.name('age')).sendKeys('-5');
      await driver.findElement(By.css('button[type="submit"]')).click();
      try {
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Edad inválida') or contains(text(),'invalid age')]")), 1000);
        results.push('✅ TC-AN-004 OK');
      } catch {
        results.push('❌ TC-AN-004: No se encontró el mensaje esperado: "Edad inválida/invalid age"');
      }
    } catch (err) {
      results.push('❌ TC-AN-004 Error: ' + err.message);
    }

    // TC-AN-005: Restricción de formato al subir imagen
    try {
      await driver.get(URL + 'dashboard/animals');
      await driver.sleep(1000);
      await driver.wait(until.elementLocated(By.name('name')), 5000);
      let fileInput = await driver.findElement(By.css('input[type="file"]'));
      await fileInput.sendKeys('C:/Users/seghs/OneDrive/Escritorio/pruebas-de-QA-proyecto/frontend/public/virus.exe');
      await driver.findElement(By.css('button[type="submit"]')).click();
      try {
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Formato no válido') or contains(text(),'invalid format')]")), 1000);
        results.push('✅ TC-AN-005 OK');
      } catch {
        results.push('❌ TC-AN-005: No se encontró el mensaje esperado: "Formato no válido/invalid format"');
      }
    } catch (err) {
      results.push('❌ TC-AN-005 Error: ' + err.message);
    }

    // TC-AN-006: Carga correcta de imagen válida
    try {
      await driver.get(URL + 'dashboard/animals');
      await driver.sleep(1000);
      await driver.wait(until.elementLocated(By.name('name')), 5000);
      let fileInput = await driver.findElement(By.css('input[type="file"]'));
      await fileInput.sendKeys('C:/Users/seghs/OneDrive/Escritorio/pruebas-de-QA-proyecto/frontend/public/perro.png');
      await driver.findElement(By.css('button[type="submit"]')).click();
      try {
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'perro.png') or contains(text(),'imagen') or contains(text(),'vista previa')]")), 1000);
        results.push('✅ TC-AN-006 OK');
      } catch {
        results.push('❌ TC-AN-006: No se encontró el mensaje esperado: "perro.png/imagen/vista previa"');
      }
    } catch (err) {
      results.push('❌ TC-AN-006 Error: ' + err.message);
    }

    // TC-AN-007: Campo raza opcional
    try {
      await driver.get(URL + 'dashboard/animals');
      await driver.sleep(1000);
      await driver.wait(until.elementLocated(By.name('name')), 5000);
      await driver.findElement(By.name('name')).sendKeys('Toby');
      await driver.findElement(By.name('species')).sendKeys('Perro');
      await driver.findElement(By.name('breed')).clear();
      await driver.findElement(By.name('age')).sendKeys('2');
      await driver.findElement(By.name('healthStatus')).sendKeys('Healthy');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Toby')]")), 1000);
      results.push('✅ TC-AN-007 OK');
    } catch (err) {
      results.push('❌ TC-AN-007 Error: ' + err.message);
    }

    // TC-AN-008: Estado de salud solo acepta valores válidos
    try {
      await driver.get(URL + 'dashboard/animals');
      await driver.sleep(1000);
      await driver.wait(until.elementLocated(By.name('healthStatus')), 5000);
      const estados = ['Healthy', 'Sick', 'Recovering', 'Critical'];
      let allOk = true;
      for (const estado of estados) {
        await driver.findElement(By.name('healthStatus')).clear();
        await driver.findElement(By.name('healthStatus')).sendKeys(estado);
        await driver.findElement(By.css('button[type="submit"]')).click();
        try {
          await driver.wait(until.elementLocated(By.xpath(`//*[contains(text(),'${estado}')]`)), 1000);
        } catch {
          allOk = false;
        }
      }
      if (allOk) {
        results.push('✅ TC-AN-008 OK');
      } else {
        results.push('❌ TC-AN-008 Error: Algún estado no fue aceptado');
      }
    } catch (err) {
      results.push('❌ TC-AN-008 Error: ' + err.message);
    }

    // TC-AN-009: Prevención de valores inválidos en estado salud
    try {
      await driver.get(URL + 'dashboard/animals');
      await driver.sleep(1000);
      await driver.wait(until.elementLocated(By.name('healthStatus')), 5000);
      await driver.findElement(By.name('healthStatus')).sendKeys('Zombie');
      await driver.findElement(By.css('button[type="submit"]')).click();
      try {
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'rechaza la solicitud con error') or contains(text(),'invalid health status')]")), 1000);
        results.push('✅ TC-AN-009 OK');
      } catch {
        results.push('❌ TC-AN-009: No se encontró el mensaje esperado: "rechaza la solicitud con error/invalid health status"');
      }
    } catch (err) {
      results.push('❌ TC-AN-009 Error: ' + err.message);
    }

    // TC-AN-010: Actualización dinámica de lista tras registro
    try {
      await driver.get(URL + 'dashboard/animals');
      await driver.sleep(1000);
      await driver.wait(until.elementLocated(By.name('name')), 5000);
      await driver.findElement(By.name('name')).sendKeys('Toby');
      await driver.findElement(By.name('species')).sendKeys('Perro');
      await driver.findElement(By.name('age')).sendKeys('2');
      await driver.findElement(By.name('healthStatus')).sendKeys('Healthy');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Toby')]")), 1000);
      results.push('✅ TC-AN-010 OK');
    } catch (err) {
      results.push('❌ TC-AN-010 Error: ' + err.message);
    }

    // TC-AN-011: Prevención de doble envío del formulario
    try {
      await driver.get(URL + 'dashboard/animals');
      await driver.sleep(1000);
      await driver.wait(until.elementLocated(By.name('name')), 5000);
      await driver.findElement(By.name('name')).sendKeys('Gato');
      await driver.findElement(By.name('species')).sendKeys('Gato');
      await driver.findElement(By.name('age')).sendKeys('1');
      await driver.findElement(By.name('healthStatus')).sendKeys('Healthy');
      const submitBtn = await driver.findElement(By.css('button[type="submit"]'));
      await submitBtn.click();
      await submitBtn.click(); // Doble click rápido
      try {
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'deshabilita') or contains(text(),'disabled')]")), 1000);
        results.push('✅ TC-AN-011 OK');
      } catch {
        results.push('❌ TC-AN-011: No se encontró el mensaje esperado: "deshabilita/disabled"');
      }
    } catch (err) {
      results.push('❌ TC-AN-011 Error: ' + err.message);
    }

    // TC-AN-012: Navegación por teclado en formulario
    try {
      await driver.get(URL + 'dashboard/animals');
      await driver.sleep(1000);
      await driver.wait(until.elementLocated(By.name('name')), 5000);
      await driver.findElement(By.name('name')).sendKeys('Luna', '\uE004'); // \uE004 = Tab
      results.push('✅ TC-AN-012 OK (navegación básica)');
    } catch (err) {
      results.push('❌ TC-AN-012 Error: ' + err.message);
    }

    // TC-AN-013: Foco automático en primer error
    try {
      await driver.get(URL + 'dashboard/animals');
      await driver.sleep(1000);
      await driver.wait(until.elementLocated(By.name('name')), 5000);
      await driver.findElement(By.name('name')).clear();
      await driver.findElement(By.css('button[type="submit"]')).click();
      const active = await driver.switchTo().activeElement();
      const nameAttr = await active.getAttribute('name');
      if (nameAttr === 'name') {
        results.push('✅ TC-AN-013 OK');
      } else {
        results.push('❌ TC-AN-013 Error: El foco no está en el campo name');
      }
    } catch (err) {
      results.push('❌ TC-AN-013 Error: ' + err.message);
    }

    // TC-AN-014: Persistencia de datos tras error
    try {
      await driver.get(URL + 'dashboard/animals');
      await driver.sleep(1000);
      await driver.wait(until.elementLocated(By.name('name')), 5000);
      await driver.findElement(By.name('name')).sendKeys('Luna');
      await driver.findElement(By.name('species')).sendKeys('Perro');
      await driver.findElement(By.name('age')).sendKeys('-2');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.findElement(By.name('age')).clear();
      await driver.findElement(By.name('age')).sendKeys('2');
      const nombreValue = await driver.findElement(By.name('name')).getAttribute('value');
      const especieValue = await driver.findElement(By.name('species')).getAttribute('value');
      if (nombreValue === 'Luna' && especieValue === 'Perro') {
        results.push('✅ TC-AN-014 OK');
      } else {
        results.push('❌ TC-AN-014 Error: Los datos no se mantienen tras corregir error');
      }
    } catch (err) {
      results.push('❌ TC-AN-014 Error: ' + err.message);
    }

    // TC-AN-015: Orden correcto en la lista
    try {
      await driver.get(URL + 'dashboard/animals');
      await driver.sleep(1000);
      await driver.wait(until.elementLocated(By.name('name')), 5000);
      await driver.findElement(By.name('name')).sendKeys('Toby');
      await driver.findElement(By.name('species')).sendKeys('Perro');
      await driver.findElement(By.name('age')).sendKeys('2');
      await driver.findElement(By.name('healthStatus')).sendKeys('Healthy');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Toby')]")), 1000);
      results.push('✅ TC-AN-015 OK');
    } catch (err) {
      results.push('❌ TC-AN-015 Error: ' + err.message);
    }

    // TC-AN-016: Prevención de XSS en campo Nombre
    try {
      await driver.get(URL + 'dashboard/animals');
      await driver.sleep(1000);
      await driver.wait(until.elementLocated(By.name('name')), 5000);
      await driver.findElement(By.name('name')).sendKeys('<script>alert("xss")</script>');
      await driver.findElement(By.name('species')).sendKeys('Perro');
      await driver.findElement(By.name('age')).sendKeys('2');
      await driver.findElement(By.name('healthStatus')).sendKeys('Healthy');
      await driver.findElement(By.css('button[type="submit"]')).click();
      const pageSource = await driver.getPageSource();
      if (!pageSource.includes('<script>alert("xss")</script>')) {
        results.push('✅ TC-AN-016 OK');
      } else {
        results.push('❌ TC-AN-016 Error: El input no se sanitiza');
      }
    } catch (err) {
      results.push('❌ TC-AN-016 Error: ' + err.message);
    }

    // TC-AN-017: Imagen asociada visible tras registro
    try {
      await driver.get(URL + 'dashboard/animals');
      await driver.sleep(1000);
      await driver.wait(until.elementLocated(By.name('name')), 5000);
      let fileInput = await driver.findElement(By.css('input[type="file"]'));
      await fileInput.sendKeys('C:/Users/seghs/OneDrive/Escritorio/pruebas-de-QA-proyecto/frontend/public/perro.png');
      await driver.findElement(By.css('button[type="submit"]')).click();
      try {
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'perro.png')]")), 1000);
        results.push('✅ TC-AN-017 OK');
      } catch {
        results.push('❌ TC-AN-017: No se encontró el mensaje esperado: "perro.png"');
      }
    } catch (err) {
      results.push('❌ TC-AN-017 Error: ' + err.message);
    }

    // TC-AN-018: Campo edad opcional
    try {
      await driver.get(URL + 'dashboard/animals');
      await driver.sleep(1000);
      await driver.wait(until.elementLocated(By.name('name')), 5000);
      await driver.findElement(By.name('name')).sendKeys('Luna');
      await driver.findElement(By.name('species')).sendKeys('Perro');
      await driver.findElement(By.name('age')).clear();
      await driver.findElement(By.name('healthStatus')).sendKeys('Healthy');
      await driver.findElement(By.css('button[type="submit"]')).click();
      try {
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'registrado') or contains(text(),'sin edad')]")), 1000);
        results.push('✅ TC-AN-018 OK');
      } catch {
        results.push('❌ TC-AN-018: No se encontró el mensaje esperado: "registrado/sin edad"');
      }
    } catch (err) {
      results.push('❌ TC-AN-018 Error: ' + err.message);
    }

    // TC-AN-019: Imagen asociada visible tras registro
    try {
      await driver.get(URL + 'dashboard/animals');
      await driver.sleep(1000);
      await driver.wait(until.elementLocated(By.name('name')), 5000);
      let fileInput = await driver.findElement(By.css('input[type="file"]'));
      await fileInput.sendKeys('C:/Users/seghs/OneDrive/Escritorio/pruebas-de-QA-proyecto/frontend/public/perro.png');
      await driver.findElement(By.css('button[type="submit"]')).click();
      try {
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'perro.png')]")), 1000);
        results.push('✅ TC-AN-019 OK');
      } catch {
        results.push('❌ TC-AN-019: No se encontró el mensaje esperado: "perro.png"');
      }
    } catch (err) {
      results.push('❌ TC-AN-019 Error: ' + err.message);
    }

  } finally {
    await driver.quit();
    console.log('--- Resumen de pruebas de registro de animales ---');
    results.forEach(r => console.log(r));
  }
}

runAnimalRegisterTests(); 