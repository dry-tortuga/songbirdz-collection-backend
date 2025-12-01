const DB = require("../../server/db");
const { storePoints } = require("../../server/utils/points");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const CURRENT_TIME = new Date();

const SEASON_6_BONUS_POINT_SPECIES = [{
	id: 1030,
	label: 'Posted on X',
	amount: 25,
	users: [
		'0x79e47f12fe6382cfb29e8e7dc05c57b5c04cc814', // paesan
		'0x2dc85944fd65b8c89cfdd76d81fc670595ee2bf0', // whalestacking
		'0xd4b896413742ea782e3a9f1108171f5bb4d9dbaa', // leosharkpark
		'0x0682f146b16e7c428a092106db430126a3766ec0', // bastr
		'0x0de101737fafd0eb7cf0c986a1fc66137f1ece6f', // jimbey
		'0xdf53adbc2fea827c3ea675d3122bec89ccbc1af4', // arcturus
		'0x0bb618d7c55ce7fed637164cf45d577c03979d9a', // cryptomouse
		'0x393b57b89c67349e0fc184b7b57e44e28ef3b29c', // tamara
		'0x47ade238cc739dbce060c572e7393467ed6f0c50', // zksnarky
		'0xef4993567ec1df8aec7beba836135efb0652c2ef', // turtles
		'0x887a9f0873d48d9cdcfdc003a9cd8f4c6a4eb027', // cryptomouse
		'0xa3e17ca80549c16cc850d37acee1a02c45736f68', // mhall0693
		'0x8ba0d7704df6a610f4ce9937d31e0bbc19717311', // asendic.base.eth
		'0x4d389ddfa4984735b6988b2d853522925ee8ec6b', // jpunke
		'0x6989e6507dac1376502a5639e01259a778db35de', // spudnik
		'0x8d57ee867c65231e20aead5040a7c489704eb5f6', // thedefifox
	],
}, {
	id: 1031,
	label: 'Posted on Farcaster',
	amount: 25,
	users: [
		'0x463b1e8e78b28027b423ea6f00695f01a84efe72', // saltorious
		'0x79e47f12fe6382cfb29e8e7dc05c57b5c04cc814', // paesan
	],
}, {
	id: 1032,
	label: 'Joined Telegram',
	amount: 10,
	users: [
		// MISSING POINTS: tokyo, jamesberg, jibbmoslice, RandomEgg, Tonywithouti,
		// My_name_is_mudd, Basedsuiguru, VENOMDSLAYER, @OxMisan, @Web3majo,
		// @bullionape1914,  oeuk nikon, melanie, @DEGENCOBRA, satoshi-nakamoto,
		// crypto-lady, refaund09, memekreator, violet
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
	],
}, {
	id: 1033,
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
		'0x91a0c767e86e832d279faa2b4b9deda28bbb26ce', // million.base.eth
		'0x46eca8796d1fab2cc52e66a508f499c8207378da', // crunklez
		'0x75521de871eea2f188a45e1a232bb6794600ebc6', // abrahamdomenick.base.eth
		'0x76ce03b1eea333ecce7d6e3506bc36cfb4dd76c6', // pederzani.eth (ozFather)
		'0xa13d127dc4e3a5552fb9a8eb10f30052579f62c5', // karii-explores
		'0xbe061d84c50e156e2faa791228662e3b52c906e2', // xbornid.eth
		'0xf5da620ba68d658fae300d79c11efab82a594243', // nuwwara1725
		'0x47ade238cc739dbce060c572e7393467ed6f0c50', // zksnarky
		'0x91eb3b483244cb2d7671b4e6433e7c6008878355', // dabus.base.eth
		'0xbcfcd3bb907507a123f9c37e920ceb5c8db56feb', // myk.base.eth
		'0x11415669286d998fd85a2a6146c41f6be41a794d', // reisub.base.eth
		'0x9beadc1297f97fff916a487e49dea1004510c59e', // s0tric.base.eth
		'0x8d888326e1e2b6a399b751105339f82476208d5d', // tomkey
		'0x2fe61e1fcb4fd2453ed34ca57a648db4d71a9232', // dbin78
		'0x8ba0d7704df6a610f4ce9937d31e0bbc19717311', // asendic.base.eth
		'0xaf1c69da79a71f82b9fbc1f72dca7f0ee70f8460', // 0xhanma
		'0xc41ba732369ac17d1372542520247518c726ef0e', // brendannn
		'0x92e05c3243266e94cd2d728fd9954eee05c4308c', // rnvnislmy
		'0x41f4ddcc02c550a92336a027f248c7e2e0367dd0', // jenna
		'0x056eb43118ffa352add9cdb9a7d2977a4842b936', // hankmoody
		'0x6d7bb670765e2be191c1f6b91399db12c4fde911', // julex
		'0x586eb1950b87bb4c9a80561d154d779c4ad872f8', // khayle8891
		'0xd6b69e58d44e523eb58645f1b78425c96dfa648c', // uniquebeing404
		'0x10fc964ef70c8467cd8c53e9ed9347422adf96a8', // kenny
		'0x2dc85944fd65b8c89cfdd76d81fc670595ee2bf0', // disciple
		'0x1ace9e4df9de3af66e33170991617ab73de5dc1a', // wanderlustmom
		'0x70faa7333f352f74452afc24156f171100a0a8ab', // logonaut
		'0xab56c668b2c49f319fc5c4c0d27b2c564c3bd810', // john snow (cancersucks)
		'0x80843e69308a594c40194ad414c3b77f606ee770', // virtualcat
		'0xc8115c770efaaf0de401898e4b86f3be36eb2f42', // jonnybravo
		'0x64be80bc71516ac48d8b0d9ff56de0af45c95d58', // profian
		'0x463b1e8e78b28027b423ea6f00695f01a84efe72', // saltorious
	],
}, {
	id: 1034,
	label: 'Hit 7 Day Streak',
	amount: 50,
	users: [
		'0x4d389ddfa4984735b6988b2d853522925ee8ec6b', // jpunke
		'0x8d57ee867c65231e20aead5040a7c489704eb5f6', // thedefifox
	],
}, {
	id: 1035,
	label: 'Hit 14 Day Streak',
	amount: 125,
	users: [
		'0x8d57ee867c65231e20aead5040a7c489704eb5f6', // thedefifox
	],
}, {
	id: 1036,
	label: 'Hit 30 Day Streak',
	amount: 300,
	users: [
		'0x8d57ee867c65231e20aead5040a7c489704eb5f6', // thedefifox 
	],
}, {
	id: 1037,
	label: 'Hit 75 Day Streak',
	amount: 1000,
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

		SEASON_6_BONUS_POINT_SPECIES.forEach((species) => {

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
