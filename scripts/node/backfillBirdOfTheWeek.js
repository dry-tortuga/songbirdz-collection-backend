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

const newData = [{
	species: 'Bachman\'s Sparrow',
	family: 'New World Sparrows',
	flock: 'Night & Day',
	ids: [3285, 3840],
	facts: [
		'Bachman\'s sparrows are large, elusive songbirds native to the southeastern United States, named after the clergyman John Bachman.',
		'In 1834, John James Audubon named the species after his friend John Bachman, who had hosted him during an expedition in South Carolina.',
		'These sparrows are skilled at evading predators, often seeking refuge in burrows created by gopher tortoises or armadillos.',
		'They prefer habitats such as open pine forests, grassy old fields, and young pine plantations, especially where native grasses cover the ground.',
		'Bachman\'s sparrows spend much of their time on the ground, hopping or running as they search for insects, seeds, and spiders.',
		'The male\'s song begins with a long, clear note followed by a trill, and he may produce a bubbling variation when disturbed or excited.',
		'For their species, they are relatively long-lived—the oldest recorded Bachman\'s sparrow was a male that lived to be 3 years and 11 months old.',
	],
	links: [
		'https://www.allaboutbirds.org/guide/Bachmans_Sparrow/overview',
		'https://landpotential.org/habitat-hub/bachmans-sparrow/',
		'https://www.audubon.org/field-guide/bird/bachmans-sparrow',
	],
}, {
	species: 'Roseate Spoonbill',
	family: 'Herons, Ibis, & Allies',
	flock: 'Picasso Genesis',
	ids: [27, 618, 824],
	facts: [
		'Roseate Spoonbills are large wading birds found in the southeastern United States, the Caribbean, and parts of Central and South America, easily recognized by their bright pink plumage and spoon-shaped bills.',
		'Their name comes from their distinctive flattened bills, which they use to sweep through shallow water to catch small fish, crustaceans, and insects.',
		'The pink coloration of their feathers comes from the carotenoid pigments in the crustaceans they eat, similar to how flamingos get their color.',
		'They inhabit coastal marshes, mangroves, and tidal lagoons, preferring shallow wetlands with plenty of aquatic life.',
		'Roseate Spoonbills often feed in groups, moving their bills side to side through the water to locate prey by touch.',
		'During breeding season, adults display even brighter colors, and they build nests in trees or shrubs near water, usually in colonies with other wading birds.',
		'The oldest known Roseate Spoonbill lived to be over 16 years old, showing their impressive longevity among wading birds.',
	],
	links: [
		'https://cruisecocoa.com/2024/08/01/the-majestic-roseate-spoonbill-everything-you-need-to-know/',
		'https://www.birdorable.com/blog/10-fun-roseate-spoonbill-facts',
	],
}, {
	species: 'Brandt\'s Cormorant',
	family: 'Cormorants & Anhingas',
	flock: 'Hatchlings',
	ids: [7405, 7813, 7907],
	facts: [
		'Brandt\'s Cormorants are large, dark seabirds native to the Pacific Coast of North America, easily recognized by their sleek black plumage and vivid blue throat patch during breeding season.',
		'They were named after the German naturalist J.F. Brandt, who first described the species in the 19th century.',
		'These cormorants are expert divers, plunging from the surface and using their strong legs and webbed feet to chase fish underwater.',
		'They inhabit rocky coastlines, offshore islands, and sea cliffs, often nesting in large colonies near other seabirds.',
		'Brandt\'s Cormorants feed mainly on small schooling fish such as anchovies and rockfish, which they catch during their deep, agile dives.',
		'During breeding season, adults display bright blue skin on their throats and perform courtship displays that include bowing and showing off their vivid colors.',
		'The oldest recorded Brandt\'s Cormorant lived to be nearly 18 years old, demonstrating their longevity among coastal seabirds.',
	],
	links: [
		'https://www.allaboutbirds.org/guide/Brandts_Cormorant/overview',
		'https://www.aquariumofpacific.org/reportcard/info/brandts_cormorant',
	],
}, {
	species: 'Vaux\'s Swift',
	family: 'Swifts',
	flock: 'Night & Day',
	ids: [3366, 3421, 3463],
	facts: [
		'Vaux\'s Swifts are small, agile birds native to western North and Central America, recognized for their cigar-shaped bodies and rapid, fluttering flight.',
		'The species was named after the American naturalist William S. Vaux, a friend of ornithologist John K. Townsend, who first described the bird in the 19th century.',
		'These swifts spend most of their lives in the air, feeding on flying insects and even drinking while in flight.',
		'They inhabit forested regions near rivers and mountains, nesting or roosting in hollow trees, old woodpecker holes, or occasionally in chimneys.',
		'Vaux\'s Swifts are highly social, often gathering in large flocks that migrate together and roost communally in great numbers during migration.',
		'They are capable of unihemispheric slow-wave sleep (USWS), allowing one half of their brain to rest while the other remains awake—an adaptation that helps them stay aloft for long periods.',
		'Their flight is quick and erratic, with constant wingbeats and sharp turns as they pursue airborne insects.',
		'The oldest recorded Vaux\'s Swift lived to be over 6 years old, a remarkable lifespan for such a small aerial bird.',
	],
	links: [
		'https://www.allaboutbirds.org/guide/Vauxs_Swift/overview',
		'https://www.nps.gov/articles/000/vaux-s-swift.htm',
		'https://en.wikipedia.org/wiki/Unihemispheric_slow-wave_sleep',
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
