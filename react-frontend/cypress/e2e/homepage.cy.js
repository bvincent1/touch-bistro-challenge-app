describe('homepage', () => {
  it('should be able to enter student name', () => {
    cy.visit(Cypress.config().baseUrl)
    cy.get('#name').type('harold')
    cy.get('#button-login-form').click()
  })

  it('should list out 5 quizzes', () => {
    cy.fixture('getQuizzes').then(json => {
      cy.intercept('GET', `${Cypress.config().apiUrl}/quizzes`, json)
    })
    cy.visit(Cypress.config().baseUrl)
    cy.get('#name').type('harold')
    cy.get('#button-login-form').click()
    cy.fixture('getQuizzes').then(json => {
      json.map(q => cy.get(`#quiz-start-${q.id}`).should('exist'))
    })
  })
})
