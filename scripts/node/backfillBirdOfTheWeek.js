const DB = require("../../server/db");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const REQUIRED_FIELDS = ['species', 'family', 'flock', 'ids', 'facts', 'links'];

// Sourced from bookmarked posts from April 1st 2025 onwards...

// 10/06/25: Sedge Wren
// 10/13/25: Common Black Hawk
// 10/20/25: White-crowned Pigeon
// 10/27/25: Red-shouldered Hawk
// 11/03/25: Northern Saw-whet Owl
// 11/10/25: Bachman's Sparrow
// 11/17/25: Roseate Spoonbill
// 11/24/25: Brandt's Cormorant
// 12/01/25: Vaux's Swift
// 12/08/25: Greater Yellowlegs
// 12/15/25: Steller's Jay
// 12/22/25: Mexican Whip-poor-will
// 12/29/25: Pacific Golden-Plover
// 01/05/25: White-faced Ibis
// 01/12/25: Snowy Egret

const newData = [{
	species: 'Greater Yellowlegs',
	family: 'Shorebirds',
	flock: 'Hatchlings',
	ids: [7041, 7701, 7880],
	facts: [
		"Greater Yellowlegs are known for their loud, piercing 'tew-tew-tew' alarm calls.",
		"They have long, bright yellow legs that make them easy to identify.",
		"These birds are skilled hunters, often chasing fish and insects through shallow water.",
		"They migrate long distances, traveling from North America to Central and South America.",
		"Greater Yellowlegs sometimes perform a bobbing or teetering motion while foraging.",
		"They are sandpipers but larger and more robust than many of their relatives.",
		"Their nests are usually simple ground scrapes lined with leaves and moss.",
		"Despite their size, they can be surprisingly agile in flight with rapid wingbeats."
	],
	links: [
		'https://www.sacramentoaudubon.org/kids-corner/meet-the-greater-yellowlegs',
		'https://www.allaboutbirds.org/guide/Greater_Yellowlegs/id',
		'https://cottagelife.com/outdoors/wild-profile-meet-the-greater-yellowlegs/',
	],
}, {
	species: 'Steller\'s Jay',
	family: 'Jays, Magpies, Crows, & Ravens',
	flock: 'Picasso Genesis',
	ids: [108, 470],
	facts: [
		"Steller's Jays are known for their bold personalities and loud, varied calls.",
		"They have striking blue bodies with a black crest on their heads.",
		"These jays are excellent mimics and can imitate other birds, animals, and even machinery.",
		"They often cache food like nuts and seeds to eat later.",
		"Steller's Jays are the only crested jay found west of the Rocky Mountains.",
		"They are highly curious and frequently visit campsites and picnic areas.",
		"Their diet is diverse, ranging from insects and berries to small animals and human food scraps.",
		"Pairs often stay together year-round and cooperate in raising young."
	],
	links: [
		'https://www.estesparknews.com/estes_valley_spotlight/article_fff5e290-24fd-11eb-b830-eb7957826f4f.html',
		'https://ridgefieldfriends.org/species-spotlight-stellers-jay/',
	],
}, {
	species: 'Mexican Whip-poor-will',
	family: 'Nightjars',
	flock: 'Masters of Disguise',
	ids: [8303, 8476, 8967],
	facts: [
		"The Mexican Whip-poor-will is a nocturnal bird known for its rhythmic, repetitive nighttime call.",
		"It belongs to the nightjar family, which is famous for excellent camouflage.",
		"By day, it rests motionless on the forest floor or low branches, blending perfectly with leaf litter.",
		"Its wide mouth helps it catch flying insects during acrobatic nighttime flights.",
		"Unlike many birds, it doesn’t build a traditional nest, eggs are laid directly on the ground.",
		"Its plumage varies regionally, helping it match local habitats for better concealment.",
		"The species is closely related to the Eastern Whip-poor-will but lives primarily in Mexico and parts of Central America.",
		"Males often sing persistently during breeding season, especially on moonlit nights."
	],
	links: [
		'https://www.allaboutbirds.org/guide/Mexican_Whip-poor-will/overview',
		'https://www.discoverwildlife.com/animal-facts/animals-who-sound-like-their-names',
		'https://ccbbirds.org/2010/07/10/mexican-whip-poor-will-monitoring/',
	],
}, {
	species: 'Pacific Golden-Plover',
	family: 'Shorebirds',
	flock: 'Final Migration',
	ids: [9985],
	facts: [
		"Pacific Golden-Plovers are famous long-distance migrants, sometimes flying nonstop for thousands of miles.",
		"They breed in the Arctic tundra and winter in places as far as Hawaii, Australia, and Southeast Asia.",
		"In breeding season, adults develop striking black faces and bellies with golden speckling on their backs.",
		"They are known for their distinctive, flute-like whistled calls during flight.",
		"These plovers often return to the same wintering grounds year after year with remarkable accuracy.",
		"They forage by quickly running and pausing to pick insects, worms, and small crustaceans.",
		"During migration, they can reach impressive speeds thanks to strong, direct flight.",
		"Their golden-spotted plumage provides excellent camouflage in both tundra and coastal habitats."
	],
	links: [
		'https://www.allaboutbirds.org/guide/Pacific_Golden-Plover/overview',
		'https://kids.kiddle.co/Pacific_golden_plover',
		'https://a-z-animals.com/blog/interesting-facts-about-plovers/',
	],
}, {
	species: 'White-faced Ibis',
	family: 'Shorebirds',
	flock: 'Final Migration',
	ids: [9282],
	facts: [
		"The White-faced Ibis has a long, down-curved bill perfect for probing mud for food.",
		"Its plumage appears dark at a distance but shines with iridescent greens, purples, and bronzes up close.",
		"Adults have a distinctive white border around the face during breeding season.",
		"They often forage in groups, stirring up insects and crustaceans in shallow wetlands.",
		"White-faced Ibises are strong fliers and migrate in V-shaped flocks.",
		"Their diet includes insects, snails, small crustaceans, and occasionally small frogs.",
		"They typically nest in colonies, often alongside herons and other wading birds.",
		"These ibises are highly dependent on healthy wetland habitats for feeding and breeding."
	],
	links: [
		'https://www.tn.gov/twra/wildlife/birds/waterbirds/white-faced-ibis.html',
		'https://www.instagram.com/p/DJef__xSSeV/?hl=en',
	],
}, {
	species: 'Snowy Egret',
	family: 'Herons, Ibis, & Allies',
	flock: 'Picasso Genesis',
	ids: [538],
	facts: [
		"Snowy Egrets are known for their bright yellow feet, often described as looking like they’re wearing golden slippers.",
		"They use their flashy feet to stir up fish while hunting in shallow water.",
		"Their plumage is entirely white, with elegant lacy plumes during breeding season.",
		"Snowy Egrets were once heavily hunted for their decorative feathers, leading to major conservation efforts.",
		"They have a sharp, black bill and contrasting black legs.",
		"These egrets are agile hunters, using quick darting movements to catch fish, insects, and crustaceans.",
		"They often feed in mixed flocks with other herons and wading birds.",
		"Snowy Egrets give soft, raspy calls, especially around breeding colonies."
	],
	links: [
		'https://www.allaboutbirds.org/guide/Snowy_Egret/lifehistory',
		'https://portal.ct.gov/deep/wildlife/fact-sheets/snowy-egret',
		'https://www.estesparknews.com/estes_valley_spotlight/article_739956d8-bb4c-11ec-9a5e-db8013819969.html',
	],
}];

(async () => {

	console.log("---------- Adding new bird of the week entries ----------");

	// Create a new connection to the database
	const db = new DB();

	try {

		// Connect to the "songbirdz" database and access the collection
		const database = db.client.db("songbirdz");
		const birds = database.collection("bird-of-the-week");

		// Find the entry with the maximum idx value
		let lastEntry = await birds.findOne({}, { sort: { idx: -1 } });

		let currentIdx = lastEntry ? lastEntry.idx + 1 : 1;

		for (let i = 0; i < newData.length; i++) {

			const birdData = newData[i];

			// Validate required fields
			for (const field of REQUIRED_FIELDS) {
				if (!birdData.hasOwnProperty(field)) {
					throw new Error(`Missing required field: ${field}`);
				}
			}

			// Create the new entry with the incremented idx
			const newBirdEntry = {
				...birdData,
				idx: currentIdx,
				active: false, // New entries are inactive by default
			};

			// Insert the new entry
			const result = await birds.insertOne(newBirdEntry);

			console.log(`Successfully added bird entry with idx: ${currentIdx}`);
			console.log(`Inserted document ID: ${result.insertedId}`);

			// Calculate the next idx
			currentIdx++;

		}

	} catch (error) {

		console.error("Error adding bird entry:", error);
		throw error;

	} finally {

		// Close the database connection
		await db.client.close();

	}

})();
