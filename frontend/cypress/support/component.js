// ***********************************************************
// Este archivo es procesado y cargado automáticamente por Cypress
// antes de los archivos de prueba de componente.
// ***********************************************************

import './commands'
import { mount } from 'cypress/react'



// ⬇️ Importa los estilos globales de tu app (ajusta la ruta si es necesario)
import '/project/src/index.css'

// Registra el comando personalizado para montar componentes
Cypress.Commands.add('mount', mount)

// Ejemplo de uso:
// cy.mount(<MyComponent />)
