import { AnimalForm } from "/project/src/components/animals/AnimalForm.tsx"; // Asegúrate de que esta ruta esté correcta

describe('<AnimalForm />', () => {
  beforeEach(() => {
    // Montamos el componente antes de cada prueba
    cy.mount(<AnimalForm />);
  });

  it('should render the form correctly', () => {
    // Verificamos que los campos estén presentes en el formulario
    cy.get('input#name').should('be.visible'); // Nombre
    cy.get('input#species').should('be.visible'); // Especie
    cy.get('input#breed').should('be.visible'); // Raza (opcional)
    cy.get('input#age').should('be.visible'); // Edad (opcional)
    cy.get('select#healthStatus').should('be.visible'); // Estado de salud
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
    cy.get('input#name').type('Buddy');
    cy.get('input#species').type('Dog');
    cy.get('select#healthStatus').select('healthy'); // Seleccionamos el estado de salud

    // Simula el envío del formulario
    cy.get('form').submit();

    // Verificamos que el formulario haya sido enviado correctamente
    cy.get('button[type="submit"]').should('be.disabled'); // Se debería deshabilitar el botón después de enviar el formulario

    // Aquí puedes agregar una validación para verificar que el estado global (store) haya sido actualizado
    // Si usas un store como Zustand o Redux, puedes verificar que el nuevo animal se haya añadido al estado.
    // Esto dependerá de la implementación de tu store.
    // Ejemplo con un store global: 
    // cy.window().its('store.getState').should('deep.include', { name: 'Buddy' });
  });

  it('should show error if health status is not selected', () => {
    // Completa todos los campos excepto el estado de salud
    cy.get('input#name').type('Buddy');
    cy.get('input#species').type('Dog');

    // Enviamos el formulario
    cy.get('form').submit();

    // Verificamos que aparezca el error de validación del estado de salud
    cy.get('p').should('contain.text', 'HealthStatus is required');
  });
});


