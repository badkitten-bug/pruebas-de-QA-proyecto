describe('<AdoptionRequestForm />', () => {
  beforeEach(() => {
    // Paso 1: Visitar la página de login
    cy.visit('http://localhost:5173/login');

    // Paso 2: Completar el formulario de inicio de sesión
    cy.get('input[name="email"]').type('testuser@example.com'); // Ajusta el correo
    cy.get('input[name="password"]').type('password123'); // Ajusta la contraseña

    // Enviar el formulario de login
    cy.get('button[type="submit"]').click();

    // Esperamos que la URL cambie y que se redirija correctamente al dashboard de animales
    cy.url({ timeout: 10000 }).should('include', '/dashboard/animals');
    
    // Paso 3: Simulamos la redirección de la página de 'animals' a 'adoptions'
    cy.url().should('include', '/dashboard/animals');
    cy.visit('http://localhost:5173/dashboard/adoptions'); // Redirigimos manualmente a la página de adopciones para continuar la prueba

    // Verificamos que estamos en la página de adopciones
    cy.url().should('include', '/dashboard/adoptions'); // Confirmamos que la URL ahora incluye '/dashboard/adoptions'
  });

  it('should validate required fields in adoption form', () => {
    // Enviamos el formulario sin completar los campos requeridos
    cy.get('form').submit();

    // Verificamos que aparezcan los mensajes de error para los campos requeridos
    cy.get('form').find('p').should('contain.text', 'Please select an animal'); // Error de animal no seleccionado
    cy.get('form').find('p').should('contain.text', 'Adopter information is required'); // Error de adoptante no proporcionado
  });
});
