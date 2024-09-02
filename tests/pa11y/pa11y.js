const pa11y = require("pa11y");

const host = "http://localhost:3000/";
const loginURL = `${host}login`;
const bmiURL = `${host}bmi`;
const workoutPlansURL = `${host}workout-plans`;
const createWorkoutPlanURL = `${workoutPlansURL}/create`;
const workoutPlanID = "6";
const workoutPlanDetailsURL = `${workoutPlansURL}/${workoutPlanID}`;
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
let outputDirectory = path.resolve("./");

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
		`wait for #bmiForm to be visible`,
	];
}

function navigate(navigationLinkId, url) {
	const actions = login();
	actions.push(
		`click element #a${navigationLinkId}`,
		`wait for url to be ${url}`
	);
	return actions;
}
function loginForGraph() {
	return [
		"set field #username to pa11y2",
		"set field #password to Pa11yisawesome",
		"click element #btnLogin",
		`wait for url to be ${bmiURL}`,
		`wait for #graphContainer to be visible`,
	];
}

async function run() {
	await fs.mkdir(outputDirectory.concat("/results"), { recursive: true });
	outputDirectory = outputDirectory.concat("/results");
	try {
		const result = await pa11y(loginURL, {
			includeWarnings: true,
			screenCapture: `${outputDirectory}/login.png`,
		});
		await createFile(result, "login");
		console.log(`Completed ${loginURL}`);
	} catch (error) {
		console.error(error.message);
	}

	try {
		const result = await pa11y(loginURL, {
			actions: login(),
			includeWarnings: true,
			screenCapture: `${outputDirectory}/bmi-form.png`,
		});
		await createFile(result, "bmi-form");
		console.log(`Completed ${bmiURL} form`);
	} catch (error) {
		console.error(error.message);
	}
	try {
		const result = await pa11y(loginURL, {
			actions: loginForGraph(),
			includeWarnings: true,
			screenCapture: `${outputDirectory}/bmi-graph.png`,
		});
		await createFile(result, "bmi-graph");
		console.log(`Completed ${bmiURL} graphs`);
	} catch (error) {
		console.error(error.message);
	}

	try {
		const result = await pa11y(loginURL, {
			actions: login().concat(
				`navigate to url ${workoutPlansURL}`,
				`wait for table to be visible`
			),
			includeWarnings: true,
			screenCapture: `${outputDirectory}/workout-plans.png`,
		});
		await createFile(result, "workout-plans");
		console.log(`Completed ${workoutPlansURL}`);
	} catch (error) {
		console.error(error.message);
	}

	try {
		const result = await pa11y(loginURL, {
			actions: login().concat(
				`navigate to url ${createWorkoutPlanURL}`,
				`wait for form to be visible`
			),
			includeWarnings: true,
			screenCapture: `${outputDirectory}/workout-plans-create.png`,
		});
		await createFile(result, "workout-plan-create");
		console.log(`Completed ${createWorkoutPlanURL}`);
	} catch (error) {
		console.error(error.message);
	}

	try {
		const result = await pa11y(loginURL, {
			actions: login().concat(
				`navigate to url ${workoutPlanDetailsURL}`,
				`wait for table to be visible`
			),
			includeWarnings: true,
			screenCapture: `${outputDirectory}/workout-plans-details.png`,
		});
		await createFile(result, "workout-plan-details");
		console.log(`Completed ${workoutPlanDetailsURL}`);
	} catch (error) {
		console.error(error.message);
	}

	try {
		const result = await pa11y(loginURL, {
			actions: login().concat(
				`navigate to ${addExerciseURL}`,
				`wait for select#category to be visible`,
				`wait for button#search to be visible`,
				`set field select#category to Back`,
				`click element button#search`,
				`wait for #results to be visible`
			),
			includeWarnings: true,
			screenCapture: `${outputDirectory}/exercise-search.png`,
		});
		await createFile(result, "exercise-search");
		console.log(`Completed ${addExerciseURL}`);
	} catch (error) {
		console.error(error.message);
	}

	try {
		const result = await pa11y(loginURL, {
			actions: login().concat(
				`navigate to ${nutritionURL}`,
				`wait for table to be visible`
			),
			includeWarnings: true,
			screenCapture: `${outputDirectory}/nutrition.png`,
		});
		await createFile(result, "nutrition");
		console.log(`Completed ${nutritionURL}`);
	} catch (error) {
		console.error(error.message);
	}

	try {
		const result = await pa11y(loginURL, {
			actions: login().concat(
				`navigate to ${addFoodURL}`,
				`set field #search to hamburger`,
				`click element #btnSearch`,
				"wait for #results to be visible"
			),
			includeWarnings: true,
			screenCapture: `${outputDirectory}/nutrition-add-search-table.png`,
		});
		await createFile(result, "nutrition-add-search-table");
		console.log(`Completed ${addFoodURL}`);
	} catch (error) {
		console.error(error.message);
	}

	try {
		const result = await pa11y(loginURL, {
			actions: login().concat(
				`navigate to ${commonFoodDetailsURL}`,
				`wait for table to be visible`
			),
			includeWarnings: true,
			screenCapture: `${outputDirectory}/common-food-details.png`,
		});
		await createFile(result, "common-food-details");
		console.log(`Completed ${commonFoodDetailsURL}`);
	} catch (error) {
		console.error(error.message);
	}

	try {
		const result = await pa11y(loginURL, {
			actions: login().concat(
				`navigate to ${brandedFoodDetailsURL}`,
				`wait for table to be visible`
			),
			includeWarnings: true,
			screenCapture: `${outputDirectory}/branded-food-details.png`,
		});
		await createFile(result, "branded-food-details");
		console.log(`Completed ${brandedFoodDetailsURL}`);
	} catch (error) {
		console.error(error.message);
	}

	try {
		const result = await pa11y(loginURL, {
			actions: login().concat(
				`navigate to ${journalURL}`,
				`wait for table to be visible`
			),
			includeWarnings: true,
			screenCapture: `${outputDirectory}/journal.png`,
		});
		await createFile(result, "journal");
		console.log(`Completed ${journalURL}`);
	} catch (error) {
		console.error(error.message);
	}

	try {
		const result = await pa11y(loginURL, {
			actions: login().concat(
				`navigate to ${addJournalEntryURL}`,
				`wait for form to be visible`
			),
			includeWarnings: true,
			screenCapture: `${outputDirectory}/journal-add.png`,
		});
		await createFile(result, "journal-add");
		console.log(`Completed ${addJournalEntryURL}`);
	} catch (error) {
		console.error(error.message);
	}

	try {
		const result = await pa11y(loginURL, {
			actions: login().concat(
				`navigate to ${editJournalEntryURL}`,
				`wait for form to be visible`
			),
			includeWarnings: true,
			screenCapture: `${outputDirectory}/journal-edit.png`,
		});
		await createFile(result, "journal-edit");
		console.log(`Completed ${editJournalEntryURL}`);
	} catch (error) {
		console.error(error.message);
	}

	try {
		const result = await pa11y(loginURL, {
			actions: login().concat(
				`navigate to ${usersURL}`,
				`wait for table to be visible`
			),
			includeWarnings: true,
			screenCapture: `${outputDirectory}/users.png`,
		});
		await createFile(result, "users");
		console.log(`Completed ${usersURL}`);
	} catch (error) {
		console.error(error.message);
	}

	try {
		const result = await pa11y(loginURL, {
			actions: login().concat(
				`navigate to ${serverTimeURL}`,
				`wait for form to be visible`
			),
			includeWarnings: true,
			screenCapture: `${outputDirectory}/time.png`,
		});
		await createFile(result, "time");
		console.log(`Completed ${serverTimeURL}`);
	} catch (error) {
		console.error(error.message);
	}
}
run();
