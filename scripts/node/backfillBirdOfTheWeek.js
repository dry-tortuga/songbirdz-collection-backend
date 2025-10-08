const DB = require("../../server/db");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const REQUIRED_FIELDS = ['species', 'family', 'flock', 'ids', 'facts', 'links'];

// 10/06/25: Sedge Wren
// 10/13/25: Common Black Hawk
// 10/20/25: White-crowned Pigeon
// 10/27/25: Red-shouldered Hawk
// 11/03/25: Northern Saw-whet Owl

const newData = [{
	species: 'White-crowned Pigeon',
	family: 'Pigeons & Doves',
	flock: 'Final Migration',
	ids: [9116, 9293, 9949],
	facts: [
		'The name "pigeon" means a young dove and is derived from Old French, which in turn is based on Latin. Doves and pigeons are in the same biological family, "Columbidae", so it makes sense.  They are similar, with doves being smaller than pigeons.',
		'I feel like pigeons have always gotten a bum rap, perceived as a nuisance or dirty birds. Perhaps that is anecdotal and due to my proximity to New York City.  I definitely shared those sentiments earlier in my life. However, now with my growing love and understanding of not just birds, but all animals, that has changed.  If you know someone who harbors similar feelings towards Pigeons, perhaps the beuatiful White-crowned Pigeon will help sway their opinion. ',
		'The White-crowned Pigeon is a strong flyer, which it relies on to make its daily commutes between their roosting sites and food sources, often over water for those that have island homes.  They\'re capable of eating the fruits of the poisonwood tree, which - as you may have guessed - is toxic. ',
		'White-crowned Pigeons - both male and female - produce crop milk to feed their young and store it in their crop, an expandable pouch in their throat. Another trait they share with doves.',
		'So, if you see a pigeon today, be sure to give it a smile. They deserve it after being pigeonholed as a nuisance and dirty bird for so long by people like me.',
	],
	links: [
		'https://www.etymonline.com/word/pigeon',
		'https://www.allaboutbirds.org/guide/White-crowned_Pigeon/overview',
		'https://www.birdorable.com/blog/bird-term-crop',
		'https://kids.kiddle.co/White-crowned_pigeon',
	],
}, {
	species: 'Red-shouldered Hawk',
	family: 'Vultures, Hawks, & Allies',
	flock: 'Picasso Genesis',
	ids: [160, 280, 557],
	facts: [
		'Red-shouldered Hawks and Red-tail Hawks compete for nesting sites, which favors the latter due to their size advantage. ',
		'While they tend to be secretive, during courtship, this is one noisy hawk with calls that can be heard miles away. The Blue Jays will mimic the call as a defense mechanism to scare away predators, a phenomenon known as acoustic mimicry. And yes, they also fly down for a short distance during their courtship ritual. ',
	],
	links: [
		'https://www.hawkmountain.org/raptors/red-shouldered-hawk',
		'https://www.allaboutbirds.org/guide/Red-shouldered_Hawk/overview',
	],
}, {
	species: "Northern Saw-whet Owl",
	family: "Owls",
	flock: "Predator & Prey",
	ids: [5123, 5363, 5470],
	facts: [
		'The Northern Saw-Whet Owl is a fierce predator, despite being under a foot tall, feeding mostly on mice, voles, small birds, and insects. It\'s not the smallest owl in North America, that goes to the Elf Owl (4-5.5 inches), with the Pygmy Owl and Flamulated Owl only 0.5-1 inch taller.',
		'They\'ll catch an abundant amount of prey to stockpile in areas outside the nest - like tree holes - for later use. In the winter, the stored food may freeze, requiring the owl to thaw it by resting on it after retrieving it from its hiding places.',
		'"Saw-Whet" was a name given to the owl by settlers which thought its call sounded like a saw being sharpened on a whetted stone. Later on, John James Audubon formally documented this in "Birds of America", which popularized it and the rest is history. Head to Songbirdz and give it a listen.',
	],
	links: [
		'https://centerofthewest.org/2016/06/08/my-favorite-interesting-facts-about-northern-saw-whet-owls/',
		'https://edmonton.wbu.com/northern-saw-whet-owl',
		'https://www.allaboutbirds.org/guide/Northern_Saw-whet_Owl/overview',
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
