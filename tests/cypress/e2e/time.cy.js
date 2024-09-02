describe("Time page (admin)", () => {
	const url = "/time";
	beforeEach(() => {
		cy.login("cypress", "Cypresst");
	});

	it("should be able to set the offset", () => {
		const currentDate = new Date();
		cy.visit(url);

		cy.get("input#offset").type(1);
		cy.get("button[type=submit]").click();
		cy.reload();
		cy.wait(1000);
		cy.get("p[id=clock]")
			.invoke("text")
			.then((text) => {
				const serverDate = new Date(text);
				currentDate.setHours(currentDate.getHours() + 1);
				expect(currentDate.getHours() == serverDate.getHours()).to.be.true;
			});

		cy.get("input#offset").type(0);
		cy.get("button[type=submit]").click();
		cy.reload();
		cy.wait(1000);

		cy.get("p[id=clock]")
			.invoke("text")
			.then((text) => {
				const serverDate = new Date(text);
				currentDate.setHours(currentDate.getHours() - 1);
				expect(currentDate.getHours() == serverDate.getHours()).to.be.true;
			});
	});
});
