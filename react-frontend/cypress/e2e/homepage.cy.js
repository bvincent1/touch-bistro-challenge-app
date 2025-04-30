describe('homepage', () => {
  it('should be able to enter student name', () => {
    cy.visit(Cypress.config().baseUrl)
    cy.get('#name').type('harold')
    cy.get('#button-login-form').click()
  })
})
