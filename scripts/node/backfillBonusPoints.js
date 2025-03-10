const DB = require("../../server/db");
const { storePoints } = require("../../server/utils/points");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const CURRENT_TIME = new Date();

const SEASON_4_BONUS_POINT_SPECIES = [{
	id: 1013,
	label: 'Posted on X',
	amount: 25,
	users: [
		'0x79e47f12fe6382cfb29e8e7dc05c57b5c04cc814', // paesan
	],
}, {
	id: 1014,
	label: 'Posted on Farcaster',
	amount: 25,
	users: [
		'0xa6c49cf1871c3fbabc0373d4fd2812c4a4fb4683', // myro5
	],
}, {
	id: 1015,
	label: 'Joined Telegram',
	amount: 10,
	users: [
		// MISSING POINTS: tokyo, jamesberg, jibbmoslice, RandomEgg, Tonywithouti,
		// My_name_is_mudd, Basedsuiguru, VENOMDSLAYER, @OxMisan, @Web3majo,
		// @bullionape1914,  oeuk nikon, melanie, @DEGENCOBRA
		'0xdf53adbc2fea827c3ea675d3122bec89ccbc1af4', // arcturus
		'0x47ade238cc739dbce060c572e7393467ed6f0c50', // zksnarky
		'0xdd9c5b8893434da7a4ce0ada32db13d0770a0116', // krakencoke
		'0x79e47f12fe6382cfb29e8e7dc05c57b5c04cc814', // paesan
		'0x8d57ee867c65231e20aead5040a7c489704eb5f6', // thedefifox
		'0x91a0c767e86e832d279faa2b4b9deda28bbb26ce', // millionbithomepage
		'0xf7206b9b6e8d2cf26ca20e6d8afb711b3aa2ef84', // poolguy
		'0xfe35e15be885750d9b2363cbb6abdd57ac9c4c40', // taylor (dotfan)
		'0x4a3398eea08cb632df5c6892e761a593095d85b1', // DORAYAKIKUZU
		'0x9b960bbeb8e62462daadb4e7b763797eb954dc58', // rita
		'0xbe3d70ff3b32357369e0cd86fcb3ac477a5cb682', // kingkeef
		'0x2ba9b84903cd6bf8a0d79722766b74c35313ceed', // livio rivera
		'0x4d5a5f3d5e38f4ce8571e9d03a0814313a85597c', // E
		'0x060813fe30137c5885f95a308dd9a068a4ba7fe8', // tatsuki
		'0xc39225a87bafa3041a7671aeb2be9bea94ee42bf', // Nifty Dog (memgen)
	],
}, {
	id: 1016,
	label: 'Joined Farcaster Channel',
	amount: 10,
	users: [
		'0x585d3ef48e12cb1be6837109b0853afe78b5ebe3', // drytortuga (self)
		'0x2c4291cfd783164971ca39ddecd2def485cf499d', // omer
		'0x17fe7565aa7d86b5392857574a32613de150fcbe', // 6bazinga
		'0xa6c49cf1871c3fbabc0373d4fd2812c4a4fb4683', // myro5
		'0x91eb3b483244cb2d7671b4e6433e7c6008878355', // artgridz
		'0x972955a934de4d0e642d913a22e9cee77386f188', // ogstyle
		'0xba397faae1d5fe10c0356f2e585bef34577ab111', // tanazolam
	],
}, {
	id: 1017,
	label: 'Hit 7 Day Streak',
	amount: 50,
	users: [
		'0x4d389ddfa4984735b6988b2d853522925ee8ec6b', // jbpunke
	],
}, {
	id: 1018,
	label: 'Hit 14 Day Streak',
	amount: 125,
	users: [],
}, {
	id: 1019,
	label: 'Hit 30 Day Streak',
	amount: 300,
	users: [],
}];

// Re-calculate and update points related to bonuses for all users for the current season
(async () => {

	console.log('------------------ BACKFILL BONUS POINTS --------------------');

	// Create a new connection to the database

	const db = new DB();

	try {

		// Build the point results

		const results = {};

		SEASON_4_BONUS_POINT_SPECIES.forEach((species) => {

			species.users.forEach((address) => {

				const parsedAddress = address.toLowerCase();

				if (!results[parsedAddress]) {
					results[parsedAddress] = {};
				}

				results[parsedAddress][species.id] = {
					amount: species.amount,
					bird_id: null,
					timestamp: CURRENT_TIME,
				};

			});

		});

		console.log(results);

		// Store the point results in the database

		await storePoints(db, results);

		// Close the connection to the database

		await db.close();

		console.log('--------------------- DONE -----------------------');

	} catch (error) {
		console.error(error);
	}

})();
