describe("Nutrition", () => {
	const data = { username: "cypress", password: "Cypresst" };
	const url = "/nutrition";
	beforeEach(() => {
		cy.login(data.username, data.password);
		cy.visit(url);
	});

	it("should be able to add common food and branded food, remove food, update quantity", () => {
		cy.get("button[id=btnAddFood]").click();
		cy.get("input").type("hamburger");
		cy.get("button[id=btnSearch]").click();
		cy.get("table[id=common] tbody tr").first().click();
		cy.get("button[type=button]").click();

		cy.get("button[id=btnAddFood]").click();
		cy.get("input").type("hamburger");
		cy.get("button[id=btnSearch]").click();
		cy.get("table[id=branded] tbody tr").first().click();
		cy.get("button[type=button]").click();

		cy.get("input[type=number]").first().type("2");
		cy.get("input[type=number]").last().type("3");

		cy.get("button[type=submit]").click();

		cy.get("tbody tr").last().find("td").last().click();
		cy.get("tbody tr").first().find("td").last().click();

		cy.get("table").should("not.exist");
	});
});
