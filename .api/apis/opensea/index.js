"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var oas_1 = __importDefault(require("oas"));
var core_1 = __importDefault(require("api/dist/core"));
var openapi_json_1 = __importDefault(require("./openapi.json"));
var SDK = /** @class */ (function () {
    function SDK() {
        this.spec = oas_1.default.init(openapi_json_1.default);
        this.core = new core_1.default(this.spec, 'opensea/2.0.0 (api/6.1.1)');
    }
    /**
     * Optionally configure various options that the SDK allows.
     *
     * @param config Object of supported SDK options and toggles.
     * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
     * should be represented in milliseconds.
     */
    SDK.prototype.config = function (config) {
        this.core.setConfig(config);
    };
    /**
     * If the API you're using requires authentication you can supply the required credentials
     * through this method and the library will magically determine how they should be used
     * within your API request.
     *
     * With the exception of OpenID and MutualTLS, it supports all forms of authentication
     * supported by the OpenAPI specification.
     *
     * @example <caption>HTTP Basic auth</caption>
     * sdk.auth('username', 'password');
     *
     * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
     * sdk.auth('myBearerToken');
     *
     * @example <caption>API Keys</caption>
     * sdk.auth('myApiKey');
     *
     * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
     * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
     * @param values Your auth credentials for the API; can specify up to two strings or numbers.
     */
    SDK.prototype.auth = function () {
        var _a;
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        (_a = this.core).setAuth.apply(_a, values);
        return this;
    };
    /**
     * If the API you're using offers alternate server URLs, and server variables, you can tell
     * the SDK which one to use with this method. To use it you can supply either one of the
     * server URLs that are contained within the OpenAPI definition (along with any server
     * variables), or you can pass it a fully qualified URL to use (that may or may not exist
     * within the OpenAPI definition).
     *
     * @example <caption>Server URL with server variables</caption>
     * sdk.server('https://{region}.api.example.com/{basePath}', {
     *   name: 'eu',
     *   basePath: 'v14',
     * });
     *
     * @example <caption>Fully qualified server URL</caption>
     * sdk.server('https://eu.api.example.com/v14');
     *
     * @param url Server URL
     * @param variables An object of variables to replace into the server URL.
     */
    SDK.prototype.server = function (url, variables) {
        if (variables === void 0) { variables = {}; }
        this.core.setServer(url, variables);
    };
    /**
     * Get stats for a single collection.
     *
     * @summary Get Collection Stats
     */
    SDK.prototype.get_collection_stats = function (metadata) {
        return this.core.fetch('/api/v2/collections/{collection_slug}/stats', 'get', metadata);
    };
    /**
     * Get a list of events based on before and after timestamps.
     *
     * @summary Get Events
     */
    SDK.prototype.list_events = function (metadata) {
        return this.core.fetch('/api/v2/events', 'get', metadata);
    };
    /**
     * Get a list of events for an account.
     *
     * @summary Get Events (by account)
     */
    SDK.prototype.list_events_by_account = function (metadata) {
        return this.core.fetch('/api/v2/events/accounts/{address}', 'get', metadata);
    };
    /**
     * Get a list of events for a collection.
     *
     * @summary Get Events (by collection)
     */
    SDK.prototype.list_events_by_collection = function (metadata) {
        return this.core.fetch('/api/v2/events/collection/{collection_slug}', 'get', metadata);
    };
    /**
     * Get a list of events for a single NFT.
     *
     * @summary Get Events (by NFT)
     */
    SDK.prototype.list_events_by_nft = function (metadata) {
        return this.core.fetch('/api/v2/events/chain/{chain}/contract/{address}/nfts/{identifier}', 'get', metadata);
    };
    /**
     * Get an OpenSea Account Profile including details such as bio, social media usernames,
     * and profile image.
     *
     * @summary Get Account
     */
    SDK.prototype.get_account = function (metadata) {
        return this.core.fetch('/api/v2/accounts/{address_or_username}', 'get', metadata);
    };
    /**
     * Get a single collection including details such as fees, traits, and links.
     *
     * @summary Get Collection
     */
    SDK.prototype.get_collection = function (metadata) {
        return this.core.fetch('/api/v2/collections/{collection_slug}', 'get', metadata);
    };
    /**
     * Get a list of OpenSea collections.
     *
     * @summary Get Collections
     */
    SDK.prototype.list_collections = function (metadata) {
        return this.core.fetch('/api/v2/collections', 'get', metadata);
    };
    /**
     * Get a smart contract for a given chain and address.
     *
     * @summary Get Contract
     */
    SDK.prototype.get_contract = function (metadata) {
        return this.core.fetch('/api/v2/chain/{chain}/contract/{address}', 'get', metadata);
    };
    /**
     * Get metadata, traits, ownership information, and rarity for a single NFT.
     *
     * @summary Get NFT
     */
    SDK.prototype.get_nft = function (metadata) {
        return this.core.fetch('/api/v2/chain/{chain}/contract/{address}/nfts/{identifier}', 'get', metadata);
    };
    /**
     * Get NFTs owned by a given account address.
     *
     * @summary Get NFTs (by account)
     */
    SDK.prototype.list_nfts_by_account = function (metadata) {
        return this.core.fetch('/api/v2/chain/{chain}/account/{address}/nfts', 'get', metadata);
    };
    /**
     * Get multiple NFTs for a collection.
     *
     * @summary Get NFTs (by collection)
     */
    SDK.prototype.list_nfts_by_collection = function (metadata) {
        return this.core.fetch('/api/v2/collection/{collection_slug}/nfts', 'get', metadata);
    };
    /**
     * Get multiple NFTs for a smart contract.
     *
     * @summary Get NFTs (by contract)
     */
    SDK.prototype.list_nfts_by_contract = function (metadata) {
        return this.core.fetch('/api/v2/chain/{chain}/contract/{address}/nfts', 'get', metadata);
    };
    /**
     * Get a smart contract for a given chain and address.
     *
     * @summary Get Payment Token
     */
    SDK.prototype.get_payment_token = function (metadata) {
        return this.core.fetch('/api/v2/chain/{chain}/payment_token/{address}', 'get', metadata);
    };
    /**
     * Get the traits in a collection.
     *
     * @summary Get Traits
     */
    SDK.prototype.get_traits = function (metadata) {
        return this.core.fetch('/api/v2/traits/{collection_slug}', 'get', metadata);
    };
    /**
     * Refresh metadata for a single NFT.
     *
     * @summary Refresh NFT Metadata
     */
    SDK.prototype.refresh_nft = function (metadata) {
        return this.core.fetch('/api/v2/chain/{chain}/contract/{address}/nfts/{identifier}/refresh', 'post', metadata);
    };
    /**
     * Build a portion of a criteria offer including the merkle tree needed to post an offer.
     *
     * @summary Build Criteria Offer
     */
    SDK.prototype.build_offer_v2 = function (body) {
        return this.core.fetch('/api/v2/offers/build', 'post', body);
    };
    SDK.prototype.cancel_order = function (body, metadata) {
        return this.core.fetch('/api/v2/orders/chain/{chain}/protocol/{protocol_address}/{order_hash}/cancel', 'post', body, metadata);
    };
    /**
     * Create a criteria offer to purchase any NFT in a collection or which matches the
     * specified trait.
     *
     * @summary Create Criteria Offer
     */
    SDK.prototype.post_criteria_offer_v2 = function (body) {
        return this.core.fetch('/api/v2/offers', 'post', body);
    };
    /**
     * Create an offer to purchase a single NFT (ERC721 or ERC1155).
     *
     * @summary Create Item Offer
     */
    SDK.prototype.post_offer = function (body, metadata) {
        return this.core.fetch('/api/v2/orders/{chain}/{protocol}/offers', 'post', body, metadata);
    };
    /**
     * List a single NFT (ERC721 or ERC1155) for sale on the OpenSea marketplace.
     *
     * @summary Create Listing
     */
    SDK.prototype.post_listing = function (body, metadata) {
        return this.core.fetch('/api/v2/orders/{chain}/{protocol}/listings', 'post', body, metadata);
    };
    /**
     * Retrieve all the information, including signatures, needed to fulfill a listing directly
     * onchain.
     *
     * @summary Fulfill Listing
     */
    SDK.prototype.generate_listing_fulfillment_data_v2 = function (body) {
        return this.core.fetch('/api/v2/listings/fulfillment_data', 'post', body);
    };
    /**
     * Retrieve all the information, including signatures, needed to fulfill an offer directly
     * onchain.
     *
     * @summary Fulfill Offer
     */
    SDK.prototype.generate_offer_fulfillment_data_v2 = function (body) {
        return this.core.fetch('/api/v2/offers/fulfillment_data', 'post', body);
    };
    /**
     * Get all active, valid listings for a single collection.
     *
     * @summary Get All Listings (by collection)
     */
    SDK.prototype.get_all_listings_on_collection_v2 = function (metadata) {
        return this.core.fetch('/api/v2/listings/collection/{collection_slug}/all', 'get', metadata);
    };
    /**
     * Get all active, valid offers for the specified collection. This includes individual and
     * criteria offers.
     *
     * @summary Get All Offers (by collection)
     */
    SDK.prototype.get_all_offers_on_collection_v2 = function (metadata) {
        return this.core.fetch('/api/v2/offers/collection/{collection_slug}/all', 'get', metadata);
    };
    /**
     * Get the best listing for an NFT.
     *
     * @summary Get Best Listing (by NFT)
     */
    SDK.prototype.get_best_listing_on_nft_v2 = function (metadata) {
        return this.core.fetch('/api/v2/listings/collection/{collection_slug}/nfts/{identifier}/best', 'get', metadata);
    };
    /**
     * Get the cheapest priced active, valid listings on a single collection.
     *
     * @summary Get Best Listings (by collection)
     */
    SDK.prototype.get_best_listings_on_collection_v2 = function (metadata) {
        return this.core.fetch('/api/v2/listings/collection/{collection_slug}/best', 'get', metadata);
    };
    /**
     * Get the best offers for an NFT.
     *
     * @summary Get Best Offer (by NFT)
     */
    SDK.prototype.get_best_offer_on_nft_v2 = function (metadata) {
        return this.core.fetch('/api/v2/offers/collection/{collection_slug}/nfts/{identifier}/best', 'get', metadata);
    };
    /**
     * Get the active, valid collection offers for the specified collection.
     *
     * @summary Get Collection Offers
     */
    SDK.prototype.get_collection_offers_v2 = function (metadata) {
        return this.core.fetch('/api/v2/offers/collection/{collection_slug}', 'get', metadata);
    };
    /**
     * Get the active, valid individual offers. This does not include criteria offers.
     *
     * @summary Get Item Offers
     */
    SDK.prototype.get_offers = function (metadata) {
        return this.core.fetch('//api/v2/orders/{chain}/{protocol}/offers', 'get', metadata);
    };
    /**
     * Get the complete set of active, valid listings.
     *
     * @summary Get Listings
     */
    SDK.prototype.get_listings = function (metadata) {
        return this.core.fetch('//api/v2/orders/{chain}/{protocol}/listings', 'get', metadata);
    };
    /**
     * Get a single order, offer or listing, by its order hash. Protocol and Chain are required
     * to prevent hash collisions.
     *
     * @summary Get Order
     */
    SDK.prototype.get_order = function (metadata) {
        return this.core.fetch('/api/v2/orders/chain/{chain}/protocol/{protocol_address}/{order_hash}', 'get', metadata);
    };
    /**
     * Get the active, valid trait offers for the specified collection.
     *
     * @summary Get Trait Offers
     */
    SDK.prototype.get_trait_offers_v2 = function (metadata) {
        return this.core.fetch('/api/v2/offers/collection/{collection_slug}/traits', 'get', metadata);
    };
    return SDK;
}());
var createSDK = (function () { return new SDK(); })();
module.exports = createSDK;
