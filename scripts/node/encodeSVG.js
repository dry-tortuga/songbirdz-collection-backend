const fs = require("fs");
const jsdom = require("jsdom");
const path = require("path");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const privatePath = path.join(__dirname, '../../private/life-list-data');

const { JSDOM } = jsdom;

const finalSpeciesList = require(
	`${privatePath}/final.json`,
);

const SPECIES_ID = 0;

(() => {

	const svgImageString = fs.readFileSync(
		`${privatePath}/images/${SPECIES_ID}.svg`, "utf8"
	);

	const dom = new JSDOM(`
		${svgImageString}
	`);

	encodeImage(dom);

})();

function encodeImage(dom) {

	const rectangles = Array.from(dom.window.document.querySelector("svg").children);

	console.log(rectangles);

	const colors = [], pixels = [];

	for (let i = 0; i < 256; i++) {

		// Get the position of the current pixel in the 16x16 grid
		const x = i % 16;
		const y = Math.floor(i / 16);

		const shape = rectangles.find((rect) => {

			const rectX = parseInt(rect.attributes.x.value, 10);
			const rectY = parseInt(rect.attributes.y.value, 10);

			const width = parseInt(rect.attributes.width.value, 10);
			const height = parseInt(rect.attributes.height.value, 10);

			// Check to see if the rectangle contains the pixel at x,y
			const xMatch = (x >= rectX) && (x < (rectX + width));
			const yMatch = (y >= rectY) && (y < (rectY + height));

			if (xMatch && yMatch) {
				return true;
			}

			return false;

		});

		let fill;

		if (shape) {
			fill = shape.attributes.fill.value.replace('#', '');
		} else {
			// fill = '000000';
			fill = 'ffffff';
		}

		if (fill.length !== 6) {
			throw new Error(`Invalid fill color=${fill},i=${i}`);
		}

		console.log(`x=${x}, y=${y}, fill=${fill}`);

		let colorIndex = colors.indexOf(fill);

		if (colorIndex === -1) {
			colors.push(fill);
			colorIndex = colors.length - 1;
		}

		pixels.push(colorIndex);

	}

	encodedResult = {
		colorsOriginal: colors,
		colorsEncoded1: encodeColors(colors.slice(0, 8)),
		colorsEncoded2: encodeColors(colors.slice(8, 16)),
		pixelsOriginal: pixels,
		pixelsEncoded: encodePixelsWith16Colors(pixels),
	};

	const idx = finalSpeciesList.findIndex((species) => species.id === SPECIES_ID);

	if (idx === -1) {
		throw new Error(`Species not found for id=${SPECIES_ID}`);
	}

	finalSpeciesList[idx].colors1 = encodedResult.colorsEncoded1;
	finalSpeciesList[idx].colors2 = encodedResult.colorsEncoded2;
	finalSpeciesList[idx].pixels = encodedResult.pixelsEncoded;

	console.log(encodedResult);

	fs.writeFileSync(
		`${privatePath}/final.json`,
		JSON.stringify(finalSpeciesList),
		(err) => {

			if (err) {
				throw new err;
			}

		},
	);

}

function encodeColors(colors) {
	if (colors.length === 0) {
		return '0x' + colors.join('').padEnd(64, '0');
	}
	return '0x' + colors.join('').match(/.{6}/g).join('').padEnd(64, '0');
}

function encodePixelsWith4Colors(pixels) {

	let bytes = new Uint8Array(64); // 64 bytes for 256 indices

	for (let i = 0; i < 256; i += 4) {

		// Pack four 2-bit values into one byte

		const byte =
			(pixels[i] << 6) +
			(pixels[i + 1] << 4) +
			(pixels[i + 2] << 2) +
			pixels[i + 3];

		bytes[i/4] = byte;

	}

	// return '0x' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
	return '0x' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');

}

function encodePixelsWith8Colors(pixels) {

	let bytes = new Uint8Array(96); // 96 bytes for 256 indices (256 * 3 bits = 768 bits = 96 bytes)

	let bitBuffer = 0;
	let bitsInBuffer = 0;
	let byteIndex = 0;

	for (let i = 0; i < 256; i++) {

		// Add 3 bits for current pixel to buffer
		bitBuffer = (bitBuffer << 3) | pixels[i];
		bitsInBuffer += 3;

		// When we have 8 or more bits, write a byte
		while (bitsInBuffer >= 8) {
			bytes[byteIndex] = (bitBuffer >> (bitsInBuffer - 8)) & 0xFF;
			byteIndex++;
			bitsInBuffer -= 8;
		}

	}

	// Handle any remaining bits
	if (bitsInBuffer > 0) {
		bytes[byteIndex] = (bitBuffer << (8 - bitsInBuffer)) & 0xFF;
	}

	return '0x' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');

}

function encodePixelsWith16Colors(pixels) {

	let bytes = new Uint8Array(128); // 128 bytes for 256 indices

	for (let i = 0; i < 256; i += 2) {

		// Pack two 4-bit values into one byte

		const byte = (pixels[i] << 4) + pixels[i + 1];

		bytes[i/2] = byte;

	}

	// return '0x' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
	return '0x' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');

}