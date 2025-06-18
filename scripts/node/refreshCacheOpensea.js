const opensea = require('@api/opensea');

opensea.auth('74d1a3c7f5f34469b2e2c43a34789d41');
opensea.server('https://api.opensea.io');

(async () => {

	for (let i = 2000; i < 3000; i++) {

		opensea.refresh_nft({
			chain: 'base',
			address: '0x7c3b795e2174c5e0c4f7d563a2fb34f024c8390b',
			identifier: i,
		})
			.then(({ data }) => console.log(data))
			.catch(err => console.error(err));

		await new Promise((resolve) => setTimeout(resolve, 500));

	}

})();
