// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("login", (username, password) => {
	cy.visit("/");

	cy.get("input[id=username]").type(username);

	cy.get("input[id=password]").type(`${password}`, { log: false });

	cy.get("button[id=btnLogin]").click();

	cy.url().should("include", "/bmi");

	cy.getCookie("token").should("exist");
});

Cypress.Commands.add("register", (username, password) => {
	cy.visit("/");

	cy.get("input[id=username]").type(username);

	cy.get("input[id=password]").type(`${password}`, { log: false });

	cy.get("button[id=btnRegister]").click();
	cy.wait(2000);

	cy.get("button[id=btnLogin]").click();

	cy.url().should("include", "/bmi");

	cy.getCookie("token").should("exist");
});
