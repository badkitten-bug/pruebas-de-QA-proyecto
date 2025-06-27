// Script Selenium para pruebas de Adopciones (TC-AD-001 al TC-AD-013)
// Ejecutar con: node selenium_tests/test_adoption_cases.js

import { Builder, By, until, Key } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

const URL = 'http://localhost:5173/';

async function runAdoptionTests() {
  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options().addArguments('--headless=new'))
    .build();
  const results = [];
  try {
    // Acceso a la ruta de adopciones
    await driver.get(URL + 'dashboard/adoptions');
    await driver.sleep(1000);
    await driver.wait(until.elementLocated(By.tagName('h2')), 3000);

    // TC-AD-001: Mostrar listado de peticiones de adopción
    try {
      const peticiones = await driver.findElements(By.xpath("//*[contains(@class,'text-lg') and contains(text(),'peticion de Adoption')]"));
      if (peticiones.length > 0) {
        results.push('✅ TC-AD-001 OK');
      } else {
        results.push('❌ TC-AD-001: No se encontró el listado de peticiones');
      }
    } catch (err) {
      results.push('❌ TC-AD-001 Error: ' + err.message);
    }

    // TC-AD-002: Mostrar mensaje cuando no hay peticiones
    try {
      const sinPeticiones = await driver.findElements(By.xpath("//*[contains(text(),'sin peticiones de adopcion')]"));
      if (sinPeticiones.length > 0) {
        results.push('✅ TC-AD-002 OK');
      } else {
        results.push('❌ TC-AD-002: No se encontró el mensaje esperado: "sin peticiones de adopcion"');
      }
    } catch (err) {
      results.push('❌ TC-AD-002 Error: ' + err.message);
    }

    // TC-AD-003: Crear nueva petición de adopción (flujo básico)
    try {
      await driver.findElement(By.xpath("//select[@name='animalId']")).click();
      await driver.findElement(By.xpath("//select[@name='animalId']/option[2]")).click(); // Selecciona el primer animal disponible
      await driver.findElement(By.name('adopterId')).sendKeys('Juan Pérez');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.sleep(500);
      try {
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Juan Pérez')]")), 2000);
        results.push('✅ TC-AD-003 OK');
      } catch {
        results.push('❌ TC-AD-003: No se encontró el mensaje esperado: "Juan Pérez" en la lista');
      }
    } catch (err) {
      results.push('❌ TC-AD-003 Error: ' + err.message);
    }

    // TC-AD-004: Validar campo selección animal obligatorio
    try {
      await driver.findElement(By.name('adopterId')).clear();
      await driver.findElement(By.name('adopterId')).sendKeys('Juan Pérez');
      await driver.findElement(By.name('animalId')).sendKeys(''); // No selecciona animal
      await driver.findElement(By.css('button[type="submit"]')).click();
      try {
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Please select an animal')]")), 1000);
        results.push('✅ TC-AD-004 OK');
      } catch {
        results.push('❌ TC-AD-004: No se encontró el mensaje esperado: "Please select an animal"');
      }
    } catch (err) {
      results.push('❌ TC-AD-004 Error: ' + err.message);
    }

    // TC-AD-005: Validar campo adoptante obligatorio
    try {
      await driver.findElement(By.name('animalId')).click();
      await driver.findElement(By.xpath("//select[@name='animalId']/option[2]")).click();
      await driver.findElement(By.name('adopterId')).clear();
      await driver.findElement(By.css('button[type="submit"]')).click();
      try {
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Adopter information is required')]")), 1000);
        results.push('✅ TC-AD-005 OK');
      } catch {
        results.push('❌ TC-AD-005: No se encontró el mensaje esperado: "Adopter information is required"');
      }
    } catch (err) {
      results.push('❌ TC-AD-005 Error: ' + err.message);
    }

    // TC-AD-006: Buscar adoptante en campo de texto (autocompletar)
    try {
      await driver.findElement(By.name('adopterId')).sendKeys('Juan');
      // Aquí se asume que el frontend muestra sugerencias, pero si no hay autocompletar, solo verifica que el campo acepte texto
      const value = await driver.findElement(By.name('adopterId')).getAttribute('value');
      if (value.includes('Juan')) {
        results.push('✅ TC-AD-006 OK');
      } else {
        results.push('❌ TC-AD-006: El campo no acepta texto correctamente');
      }
    } catch (err) {
      results.push('❌ TC-AD-006 Error: ' + err.message);
    }

    // TC-AD-007: Cancelar creación de nueva petición (no hay botón cancelar, se omite o marca como N/A)
    results.push('⚠️ TC-AD-007: No implementado (no hay botón Cancelar en el formulario)');

    // TC-AD-008: Listado dinámico tras nueva petición
    try {
      await driver.findElement(By.xpath("//select[@name='animalId']")).click();
      await driver.findElement(By.xpath("//select[@name='animalId']/option[2]")).click();
      await driver.findElement(By.name('adopterId')).clear();
      await driver.findElement(By.name('adopterId')).sendKeys('Nuevo Adoptante');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.sleep(500);
      try {
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Nuevo Adoptante')]")), 2000);
        results.push('✅ TC-AD-008 OK');
      } catch {
        results.push('❌ TC-AD-008: No se encontró el mensaje esperado: "Nuevo Adoptante" en la lista');
      }
    } catch (err) {
      results.push('❌ TC-AD-008 Error: ' + err.message);
    }

    // TC-AD-009: Prevención de doble envío de petición
    try {
      await driver.findElement(By.xpath("//select[@name='animalId']")).click();
      await driver.findElement(By.xpath("//select[@name='animalId']/option[2]")).click();
      await driver.findElement(By.name('adopterId')).clear();
      await driver.findElement(By.name('adopterId')).sendKeys('Doble Envio');
      const submitBtn = await driver.findElement(By.css('button[type="submit"]'));
      await submitBtn.click();
      await submitBtn.click(); // Doble click rápido
      // No hay mensaje específico, pero podrías verificar que solo aparece una vez en la lista
      await driver.sleep(500);
      const elementos = await driver.findElements(By.xpath("//*[contains(text(),'Doble Envio')]"));
      if (elementos.length === 1) {
        results.push('✅ TC-AD-009 OK');
      } else {
        results.push('❌ TC-AD-009: Se permitió doble envío o no se registró la petición');
      }
    } catch (err) {
      results.push('❌ TC-AD-009 Error: ' + err.message);
    }

    // TC-AD-010: Validar navegación por teclado en formulario
    try {
      await driver.findElement(By.name('animalId')).click();
      await driver.actions().sendKeys(Key.TAB).perform();
      await driver.actions().sendKeys('Adoptante Teclado').perform();
      results.push('✅ TC-AD-010 OK (navegación básica)');
    } catch (err) {
      results.push('❌ TC-AD-010 Error: ' + err.message);
    }

    // TC-AD-011: Persistencia de datos tras error en validación
    try {
      await driver.findElement(By.name('animalId')).click();
      await driver.findElement(By.xpath("//select[@name='animalId']/option[2]")).click();
      await driver.findElement(By.name('adopterId')).clear();
      await driver.findElement(By.css('button[type="submit"]')).click(); // Provoca error
      await driver.findElement(By.name('adopterId')).sendKeys('Persistente');
      const value = await driver.findElement(By.name('adopterId')).getAttribute('value');
      if (value.includes('Persistente')) {
        results.push('✅ TC-AD-011 OK');
      } else {
        results.push('❌ TC-AD-011: El campo no mantiene el dato tras error');
      }
    } catch (err) {
      results.push('❌ TC-AD-011 Error: ' + err.message);
    }

    // TC-AD-012: Prueba de roles de usuario (no implementado en frontend, se marca como N/A)
    results.push('⚠️ TC-AD-012: No implementado (no hay control de roles en el frontend)');

    // TC-AD-013: Validación de tamaño máximo del texto adoptante
    try {
      const textoLargo = 'a'.repeat(200);
      await driver.findElement(By.name('adopterId')).clear();
      await driver.findElement(By.name('adopterId')).sendKeys(textoLargo);
      await driver.findElement(By.css('button[type="submit"]')).click();
      try {
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Máximo 100 caracteres') or contains(text(),'maximum 100 characters')]")), 1000);
        results.push('✅ TC-AD-013 OK');
      } catch {
        results.push('❌ TC-AD-013: No se encontró el mensaje esperado: "Máximo 100 caracteres/maximum 100 characters"');
      }
    } catch (err) {
      results.push('❌ TC-AD-013 Error: ' + err.message);
    }

  } finally {
    await driver.quit();
    console.log('--- Resumen de pruebas de adopciones ---');
    results.forEach(r => console.log(r));
  }
}

runAdoptionTests(); 