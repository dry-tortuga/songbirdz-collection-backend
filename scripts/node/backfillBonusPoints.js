const DB = require("../../server/db");
const { storePoints } = require("../../server/utils/points");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const CURRENT_TIME = new Date();

const SEASON_8_BONUS_POINT_SPECIES = [{
	id: 1050,
	label: 'Posted on X',
	amount: 25,
	users: [
		'0x79e47f12fe6382cfb29e8e7dc05c57b5c04cc814', // paesan
	],
}, {
	id: 1051,
	label: 'Posted on Farcaster',
	amount: 25,
	users: [

	],
}, {
	id: 1052,
	label: 'Joined Telegram',
	amount: 10,
	users: [
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
		'0x75521de871eea2f188a45e1a232bb6794600ebc6', // abrahamdomenick.base.eth
		'0xaaa87024aa2fd6e816161cc2554f47a5256bb57d', // GlenCanete
		'0x4342cf54d72cefed89898b0c6513201f9917ea9b', // cryptosensei
		'0xb8addea803817fdbf5e36875ddaf9016d8e267cd', // Fgallagah3er
		'0x8290f8f39615b803ee2b200534d3e5904a9b8ea3', // DopD
		'0xef8a43bd9a093a562240bf43faabc74900e23284', // gojo_satoru
		'0x09087fd95c1fc7908a1cb2a9817ab97a8ce5e21f', // osthelka
		'0xa32fc2c4e09e71ec3a104f74ce4651117b4a90b7', // chewbs.base.eth
		'0x91eb3b483244cb2d7671b4e6433e7c6008878355', // dabus.base.eth
		'0x8030778eb83a4f6111bf600159d29b385478c443', // xPoli
		'0x8ba0d7704df6a610f4ce9937d31e0bbc19717311', // asendic.base.eth
		'0x0000000000c2d145a2526bd8c716263bfebe1a72', // SBMweb3
		'0x14b39a23288de637f5115bee1801b9443bd3765b', // jozzymentorz
		'0x1796d7addeecb301692b0f16b19fd209af57ac31', // mackenzie
		'0x4975eee83496c9c3df957c3196b0fcfc91f80c24', // riotffx
		'0xbf9aea2f77059450f4de6c661dbeb3ef926d633d', // IMIDGIEI
		'0x91c2232f8eab20b21aa95c325aaf9aad639ff486', // w3core
		'0x4d389ddfa4984735b6988b2d853522925ee8ec6b', // jpunke
		'0x6989e6507dac1376502a5639e01259a778db35de', // spudnik
		'0x2dc85944fd65b8c89cfdd76d81fc670595ee2bf0', // justforfreedom
		'0x2dc85944fd65b8c89cfdd76d81fc670595ee2bf0', // whalestacking
		'0x70faa7333f352f74452afc24156f171100a0a8ab', // logonaut
		'0xef4993567ec1df8aec7beba836135efb0652c2ef', // turtles
		'0xd4b896413742ea782e3a9f1108171f5bb4d9dbaa', // leosharkpark
		'0x0de101737fafd0eb7cf0c986a1fc66137f1ece6f', // jimbey
		'0x211b25a4ed2cb5bbf8c36cc7872a13a1d00ca840', // great uxie ovey (nobodythere5)
		'0x6a5d26288b3463e9fb9a18eb0a5b7960f2d46790', // itsverchi
		'0xa3e17ca80549c16cc850d37acee1a02c45736f68', // mhall0693
		'0x1dff91e932184fc80a0c65894bb4bf3f3067d001', // skurring,
	],
}, {
	id: 1054,
	label: 'Hit 7 Day Streak',
	amount: 50,
	users: [],
}, {
	id: 1055,
	label: 'Hit 14 Day Streak',
	amount: 125,
	users: [],
}, {
	id: 1056,
	label: 'Hit 30 Day Streak',
	amount: 300,
	users: [],
}, {
	id: 1057,
	label: 'Hit 75 Day Streak',
	amount: 1000,
	users: [],
}, {
	id: 1058,
	label: 'PFP on X',
	amount: 50,
	users: [
		'0x79e47f12fe6382cfb29e8e7dc05c57b5c04cc814', // paesan
		'0x4d389ddfa4984735b6988b2d853522925ee8ec6b', // jpunke
		'0xa3e17ca80549c16cc850d37acee1a02c45736f68', // mhall0693
	],
}, {
	id: 1059,
	label: 'PFP on Farcaster',
	amount: 50,
	users: [
		'0x79e47f12fe6382cfb29e8e7dc05c57b5c04cc814', // paesan
		'0x4d389ddfa4984735b6988b2d853522925ee8ec6b', // jpunke
	],
}];

// Re-calculate and update points related to bonuses for all users for the current season
(async () => {

	console.log('------------------ BACKFILL BONUS POINTS --------------------');

	// Create a new connection to the database

	const db = new DB();

	try {

		// Build the point results

		const results = {};

		SEASON_8_BONUS_POINT_SPECIES.forEach((species) => {

			species.users.forEach((address) => {

				const parsedAddress = address.toLowerCase();

				if (!results[parsedAddress]) {
					results[parsedAddress] = {};
				}

				results[parsedAddress][species.id] = {
					amount: species.amount,
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
