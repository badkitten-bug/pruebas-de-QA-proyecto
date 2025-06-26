describe('<AnimalForm />', () => {
  beforeEach(() => {
    // Paso 1: Visitar la página de login
    cy.visit('http://localhost:5173/login');

    // Paso 2: Completar el formulario de inicio de sesión
    cy.get('input[name="email"]').type('testuser@example.com'); // Ajusta el correo
    cy.get('input[name="password"]').type('password123'); // Ajusta la contraseña

    // Enviar el formulario de login
    cy.get('button[type="submit"]').click();

    // Esperamos que la URL cambie y que se redirija correctamente al dashboard
    cy.url({ timeout: 10000 }).should('include', '/dashboard/animals');
  });

  it('should render the form correctly', () => {
    // Paso 3: Verificamos que los campos estén presentes en el formulario
    cy.get('input[name="name"]').should('be.visible'); // Nombre del animal
    cy.get('input[name="species"]').should('be.visible'); // Especie del animal
    cy.get('input[name="breed"]').should('be.visible'); // Raza (opcional)
    cy.get('input[name="age"]').should('be.visible'); // Edad (opcional)
    cy.get('select[name="healthStatus"]').should('be.visible'); // Estado de salud
    cy.get('button[type="submit"]').should('be.visible'); // Botón de envío
  });

  it('should validate required fields', () => {
    // Enviamos el formulario sin completar los campos requeridos
    cy.get('form').submit();

    // Verificamos que aparezcan los mensajes de error
    cy.get('p').should('contain.text', 'Name is required');
    cy.get('p').should('contain.text', 'Species is required');
  });

  it('should submit the form correctly', () => {
    // Completa los campos obligatorios
    cy.get('input[name="name"]').type('Buddy'); // Nombre del animal
    cy.get('input[name="species"]').type('Dog'); // Especie del animal
    cy.get('select[name="healthStatus"]').select('healthy'); // Seleccionamos el estado de salud

    // Simula el envío del formulario
    cy.get('form').submit();

    // Verificamos que el formulario haya sido enviado correctamente
    cy.get('button[type="submit"]').should('be.disabled'); // Se debería deshabilitar el botón después de enviar el formulario

    // Aquí puedes agregar una validación para verificar que el estado global (store) haya sido actualizado
    // Si usas un store como Zustand o Redux, puedes verificar que el nuevo animal se haya añadido al estado.
    // Ejemplo con un store global:
    // cy.window().its('store.getState').should('deep.include', { name: 'Buddy' });
  });

  it('should show error if health status is not selected', () => {
    // Completa todos los campos excepto el estado de salud
    cy.get('input[name="name"]').type('Buddy'); // Nombre del animal
    cy.get('input[name="species"]').type('Dog'); // Especie del animal

    // Enviamos el formulario
    cy.get('form').submit();

    // Verificamos que aparezca el error de validación del estado de salud
    cy.get('p').should('contain.text', 'HealthStatus is required');
  });
});
