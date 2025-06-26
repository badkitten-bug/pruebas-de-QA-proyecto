import React from 'react';
import { AdoptionRequestForm } from '/project/src/components/adoptions/AdoptionRequestForm.tsx'; // Ajusta la ruta según tu estructura

describe('<AdoptionRequestForm />', () => {
  it('renders', () => {
    // Montamos el componente en el entorno de pruebas de Cypress
    cy.mount(<AdoptionRequestForm />);
  });

  it('should validate required fields', () => {
    // Simulamos el envío del formulario sin completar los campos requeridos
    cy.get('form').submit();
    // Verificamos que el mensaje de error esté presente y contenga el texto esperado
    cy.get('.error-message') // Ajusta esto según la clase real del mensaje de error
      .should('exist')
      .and('contain.text', 'Este campo es obligatorio');
  });

  it('should change the status of the adoption request to approved', () => {
    // Asumimos que hay un botón para aprobar solicitudes de adopción
    cy.get('[data-cy="approve-button"]').click(); // Asegúrate de que el botón tenga este atributo
    // Verificamos que el estado cambió a aprobado
    cy.get('.status') // Ajusta esto según la clase del elemento de estado
      .should('contain.text', 'Aprobada');
  });

  it('should change the status of the adoption request to rejected', () => {
    // Asumimos que hay un botón para rechazar solicitudes de adopción
    cy.get('[data-cy="reject-button"]').click(); // Asegúrate de que el botón tenga este atributo
    // Verificamos que el estado cambió a rechazado
    cy.get('.status') // Ajusta esto según la clase del elemento de estado
      .should('contain.text', 'Rechazada');
  });
});
