describe('Donations Page', () => {
  beforeEach(() => {
    // 1. Ir al login
    cy.visit('http://localhost:5173/login');

    // 2. Llenar y enviar el formulario de login
    cy.get('input[name="email"]').type('admin@email.com'); // ajusta según tu campo
    cy.get('input[name="password"]').type('admin123');     // ajusta la contraseña
    cy.get('button[type="submit"]').click();

    // 3. Esperar redirección y luego visitar donations
    cy.url().should('include', '/dashboard'); // asegúrate que entró al dashboard
    cy.visit('http://localhost:5173/dashboard/donations');
  });

  it('should load the donations page correctly', () => {
    cy.contains('Registro de Donation').should('be.visible');
  });
});
