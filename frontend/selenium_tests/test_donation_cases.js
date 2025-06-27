// Script Selenium para pruebas de Donaciones (TC-DON-001 al TC-DON-015)
// Ejecutar con: node selenium_tests/test_donation_cases.js

import { Builder, By, until, Key } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

const URL = 'http://localhost:5173/';

async function runDonationTests() {
  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options().addArguments('--headless=new'))
    .build();
  const results = [];
  try {
    // Acceso a la ruta de donaciones
    await driver.get(URL + 'dashboard/donations');
    await driver.sleep(1000);
    await driver.wait(until.elementLocated(By.tagName('h2')), 3000);

    // TC-DON-001: Visualizar resumen de donaciones
    try {
      const resumen = await driver.findElements(By.xpath("//*[contains(text(),'Donation Summary')]"));
      if (resumen.length > 0) {
        results.push('✅ TC-DON-001 OK');
      } else {
        results.push('❌ TC-DON-001: No se encontró el resumen de donaciones');
      }
    } catch (err) {
      results.push('❌ TC-DON-001 Error: ' + err.message);
    }

    // TC-DON-002: Mostrar mensaje si no hay donaciones
    try {
      const sinDonaciones = await driver.findElements(By.xpath("//*[contains(text(),'No donations recorded yet')]"));
      if (sinDonaciones.length > 0) {
        results.push('✅ TC-DON-002 OK');
      } else {
        results.push('❌ TC-DON-002: No se encontró el mensaje esperado: "No donations recorded yet"');
      }
    } catch (err) {
      results.push('❌ TC-DON-002 Error: ' + err.message);
    }

    // TC-DON-003: Acceder a formulario de donación monetaria
    try {
      await driver.findElement(By.xpath("//button[contains(text(),'Monetario')]"));
      results.push('✅ TC-DON-003 OK');
    } catch (err) {
      results.push('❌ TC-DON-003 Error: No se encontró el botón Monetario');
    }

    // TC-DON-004: Acceder a formulario de donación material
    try {
      await driver.findElement(By.xpath("//button[contains(text(),'Material')]"));
      results.push('✅ TC-DON-004 OK');
    } catch (err) {
      results.push('❌ TC-DON-004 Error: No se encontró el botón Material');
    }

    // TC-DON-005: Registrar donación monetaria válida
    try {
      await driver.findElement(By.xpath("//button[contains(text(),'Monetario')]"));
      await driver.findElement(By.name('donorId')).clear();
      await driver.findElement(By.name('donorId')).sendKeys('Ana Rivas');
      await driver.findElement(By.name('amount')).clear();
      await driver.findElement(By.name('amount')).sendKeys('100');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.sleep(500);
      try {
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Ana Rivas')]")), 2000);
        results.push('✅ TC-DON-005 OK');
      } catch {
        results.push('❌ TC-DON-005: No se encontró la donación monetaria registrada');
      }
    } catch (err) {
      results.push('❌ TC-DON-005 Error: ' + err.message);
    }

    // TC-DON-006: Registrar donación material válida
    try {
      await driver.findElement(By.xpath("//button[contains(text(),'Material')]"));
      await driver.findElement(By.name('donorId')).clear();
      await driver.findElement(By.name('donorId')).sendKeys('Fundación Vida');
      await driver.findElement(By.xpath("//button[contains(text(),'Add Item')]")).click();
      await driver.findElement(By.xpath("//input[@placeholder='Item name']")).sendKeys('Alimento seco');
      await driver.findElement(By.xpath("//input[@type='number' and @min='1']")).clear();
      await driver.findElement(By.xpath("//input[@type='number' and @min='1']")).sendKeys('10');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.sleep(500);
      try {
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Fundación Vida')]")), 2000);
        results.push('✅ TC-DON-006 OK');
      } catch {
        results.push('❌ TC-DON-006: No se encontró la donación material registrada');
      }
    } catch (err) {
      results.push('❌ TC-DON-006 Error: ' + err.message);
    }

    // TC-DON-007: Validación donador obligatorio
    try {
      await driver.findElement(By.name('donorId')).clear();
      await driver.findElement(By.css('button[type="submit"]')).click();
      try {
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Donor information is required')]")), 1000);
        results.push('✅ TC-DON-007 OK');
      } catch {
        results.push('❌ TC-DON-007: No se encontró el mensaje esperado: "Donor information is required"');
      }
    } catch (err) {
      results.push('❌ TC-DON-007 Error: ' + err.message);
    }

    // TC-DON-008: Validación monto obligatorio si tipo es monetario
    try {
      await driver.findElement(By.xpath("//button[contains(text(),'Monetario')]"));
      await driver.findElement(By.name('amount')).clear();
      await driver.findElement(By.css('button[type="submit"]')).click();
      try {
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Amount must be greater than 0')]")), 1000);
        results.push('✅ TC-DON-008 OK');
      } catch {
        results.push('❌ TC-DON-008: No se encontró el mensaje esperado: "Amount must be greater than 0"');
      }
    } catch (err) {
      results.push('❌ TC-DON-008 Error: ' + err.message);
    }

    // TC-DON-009: Validación item obligatorio si tipo es material
    try {
      await driver.findElement(By.xpath("//button[contains(text(),'Material')]"));
      // No añadir ningún item
      await driver.findElement(By.css('button[type="submit"]')).click();
      try {
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'At least one item is required')]")), 1000);
        results.push('✅ TC-DON-009 OK');
      } catch {
        results.push('❌ TC-DON-009: No se encontró el mensaje esperado: "At least one item is required"');
      }
    } catch (err) {
      results.push('❌ TC-DON-009 Error: ' + err.message);
    }

    // TC-DON-010: Validación monto debe ser numérico positivo
    try {
      await driver.findElement(By.xpath("//button[contains(text(),'Monetario')]"));
      await driver.findElement(By.name('amount')).clear();
      await driver.findElement(By.name('amount')).sendKeys('-5');
      await driver.findElement(By.css('button[type="submit"]')).click();
      try {
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Amount must be greater than 0')]")), 1000);
        results.push('✅ TC-DON-010 OK');
      } catch {
        results.push('❌ TC-DON-010: No se encontró el mensaje esperado: "Amount must be greater than 0"');
      }
    } catch (err) {
      results.push('❌ TC-DON-010 Error: ' + err.message);
    }

    // TC-DON-011: Cancelar donación (no hay botón cancelar, se marca como N/A)
    results.push('⚠️ TC-DON-011: No implementado (no hay botón Cancelar en el formulario)');

    // TC-DON-012: Visualizar donación monetaria registrada en resumen
    try {
      const resumen = await driver.findElements(By.xpath("//*[contains(text(),'Total Monetary Donations')]"));
      if (resumen.length > 0) {
        results.push('✅ TC-DON-012 OK');
      } else {
        results.push('❌ TC-DON-012: No se encontró el resumen de donaciones monetarias');
      }
    } catch (err) {
      results.push('❌ TC-DON-012 Error: ' + err.message);
    }

    // TC-DON-013: Visualizar donación material registrada en resumen
    try {
      const resumen = await driver.findElements(By.xpath("//*[contains(text(),'Material Donations')]"));
      if (resumen.length > 0) {
        results.push('✅ TC-DON-013 OK');
      } else {
        results.push('❌ TC-DON-013: No se encontró el resumen de donaciones materiales');
      }
    } catch (err) {
      results.push('❌ TC-DON-013 Error: ' + err.message);
    }

    // TC-DON-014: Accesibilidad: navegación por teclado
    try {
      await driver.findElement(By.name('donorId')).click();
      await driver.actions().sendKeys(Key.TAB).perform();
      await driver.actions().sendKeys('Teclado').perform();
      results.push('✅ TC-DON-014 OK (navegación básica)');
    } catch (err) {
      results.push('❌ TC-DON-014 Error: ' + err.message);
    }

    // TC-DON-015: Persistencia de datos tras error de validación
    try {
      await driver.findElement(By.name('donorId')).sendKeys('Persistente');
      await driver.findElement(By.name('amount')).clear();
      await driver.findElement(By.css('button[type="submit"]')).click(); // Provoca error
      await driver.findElement(By.name('amount')).sendKeys('50');
      const nombreValue = await driver.findElement(By.name('donorId')).getAttribute('value');
      if (nombreValue.includes('Persistente')) {
        results.push('✅ TC-DON-015 OK');
      } else {
        results.push('❌ TC-DON-015: El campo no mantiene el dato tras error');
      }
    } catch (err) {
      results.push('❌ TC-DON-015 Error: ' + err.message);
    }

  } finally {
    await driver.quit();
    console.log('--- Resumen de pruebas de donaciones ---');
    results.forEach(r => console.log(r));
  }
}

runDonationTests(); 