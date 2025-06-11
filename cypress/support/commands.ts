Cypress.Commands.add('login', (role: string) => {
	cy.request({
		method: 'POST',
		url: '/api/cypress-login',
		body: { role, ...Cypress.env() },
	}).then((response) => {
		expect(response.status).to.eq(200)
		cy.log('Login successful with role:', role)
	})
})
