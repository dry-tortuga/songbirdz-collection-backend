// const DB = require("../db");

// Create a new connection to the database
// const db = new DB();

const getBirdOfTheWeek = async (req, res, next) => {

	res.send({
		species: "Sedge Wren",
		ids: [7132, 7178, 7940],
		facts: [
			'The Sedge Wren\'s tail is frequently cocked upward, a trait shared among other wrens, which definitely increases the cuteness factor of these birds. The plants in the images, which are often found near or in marshes where Sedge Wrens dwell, were a big clue in eliminating the Winter Wren as a choice from the OBT. And, despite its name, the Wrentit is in the "Parrotbills, Wrentit, & Allies" family, not the "Wren" family.',
			'There is a lot of lore and stories about the wren. In Celtic folklore, the wren was known as the "king of all birds" by besting an eagle by hiding on its back to fly higher. The victory, being considered deceitful, placed the wren under a geis, a mystical taboo that prevents it from flying higher than a bush.',
			'The story doesn\'t end there for the king of birds. A wren is also said to have betrayed Saint Stephen by revealing his hiding spot to his attackers. There is even a tradition that takes place in Ireland on St. Stephen\'s Day (a.k.a. Wren Day) which includes dressing up, traveling house to house with a fake wren on a pole and singing a song (The Wren Song) about the king of all birds.',
		],
		links: [
			'https://roisinmallonart.com/blog/irish-folklore-wren-became-king',
			'https://www.rte.ie/brainstorm/2024/1216/1185007-wren-st-stephens-day-ireland-folklore-traditions-bad-luck/',
			'https://www.allaboutbirds.org/guide/Sedge_Wren/overview',
		],
	});

};

module.exports = {
	getBirdOfTheWeek,
};
