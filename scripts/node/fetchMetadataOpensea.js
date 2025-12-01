const opensea = require('@api/opensea');

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

opensea.auth(process.env.OPENSEA_PRIVATE_API_KEY);
opensea.server('https://api.opensea.io');

(async () => {

	let count = 0, withImages = 0;

	for (let i = 0; i < 10000; i++) {

		try {

			const { data } = await opensea.get_nft({
				chain: 'base',
				address: process.env.SONGBIRDZ_CONTRACT_ADDRESS,
				identifier: i,
			});

			if (!data.display_animation_url) {
				count++;
			}

			if (data.display_image_url) {
				withImages++;
			}

			console.log(i);

			await new Promise((resolve) => setTimeout(resolve, 1000));

		} catch (error) {
			console.error(error);
			count++;
		}

	
	}

	console.log(`withoutAudio=${count},withImages=${withImages}`);

})();
