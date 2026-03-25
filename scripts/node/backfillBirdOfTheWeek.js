const DB = require("../../server/db");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const REQUIRED_FIELDS = ['species', 'family', 'flock', 'ids', 'facts', 'links'];

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

// 01/05/26: White-faced Ibis
// 01/12/26: Snowy Egret
// 01/19/26: Inca Dove
// 01/26/26: Bay-breasted Warbler
// 02/02/26: Hawaiian Duck
// 02/09/26: Phainopepla
// 02/16/26: Curve-billed Thrasher
// 02/23/26: Blackpoll Warbler (DONE)
// 03/02/26: White-faced Whistling-Duck (DONE)
// 03/09/26: African Collared-Dove (DONE)
// 03/16/26: Snow Goose (DONE)
// 03/23/26: White Tern (DONE)
// 03/30/26: Pectoral Sandpiper (DONE)
// 04/06/26: Horned Puffin (DONE)
// 04/13/26: Great Knot (DONE)
// 04/20/26: Eastern Screech-Owl (DONE)
// 04/27/26: Helmeted Guineafowl (DONE)
// 05/04/26: Ruby-throated Hummingbird (DONE)
// 05/11/26: Yellow Rail (DONE)
// 05/18/26: White-rumped Shama (DONE)
// 05/25/26: Sage Thrasher (DONE)
// 06/01/26: Wood Stork (DONE)
// 06/08/26: Red Junglefowl (DONE)
// 06/15/26: Blue Mockingbird (DONE)
// 06/22/26: Whiskered Screech-Owl (DONE)
// 06/29/26: Rufous-crowned Sparrow (DONE)
// 07/06/26: White-tailed Eagle (DONE)
// 07/13/26: Barred Owl (DONE)
// 07/20/26: Ferruginous Hawk (DONE)
// 07/27/26: King Eider (DONE)
// 08/03/26: White-throated Swift (DONE)
// 08/10/26: Plain-capped Starthroat (DONE)
// 08/17/26: Double-crested Cormorant (DONE)
// 08/24/26: Chuck-will's-widow (DONE)
// 08/31/26: Prairie Falcon (DONE)
// 09/07/26: Mexican Jay (DONE)
// 09/14/26: White-winged Dove (DONE)
// 09/21/26: Common Black Hawk (DONE)
// 09/28/26: Bananaquit (DONE)
// 10/05/26: Black-throated Magpie-Jay (DONE)
// 10/12/26: Northern Goshawk (DONE)
// 10/19/26: Bohemian Waxwing (DONE)
// 10/26/26: Gunnison Sage-Grouse (DONE)
// 11/02/26: Lavender Waxbill (DONE)
// 11/09/26: Green-breasted Mango (DONE)
// 11/16/26: Bullock's Oriole (DONE)
// 11/23/26: Crested Caracara (DONE)
// 11/30/26: Black Turnstone (DONE)
// 12/07/26: Common Merganser (DONE)
// 12/14/26: Common Pauraque (DONE)
// 12/21/26: European Starling (DONE)
// 12/28/26: Cassin's Finch (DONE)

/*

{
	species: "",
	family: "",
	flock: "",
	ids: [],
	facts: [
		"",
	],
	links: [
		"",
		"",
		"",
	],
}

*/

const newData = [{
	species: "African Collared-Dove",
	family: "Pigeons & Doves",
	flock: "Final Migration",
	ids: [9785],
	facts: [
		"Native to sub-Saharan Africa but has expanded its range rapidly in recent decades.",
		"Easily recognized by the thin black “collar” on the back of its neck.",
		"Often found around towns and farms rather than deep forests.",
		"Builds simple, sometimes flimsy stick nests in trees or on structures.",
	],
	links: [
		"https://www.livingwithbirds.com/tweetapedia/21-facts-on-collared-dove",
		"https://www.allaboutbirds.org/guide/African_Collared-Dove/overview",
		"https://app.mybirdbuddy.com/compare/african-collared-dove-vs-eurasian-collared-dove",
	],
}, {
	species: "Snow Goose",
	family: "Waterfowl",
	flock: "Fire & Ice",
	ids: [4095, 4117, 4455, 4977],
	facts: [
		"Comes in two color morphs: white and blue, both in the same species.",
		"Migrates thousands of miles between Arctic breeding grounds and southern wintering areas.",
		"Travels in massive, noisy flocks that can number in the tens of thousands.",
		"Feeds by grubbing up roots in wetlands and agricultural fields.",
	],
	links: [
		"https://www.pennlive.com/wildaboutpa/2018/02/15_things_you_may_not_know_abo.html",
		"https://threeriversduckclub.com/content/4-interesting-snow-goose-facts",
	],
}, {
	species: "White Tern",
	family: "Gulls, Terns, & Skimmers",
	flock: "Final Migration",
	ids: [9248, 9629],
	facts: [
		"Also called the “fairy tern” for its pure white feathers and graceful flight.",
		"Lays a single egg directly on a bare tree branch—no nest at all.",
		"Parents carefully balance the egg and chick on the branch.",
		"Found across tropical oceans, often far from land.",
	],
	links: [
		"https://www.inaturalist.org/posts/106093-fun-facts-about-the-white-tern",
		"https://www.discoverwildlife.com/animal-facts/birds/why-do-white-terns-lay-their-eggs-on-branches",
	],
}, {
	species: "Pectoral Sandpiper",
	family: "Shorebirds",
	flock: "Masters of Disguise",
	ids: [8080, 8745],
	facts: [
		"Named for the sharp line separating its streaked chest from its white belly.",
		"Breeds in Arctic tundra but migrates to South America.",
		"Males inflate their chests and make booming sounds during courtship displays.",
		"Often seen probing muddy shores for insects and small invertebrates.",
	],
	links: [
		"https://animalecologyinfocus.com/2021/04/01/blown-away-how-male-pectoral-sandpipers-look-for-their-next-partner/",
		"https://kids.kiddle.co/Pectoral_sandpiper",
	],
}, {
	species: "Horned Puffin",
	family: "Alcids",
	flock: "Fire & Ice",
	ids: [4712, 4813],
	facts: [
		"Named for the small fleshy “horn” above each eye during breeding season.",
		"Breeds on rocky cliffs and islands in the North Pacific.",
		"Uses its colorful bill to carry multiple fish at once.",
		"Excellent swimmer that “flies” underwater with its wings.",
	],
	links: [
		"https://wildboyzphotography.com/puffin/",
		"https://www.allaboutbirds.org/guide/Horned_Puffin/overview",
	],
}, {
	species: "Great Knot",
	family: "Shorebirds",
	flock: "Final Migration",
	ids: [9030, 9727],
	facts: [
		"One of the largest sandpipers in the world.",
		"Migrates along the East Asian–Australasian Flyway.",
		"Feeds on mollusks and crustaceans on tidal mudflats.",
		"Breeds in northeastern Siberia’s Arctic tundra.",
	],
	links: [
		"https://birdlife.org.au/bird-profiles/great-knot/?srsltid=AfmBOopBBiQTwTiqkkGbRPl1GgR1KkI9oL7De2ByAURMRoxDNBZun5xH",
		"https://kids.kiddle.co/Great_knot",
		"https://www.birdsinbackyards.net/species/Calidris-tenuirostris",
	],
}, {
	species: "Eastern Screech-Owl",
	family: "Owls",
	flock: "Picasso Genesis",
	ids: [271],
	facts: [
		"Despite its name, it usually makes soft trills and whinnies rather than screeches.",
		"Comes in gray and reddish color morphs.",
		"Often nests in tree cavities or nest boxes.",
		"Small but fierce predator of insects, rodents, and small birds.",
	],
	links: [
		"https://www.hawkmountain.org/raptors/eastern-screech-owl",
		"https://auduboncnc.org/eastern-screech-owl/",
	],
}, {
	species: "Helmeted Guineafowl",
	family: "Grouse, Quail, & Allies",
	flock: "Final Migration",
	ids: [9728],
	facts: [
		"Recognizable by its bare blue head and helmet-like casque.",
		"Native to Africa but domesticated in many parts of the world.",
		"Travels in noisy flocks that give loud, cackling calls.",
		"Feeds on seeds, insects, and even small reptiles.",
	],
	links: [
		"https://www.wynnstay.co.uk/blog/5-things-you-didnt-know-about-guinea-fowl/",
		"https://www.hoedspruit.co.za/the-helmeted-guineafowl-in-kruger-national-park",
		"https://biodb.com/species/helmeted-guineafowl/",
	],
}, {
	species: "Ruby-throated Hummingbird",
	family: "Hummingbirds",
	flock: "Picasso Genesis",
	ids: [842],
	facts: [
		"Males flash a brilliant red throat patch called a gorget.",
		"Can beat its wings about 50 times per second.",
		"Migrates nonstop across the Gulf of Mexico.",
		"Feeds on nectar and tiny insects for protein.",
	],
	links: [
		"https://www.audubon.org/magazine/10-fun-facts-about-ruby-throated-hummingbird",
		"https://highparknaturecentre.com/10-things-you-did-not-know-about-ruby-throated-hummingbirds/",
		"https://greenwood.wbu.com/botm--ruby-throated-hummingbird",
	],
}, {
	species: "Yellow Rail",
	family: "Rails, Gallinules, & Allies",
	flock: "Night & Day",
	ids: [3364, 3731],
	facts: [
		"A secretive marsh bird rarely seen in the open.",
		"Has buffy yellow streaks that help it blend into grasses.",
		"Often detected by its distinctive clicking call at night.",
		"Prefers wet meadows and shallow marshes.",
	],
	links: [
		"https://www.dnr.state.mn.us/rsg/profile.html?action=elementDetail&selectedElement=ABNME01010",
		"https://www.nwtspeciesatrisk.ca/en/our-species-risk/yellow-rail",
		"https://www.allaboutbirds.org/guide/Yellow_Rail/overview",
	],
}, {
	species: "White-rumped Shama",
	family: "Old World Flycatchers",
	flock: "Final Migration",
	ids: [9664],
	facts: [
		"Famous for its rich, melodious song.",
		"Named for the bright white patch on its rump.",
		"Native to South and Southeast Asia.",
		"Often kept historically as a cage bird for its singing ability.",
	],
	links: [
		"https://kids.kiddle.co/White-rumped_shama",
		"https://www.lpzoo.org/animals/white-rumped-shama/",
	],
}, {
	species: "Sage Thrasher",
	family: "Catbirds, Mockingbirds, & Thrashers",
	flock: "Final Migration",
	ids: [9844, 9901],
	facts: [
		"A master of camouflage in sagebrush habitats.",
		"Known for long, varied songs during breeding season.",
		"Migrates between western North America and Mexico.",
		"Builds nests low in shrubs.",
	],
	links: [
		"https://www.audubon.org/art/birds-america/mountain-mocking-bird-and-varied-thrush",
		"https://www.deschuteslandtrust.org/news/blog/2020-blog-posts/sage-thrasher-central-oregon-birds",
		"https://www.allaboutbirds.org/guide/Sage_Thrasher/overview",
	],
}, {
	species: "Wood Stork",
	family: "Storks",
	flock: "Final Migration",
	ids: [9204],
	facts: [
		"The only stork species that breeds in the United States.",
		"Uses a unique foot-stirring technique to catch fish.",
		"Has a bald, scaly head adapted for feeding in water.",
		"Soars on thermals like vultures.",
	],
	links: [
		"https://avianreport.com/facts-about-wood-storks/",
		"https://houstonaudubon.org/programs/birding/gallery/wood-stork.html",
		"https://www.birdfy.com/blogs/blogs/a-comprehensive-guide-about-wood-stork",
	],
}, {
	species: "Red Junglefowl",
	family: "Grouse, Quail, & Allies",
	flock: "Fire & Ice",
	ids: [4744, 4746, 4877],
	facts: [
		"The wild ancestor of most domestic chickens.",
		"Native to South and Southeast Asia.",
		"Males have bright red combs and long, arched tail feathers.",
		"Roosts in trees to avoid ground predators.",
	],
	links: [
		"https://www.allaboutbirds.org/guide/Red_Junglefowl/id",
		"https://animalia.bio/red-junglefowl",
	],
}, {
	species: "Blue Mockingbird",
	family: "Catbirds, Mockingbirds, & Thrashers",
	flock: "Night & Day",
	ids: [3411, 3719, 3752],
	facts: [
		"Sports deep blue plumage with a darker face mask.",
		"Endemic to central Mexico.",
		"Often travels in small family groups.",
		"Has a rich, warbling song with varied notes.",
	],
	links: [
		"https://birdsoftheworld.org/bow/species/blumoc/cur/introduction",
		"https://holisticbirding.wordpress.com/blue-mockingbird-melanotis-caerulescens/",
	],
}, {
	species: "Whiskered Screech-Owl",
	family: "Owls",
	flock: "Night & Day",
	ids: [3383],
	facts: [
		"Named for the bristle-like feathers around its bill.",
		"Found in mountainous forests of the southwestern U.S. and Mexico.",
		"Nests in tree cavities or old woodpecker holes.",
		"Its soft trills blend into nighttime forest sounds.",
	],
	links: [
		"https://www.owlresearchinstitute.org/whiskered-screech-owl",
		"https://hawkwatch.org/raptor-id/raptor-id-fact-sheets/whiskered-screech-owl/",
	],
}, {
	species: "Rufous-crowned Sparrow",
	family: "New World Sparrows",
	flock: "Fire & Ice",
	ids: [4912, 4925, 4962],
	facts: [
		"Recognized by its rusty-colored crown stripe.",
		"Prefers dry, rocky hillsides and grasslands.",
		"Sings a clear, musical trill from exposed perches.",
		"Often runs rather than flies when startled.",
	],
	links: [
		"https://www.nps.gov/places/000/rufous-crowned-sparrow.htm",
		"https://www.allaboutbirds.org/guide/Rufous-crowned_Sparrow/overview",
	],
}, {
	species: "White-tailed Eagle",
	family: "Vultures, Hawks, & Allies",
	flock: "Predator & Prey",
	ids: [5776, 5147],
	facts: [
		"Also known as the white-tailed sea eagle.",
		"One of the largest birds of prey in Europe.",
		"Has a massive wingspan that can exceed 8 feet.",
		"Feeds mainly on fish and waterbirds, often stealing prey from other birds.",
	],
	links: [
		"https://peregrinefund.org/explore-raptors-species/eagles/white-tailed-sea-eagle",
		"https://www.scotsmagazine.com/articles/fascinating-facts-sea-eagles/",
	],
}, {
	species: "Barred Owl",
	family: "Owls",
	flock: "Picasso Genesis",
	ids: [244, 599, 890],
	facts: [
		"Famous for its call that sounds like “Who cooks for you? Who cooks for you all?”",
		"Has striking dark eyes instead of the yellow eyes common in many owls.",
		"Adaptable and found in forests, swamps, and even suburban areas.",
		"Will hunt during the day more often than many other owl species.",
	],
	links: [
		"https://www.audubon.org/magazine/10-fun-facts-about-barred-owl",
		"https://www.chattnaturecenter.org/visit/experience/wildlife/animal-facts/barred-owl/",
	],
}, {
	species: "Ferruginous Hawk",
	family: "Vultures, Hawks, & Allies",
	flock: "Predator & Prey",
	ids: [5126, 5220, 5741],
	facts: [
		"The largest hawk in North America.",
		"Named for its rusty (ferruginous) colored legs and back.",
		"Prefers open grasslands and prairies.",
		"Builds large stick nests on cliffs, trees, or even the ground.",
	],
	links: [
		"https://www.allaboutbirds.org/guide/Ferruginous_Hawk/id",
		"https://naturecanada.ca/discover-nature/endangered-species/ferruginous-hawk/",
	],
}, {
	species: "King Eider",
	family: "Waterfowl",
	flock: "Deep Blue",
	ids: [1077],
	facts: [
		"Males have a colorful head with a bright orange knob on the bill.",
		"Breeds in Arctic tundra and winters in cold northern seas.",
		"Expert diver that feeds on mollusks and crustaceans.",
		"Often gathers in large flocks along rocky coastlines.",
	],
	links: [
		"https://arcticwildlifeknowledge.com/king-eider-facts/",
		"https://www.allaboutbirds.org/guide/King_Eider/overview",
	],
}, {
	species: "White-throated Swift",
	family: "Swifts",
	flock: "Small & Mighty",
	ids: [2711, 2863, 2887],
	facts: [
		"Spends most of its life in the air, even feeding and drinking on the wing.",
		"Recognizable by its white throat and belly patch.",
		"Nests on cliff faces and sometimes tall buildings.",
		"Can fly at very high speeds while chasing insects.",
	],
	links: [
		"https://www.allaboutbirds.org/guide/White-throated_Swift/overview",
		"https://birdweb.org/Birdweb/bird/white-throated_swift",
		"https://www.scienceabc.com/nature/animals/how-do-birds-sleep-during-migration.html",
	],
}, {
	species: "Plain-capped Starthroat",
	family: "Hummingbirds",
	flock: "Fire & Ice",
	ids: [4381, 4466, 4538, 4586],
	facts: [
		"A large hummingbird with a long, slightly curved bill.",
		"Males have a bright, iridescent throat patch.",
		"Found from Mexico to Central America.",
		"Often visits flowering shrubs and garden feeders.",
	],
	links: [
		"https://earthlife.net/plain-capped-star-throat-hummingbirds/",
		"https://birdsoftheworld.org/bow/species/plcsta/cur/introduction",
	],
}, {
	species: "Double-crested Cormorant",
	family: "Cormorants & Anhingas",
	flock: "Deep Blue",
	ids: [1237, 1988],
	facts: [
		"Named for the two small tufts that appear during breeding season.",
		"Often seen perched with wings spread to dry.",
		"Excellent diver that catches fish underwater.",
		"Nests in large colonies in trees or on the ground.",
	],
	links: [
		"https://www.allaboutbirds.org/guide/Double-crested_Cormorant/overview",
		"https://www.estesparknews.com/estes_valley_spotlight/article_7df73c72-26c7-11ec-a6f5-a767ce7a4832.html",
	],
}, {
	species: "Chuck-will's-widow",
	family: "Nightjars",
	flock: "Picasso Genesis",
	ids: [555, 914],
	facts: [
		"Named for its repetitive, haunting nighttime call.",
		"Active mostly at dusk and dawn.",
		"Camouflaged plumage helps it blend into leaf litter.",
		"Feeds on large flying insects caught in midair.",
	],
	links: [
		"https://www.allaboutbirds.org/guide/Chuck-wills-widow/overview",
		"https://www.audubon.org/field-guide/bird/chuck-wills-widow",
	],
}, {
	species: "Prairie Falcon",
	family: "Falcons & Caracaras",
	flock: "Predator & Prey",
	ids: [5352, 5665, 5803, 5830],
	facts: [
		"A powerful falcon of open deserts and grasslands.",
		"Often hunts ground squirrels and small birds.",
		"Nests on cliff ledges rather than building its own nest.",
		"Known for fast, low flights over open terrain.",
	],
	links: [
		"https://www.allaboutbirds.org/guide/Prairie_Falcon/overview",
		"https://hawkwatch.org/raptor-id/raptor-id-fact-sheets/prairie-falcon/",
	],
}, {
	species: "Mexican Jay",
	family: "Jays, Magpies, Crows, & Ravens",
	flock: "Fire & Ice",
	ids: [4776, 4937],
	facts: [
		"A social bird that lives in cooperative family groups.",
		"Has bright blue plumage with a pale gray back.",
		"Found in mountain forests of the southwestern U.S. and Mexico.",
		"Often caches acorns and other food for later.",
	],
	links: [
		"https://www.audubon.org/field-guide/bird/mexican-jay",
		"https://animalia.bio/mexican-jay",
		"https://www.allaboutbirds.org/guide/Mexican_Jay/overview",
	],
}, {
	species: "White-winged Dove",
	family: "Pigeons & Doves",
	flock: "Lovebirds",
	ids: [6341, 6454, 6501, 6522],
	facts: [
		"Named for the bold white stripe visible in flight.",
		"Common in deserts and urban areas of the Southwest.",
		"Feeds heavily on seeds, fruits, and grains.",
		"Its soft cooing call is a familiar summer sound.",
	],
	links: [
		"https://celebrateurbanbirds.org/birds/white-winged-dove/",
		"https://www.audubon.org/field-guide/bird/white-winged-dove",
		"https://www.allaboutbirds.org/guide/White-winged_Dove/overview",
	],
}, {
	species: "Common Black Hawk",
	family: "Vultures, Hawks, & Allies",
	flock: "Predator & Prey",
	ids: [5433, 5495, 5877],
	facts: [
		"Often found near rivers and wetlands.",
		"Feeds on fish, amphibians, and crustaceans.",
		"Has broad wings and a short tail with a white band.",
		"Nests in tall trees near water.",
	],
	links: [
		"https://www.audubon.org/field-guide/bird/common-black-hawk",
		"https://animaldiversity.org/accounts/Buteogallus_anthracinus/",
		"https://hawkwatch.org/raptor-id/raptor-id-fact-sheets/common-black-hawk/",
	],
}, {
	species: "Bananaquit",
	family: "Tanagers & Allies",
	flock: "Fire & Ice",
	ids: [4123, 4502, 4691],
	facts: [
		"A tiny, energetic bird of the Caribbean and Central America.",
		"Has a curved bill perfect for sipping nectar.",
		"Also eats fruit and small insects.",
		"Builds a domed nest with a side entrance.",
	],
	links: [
		"https://www.allaboutbirds.org/guide/Bananaquit/overview",
		"https://animalia.bio/bananaquit",
		"https://www.anywhere.com/flora-fauna/bird/bananaquit",
	],
}, {
	species: "Black-throated Magpie-Jay",
	family: "Jays, Magpies, Crows, & Ravens",
	flock: "Lovebirds",
	ids: [6521, 6974],
	facts: [
		"Known for its extremely long tail, often as long as its body.",
		"Has striking blue-and-white plumage with a bold black throat.",
		"Highly social and often travels in noisy family groups.",
		"Native to northwestern Mexico’s dry forests.",
	],
	links: [
		"https://animalia.bio/black-throated-magpie-jay",
		"https://datazone.birdlife.org/species/factsheet/black-throated-magpie-jay-cyanocorax-colliei",
		"https://www.phoenixzoo.org/explore/animals/black-throated-magpie-jay/",
	],
}, {
	species: "Northern Goshawk",
	family: "Vultures, Hawks, & Allies",
	flock: "Predator & Prey",
	ids: [5197, 5341, 5875],
	facts: [
		"A powerful forest hawk known for its speed and agility.",
		"Has bold white “eyebrow” stripes over piercing red eyes in adults.",
		"Preys on birds and mammals, including grouse and squirrels.",
		"Females are significantly larger than males.",
	],
	links: [
		"https://peregrinefund.org/explore-raptors-species/hawks/northern-goshawk",
		"https://www.hawkmountain.org/raptors/northern-goshawk",
	],
}, {
	species: "Bohemian Waxwing",
	family: "Waxwings",
	flock: "Fire & Ice",
	ids: [4478, 4723, 4986],
	facts: [
		"Named for its wandering, nomadic winter movements.",
		"Recognizable by silky gray plumage and red waxy wing tips.",
		"Feeds heavily on berries during winter.",
		"Can become tipsy from eating fermented fruit.",
	],
	links: [
		"https://www.allaboutbirds.org/guide/Bohemian_Waxwing/overview",
		"https://www.audubon.org/field-guide/bird/bohemian-waxwing",
		"https://flatheadaudubon.org/bird-of-the-month/bohemian-waxwing/",
	],
}, {
	species: "Gunnison Sage-Grouse",
	family: "Grouse, Quail, & Allies",
	flock: "Lovebirds",
	ids: [6122, 6843, 6963],
	facts: [
		"Found only in southwestern Colorado and southeastern Utah.",
		"Males perform elaborate strutting displays on leks.",
		"Has spiky tail feathers and inflatable yellow air sacs.",
		"Relies heavily on sagebrush for food and shelter.",
	],
	links: [
		"https://www.allaboutbirds.org/guide/Gunnison_Sage-Grouse/overview",
		"https://cpw.state.co.us/species/gunnison-sage-grouse",
	],
}, {
	species: "Lavender Waxbill",
	family: "Estrildids",
	flock: "Lovebirds",
	ids: [6453, 6650],
	facts: [
		"A small finch with soft gray-lavender plumage.",
		"Native to eastern and southern Africa.",
		"Often seen in pairs or small flocks in grasslands.",
		"Builds a neat, ball-shaped nest from grasses.",
	],
	links: [
		"https://animalia.bio/lavender-waxbill",
		"https://birdfact.com/birds/lavender-waxbill",
		"https://hawaiiislandkauai.com/kauai-birds/lavender-waxbill/",
	],
}, {
	species: "Green-breasted Mango",
	family: "Hummingbirds",
	flock: "Predator & Prey",
	ids: [5257, 5287, 5381, 5548],
	facts: [
		"A large hummingbird with a slightly curved bill.",
		"Males have shimmering green underparts and dark central stripe.",
		"Found from Mexico to northern South America.",
		"Defends flowering trees aggressively from other hummingbirds.",
	],
	links: [
		"https://ebird.org/species/gnbman",
		"https://datazone.birdlife.org/species/factsheet/green-breasted-mango-anthracothorax-prevostii",
	],
}, {
	species: "Bullock's Oriole",
	family: "Blackbirds",
	flock: "Lovebirds",
	ids: [6407, 6600],
	facts: [
		"Males are bright orange with a bold black eye line.",
		"Weaves intricate hanging nests from plant fibers.",
		"Breeds in western North America.",
		"Feeds on insects, fruit, and nectar.",
	],
	links: [
		"https://malheurfriends.org/2023/05/species-spotlight-bullocks-oriole/",
		"https://www.allaboutbirds.org/guide/Bullocks_Oriole/overview",
		"https://www.pennington.com/all-products/wild-bird/resources/orioles",
		"https://malheurfriends.org/2023/05/species-spotlight-bullocks-oriole/",
	],
}, {
	species: "Crested Caracara",
	family: "Falcons & Caracaras",
	flock: "Fire & Ice",
	ids: [4514],
	facts: [
		"A falcon that often walks on the ground like a vulture.",
		"Has a bold black cap and bright orange facial skin.",
		"Feeds on carrion as well as live prey.",
		"Common in open grasslands and ranchlands.",
	],
	links: [
		"https://www.sariverauthority.org/blog-news/south-texas-natives-crested-caracara/",
		"https://travisaudubon.org/murmurations/bird-of-the-week-crested-caracara-2",
	],
}, {
	species: "Black Turnstone",
	family: "Shorebirds",
	flock: "Deep Blue",
	ids: [1325],
	facts: [
		"Named for its habit of flipping over stones to find food.",
		"Breeds in Alaska and winters along rocky Pacific coasts.",
		"Has dark plumage that blends into rocky shorelines.",
		"Feeds on insects, crustaceans, and small marine creatures.",
	],
	links: [
		"https://www.bird.bot/guide/black-turnstone",
		"https://softschools.com/facts/animals/black_turnstone_facts/2154/#google_vignette",
		"https://www.audubon.org/field-guide/bird/black-turnstone",
	],
}, {
	species: "Common Merganser",
	family: "Waterfowl",
	flock: "Picasso Genesis",
	ids: [193],
	facts: [
		"A large duck with a long, thin, serrated bill for catching fish.",
		"Males have a glossy dark green head and white body.",
		"Nests in tree cavities near rivers and lakes.",
		"Chicks leave the nest shortly after hatching and head to water.",
	],
	links: [
		"https://www.estesparknews.com/estes_valley_spotlight/article_ed9eb4e8-97e7-11eb-b3f7-87a54e642d43.html",
		"https://flatheadaudubon.org/bird-of-the-month/the-common-merganser/",
	],
}, {
	species: "Common Pauraque",
	family: "Nightjars",
	flock: "Picasso Genesis",
	ids: [306],
	facts: [
		"A nocturnal bird with excellent camouflage.",
		"Often rests directly on roads or open ground at night.",
		"Feeds on moths and other flying insects.",
		"Its call is a repetitive, rolling whistle.",
	],
	links: [
		"https://www.audubon.org/field-guide/bird/common-pauraque",
		"https://reflectionsofthenaturalworld.com/2024/07/10/common-pauraque/",
		"https://birdsoftheworld.org/bow/species/compau/cur/introduction",
	],
}, {
	species: "European Starling",
	family: "Starlings & Mynas",
	flock: "Picasso Genesis",
	ids: [936],
	facts: [
		"Introduced to North America in the 1890s.",
		"Known for forming massive, swirling flocks called murmurations.",
		"Has glossy, iridescent plumage with speckles in winter.",
		"An excellent mimic of other birds and sounds.",
	],
	links: [
		"https://www.estesparknews.com/estes_valley_spotlight/article_6e5ad65c-6e43-11ec-a612-db497a08c952.html",
		"https://www.allaboutbirds.org/guide/European_Starling/overview",
		"https://www.lyricbirdfood.com/birding-hub/behavior/4-things-you-may-not-know-about-the-european-starling/",
	],
}, {
	species: "Cassin's Finch",
	family: "Finches, Euphonias, & Allies",
	flock: "Picasso Genesis",
	ids: [762],
	facts: [
		"Males have a rosy-red crown and face.",
		"Breeds in mountain forests of western North America.",
		"Feeds on seeds, especially from conifer trees.",
		"Has a sweet, warbling song.",
	],
	links: [
		"https://www.allaboutbirds.org/guide/Cassins_Finch/overview",
		"https://www.bioexplorer.net/animals/birds/cassins-finch/",
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
