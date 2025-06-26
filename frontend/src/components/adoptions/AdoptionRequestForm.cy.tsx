import React from 'react'
import { AdoptionRequestForm } from './AdoptionRequestForm'

describe('<AdoptionRequestForm />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<AdoptionRequestForm />)
  })
})