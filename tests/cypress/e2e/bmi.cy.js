describe("BMI", () => {
	beforeEach(() => {
		cy.register("cypressRegisterTest", "Cypresst");
	});

	it("should be able to enter height and weight, receive bmi and see graphs after refresh", () => {
		cy.get("input[id=height]").type("1.80");
		cy.get("input[id=weight]").type("65");

		cy.get("button[id=submitBmi]").click();

		cy.get("form").should("not.exist");

		cy.reload();

		cy.get("canvas").should("have.length", 2);
	});
});
