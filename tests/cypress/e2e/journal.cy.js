describe("Journal", () => {
	const url = "/journal";
	beforeEach(() => {
		cy.login("cypress", "Cypresst");
	});
	it("should be able to create new entry, update and delete it", () => {
		cy.visit(url);

		cy.get("button[type=button]").click();
		cy.get("button[id=cancel]").click();

		cy.get("button[type=button]").click();
		cy.get("input[id=title]").type("Cypress entry");
		cy.get("textarea[id=description]").type(
			"This description was typed by Cypress"
		);
		cy.get("button[type=submit]").click();

		cy.get("tbody").children("tr").first().click();

		cy.get("input[id=title]").type("Cypress entry edit");
		cy.get("textarea[id=description]").type(
			"This description was edited by Cypress"
		);
		cy.get("button[type=submit]").click();

		cy.get("tbody").children("tr").first().click();

		cy.get("button[id=delete]").click();

		cy.get("tbody").should("not.exist");
	});
});
