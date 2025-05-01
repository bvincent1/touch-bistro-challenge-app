describe('homepage', () => {
  it('should be able to visit a question page', () => {
    cy.fixture('getQuizzes').then(json => {
      cy.intercept('GET', `${Cypress.config().apiUrl}/quizzes`, json)
    })
    cy.fixture('getQuestion').then(json => {
      cy.intercept('GET', `${Cypress.config().apiUrl}/questions/*`, json)
    })

    cy.visit(Cypress.config().baseUrl)
    cy.get('#name').type('harold')
    cy.get('#button-login-form').click()
    cy.get('#quiz-start-tst').click()
  })

  it('should be kicked out after 3 attempts', () => {
    cy.fixture('getQuestion').then(json => {
      cy.intercept('GET', `${Cypress.config().apiUrl}/questions/*`, json)
    })

    cy.fixture('getSubmissions').then(json => {
      cy.intercept('GET', `${Cypress.config().apiUrl}/submissions/*`, json)
    })
    cy.window().its('localStorage').invoke('setItem', 'quiz-user', 'test-user')
    cy.visit(`${Cypress.config().baseUrl}/questions/testtt`)

    // 1st
    cy.get('#answer').type('wrong answer')
    cy.get('button[type=submit]').click()

    // 2nd
    cy.get('button[type=submit]').click()

    // 3rd
    cy.get('button[type=submit]').click()

    cy.location().should(loc => {
      expect(loc.pathname).to.eq('/results/test-quiz-id')
    })
    cy.get('td').contains('1')
  })
})
