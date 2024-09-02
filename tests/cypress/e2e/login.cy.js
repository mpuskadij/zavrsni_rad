describe("login page", () => {
	const data = { username: "cypress", password: "Cypresst" };
	it("should load", () => {
		cy.visit("/");
	});

	it("should be able to log in", () => {
		cy.visit("/");
		cy.login(data.username, data.password);
	});
});
