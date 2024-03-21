const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");

const _populateBirds = async (contract, collectionId = 0, numToPopulate = 1000) => {

	const values = [];

	for (let i = 0; i < numToPopulate; i++) {

		const birdId = i;

		// Generate hash values for the species name, audio file, and image file

		let speciesBytes = ethers.toUtf8Bytes(`Bird #${i}`);

		let audioFileBytes = ethers.toUtf8Bytes(`Audio #${i}`);

		let imageFileBytes = ethers.toUtf8Bytes(`Image #${i}`);

		// Add hash values as leafs to the merkle tree

		values.push([ethers.keccak256(speciesBytes), `${birdId}-species`]);

		values.push([ethers.keccak256(audioFileBytes), `${birdId}-audio`]);

		values.push([ethers.keccak256(imageFileBytes), `${birdId}-image`]);

	}

	const tree = StandardMerkleTree.of(values, ["bytes32", "string"]);

	await contract.publicGenerateBirds(collectionId, tree.root);

	return {
		collectionId,
		tree,
	};

};

const _getProof = (tree, birdId) => {

	let proof;

	for (const [i, v] of tree.entries()) {

		if (v[0] === ethers.keccak256(ethers.toUtf8Bytes(`Bird #${birdId}`)) &&
			v[1] === `${birdId}-species`) {

			proof = tree.getProof(i);

		}

	}

	return {
		proof,
		speciesName: `Bird #${birdId}`,
	};

};

module.exports = {
	_populateBirds,
	_getProof,
};
