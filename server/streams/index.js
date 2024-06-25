const initOpenseaStream = require("./opensea");

const streamer = () => {

	try {

		initOpenseaStream();

	} catch (error) {
		console.error(error);
	}

};

module.exports = streamer;
