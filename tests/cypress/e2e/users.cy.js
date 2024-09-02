describe("Users (admin page)", () => {
	const url = "/users";
	beforeEach(() => {
		cy.login("cypress", "Cypresst");
	});

	it("should be able to lock and unlock user", () => {
		cy.visit(url);

		cy.get("table").should("exist");

		cy.get("td#cypressRegisterTest").contains("Lock");

		cy.get("td#cypressRegisterTest").click();

		cy.get("td#cypressRegisterTest").contains("Unlock");

		cy.get("td#cypressRegisterTest").click();
	});
});
