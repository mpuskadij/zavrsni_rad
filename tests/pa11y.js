const pa11y = require("pa11y");

const host = "http://localhost:3000/";
const loginURL = `${host}login`;
const bmiURL = `${host}bmi`;
const workoutPlansURL = `${host}workout-plans`;
const createWorkoutPlanURL = `${workoutPlansURL}/create`;
const workoutPlanDetailsURL = `${workoutPlansURL}/6`;
const addExerciseURL = `${workoutPlanDetailsURL}/add`;
const nutritionURL = `${host}nutrition`;
const addFoodURL = `${nutritionURL}/add`;
const brandedID = "51c549ff97c3e6efadd60294";
const commonFoodDetailsURL = `${addFoodURL}/common/hamburger`;
const brandedFoodDetailsURL = `${addFoodURL}/branded/${brandedID}`;
const journalURL = `${host}journal`;
const addJournalEntryURL = `${journalURL}/add`;
const editJournalEntryURL = `${journalURL}/edit/9`;
const usersURL = `${host}users`;
const serverTimeURL = `${host}time`;
const htmlReporter = require("pa11y/lib/reporters/html");
const cliReporter = require("pa11y/lib/reporters/cli");
const fs = require("fs/promises");
const path = require("path");
const outputDirectory = path.resolve("./");
async function createFile(result, fileName) {
	const reporter = process.env["reporter"];
	if (!reporter) {
		throw new Error("No reporter type provided!");
	}
	switch (reporter) {
		case "html": {
			const fileContent = await htmlReporter.results(result);

			await fs.writeFile(
				outputDirectory.concat(`/${fileName}.html`),
				fileContent,
				{
					encoding: "utf8",
				}
			);

			break;
		}

		case "cli": {
			const cliText = await cliReporter.results(result);
			console.log(cliText);
			break;
		}
		default: {
			throw new Error("Invalid reporter!");
		}
	}
	return;
}
function login() {
	return [
		"set field #username to pa11y",
		"set field #password to Pa11yisawesome",
		"click element #btnLogin",
		`wait for url to be ${bmiURL}`,
	];
}
function loginForGraph() {
	return [
		"set field #username to pa11y2",
		"set field #password to Pa11yisawesome",
		"click element #btnLogin",
		`wait for url to be ${bmiURL}`,
	];
}

async function run() {
	try {
		const result = await pa11y(loginURL);
		await createFile(result, "login");
	} catch (error) {
		console.error(error.message);
	}

	try {
		const result = await pa11y(loginURL, {
			actions: login(),
		});
		await createFile(result, "bmi-form");
	} catch (error) {
		console.error(error.message);
	}
	try {
		const result = await pa11y(loginURL, {
			actions: loginForGraph(),
		});
		await createFile(result, "bmi-graph");
	} catch (error) {
		console.error(error.message);
	}

	try {
		const result = await pa11y(loginURL, {
			actions: login().push(`navigate to ${workoutPlansURL}`),
		});
		await createFile(result, "workout-plans");
	} catch (error) {
		console.error(error.message);
	}

	try {
		const result = await pa11y(loginURL, {
			actions: login().push(`navigate to ${createWorkoutPlanURL}`),
		});
		await createFile(result, "workout-plan-create");
	} catch (error) {
		console.error(error.message);
	}

	try {
		const result = await pa11y(loginURL, {
			actions: login().push(`navigate to ${workoutPlanDetailsURL}`),
		});
		await createFile(result, "workout-plan-details");
	} catch (error) {
		console.error(error.message);
	}

	try {
		const result = await pa11y(loginURL, {
			actions: login().push(
				`navigate to ${addExerciseURL}`,
				`set field #category to Back`,
				`click element #search`,
				`wait for #results to be visible`
			),
		});
		await createFile(result, "exercise-search");
	} catch (error) {
		console.error(error.message);
	}

	try {
		const result = await pa11y(loginURL, {
			actions: login().push(`navigate to ${nutritionURL}`),
		});
		await createFile(result, "nutrition");
	} catch (error) {
		console.error(error.message);
	}

	try {
		const result = await pa11y(loginURL, {
			actions: login().push(`navigate to ${addFoodURL}`),
		});
		await createFile(result, "nutrition-add");
	} catch (error) {
		console.error(error.message);
	}

	try {
		const result = await pa11y(loginURL, {
			actions: login().push(
				`navigate to ${addFoodURL}`,
				`set field #search to hamburger`,
				`click element #btnSearch`,
				"wait for #results to be visible"
			),
		});
		await createFile(result, "nutrition-add-search-table");
	} catch (error) {
		console.error(error.message);
	}

	try {
		const result = await pa11y(loginURL, {
			actions: login().push(`navigate to ${commonFoodDetailsURL}`),
		});
		await createFile(result, "common-food-details");
	} catch (error) {
		console.error(error.message);
	}

	try {
		const result = await pa11y(loginURL, {
			actions: login().push(`navigate to ${brandedFoodDetailsURL}`),
		});
		await createFile(result, "branded-food-details");
	} catch (error) {
		console.error(error.message);
	}

	try {
		const result = await pa11y(loginURL, {
			actions: login().push(`navigate to ${journalURL}`),
		});
		await createFile(result, "journal");
	} catch (error) {
		console.error(error.message);
	}

	try {
		const result = await pa11y(loginURL, {
			actions: login().push(`navigate to ${addJournalEntryURL}`),
		});
		await createFile(result, "journal-add");
	} catch (error) {
		console.error(error.message);
	}

	try {
		const result = await pa11y(loginURL, {
			actions: login().push(`navigate to ${editJournalEntryURL}`),
		});
		await createFile(result, "journal-edit");
	} catch (error) {
		console.error(error.message);
	}

	try {
		const result = await pa11y(loginURL, {
			actions: login().push(`navigate to ${usersURL}`),
		});
		await createFile(result, "users");
	} catch (error) {
		console.error(error.message);
	}

	try {
		const result = await pa11y(loginURL, {
			actions: login().push(`navigate to ${serverTimeURL}`),
		});
		await createFile(result, "time");
	} catch (error) {
		console.error(error.message);
	}
}
run();
