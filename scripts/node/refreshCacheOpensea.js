const opensea = require('@api/opensea');

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

opensea.auth(process.env.OPENSEA_PRIVATE_API_KEY);
opensea.server('https://api.opensea.io');

(async () => {

	for (let i = 0; i < 10000; i++) {

		try {

			const { data } = await opensea.refresh_nft({
				chain: 'base',
				address: process.env.SONGBIRDZ_CONTRACT_ADDRESS,
				identifier: i,
			});

			console.log(data);

			await new Promise((resolve) => setTimeout(resolve, 500));

		} catch (error) {
			console.error(error);
		}

	}

})();
