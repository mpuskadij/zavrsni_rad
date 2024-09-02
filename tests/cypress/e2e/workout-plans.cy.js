describe("Workout plans", () => {
	const data = { username: "cypress", password: "Cypresst" };
	const url = "/workout-plans";

	beforeEach(() => {
		cy.login(data.username, data.password);
		cy.visit(url);
	});

	it("be able to create/delete workout plan and add/remove exercise", () => {
		cy.url().should("contain", url);
		cy.get("button[id=addWorkoutPlan]").click();
		cy.get("button[type=button]").click();
		cy.get("button[id=addWorkoutPlan]").click();
		cy.get("input").type("cypress");
		cy.get("button[type=submit]").click();
		cy.get("tbody").children("tr").first().click();
		cy.get("button[id=add]").click();
		cy.get("select[id=category]").select("Back");
		cy.get("button[id=search]").click();
		cy.get("tbody tr").first().find("td").last().click();
		cy.get("tbody tr").first().find("td").last().click();
		cy.get("button[id=delete]").click();

		cy.get("tbody").should("not.exist");
	});
});
