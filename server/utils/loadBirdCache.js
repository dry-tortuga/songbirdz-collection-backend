const alreadyIdentified = require("../constants/alreadyIdentified.json");

const loadBirdCache = () => {
	return alreadyIdentified;
};

module.exports = loadBirdCache;
