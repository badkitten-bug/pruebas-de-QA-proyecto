// En cypress/e2e/donations.spec.js

describe('Donations Page', () => {
  beforeEach(() => {
    // Navegar a la URL donde se encuentran las donations
    cy.visit('http://localhost:5173/dashboard/donations');
  });

  it('should load the donations page correctly', () => {
    cy.contains('Registro de Donation').should('be.visible'); // Verifica que el título esté visible
  });

  it('should display the donation form', () => {
    cy.get('form').should('be.visible'); // Verifica que el formulario esté visible
  });

  it('should have the necessary fields in the donation form', () => {
    cy.get('input[name="donorId"]').should('exist');
    cy.get('input[name="amount"]').should('exist');
  });

  it('should switch donation type between monetary and material', () => {
    cy.get('button').contains('Monetario').click();
    cy.get('input[name="amount"]').should('exist'); // Verifica que el campo "amount" esté presente para tipo monetario

    cy.get('button').contains('Material').click();
    cy.get('input[placeholder="Item name"]').should('exist'); // Verifica los campos para items de material
  });

  it('should submit a monetary donation', () => {
    cy.get('input[name="donorId"]').type('John Doe');
    cy.get('input[name="amount"]').type('50');
    cy.get('button[type="submit"]').click();
    cy.contains('Donation submitted').should('be.visible'); // Verifica que se haya enviado la donación
  });

  it('should submit a material donation', () => {
    cy.get('button').contains('Material').click();
    cy.get('input[placeholder="Item name"]').type('Laptop');
    cy.get('input[type="number"]').type('2');
    cy.get('button[type="submit"]').click();
    cy.contains('Donation submitted').should('be.visible');
  });
});
