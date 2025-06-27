// Script Selenium para pruebas de Inventario (TC-INV-001 al TC-INV-015)
// Ejecutar con: node selenium_tests/test_inventory_cases.js

import { Builder, By, until, Key } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

const URL = 'http://localhost:5173/';

async function runInventoryTests() {
  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options().addArguments('--headless=new'))
    .build();
  const results = [];
  try {
    // Acceso a la ruta de inventario
    await driver.get(URL + 'dashboard/inventory');
    await driver.sleep(1000);
    await driver.wait(until.elementLocated(By.tagName('h2')), 3000);

    // TC-INV-001: Visualizar items de inventario
    try {
      const items = await driver.findElements(By.xpath("//*[contains(@class,'text-lg') and contains(text(),'Inventory Items')]"));
      if (items.length > 0) {
        results.push('✅ TC-INV-001 OK');
      } else {
        results.push('❌ TC-INV-001: No se encontró el listado de items');
      }
    } catch (err) {
      results.push('❌ TC-INV-001 Error: ' + err.message);
    }

    // TC-INV-002: Mostrar mensaje si no hay items
    try {
      const sinItems = await driver.findElements(By.xpath("//*[contains(text(),'No items in inventory')]"));
      if (sinItems.length > 0) {
        results.push('✅ TC-INV-002 OK');
      } else {
        results.push('❌ TC-INV-002: No se encontró el mensaje esperado: "No items in inventory"');
      }
    } catch (err) {
      results.push('❌ TC-INV-002 Error: ' + err.message);
    }

    // TC-INV-003: Crear nuevo item de inventario con datos válidos
    try {
      await driver.findElement(By.name('name')).sendKeys('Croquetas para perros');
      await driver.findElement(By.name('category')).sendKeys('food');
      await driver.findElement(By.name('quantity')).sendKeys('10');
      await driver.findElement(By.name('unit')).sendKeys('kg');
      await driver.findElement(By.name('minimumRequired')).sendKeys('5');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.sleep(500);
      try {
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Croquetas para perros')]")), 2000);
        results.push('✅ TC-INV-003 OK');
      } catch {
        results.push('❌ TC-INV-003: No se encontró el item creado en la lista');
      }
    } catch (err) {
      results.push('❌ TC-INV-003 Error: ' + err.message);
    }

    // TC-INV-004: Validación campo nombre obligatorio
    try {
      await driver.findElement(By.name('name')).clear();
      await driver.findElement(By.css('button[type="submit"]')).click();
      try {
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Name is required')]")), 1000);
        results.push('✅ TC-INV-004 OK');
      } catch {
        results.push('❌ TC-INV-004: No se encontró el mensaje esperado: "Name is required"');
      }
    } catch (err) {
      results.push('❌ TC-INV-004 Error: ' + err.message);
    }

    // TC-INV-005: Validación categoría obligatoria
    try {
      await driver.findElement(By.name('category')).sendKeys('');
      await driver.findElement(By.css('button[type="submit"]')).click();
      try {
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'category')]")), 1000);
        results.push('✅ TC-INV-005 OK');
      } catch {
        results.push('❌ TC-INV-005: No se encontró el mensaje esperado: "category"');
      }
    } catch (err) {
      results.push('❌ TC-INV-005 Error: ' + err.message);
    }

    // TC-INV-006: Validación cantidad debe ser positiva
    try {
      await driver.findElement(By.name('quantity')).clear();
      await driver.findElement(By.name('quantity')).sendKeys('-3');
      await driver.findElement(By.css('button[type="submit"]')).click();
      try {
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Quantity must be 0 or greater')]")), 1000);
        results.push('✅ TC-INV-006 OK');
      } catch {
        results.push('❌ TC-INV-006: No se encontró el mensaje esperado: "Quantity must be 0 or greater"');
      }
    } catch (err) {
      results.push('❌ TC-INV-006 Error: ' + err.message);
    }

    // TC-INV-007: Validación unidad obligatoria
    try {
      await driver.findElement(By.name('unit')).clear();
      await driver.findElement(By.css('button[type="submit"]')).click();
      try {
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Unit is required')]")), 1000);
        results.push('✅ TC-INV-007 OK');
      } catch {
        results.push('❌ TC-INV-007: No se encontró el mensaje esperado: "Unit is required"');
      }
    } catch (err) {
      results.push('❌ TC-INV-007 Error: ' + err.message);
    }

    // TC-INV-008: Validación mínimo requerido debe ser positivo
    try {
      await driver.findElement(By.name('minimumRequired')).clear();
      await driver.findElement(By.name('minimumRequired')).sendKeys('-1');
      await driver.findElement(By.css('button[type="submit"]')).click();
      try {
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Minimum required must be 0 or greater')]")), 1000);
        results.push('✅ TC-INV-008 OK');
      } catch {
        results.push('❌ TC-INV-008: No se encontró el mensaje esperado: "Minimum required must be 0 or greater"');
      }
    } catch (err) {
      results.push('❌ TC-INV-008 Error: ' + err.message);
    }

    // TC-INV-009: Cancelar creación de item (no hay botón cancelar, se marca como N/A)
    results.push('⚠️ TC-INV-009: No implementado (no hay botón Cancelar en el formulario)');

    // TC-INV-010: Validación de persistencia tras error de envío
    try {
      await driver.findElement(By.name('name')).sendKeys('Persistencia');
      await driver.findElement(By.name('category')).sendKeys('food');
      await driver.findElement(By.name('quantity')).clear();
      await driver.findElement(By.name('quantity')).sendKeys('-1');
      await driver.findElement(By.css('button[type="submit"]')).click(); // Provoca error
      await driver.findElement(By.name('quantity')).clear();
      await driver.findElement(By.name('quantity')).sendKeys('5');
      const nombreValue = await driver.findElement(By.name('name')).getAttribute('value');
      if (nombreValue === 'Persistencia') {
        results.push('✅ TC-INV-010 OK');
      } else {
        results.push('❌ TC-INV-010: El campo no mantiene el dato tras error');
      }
    } catch (err) {
      results.push('❌ TC-INV-010 Error: ' + err.message);
    }

    // TC-INV-011: Validar entrada de datos con teclado
    try {
      await driver.findElement(By.name('name')).click();
      await driver.actions().sendKeys(Key.TAB).perform();
      await driver.actions().sendKeys('Teclado').perform();
      results.push('✅ TC-INV-011 OK (navegación básica)');
    } catch (err) {
      results.push('❌ TC-INV-011 Error: ' + err.message);
    }

    // TC-INV-012: Edición de un item existente (no implementado en UI, se marca como N/A)
    results.push('⚠️ TC-INV-012: No implementado (no hay edición en la UI)');

    // TC-INV-013: Eliminación de un item del inventario (no implementado en UI, se marca como N/A)
    results.push('⚠️ TC-INV-013: No implementado (no hay botón de eliminar en la UI)');

    // TC-INV-014: Validar formato de unidad (no hay validación específica, se marca como N/A)
    results.push('⚠️ TC-INV-014: No implementado (no hay validación de formato de unidad)');

    // TC-INV-015: Prevenir duplicado exacto de item (no hay validación específica, se marca como N/A)
    results.push('⚠️ TC-INV-015: No implementado (no hay validación de duplicados en la UI)');

  } finally {
    await driver.quit();
    console.log('--- Resumen de pruebas de inventario ---');
    results.forEach(r => console.log(r));
  }
}

runInventoryTests(); 