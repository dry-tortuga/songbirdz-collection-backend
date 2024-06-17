declare const BuildOfferV2: {
    readonly body: {
        readonly title: "BuildOfferInput";
        readonly type: "object";
        readonly properties: {
            readonly offerer: {
                readonly title: "Offerer";
                readonly description: "The address which supplies all the items in the offer.";
                readonly type: "string";
            };
            readonly quantity: {
                readonly title: "Quantity";
                readonly description: "The number of offers to place.";
                readonly default: 1;
                readonly type: "integer";
            };
            readonly criteria: {
                readonly title: "Criteria";
                readonly description: "Criteria for the collection or trait offer";
                readonly type: "object";
                readonly required: readonly ["collection", "contract"];
                readonly properties: {
                    readonly collection: {
                        readonly title: "Collection";
                        readonly description: "The collection in which the criteria offer is being made for.";
                        readonly type: "object";
                        readonly required: readonly ["slug"];
                        readonly properties: {
                            readonly slug: {
                                readonly title: "Slug";
                                readonly description: "Unique string to identify a collection on OpenSea. This can be found by visiting the collection on the OpenSea website and noting the last path parameter.";
                                readonly type: "string";
                            };
                        };
                    };
                    readonly contract: {
                        readonly title: "Contract";
                        readonly description: "The public blockchain address of the NFT contract";
                        readonly type: "object";
                        readonly required: readonly ["address"];
                        readonly properties: {
                            readonly address: {
                                readonly title: "Address";
                                readonly type: "string";
                            };
                        };
                    };
                    readonly trait: {
                        readonly title: "Trait";
                        readonly description: "The trait that the criteria offer is being made for.";
                        readonly type: "object";
                        readonly required: readonly ["type", "value"];
                        readonly properties: {
                            readonly type: {
                                readonly title: "Type";
                                readonly type: "string";
                            };
                            readonly value: {
                                readonly title: "Value";
                                readonly type: "string";
                            };
                        };
                    };
                    readonly encoded_token_ids: {
                        readonly title: "Encoded Token Ids";
                        readonly description: "Represents a list of token ids which can be used to fulfill the criteria offer. When decoded using the provided SDK function, developers can now see a list of all tokens that could be used to fulfill the offer.";
                        readonly type: "string";
                    };
                };
            };
            readonly protocol_address: {
                readonly title: "Protocol Address";
                readonly description: "Exchange contract address. Must be one of ['0x0000000000000068f116a894984e2db1123eb395']";
                readonly type: "string";
            };
            readonly offer_protection_enabled: {
                readonly title: "Offer Protection Enabled";
                readonly description: "Builds the offer on OpenSea's signed zone to provide offer protections from receiving an item which is disabled from trading.";
                readonly default: true;
                readonly type: "boolean";
            };
        };
        readonly required: readonly ["offerer", "criteria", "protocol_address"];
        readonly additionalProperties: false;
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly title: "BuildOffer";
            readonly type: "object";
            readonly properties: {
                readonly partialParameters: {
                    readonly title: "Partialparameters";
                    readonly description: "Partial set of Seaport Order Parameters";
                    readonly type: "object";
                    readonly required: readonly ["consideration", "zone", "zoneHash"];
                    readonly properties: {
                        readonly consideration: {
                            readonly title: "Consideration";
                            readonly description: "One of the consideration items used when creating criteria offers.";
                            readonly type: "array";
                            readonly items: {
                                readonly title: "SerializedConsiderationItem";
                                readonly type: "object";
                                readonly required: readonly ["itemType", "token", "identifierOrCriteria", "startAmount", "endAmount", "recipient"];
                                readonly properties: {
                                    readonly itemType: {
                                        readonly title: "ItemType";
                                        readonly description: "0 - Native - Ether (or other native token for the given chain)\n1 - ERC20\n2 - ERC721\n3 - ERC1155\n4 - ERC721 with criteria\n5 - ERC1155 with criteria\n\n`1` `2` `3` `4` `5`";
                                        readonly enum: readonly [0, 1, 2, 3, 4, 5];
                                        readonly type: "integer";
                                    };
                                    readonly token: {
                                        readonly title: "Token";
                                        readonly description: "The item's token contract (with the null address used for native tokens)";
                                        readonly type: "string";
                                    };
                                    readonly identifierOrCriteria: {
                                        readonly title: "Identifierorcriteria";
                                        readonly description: "The ERC721 or ERC1155 token identifier or, in the case of a criteria-based item type, a merkle root composed of the valid set of token identifiers for the item. This value will be ignored for Ether and ERC20 item types, and can optionally be zero for criteria-based item types to allow for any identifier.";
                                        readonly type: "string";
                                    };
                                    readonly startAmount: {
                                        readonly title: "Startamount";
                                        readonly description: "The amount of the token in question that will be required should the order be fulfilled.";
                                        readonly type: "string";
                                    };
                                    readonly endAmount: {
                                        readonly title: "Endamount";
                                        readonly description: "When endAmount differs from `startAmount`, the realized amount is calculated linearly based on the time elapsed since the order became active.";
                                        readonly type: "string";
                                    };
                                    readonly recipient: {
                                        readonly title: "Recipient";
                                        readonly description: "The address which will receive the consideration item when the order is executed.";
                                        readonly type: "string";
                                    };
                                };
                            };
                        };
                        readonly zone: {
                            readonly title: "Zone";
                            readonly description: "Optional secondary account attached the order which can cancel orders. Additionally, when the `OrderType` is Restricted, the zone or the offerer are the only entities which can execute the order.\nFor open orders, use the zero address.\nFor restricted orders, use the signed zone address 0x000056f7000000ece9003ca63978907a00ffd100";
                            readonly type: "string";
                        };
                        readonly zoneHash: {
                            readonly title: "Zonehash";
                            readonly description: "A value that will be supplied to the zone when fulfilling restricted orders that the zone can utilize when making a determination on whether to authorize the order. Most often this value will be the zero hash 0x0000000000000000000000000000000000000000000000000000000000000000";
                            readonly type: "string";
                        };
                    };
                };
                readonly encoded_token_ids: {
                    readonly title: "Encoded Token Ids";
                    readonly description: "Represents a list of token ids which can be used to fulfill the criteria offer. When decoded using the provided SDK function, developers can now see a list of all tokens that could be used to fulfill the offer.";
                    readonly type: "string";
                };
            };
            readonly required: readonly ["partialParameters"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const CancelOrder: {
    readonly body: {
        readonly title: "CancelOrderInput";
        readonly type: "object";
        readonly properties: {
            readonly offererSignature: {
                readonly title: "Offerer Signature";
                readonly description: "An EIP-712 signature from the offerer of the order. If this is not provided, the user associated with the API Key will be checked instead. The signature must be a EIP-712 signature consisting of the order's Seaport contract's name, version, address, and chain. The struct to sign is `OrderHash` containing a single bytes32 field.";
                readonly type: "string";
            };
        };
        readonly additionalProperties: false;
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly chain: {
                    readonly type: "string";
                    readonly enum: readonly ["amoy", "arbitrum", "arbitrum_nova", "arbitrum_sepolia", "avalanche", "avalanche_fuji", "baobab", "base", "base_sepolia", "blast", "blast_sepolia", "bsc", "bsctestnet", "ethereum", "klaytn", "matic", "mumbai", "optimism", "optimism_sepolia", "sepolia", "solana", "soldev", "zora", "zora_sepolia"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The blockchain on which to filter the results.";
                };
                readonly order_hash: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The hash of the order to retrieve.";
                };
                readonly protocol_address: {
                    readonly type: "string";
                    readonly enum: readonly ["0x0000000000000068f116a894984e2db1123eb395", "0x00000000000000adc04c56bf30ac9d3c0aaf14dc"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The contract address of the protocol to use in the request.";
                };
            };
            readonly required: readonly ["chain", "order_hash", "protocol_address"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "CancelOrderResult";
            readonly type: "object";
            readonly properties: {
                readonly last_signature_issued_valid_until: {
                    readonly title: "Last Signature Issued Valid Until";
                    readonly type: "string";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GenerateListingFulfillmentDataV2: {
    readonly body: {
        readonly title: "GenerateListingFulfillmentInput";
        readonly type: "object";
        readonly properties: {
            readonly listing: {
                readonly title: "Listing";
                readonly description: "Listing to get fulfillment data for.";
                readonly type: "object";
                readonly required: readonly ["hash", "chain"];
                readonly properties: {
                    readonly hash: {
                        readonly title: "Hash";
                        readonly description: "Hash of the order to fulfill.";
                        readonly type: "string";
                    };
                    readonly chain: {
                        readonly title: "Chain";
                        readonly type: "string";
                    };
                    readonly protocol_address: {
                        readonly title: "Protocol Address";
                        readonly description: "Exchange contract address. Must be one of ['0x00000000000000adc04c56bf30ac9d3c0aaf14dc', '0x0000000000000068f116a894984e2db1123eb395']";
                        readonly type: "string";
                    };
                };
            };
            readonly fulfiller: {
                readonly title: "Fulfiller";
                readonly description: "Fulfiller address.";
                readonly type: "object";
                readonly required: readonly ["address"];
                readonly properties: {
                    readonly address: {
                        readonly title: "Address";
                        readonly type: "string";
                    };
                };
            };
        };
        readonly required: readonly ["listing", "fulfiller"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly title: "FulfillmentOutput";
            readonly type: "object";
            readonly properties: {
                readonly protocol: {
                    readonly title: "Protocol";
                    readonly description: "Exchange contract address. Must be one of ['0x00000000000000adc04c56bf30ac9d3c0aaf14dc', '0x0000000000000068f116a894984e2db1123eb395']";
                    readonly type: "string";
                };
                readonly fulfillment_data: {
                    readonly title: "Fulfillment Data";
                    readonly description: "All the information, including signatures, needed to fulfill an order directly onchain.";
                    readonly type: "object";
                    readonly required: readonly ["transaction", "orders"];
                    readonly properties: {
                        readonly transaction: {
                            readonly title: "Transaction";
                            readonly description: "The name of the fulfillment method and associated call data.";
                            readonly type: "object";
                            readonly required: readonly ["function", "chain", "to", "value", "input_data"];
                            readonly properties: {
                                readonly function: {
                                    readonly title: "Function";
                                    readonly description: "Seaport protocol contract method to use to fulfill the order.";
                                    readonly type: "string";
                                };
                                readonly chain: {
                                    readonly title: "Chain";
                                    readonly description: "Numeric Chain Identifier.";
                                    readonly type: "integer";
                                };
                                readonly to: {
                                    readonly title: "To";
                                    readonly description: "Protocol contract address to use fto fulfill the order.";
                                    readonly type: "string";
                                };
                                readonly value: {
                                    readonly title: "Value";
                                    readonly description: "Wei value of the transaction.";
                                    readonly type: "integer";
                                };
                                readonly input_data: {
                                    readonly title: "Input Data";
                                    readonly description: "Decoded Call Data.";
                                    readonly type: "object";
                                    readonly additionalProperties: true;
                                };
                            };
                        };
                        readonly orders: {
                            readonly title: "Order";
                            readonly description: "Array of Seaport Orders.";
                            readonly type: "array";
                            readonly items: {
                                readonly title: "SerializedOrder";
                                readonly type: "object";
                                readonly required: readonly ["parameters"];
                                readonly properties: {
                                    readonly parameters: {
                                        readonly title: "Order";
                                        readonly type: "object";
                                        readonly required: readonly ["offerer", "offer", "consideration", "startTime", "endTime", "orderType", "zone", "zoneHash", "salt", "conduitKey", "totalOriginalConsiderationItems", "counter"];
                                        readonly properties: {
                                            readonly offerer: {
                                                readonly title: "Offerer";
                                                readonly description: "The address which supplies all the items in the offer.";
                                                readonly type: "string";
                                            };
                                            readonly offer: {
                                                readonly title: "Offer";
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly title: "SerializedOfferItem";
                                                    readonly type: "object";
                                                    readonly required: readonly ["itemType", "token", "identifierOrCriteria", "startAmount", "endAmount"];
                                                    readonly properties: {
                                                        readonly itemType: {
                                                            readonly title: "ItemType";
                                                            readonly description: "0 - Native - Ether (or other native token for the given chain)\n1 - ERC20\n2 - ERC721\n3 - ERC1155\n4 - ERC721 with criteria\n5 - ERC1155 with criteria\n\n`1` `2` `3` `4` `5`";
                                                            readonly enum: readonly [0, 1, 2, 3, 4, 5];
                                                            readonly type: "integer";
                                                        };
                                                        readonly token: {
                                                            readonly title: "Token";
                                                            readonly description: "The item's token contract (with the null address used for native tokens)";
                                                            readonly type: "string";
                                                        };
                                                        readonly identifierOrCriteria: {
                                                            readonly title: "Identifierorcriteria";
                                                            readonly description: "The ERC721 or ERC1155 token identifier or, in the case of a criteria-based item type, a merkle root composed of the valid set of token identifiers for the item. This value will be ignored for Ether and ERC20 item types, and can optionally be zero for criteria-based item types to allow for any identifier.";
                                                            readonly type: "string";
                                                        };
                                                        readonly startAmount: {
                                                            readonly title: "Startamount";
                                                            readonly description: "The amount of the token in question that will be required should the order be fulfilled.";
                                                            readonly type: "string";
                                                        };
                                                        readonly endAmount: {
                                                            readonly title: "Endamount";
                                                            readonly description: "When endAmount differs from `startAmount`, the realized amount is calculated linearly based on the time elapsed since the order became active.";
                                                            readonly type: "string";
                                                        };
                                                    };
                                                };
                                            };
                                            readonly consideration: {
                                                readonly title: "Consideration";
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly title: "SerializedConsiderationItem";
                                                    readonly type: "object";
                                                    readonly required: readonly ["itemType", "token", "identifierOrCriteria", "startAmount", "endAmount", "recipient"];
                                                    readonly properties: {
                                                        readonly itemType: {
                                                            readonly title: "ItemType";
                                                            readonly description: "0 - Native - Ether (or other native token for the given chain)\n1 - ERC20\n2 - ERC721\n3 - ERC1155\n4 - ERC721 with criteria\n5 - ERC1155 with criteria\n\n`1` `2` `3` `4` `5`";
                                                            readonly enum: readonly [0, 1, 2, 3, 4, 5];
                                                            readonly type: "integer";
                                                        };
                                                        readonly token: {
                                                            readonly title: "Token";
                                                            readonly description: "The item's token contract (with the null address used for native tokens)";
                                                            readonly type: "string";
                                                        };
                                                        readonly identifierOrCriteria: {
                                                            readonly title: "Identifierorcriteria";
                                                            readonly description: "The ERC721 or ERC1155 token identifier or, in the case of a criteria-based item type, a merkle root composed of the valid set of token identifiers for the item. This value will be ignored for Ether and ERC20 item types, and can optionally be zero for criteria-based item types to allow for any identifier.";
                                                            readonly type: "string";
                                                        };
                                                        readonly startAmount: {
                                                            readonly title: "Startamount";
                                                            readonly description: "The amount of the token in question that will be required should the order be fulfilled.";
                                                            readonly type: "string";
                                                        };
                                                        readonly endAmount: {
                                                            readonly title: "Endamount";
                                                            readonly description: "When endAmount differs from `startAmount`, the realized amount is calculated linearly based on the time elapsed since the order became active.";
                                                            readonly type: "string";
                                                        };
                                                        readonly recipient: {
                                                            readonly title: "Recipient";
                                                            readonly description: "The address which will receive the consideration item when the order is executed.";
                                                            readonly type: "string";
                                                        };
                                                    };
                                                };
                                            };
                                            readonly startTime: {
                                                readonly title: "Starttime";
                                                readonly description: "The block timestamp at which the order becomes active";
                                                readonly type: "string";
                                            };
                                            readonly endTime: {
                                                readonly title: "Endtime";
                                                readonly description: "The block timestamp at which the order expires";
                                                readonly type: "string";
                                            };
                                            readonly orderType: {
                                                readonly title: "SeaportOrderType";
                                                readonly description: "The type of order, which determines how it can be executed.\n0 = Full Open - No partial fills, anyone can execute\n1 = Partial Open - Partial fills supported, anyone can execute\n2 = Full Restricted - No partial fills, only offerer or zone can check if it can be executed\n3 = Partial Restricted - Partial fills supported, only offerer or zone can check if it can be executed\n4 = Contract - Contract order type, for contract offerers that can dynamically generate orders. Introduced in Seaport v1.4 and currently unsupported\n\n`1` `2` `3` `4`";
                                                readonly enum: readonly [0, 1, 2, 3, 4];
                                                readonly type: "integer";
                                            };
                                            readonly zone: {
                                                readonly title: "Zone";
                                                readonly description: "Optional secondary account attached the order which can cancel orders. Additionally, when the `OrderType` is Restricted, the zone or the offerer are the only entities which can execute the order.\nFor open orders, use the zero address.\nFor restricted orders, use the signed zone address 0x000056f7000000ece9003ca63978907a00ffd100";
                                                readonly type: "string";
                                            };
                                            readonly zoneHash: {
                                                readonly title: "Zonehash";
                                                readonly description: "A value that will be supplied to the zone when fulfilling restricted orders that the zone can utilize when making a determination on whether to authorize the order. Most often this value will be the zero hash 0x0000000000000000000000000000000000000000000000000000000000000000";
                                                readonly type: "string";
                                            };
                                            readonly salt: {
                                                readonly title: "Salt";
                                                readonly description: "an arbitrary source of entropy for the order";
                                                readonly type: "string";
                                            };
                                            readonly conduitKey: {
                                                readonly title: "Conduitkey";
                                                readonly description: "Indicates what conduit, if any, should be utilized as a source for token approvals when performing transfers. By default (i.e. when conduitKey is set to the zero hash), the offerer will grant transfer approvals to Seaport directly. \nTo utilize OpenSea's conduit, use 0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000";
                                                readonly type: "string";
                                            };
                                            readonly totalOriginalConsiderationItems: {
                                                readonly title: "Totaloriginalconsiderationitems";
                                                readonly description: "Size of the consideration array.";
                                                readonly type: "integer";
                                            };
                                            readonly counter: {
                                                readonly title: "Counter";
                                                readonly anyOf: readonly [{
                                                    readonly type: "integer";
                                                }, {
                                                    readonly type: "string";
                                                }];
                                            };
                                        };
                                    };
                                    readonly signature: {
                                        readonly title: "Signature";
                                        readonly description: "The order maker's signature used to validate the order.";
                                        readonly type: "string";
                                    };
                                };
                            };
                        };
                    };
                };
            };
            readonly required: readonly ["protocol", "fulfillment_data"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GenerateOfferFulfillmentDataV2: {
    readonly body: {
        readonly title: "GenerateOfferFulfillmentInput";
        readonly type: "object";
        readonly properties: {
            readonly offer: {
                readonly title: "Offer";
                readonly description: "Offer to get fulfillment data for.";
                readonly type: "object";
                readonly required: readonly ["hash", "chain"];
                readonly properties: {
                    readonly hash: {
                        readonly title: "Hash";
                        readonly description: "Hash of the order to fulfill.";
                        readonly type: "string";
                    };
                    readonly chain: {
                        readonly title: "Chain";
                        readonly type: "string";
                    };
                    readonly protocol_address: {
                        readonly title: "Protocol Address";
                        readonly description: "Exchange contract address. Must be one of ['0x00000000000000adc04c56bf30ac9d3c0aaf14dc', '0x0000000000000068f116a894984e2db1123eb395']";
                        readonly type: "string";
                    };
                };
            };
            readonly fulfiller: {
                readonly title: "Fulfiller";
                readonly description: "Fulfiller address.";
                readonly type: "object";
                readonly required: readonly ["address"];
                readonly properties: {
                    readonly address: {
                        readonly title: "Address";
                        readonly type: "string";
                    };
                };
            };
            readonly consideration: {
                readonly title: "Consideration";
                readonly description: "If the offer you are fulfilling is a criteria offer, the NFT you are using to fulfill the offer with. The fulfiller account must own this NFT or the request will not succeed.";
                readonly type: "object";
                readonly required: readonly ["asset_contract_address", "token_id"];
                readonly properties: {
                    readonly asset_contract_address: {
                        readonly title: "Asset Contract Address";
                        readonly type: "string";
                    };
                    readonly token_id: {
                        readonly title: "Token Id";
                        readonly description: "NFT Token ID which will be used to fulfill the offer.";
                        readonly type: "string";
                    };
                };
            };
        };
        readonly required: readonly ["offer", "fulfiller"];
        readonly additionalProperties: false;
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly title: "FulfillmentOutput";
            readonly type: "object";
            readonly properties: {
                readonly protocol: {
                    readonly title: "Protocol";
                    readonly description: "Exchange contract address. Must be one of ['0x00000000000000adc04c56bf30ac9d3c0aaf14dc', '0x0000000000000068f116a894984e2db1123eb395']";
                    readonly type: "string";
                };
                readonly fulfillment_data: {
                    readonly title: "Fulfillment Data";
                    readonly description: "All the information, including signatures, needed to fulfill an order directly onchain.";
                    readonly type: "object";
                    readonly required: readonly ["transaction", "orders"];
                    readonly properties: {
                        readonly transaction: {
                            readonly title: "Transaction";
                            readonly description: "The name of the fulfillment method and associated call data.";
                            readonly type: "object";
                            readonly required: readonly ["function", "chain", "to", "value", "input_data"];
                            readonly properties: {
                                readonly function: {
                                    readonly title: "Function";
                                    readonly description: "Seaport protocol contract method to use to fulfill the order.";
                                    readonly type: "string";
                                };
                                readonly chain: {
                                    readonly title: "Chain";
                                    readonly description: "Numeric Chain Identifier.";
                                    readonly type: "integer";
                                };
                                readonly to: {
                                    readonly title: "To";
                                    readonly description: "Protocol contract address to use fto fulfill the order.";
                                    readonly type: "string";
                                };
                                readonly value: {
                                    readonly title: "Value";
                                    readonly description: "Wei value of the transaction.";
                                    readonly type: "integer";
                                };
                                readonly input_data: {
                                    readonly title: "Input Data";
                                    readonly description: "Decoded Call Data.";
                                    readonly type: "object";
                                    readonly additionalProperties: true;
                                };
                            };
                        };
                        readonly orders: {
                            readonly title: "Order";
                            readonly description: "Array of Seaport Orders.";
                            readonly type: "array";
                            readonly items: {
                                readonly title: "SerializedOrder";
                                readonly type: "object";
                                readonly required: readonly ["parameters"];
                                readonly properties: {
                                    readonly parameters: {
                                        readonly title: "Order";
                                        readonly type: "object";
                                        readonly required: readonly ["offerer", "offer", "consideration", "startTime", "endTime", "orderType", "zone", "zoneHash", "salt", "conduitKey", "totalOriginalConsiderationItems", "counter"];
                                        readonly properties: {
                                            readonly offerer: {
                                                readonly title: "Offerer";
                                                readonly description: "The address which supplies all the items in the offer.";
                                                readonly type: "string";
                                            };
                                            readonly offer: {
                                                readonly title: "Offer";
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly title: "SerializedOfferItem";
                                                    readonly type: "object";
                                                    readonly required: readonly ["itemType", "token", "identifierOrCriteria", "startAmount", "endAmount"];
                                                    readonly properties: {
                                                        readonly itemType: {
                                                            readonly title: "ItemType";
                                                            readonly description: "0 - Native - Ether (or other native token for the given chain)\n1 - ERC20\n2 - ERC721\n3 - ERC1155\n4 - ERC721 with criteria\n5 - ERC1155 with criteria\n\n`1` `2` `3` `4` `5`";
                                                            readonly enum: readonly [0, 1, 2, 3, 4, 5];
                                                            readonly type: "integer";
                                                        };
                                                        readonly token: {
                                                            readonly title: "Token";
                                                            readonly description: "The item's token contract (with the null address used for native tokens)";
                                                            readonly type: "string";
                                                        };
                                                        readonly identifierOrCriteria: {
                                                            readonly title: "Identifierorcriteria";
                                                            readonly description: "The ERC721 or ERC1155 token identifier or, in the case of a criteria-based item type, a merkle root composed of the valid set of token identifiers for the item. This value will be ignored for Ether and ERC20 item types, and can optionally be zero for criteria-based item types to allow for any identifier.";
                                                            readonly type: "string";
                                                        };
                                                        readonly startAmount: {
                                                            readonly title: "Startamount";
                                                            readonly description: "The amount of the token in question that will be required should the order be fulfilled.";
                                                            readonly type: "string";
                                                        };
                                                        readonly endAmount: {
                                                            readonly title: "Endamount";
                                                            readonly description: "When endAmount differs from `startAmount`, the realized amount is calculated linearly based on the time elapsed since the order became active.";
                                                            readonly type: "string";
                                                        };
                                                    };
                                                };
                                            };
                                            readonly consideration: {
                                                readonly title: "Consideration";
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly title: "SerializedConsiderationItem";
                                                    readonly type: "object";
                                                    readonly required: readonly ["itemType", "token", "identifierOrCriteria", "startAmount", "endAmount", "recipient"];
                                                    readonly properties: {
                                                        readonly itemType: {
                                                            readonly title: "ItemType";
                                                            readonly description: "0 - Native - Ether (or other native token for the given chain)\n1 - ERC20\n2 - ERC721\n3 - ERC1155\n4 - ERC721 with criteria\n5 - ERC1155 with criteria\n\n`1` `2` `3` `4` `5`";
                                                            readonly enum: readonly [0, 1, 2, 3, 4, 5];
                                                            readonly type: "integer";
                                                        };
                                                        readonly token: {
                                                            readonly title: "Token";
                                                            readonly description: "The item's token contract (with the null address used for native tokens)";
                                                            readonly type: "string";
                                                        };
                                                        readonly identifierOrCriteria: {
                                                            readonly title: "Identifierorcriteria";
                                                            readonly description: "The ERC721 or ERC1155 token identifier or, in the case of a criteria-based item type, a merkle root composed of the valid set of token identifiers for the item. This value will be ignored for Ether and ERC20 item types, and can optionally be zero for criteria-based item types to allow for any identifier.";
                                                            readonly type: "string";
                                                        };
                                                        readonly startAmount: {
                                                            readonly title: "Startamount";
                                                            readonly description: "The amount of the token in question that will be required should the order be fulfilled.";
                                                            readonly type: "string";
                                                        };
                                                        readonly endAmount: {
                                                            readonly title: "Endamount";
                                                            readonly description: "When endAmount differs from `startAmount`, the realized amount is calculated linearly based on the time elapsed since the order became active.";
                                                            readonly type: "string";
                                                        };
                                                        readonly recipient: {
                                                            readonly title: "Recipient";
                                                            readonly description: "The address which will receive the consideration item when the order is executed.";
                                                            readonly type: "string";
                                                        };
                                                    };
                                                };
                                            };
                                            readonly startTime: {
                                                readonly title: "Starttime";
                                                readonly description: "The block timestamp at which the order becomes active";
                                                readonly type: "string";
                                            };
                                            readonly endTime: {
                                                readonly title: "Endtime";
                                                readonly description: "The block timestamp at which the order expires";
                                                readonly type: "string";
                                            };
                                            readonly orderType: {
                                                readonly title: "SeaportOrderType";
                                                readonly description: "The type of order, which determines how it can be executed.\n0 = Full Open - No partial fills, anyone can execute\n1 = Partial Open - Partial fills supported, anyone can execute\n2 = Full Restricted - No partial fills, only offerer or zone can check if it can be executed\n3 = Partial Restricted - Partial fills supported, only offerer or zone can check if it can be executed\n4 = Contract - Contract order type, for contract offerers that can dynamically generate orders. Introduced in Seaport v1.4 and currently unsupported\n\n`1` `2` `3` `4`";
                                                readonly enum: readonly [0, 1, 2, 3, 4];
                                                readonly type: "integer";
                                            };
                                            readonly zone: {
                                                readonly title: "Zone";
                                                readonly description: "Optional secondary account attached the order which can cancel orders. Additionally, when the `OrderType` is Restricted, the zone or the offerer are the only entities which can execute the order.\nFor open orders, use the zero address.\nFor restricted orders, use the signed zone address 0x000056f7000000ece9003ca63978907a00ffd100";
                                                readonly type: "string";
                                            };
                                            readonly zoneHash: {
                                                readonly title: "Zonehash";
                                                readonly description: "A value that will be supplied to the zone when fulfilling restricted orders that the zone can utilize when making a determination on whether to authorize the order. Most often this value will be the zero hash 0x0000000000000000000000000000000000000000000000000000000000000000";
                                                readonly type: "string";
                                            };
                                            readonly salt: {
                                                readonly title: "Salt";
                                                readonly description: "an arbitrary source of entropy for the order";
                                                readonly type: "string";
                                            };
                                            readonly conduitKey: {
                                                readonly title: "Conduitkey";
                                                readonly description: "Indicates what conduit, if any, should be utilized as a source for token approvals when performing transfers. By default (i.e. when conduitKey is set to the zero hash), the offerer will grant transfer approvals to Seaport directly. \nTo utilize OpenSea's conduit, use 0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000";
                                                readonly type: "string";
                                            };
                                            readonly totalOriginalConsiderationItems: {
                                                readonly title: "Totaloriginalconsiderationitems";
                                                readonly description: "Size of the consideration array.";
                                                readonly type: "integer";
                                            };
                                            readonly counter: {
                                                readonly title: "Counter";
                                                readonly anyOf: readonly [{
                                                    readonly type: "integer";
                                                }, {
                                                    readonly type: "string";
                                                }];
                                            };
                                        };
                                    };
                                    readonly signature: {
                                        readonly title: "Signature";
                                        readonly description: "The order maker's signature used to validate the order.";
                                        readonly type: "string";
                                    };
                                };
                            };
                        };
                    };
                };
            };
            readonly required: readonly ["protocol", "fulfillment_data"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetAccount: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly address_or_username: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The public blockchain address or OpenSea username.";
                };
            };
            readonly required: readonly ["address_or_username"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "DetailedAccountDataModel";
            readonly type: "object";
            readonly properties: {
                readonly address: {
                    readonly title: "Address";
                    readonly description: "The public blockchain address of the account.";
                    readonly type: "string";
                };
                readonly username: {
                    readonly title: "Username";
                    readonly description: "The OpenSea account's username.";
                    readonly type: "string";
                };
                readonly profile_image_url: {
                    readonly title: "Profile Image Url";
                    readonly description: "The OpenSea account's image url.";
                    readonly type: "string";
                };
                readonly banner_image_url: {
                    readonly title: "Banner Image Url";
                    readonly description: "The OpenSea account's banner url.";
                    readonly type: "string";
                };
                readonly website: {
                    readonly title: "Website";
                    readonly description: "Personal website for the OpenSea user.";
                    readonly type: "string";
                };
                readonly social_media_accounts: {
                    readonly title: "Social Media Account";
                    readonly default: readonly [];
                    readonly type: "array";
                    readonly items: {
                        readonly title: "SocialMediaAccountModel";
                        readonly type: "object";
                        readonly properties: {
                            readonly platform: {
                                readonly title: "Platform";
                                readonly description: "The social media platform, e.g. twitter or instagram";
                                readonly type: "string";
                            };
                            readonly username: {
                                readonly title: "Username";
                                readonly description: "The username for the social media platform";
                                readonly type: "string";
                            };
                        };
                        readonly required: readonly ["platform", "username"];
                    };
                };
                readonly bio: {
                    readonly title: "Bio";
                    readonly description: "The OpenSea account's bio.";
                    readonly type: "string";
                };
                readonly joined_date: {
                    readonly title: "Joined Date";
                    readonly description: "Date the account was first added to OpenSea.";
                    readonly type: "string";
                    readonly format: "date";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetAllListingsOnCollectionV2: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly collection_slug: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Unique string to identify a collection on OpenSea. This can be found by visiting the collection on the OpenSea website and noting the last path parameter.";
                };
            };
            readonly required: readonly ["collection_slug"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly limit: {
                    readonly type: "integer";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The number of listings to return. Must be between 1 and 100. Default: 100";
                };
                readonly next: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The cursor for the next page of results. This is returned from a previous request.";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "Paginated Listing List";
            readonly type: "object";
            readonly properties: {
                readonly listings: {
                    readonly title: "Listings";
                    readonly description: "OpenSea Listings";
                    readonly type: "array";
                    readonly items: {
                        readonly title: "Listing";
                        readonly type: "object";
                        readonly properties: {
                            readonly order_hash: {
                                readonly title: "Order Hash";
                                readonly description: "Order hash";
                                readonly type: "string";
                            };
                            readonly chain: {
                                readonly description: "OpenSea supported chains.";
                                readonly title: "ChainIdentifier";
                                readonly enum: readonly ["ethereum", "matic", "klaytn", "bsc", "solana", "arbitrum", "arbitrum_nova", "avalanche", "optimism", "base", "blast", "sei", "zora", "sepolia", "rinkeby", "mumbai", "amoy", "baobab", "bsctestnet", "goerli", "soldev", "arbitrum_goerli", "arbitrum_sepolia", "avalanche_fuji", "optimism_goerli", "optimism_sepolia", "base_goerli", "base_sepolia", "blast_sepolia", "gunzilla_testnet", "sei_devnet", "zora_testnet", "zora_sepolia"];
                            };
                            readonly type: {
                                readonly title: "OrderType";
                                readonly description: "basic - Quantities are fixed. Used for fixed price listings and offers.\nenglish - The quantity represents the minimum price.\ncriteria - The items that are accepted by this offer will be found in the criteria fields.\n\n`basic` `dutch` `english` `criteria`";
                                readonly enum: readonly ["basic", "dutch", "english", "criteria"];
                                readonly properties: {};
                                readonly type: "object";
                            };
                            readonly price: {
                                readonly title: "BasicListingPrice";
                                readonly type: "object";
                                readonly properties: {
                                    readonly current: {
                                        readonly title: "Price";
                                        readonly type: "object";
                                        readonly required: readonly ["currency", "decimals", "value"];
                                        readonly properties: {
                                            readonly currency: {
                                                readonly title: "Currency";
                                                readonly type: "string";
                                            };
                                            readonly decimals: {
                                                readonly title: "Decimals";
                                                readonly type: "integer";
                                            };
                                            readonly value: {
                                                readonly title: "Value";
                                                readonly type: "string";
                                            };
                                        };
                                    };
                                };
                                readonly required: readonly ["current"];
                            };
                            readonly protocol_data: {
                                readonly title: "Protocol Data";
                                readonly description: "The onchain order data.";
                                readonly type: "object";
                                readonly required: readonly ["parameters"];
                                readonly properties: {
                                    readonly parameters: {
                                        readonly title: "Order";
                                        readonly type: "object";
                                        readonly required: readonly ["offerer", "offer", "consideration", "startTime", "endTime", "orderType", "zone", "zoneHash", "salt", "conduitKey", "totalOriginalConsiderationItems", "counter"];
                                        readonly properties: {
                                            readonly offerer: {
                                                readonly title: "Offerer";
                                                readonly description: "The address which supplies all the items in the offer.";
                                                readonly type: "string";
                                            };
                                            readonly offer: {
                                                readonly title: "Offer";
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly title: "SerializedOfferItem";
                                                    readonly type: "object";
                                                    readonly required: readonly ["itemType", "token", "identifierOrCriteria", "startAmount", "endAmount"];
                                                    readonly properties: {
                                                        readonly itemType: {
                                                            readonly title: "ItemType";
                                                            readonly description: "0 - Native - Ether (or other native token for the given chain)\n1 - ERC20\n2 - ERC721\n3 - ERC1155\n4 - ERC721 with criteria\n5 - ERC1155 with criteria\n\n`1` `2` `3` `4` `5`";
                                                            readonly enum: readonly [0, 1, 2, 3, 4, 5];
                                                            readonly type: "integer";
                                                        };
                                                        readonly token: {
                                                            readonly title: "Token";
                                                            readonly description: "The item's token contract (with the null address used for native tokens)";
                                                            readonly type: "string";
                                                        };
                                                        readonly identifierOrCriteria: {
                                                            readonly title: "Identifierorcriteria";
                                                            readonly description: "The ERC721 or ERC1155 token identifier or, in the case of a criteria-based item type, a merkle root composed of the valid set of token identifiers for the item. This value will be ignored for Ether and ERC20 item types, and can optionally be zero for criteria-based item types to allow for any identifier.";
                                                            readonly type: "string";
                                                        };
                                                        readonly startAmount: {
                                                            readonly title: "Startamount";
                                                            readonly description: "The amount of the token in question that will be required should the order be fulfilled.";
                                                            readonly type: "string";
                                                        };
                                                        readonly endAmount: {
                                                            readonly title: "Endamount";
                                                            readonly description: "When endAmount differs from `startAmount`, the realized amount is calculated linearly based on the time elapsed since the order became active.";
                                                            readonly type: "string";
                                                        };
                                                    };
                                                };
                                            };
                                            readonly consideration: {
                                                readonly title: "Consideration";
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly title: "SerializedConsiderationItem";
                                                    readonly type: "object";
                                                    readonly required: readonly ["itemType", "token", "identifierOrCriteria", "startAmount", "endAmount", "recipient"];
                                                    readonly properties: {
                                                        readonly itemType: {
                                                            readonly title: "ItemType";
                                                            readonly description: "0 - Native - Ether (or other native token for the given chain)\n1 - ERC20\n2 - ERC721\n3 - ERC1155\n4 - ERC721 with criteria\n5 - ERC1155 with criteria\n\n`1` `2` `3` `4` `5`";
                                                            readonly enum: readonly [0, 1, 2, 3, 4, 5];
                                                            readonly type: "integer";
                                                        };
                                                        readonly token: {
                                                            readonly title: "Token";
                                                            readonly description: "The item's token contract (with the null address used for native tokens)";
                                                            readonly type: "string";
                                                        };
                                                        readonly identifierOrCriteria: {
                                                            readonly title: "Identifierorcriteria";
                                                            readonly description: "The ERC721 or ERC1155 token identifier or, in the case of a criteria-based item type, a merkle root composed of the valid set of token identifiers for the item. This value will be ignored for Ether and ERC20 item types, and can optionally be zero for criteria-based item types to allow for any identifier.";
                                                            readonly type: "string";
                                                        };
                                                        readonly startAmount: {
                                                            readonly title: "Startamount";
                                                            readonly description: "The amount of the token in question that will be required should the order be fulfilled.";
                                                            readonly type: "string";
                                                        };
                                                        readonly endAmount: {
                                                            readonly title: "Endamount";
                                                            readonly description: "When endAmount differs from `startAmount`, the realized amount is calculated linearly based on the time elapsed since the order became active.";
                                                            readonly type: "string";
                                                        };
                                                        readonly recipient: {
                                                            readonly title: "Recipient";
                                                            readonly description: "The address which will receive the consideration item when the order is executed.";
                                                            readonly type: "string";
                                                        };
                                                    };
                                                };
                                            };
                                            readonly startTime: {
                                                readonly title: "Starttime";
                                                readonly description: "The block timestamp at which the order becomes active";
                                                readonly type: "string";
                                            };
                                            readonly endTime: {
                                                readonly title: "Endtime";
                                                readonly description: "The block timestamp at which the order expires";
                                                readonly type: "string";
                                            };
                                            readonly orderType: {
                                                readonly title: "SeaportOrderType";
                                                readonly description: "The type of order, which determines how it can be executed.\n0 = Full Open - No partial fills, anyone can execute\n1 = Partial Open - Partial fills supported, anyone can execute\n2 = Full Restricted - No partial fills, only offerer or zone can check if it can be executed\n3 = Partial Restricted - Partial fills supported, only offerer or zone can check if it can be executed\n4 = Contract - Contract order type, for contract offerers that can dynamically generate orders. Introduced in Seaport v1.4 and currently unsupported\n\n`1` `2` `3` `4`";
                                                readonly enum: readonly [0, 1, 2, 3, 4];
                                                readonly type: "integer";
                                            };
                                            readonly zone: {
                                                readonly title: "Zone";
                                                readonly description: "Optional secondary account attached the order which can cancel orders. Additionally, when the `OrderType` is Restricted, the zone or the offerer are the only entities which can execute the order.\nFor open orders, use the zero address.\nFor restricted orders, use the signed zone address 0x000056f7000000ece9003ca63978907a00ffd100";
                                                readonly type: "string";
                                            };
                                            readonly zoneHash: {
                                                readonly title: "Zonehash";
                                                readonly description: "A value that will be supplied to the zone when fulfilling restricted orders that the zone can utilize when making a determination on whether to authorize the order. Most often this value will be the zero hash 0x0000000000000000000000000000000000000000000000000000000000000000";
                                                readonly type: "string";
                                            };
                                            readonly salt: {
                                                readonly title: "Salt";
                                                readonly description: "an arbitrary source of entropy for the order";
                                                readonly type: "string";
                                            };
                                            readonly conduitKey: {
                                                readonly title: "Conduitkey";
                                                readonly description: "Indicates what conduit, if any, should be utilized as a source for token approvals when performing transfers. By default (i.e. when conduitKey is set to the zero hash), the offerer will grant transfer approvals to Seaport directly. \nTo utilize OpenSea's conduit, use 0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000";
                                                readonly type: "string";
                                            };
                                            readonly totalOriginalConsiderationItems: {
                                                readonly title: "Totaloriginalconsiderationitems";
                                                readonly description: "Size of the consideration array.";
                                                readonly type: "integer";
                                            };
                                            readonly counter: {
                                                readonly title: "Counter";
                                                readonly anyOf: readonly [{
                                                    readonly type: "integer";
                                                }, {
                                                    readonly type: "string";
                                                }];
                                            };
                                        };
                                    };
                                    readonly signature: {
                                        readonly title: "Signature";
                                        readonly description: "The order maker's signature used to validate the order.";
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly protocol_address: {
                                readonly title: "Protocol Address";
                                readonly description: "Exchange contract address";
                                readonly type: "string";
                            };
                        };
                        readonly required: readonly ["order_hash", "chain", "type", "price", "protocol_data", "protocol_address"];
                    };
                };
                readonly next: {
                    readonly title: "Next";
                    readonly description: "Cursor for the next page of results";
                    readonly type: "string";
                };
            };
            readonly required: readonly ["listings", "next"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetAllOffersOnCollectionV2: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly collection_slug: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Unique string to identify a collection on OpenSea. This can be found by visiting the collection on the OpenSea website and noting the last path parameter.";
                };
            };
            readonly required: readonly ["collection_slug"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly limit: {
                    readonly type: "integer";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The number of offers to return. Must be between 1 and 100. Default: 100";
                };
                readonly next: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The cursor for the next page of results. This is returned from a previous request.";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "Paginated Offer List";
            readonly type: "object";
            readonly properties: {
                readonly offers: {
                    readonly title: "Offers";
                    readonly type: "array";
                    readonly items: {
                        readonly title: "Offer";
                        readonly type: "object";
                        readonly properties: {
                            readonly order_hash: {
                                readonly title: "Order Hash";
                                readonly description: "Order hash";
                                readonly type: "string";
                            };
                            readonly chain: {
                                readonly title: "ChainIdentifier";
                                readonly description: "OpenSea supported chains.\n\n`ethereum` `matic` `klaytn` `bsc` `solana` `arbitrum` `arbitrum_nova` `avalanche` `optimism` `base` `blast` `sei` `zora` `sepolia` `rinkeby` `mumbai` `amoy` `baobab` `bsctestnet` `goerli` `soldev` `arbitrum_goerli` `arbitrum_sepolia` `avalanche_fuji` `optimism_goerli` `optimism_sepolia` `base_goerli` `base_sepolia` `blast_sepolia` `gunzilla_testnet` `sei_devnet` `zora_testnet` `zora_sepolia`";
                                readonly enum: readonly ["ethereum", "matic", "klaytn", "bsc", "solana", "arbitrum", "arbitrum_nova", "avalanche", "optimism", "base", "blast", "sei", "zora", "sepolia", "rinkeby", "mumbai", "amoy", "baobab", "bsctestnet", "goerli", "soldev", "arbitrum_goerli", "arbitrum_sepolia", "avalanche_fuji", "optimism_goerli", "optimism_sepolia", "base_goerli", "base_sepolia", "blast_sepolia", "gunzilla_testnet", "sei_devnet", "zora_testnet", "zora_sepolia"];
                                readonly properties: {};
                                readonly type: "object";
                            };
                            readonly price: {
                                readonly title: "PriceModel";
                                readonly type: "object";
                                readonly properties: {
                                    readonly currency: {
                                        readonly title: "Currency";
                                        readonly type: "string";
                                    };
                                    readonly decimals: {
                                        readonly title: "Decimals";
                                        readonly type: "integer";
                                    };
                                    readonly value: {
                                        readonly title: "Value";
                                        readonly type: "string";
                                    };
                                };
                                readonly required: readonly ["currency", "decimals", "value"];
                            };
                            readonly criteria: {
                                readonly title: "Criteria";
                                readonly description: "Criteria for collection or trait offers";
                                readonly type: "object";
                                readonly required: readonly ["collection", "contract"];
                                readonly properties: {
                                    readonly collection: {
                                        readonly title: "Collection";
                                        readonly description: "The collection in which the criteria offer is being made for.";
                                        readonly type: "object";
                                        readonly required: readonly ["slug"];
                                        readonly properties: {
                                            readonly slug: {
                                                readonly title: "Slug";
                                                readonly description: "Unique string to identify a collection on OpenSea. This can be found by visiting the collection on the OpenSea website and noting the last path parameter.";
                                                readonly type: "string";
                                            };
                                        };
                                    };
                                    readonly contract: {
                                        readonly title: "Contract";
                                        readonly description: "The public blockchain address of the NFT contract";
                                        readonly type: "object";
                                        readonly required: readonly ["address"];
                                        readonly properties: {
                                            readonly address: {
                                                readonly title: "Address";
                                                readonly type: "string";
                                            };
                                        };
                                    };
                                    readonly trait: {
                                        readonly title: "Trait";
                                        readonly description: "The trait that the criteria offer is being made for.";
                                        readonly type: "object";
                                        readonly required: readonly ["type", "value"];
                                        readonly properties: {
                                            readonly type: {
                                                readonly title: "Type";
                                                readonly type: "string";
                                            };
                                            readonly value: {
                                                readonly title: "Value";
                                                readonly type: "string";
                                            };
                                        };
                                    };
                                    readonly encoded_token_ids: {
                                        readonly title: "Encoded Token Ids";
                                        readonly description: "Represents a list of token ids which can be used to fulfill the criteria offer. When decoded using the provided SDK function, developers can now see a list of all tokens that could be used to fulfill the offer.";
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly protocol_data: {
                                readonly title: "Protocol Data";
                                readonly description: "The onchain order data.";
                                readonly type: "object";
                                readonly required: readonly ["parameters"];
                                readonly properties: {
                                    readonly parameters: {
                                        readonly title: "Order";
                                        readonly type: "object";
                                        readonly required: readonly ["offerer", "offer", "consideration", "startTime", "endTime", "orderType", "zone", "zoneHash", "salt", "conduitKey", "totalOriginalConsiderationItems", "counter"];
                                        readonly properties: {
                                            readonly offerer: {
                                                readonly title: "Offerer";
                                                readonly description: "The address which supplies all the items in the offer.";
                                                readonly type: "string";
                                            };
                                            readonly offer: {
                                                readonly title: "Offer";
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly title: "SerializedOfferItem";
                                                    readonly type: "object";
                                                    readonly required: readonly ["itemType", "token", "identifierOrCriteria", "startAmount", "endAmount"];
                                                    readonly properties: {
                                                        readonly itemType: {
                                                            readonly title: "ItemType";
                                                            readonly description: "0 - Native - Ether (or other native token for the given chain)\n1 - ERC20\n2 - ERC721\n3 - ERC1155\n4 - ERC721 with criteria\n5 - ERC1155 with criteria\n\n`1` `2` `3` `4` `5`";
                                                            readonly enum: readonly [0, 1, 2, 3, 4, 5];
                                                            readonly type: "integer";
                                                        };
                                                        readonly token: {
                                                            readonly title: "Token";
                                                            readonly description: "The item's token contract (with the null address used for native tokens)";
                                                            readonly type: "string";
                                                        };
                                                        readonly identifierOrCriteria: {
                                                            readonly title: "Identifierorcriteria";
                                                            readonly description: "The ERC721 or ERC1155 token identifier or, in the case of a criteria-based item type, a merkle root composed of the valid set of token identifiers for the item. This value will be ignored for Ether and ERC20 item types, and can optionally be zero for criteria-based item types to allow for any identifier.";
                                                            readonly type: "string";
                                                        };
                                                        readonly startAmount: {
                                                            readonly title: "Startamount";
                                                            readonly description: "The amount of the token in question that will be required should the order be fulfilled.";
                                                            readonly type: "string";
                                                        };
                                                        readonly endAmount: {
                                                            readonly title: "Endamount";
                                                            readonly description: "When endAmount differs from `startAmount`, the realized amount is calculated linearly based on the time elapsed since the order became active.";
                                                            readonly type: "string";
                                                        };
                                                    };
                                                };
                                            };
                                            readonly consideration: {
                                                readonly title: "Consideration";
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly title: "SerializedConsiderationItem";
                                                    readonly type: "object";
                                                    readonly required: readonly ["itemType", "token", "identifierOrCriteria", "startAmount", "endAmount", "recipient"];
                                                    readonly properties: {
                                                        readonly itemType: {
                                                            readonly title: "ItemType";
                                                            readonly description: "0 - Native - Ether (or other native token for the given chain)\n1 - ERC20\n2 - ERC721\n3 - ERC1155\n4 - ERC721 with criteria\n5 - ERC1155 with criteria\n\n`1` `2` `3` `4` `5`";
                                                            readonly enum: readonly [0, 1, 2, 3, 4, 5];
                                                            readonly type: "integer";
                                                        };
                                                        readonly token: {
                                                            readonly title: "Token";
                                                            readonly description: "The item's token contract (with the null address used for native tokens)";
                                                            readonly type: "string";
                                                        };
                                                        readonly identifierOrCriteria: {
                                                            readonly title: "Identifierorcriteria";
                                                            readonly description: "The ERC721 or ERC1155 token identifier or, in the case of a criteria-based item type, a merkle root composed of the valid set of token identifiers for the item. This value will be ignored for Ether and ERC20 item types, and can optionally be zero for criteria-based item types to allow for any identifier.";
                                                            readonly type: "string";
                                                        };
                                                        readonly startAmount: {
                                                            readonly title: "Startamount";
                                                            readonly description: "The amount of the token in question that will be required should the order be fulfilled.";
                                                            readonly type: "string";
                                                        };
                                                        readonly endAmount: {
                                                            readonly title: "Endamount";
                                                            readonly description: "When endAmount differs from `startAmount`, the realized amount is calculated linearly based on the time elapsed since the order became active.";
                                                            readonly type: "string";
                                                        };
                                                        readonly recipient: {
                                                            readonly title: "Recipient";
                                                            readonly description: "The address which will receive the consideration item when the order is executed.";
                                                            readonly type: "string";
                                                        };
                                                    };
                                                };
                                            };
                                            readonly startTime: {
                                                readonly title: "Starttime";
                                                readonly description: "The block timestamp at which the order becomes active";
                                                readonly type: "string";
                                            };
                                            readonly endTime: {
                                                readonly title: "Endtime";
                                                readonly description: "The block timestamp at which the order expires";
                                                readonly type: "string";
                                            };
                                            readonly orderType: {
                                                readonly title: "SeaportOrderType";
                                                readonly description: "The type of order, which determines how it can be executed.\n0 = Full Open - No partial fills, anyone can execute\n1 = Partial Open - Partial fills supported, anyone can execute\n2 = Full Restricted - No partial fills, only offerer or zone can check if it can be executed\n3 = Partial Restricted - Partial fills supported, only offerer or zone can check if it can be executed\n4 = Contract - Contract order type, for contract offerers that can dynamically generate orders. Introduced in Seaport v1.4 and currently unsupported\n\n`1` `2` `3` `4`";
                                                readonly enum: readonly [0, 1, 2, 3, 4];
                                                readonly type: "integer";
                                            };
                                            readonly zone: {
                                                readonly title: "Zone";
                                                readonly description: "Optional secondary account attached the order which can cancel orders. Additionally, when the `OrderType` is Restricted, the zone or the offerer are the only entities which can execute the order.\nFor open orders, use the zero address.\nFor restricted orders, use the signed zone address 0x000056f7000000ece9003ca63978907a00ffd100";
                                                readonly type: "string";
                                            };
                                            readonly zoneHash: {
                                                readonly title: "Zonehash";
                                                readonly description: "A value that will be supplied to the zone when fulfilling restricted orders that the zone can utilize when making a determination on whether to authorize the order. Most often this value will be the zero hash 0x0000000000000000000000000000000000000000000000000000000000000000";
                                                readonly type: "string";
                                            };
                                            readonly salt: {
                                                readonly title: "Salt";
                                                readonly description: "an arbitrary source of entropy for the order";
                                                readonly type: "string";
                                            };
                                            readonly conduitKey: {
                                                readonly title: "Conduitkey";
                                                readonly description: "Indicates what conduit, if any, should be utilized as a source for token approvals when performing transfers. By default (i.e. when conduitKey is set to the zero hash), the offerer will grant transfer approvals to Seaport directly. \nTo utilize OpenSea's conduit, use 0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000";
                                                readonly type: "string";
                                            };
                                            readonly totalOriginalConsiderationItems: {
                                                readonly title: "Totaloriginalconsiderationitems";
                                                readonly description: "Size of the consideration array.";
                                                readonly type: "integer";
                                            };
                                            readonly counter: {
                                                readonly title: "Counter";
                                                readonly anyOf: readonly [{
                                                    readonly type: "integer";
                                                }, {
                                                    readonly type: "string";
                                                }];
                                            };
                                        };
                                    };
                                    readonly signature: {
                                        readonly title: "Signature";
                                        readonly description: "The order maker's signature used to validate the order.";
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly protocol_address: {
                                readonly title: "Protocol Address";
                                readonly description: "Exchange contract address";
                                readonly type: "string";
                            };
                        };
                        readonly required: readonly ["order_hash", "chain", "price", "criteria", "protocol_data", "protocol_address"];
                    };
                };
                readonly next: {
                    readonly title: "Next";
                    readonly description: "Cursor for the next page of results";
                    readonly type: "string";
                };
            };
            readonly required: readonly ["offers", "next"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetBestListingOnNftV2: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly collection_slug: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Unique string to identify a collection on OpenSea. This can be found by visiting the collection on the OpenSea website and noting the last path parameter.";
                };
                readonly identifier: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The NFT token id.";
                };
            };
            readonly required: readonly ["collection_slug", "identifier"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "Listing";
            readonly type: "object";
            readonly properties: {
                readonly order_hash: {
                    readonly title: "Order Hash";
                    readonly description: "Order hash";
                    readonly type: "string";
                };
                readonly chain: {
                    readonly description: "OpenSea supported chains.";
                    readonly title: "ChainIdentifier";
                    readonly enum: readonly ["ethereum", "matic", "klaytn", "bsc", "solana", "arbitrum", "arbitrum_nova", "avalanche", "optimism", "base", "blast", "sei", "zora", "sepolia", "rinkeby", "mumbai", "amoy", "baobab", "bsctestnet", "goerli", "soldev", "arbitrum_goerli", "arbitrum_sepolia", "avalanche_fuji", "optimism_goerli", "optimism_sepolia", "base_goerli", "base_sepolia", "blast_sepolia", "gunzilla_testnet", "sei_devnet", "zora_testnet", "zora_sepolia"];
                };
                readonly type: {
                    readonly title: "OrderType";
                    readonly description: "basic - Quantities are fixed. Used for fixed price listings and offers.\nenglish - The quantity represents the minimum price.\ncriteria - The items that are accepted by this offer will be found in the criteria fields.\n\n`basic` `dutch` `english` `criteria`";
                    readonly enum: readonly ["basic", "dutch", "english", "criteria"];
                    readonly properties: {};
                    readonly type: "object";
                };
                readonly price: {
                    readonly title: "BasicListingPrice";
                    readonly type: "object";
                    readonly properties: {
                        readonly current: {
                            readonly title: "Price";
                            readonly type: "object";
                            readonly required: readonly ["currency", "decimals", "value"];
                            readonly properties: {
                                readonly currency: {
                                    readonly title: "Currency";
                                    readonly type: "string";
                                };
                                readonly decimals: {
                                    readonly title: "Decimals";
                                    readonly type: "integer";
                                };
                                readonly value: {
                                    readonly title: "Value";
                                    readonly type: "string";
                                };
                            };
                        };
                    };
                    readonly required: readonly ["current"];
                };
                readonly protocol_data: {
                    readonly title: "Protocol Data";
                    readonly description: "The onchain order data.";
                    readonly type: "object";
                    readonly required: readonly ["parameters"];
                    readonly properties: {
                        readonly parameters: {
                            readonly title: "Order";
                            readonly type: "object";
                            readonly required: readonly ["offerer", "offer", "consideration", "startTime", "endTime", "orderType", "zone", "zoneHash", "salt", "conduitKey", "totalOriginalConsiderationItems", "counter"];
                            readonly properties: {
                                readonly offerer: {
                                    readonly title: "Offerer";
                                    readonly description: "The address which supplies all the items in the offer.";
                                    readonly type: "string";
                                };
                                readonly offer: {
                                    readonly title: "Offer";
                                    readonly type: "array";
                                    readonly items: {
                                        readonly title: "SerializedOfferItem";
                                        readonly type: "object";
                                        readonly required: readonly ["itemType", "token", "identifierOrCriteria", "startAmount", "endAmount"];
                                        readonly properties: {
                                            readonly itemType: {
                                                readonly title: "ItemType";
                                                readonly description: "0 - Native - Ether (or other native token for the given chain)\n1 - ERC20\n2 - ERC721\n3 - ERC1155\n4 - ERC721 with criteria\n5 - ERC1155 with criteria\n\n`1` `2` `3` `4` `5`";
                                                readonly enum: readonly [0, 1, 2, 3, 4, 5];
                                                readonly type: "integer";
                                            };
                                            readonly token: {
                                                readonly title: "Token";
                                                readonly description: "The item's token contract (with the null address used for native tokens)";
                                                readonly type: "string";
                                            };
                                            readonly identifierOrCriteria: {
                                                readonly title: "Identifierorcriteria";
                                                readonly description: "The ERC721 or ERC1155 token identifier or, in the case of a criteria-based item type, a merkle root composed of the valid set of token identifiers for the item. This value will be ignored for Ether and ERC20 item types, and can optionally be zero for criteria-based item types to allow for any identifier.";
                                                readonly type: "string";
                                            };
                                            readonly startAmount: {
                                                readonly title: "Startamount";
                                                readonly description: "The amount of the token in question that will be required should the order be fulfilled.";
                                                readonly type: "string";
                                            };
                                            readonly endAmount: {
                                                readonly title: "Endamount";
                                                readonly description: "When endAmount differs from `startAmount`, the realized amount is calculated linearly based on the time elapsed since the order became active.";
                                                readonly type: "string";
                                            };
                                        };
                                    };
                                };
                                readonly consideration: {
                                    readonly title: "Consideration";
                                    readonly type: "array";
                                    readonly items: {
                                        readonly title: "SerializedConsiderationItem";
                                        readonly type: "object";
                                        readonly required: readonly ["itemType", "token", "identifierOrCriteria", "startAmount", "endAmount", "recipient"];
                                        readonly properties: {
                                            readonly itemType: {
                                                readonly title: "ItemType";
                                                readonly description: "0 - Native - Ether (or other native token for the given chain)\n1 - ERC20\n2 - ERC721\n3 - ERC1155\n4 - ERC721 with criteria\n5 - ERC1155 with criteria\n\n`1` `2` `3` `4` `5`";
                                                readonly enum: readonly [0, 1, 2, 3, 4, 5];
                                                readonly type: "integer";
                                            };
                                            readonly token: {
                                                readonly title: "Token";
                                                readonly description: "The item's token contract (with the null address used for native tokens)";
                                                readonly type: "string";
                                            };
                                            readonly identifierOrCriteria: {
                                                readonly title: "Identifierorcriteria";
                                                readonly description: "The ERC721 or ERC1155 token identifier or, in the case of a criteria-based item type, a merkle root composed of the valid set of token identifiers for the item. This value will be ignored for Ether and ERC20 item types, and can optionally be zero for criteria-based item types to allow for any identifier.";
                                                readonly type: "string";
                                            };
                                            readonly startAmount: {
                                                readonly title: "Startamount";
                                                readonly description: "The amount of the token in question that will be required should the order be fulfilled.";
                                                readonly type: "string";
                                            };
                                            readonly endAmount: {
                                                readonly title: "Endamount";
                                                readonly description: "When endAmount differs from `startAmount`, the realized amount is calculated linearly based on the time elapsed since the order became active.";
                                                readonly type: "string";
                                            };
                                            readonly recipient: {
                                                readonly title: "Recipient";
                                                readonly description: "The address which will receive the consideration item when the order is executed.";
                                                readonly type: "string";
                                            };
                                        };
                                    };
                                };
                                readonly startTime: {
                                    readonly title: "Starttime";
                                    readonly description: "The block timestamp at which the order becomes active";
                                    readonly type: "string";
                                };
                                readonly endTime: {
                                    readonly title: "Endtime";
                                    readonly description: "The block timestamp at which the order expires";
                                    readonly type: "string";
                                };
                                readonly orderType: {
                                    readonly title: "SeaportOrderType";
                                    readonly description: "The type of order, which determines how it can be executed.\n0 = Full Open - No partial fills, anyone can execute\n1 = Partial Open - Partial fills supported, anyone can execute\n2 = Full Restricted - No partial fills, only offerer or zone can check if it can be executed\n3 = Partial Restricted - Partial fills supported, only offerer or zone can check if it can be executed\n4 = Contract - Contract order type, for contract offerers that can dynamically generate orders. Introduced in Seaport v1.4 and currently unsupported\n\n`1` `2` `3` `4`";
                                    readonly enum: readonly [0, 1, 2, 3, 4];
                                    readonly type: "integer";
                                };
                                readonly zone: {
                                    readonly title: "Zone";
                                    readonly description: "Optional secondary account attached the order which can cancel orders. Additionally, when the `OrderType` is Restricted, the zone or the offerer are the only entities which can execute the order.\nFor open orders, use the zero address.\nFor restricted orders, use the signed zone address 0x000056f7000000ece9003ca63978907a00ffd100";
                                    readonly type: "string";
                                };
                                readonly zoneHash: {
                                    readonly title: "Zonehash";
                                    readonly description: "A value that will be supplied to the zone when fulfilling restricted orders that the zone can utilize when making a determination on whether to authorize the order. Most often this value will be the zero hash 0x0000000000000000000000000000000000000000000000000000000000000000";
                                    readonly type: "string";
                                };
                                readonly salt: {
                                    readonly title: "Salt";
                                    readonly description: "an arbitrary source of entropy for the order";
                                    readonly type: "string";
                                };
                                readonly conduitKey: {
                                    readonly title: "Conduitkey";
                                    readonly description: "Indicates what conduit, if any, should be utilized as a source for token approvals when performing transfers. By default (i.e. when conduitKey is set to the zero hash), the offerer will grant transfer approvals to Seaport directly. \nTo utilize OpenSea's conduit, use 0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000";
                                    readonly type: "string";
                                };
                                readonly totalOriginalConsiderationItems: {
                                    readonly title: "Totaloriginalconsiderationitems";
                                    readonly description: "Size of the consideration array.";
                                    readonly type: "integer";
                                };
                                readonly counter: {
                                    readonly title: "Counter";
                                    readonly anyOf: readonly [{
                                        readonly type: "integer";
                                    }, {
                                        readonly type: "string";
                                    }];
                                };
                            };
                        };
                        readonly signature: {
                            readonly title: "Signature";
                            readonly description: "The order maker's signature used to validate the order.";
                            readonly type: "string";
                        };
                    };
                };
                readonly protocol_address: {
                    readonly title: "Protocol Address";
                    readonly description: "Exchange contract address";
                    readonly type: "string";
                };
            };
            readonly required: readonly ["order_hash", "chain", "type", "price", "protocol_data", "protocol_address"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetBestListingsOnCollectionV2: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly collection_slug: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Unique string to identify a collection on OpenSea. This can be found by visiting the collection on the OpenSea website and noting the last path parameter.";
                };
            };
            readonly required: readonly ["collection_slug"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly limit: {
                    readonly type: "integer";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The number of listings to return. Must be between 1 and 100. Default: 100";
                };
                readonly next: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The cursor for the next page of results. This is returned from a previous request.";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "Paginated Listing List";
            readonly type: "object";
            readonly properties: {
                readonly listings: {
                    readonly title: "Listings";
                    readonly description: "OpenSea Listings";
                    readonly type: "array";
                    readonly items: {
                        readonly title: "Listing";
                        readonly type: "object";
                        readonly properties: {
                            readonly order_hash: {
                                readonly title: "Order Hash";
                                readonly description: "Order hash";
                                readonly type: "string";
                            };
                            readonly chain: {
                                readonly description: "OpenSea supported chains.";
                                readonly title: "ChainIdentifier";
                                readonly enum: readonly ["ethereum", "matic", "klaytn", "bsc", "solana", "arbitrum", "arbitrum_nova", "avalanche", "optimism", "base", "blast", "sei", "zora", "sepolia", "rinkeby", "mumbai", "amoy", "baobab", "bsctestnet", "goerli", "soldev", "arbitrum_goerli", "arbitrum_sepolia", "avalanche_fuji", "optimism_goerli", "optimism_sepolia", "base_goerli", "base_sepolia", "blast_sepolia", "gunzilla_testnet", "sei_devnet", "zora_testnet", "zora_sepolia"];
                            };
                            readonly type: {
                                readonly title: "OrderType";
                                readonly description: "basic - Quantities are fixed. Used for fixed price listings and offers.\nenglish - The quantity represents the minimum price.\ncriteria - The items that are accepted by this offer will be found in the criteria fields.\n\n`basic` `dutch` `english` `criteria`";
                                readonly enum: readonly ["basic", "dutch", "english", "criteria"];
                                readonly properties: {};
                                readonly type: "object";
                            };
                            readonly price: {
                                readonly title: "BasicListingPrice";
                                readonly type: "object";
                                readonly properties: {
                                    readonly current: {
                                        readonly title: "Price";
                                        readonly type: "object";
                                        readonly required: readonly ["currency", "decimals", "value"];
                                        readonly properties: {
                                            readonly currency: {
                                                readonly title: "Currency";
                                                readonly type: "string";
                                            };
                                            readonly decimals: {
                                                readonly title: "Decimals";
                                                readonly type: "integer";
                                            };
                                            readonly value: {
                                                readonly title: "Value";
                                                readonly type: "string";
                                            };
                                        };
                                    };
                                };
                                readonly required: readonly ["current"];
                            };
                            readonly protocol_data: {
                                readonly title: "Protocol Data";
                                readonly description: "The onchain order data.";
                                readonly type: "object";
                                readonly required: readonly ["parameters"];
                                readonly properties: {
                                    readonly parameters: {
                                        readonly title: "Order";
                                        readonly type: "object";
                                        readonly required: readonly ["offerer", "offer", "consideration", "startTime", "endTime", "orderType", "zone", "zoneHash", "salt", "conduitKey", "totalOriginalConsiderationItems", "counter"];
                                        readonly properties: {
                                            readonly offerer: {
                                                readonly title: "Offerer";
                                                readonly description: "The address which supplies all the items in the offer.";
                                                readonly type: "string";
                                            };
                                            readonly offer: {
                                                readonly title: "Offer";
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly title: "SerializedOfferItem";
                                                    readonly type: "object";
                                                    readonly required: readonly ["itemType", "token", "identifierOrCriteria", "startAmount", "endAmount"];
                                                    readonly properties: {
                                                        readonly itemType: {
                                                            readonly title: "ItemType";
                                                            readonly description: "0 - Native - Ether (or other native token for the given chain)\n1 - ERC20\n2 - ERC721\n3 - ERC1155\n4 - ERC721 with criteria\n5 - ERC1155 with criteria\n\n`1` `2` `3` `4` `5`";
                                                            readonly enum: readonly [0, 1, 2, 3, 4, 5];
                                                            readonly type: "integer";
                                                        };
                                                        readonly token: {
                                                            readonly title: "Token";
                                                            readonly description: "The item's token contract (with the null address used for native tokens)";
                                                            readonly type: "string";
                                                        };
                                                        readonly identifierOrCriteria: {
                                                            readonly title: "Identifierorcriteria";
                                                            readonly description: "The ERC721 or ERC1155 token identifier or, in the case of a criteria-based item type, a merkle root composed of the valid set of token identifiers for the item. This value will be ignored for Ether and ERC20 item types, and can optionally be zero for criteria-based item types to allow for any identifier.";
                                                            readonly type: "string";
                                                        };
                                                        readonly startAmount: {
                                                            readonly title: "Startamount";
                                                            readonly description: "The amount of the token in question that will be required should the order be fulfilled.";
                                                            readonly type: "string";
                                                        };
                                                        readonly endAmount: {
                                                            readonly title: "Endamount";
                                                            readonly description: "When endAmount differs from `startAmount`, the realized amount is calculated linearly based on the time elapsed since the order became active.";
                                                            readonly type: "string";
                                                        };
                                                    };
                                                };
                                            };
                                            readonly consideration: {
                                                readonly title: "Consideration";
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly title: "SerializedConsiderationItem";
                                                    readonly type: "object";
                                                    readonly required: readonly ["itemType", "token", "identifierOrCriteria", "startAmount", "endAmount", "recipient"];
                                                    readonly properties: {
                                                        readonly itemType: {
                                                            readonly title: "ItemType";
                                                            readonly description: "0 - Native - Ether (or other native token for the given chain)\n1 - ERC20\n2 - ERC721\n3 - ERC1155\n4 - ERC721 with criteria\n5 - ERC1155 with criteria\n\n`1` `2` `3` `4` `5`";
                                                            readonly enum: readonly [0, 1, 2, 3, 4, 5];
                                                            readonly type: "integer";
                                                        };
                                                        readonly token: {
                                                            readonly title: "Token";
                                                            readonly description: "The item's token contract (with the null address used for native tokens)";
                                                            readonly type: "string";
                                                        };
                                                        readonly identifierOrCriteria: {
                                                            readonly title: "Identifierorcriteria";
                                                            readonly description: "The ERC721 or ERC1155 token identifier or, in the case of a criteria-based item type, a merkle root composed of the valid set of token identifiers for the item. This value will be ignored for Ether and ERC20 item types, and can optionally be zero for criteria-based item types to allow for any identifier.";
                                                            readonly type: "string";
                                                        };
                                                        readonly startAmount: {
                                                            readonly title: "Startamount";
                                                            readonly description: "The amount of the token in question that will be required should the order be fulfilled.";
                                                            readonly type: "string";
                                                        };
                                                        readonly endAmount: {
                                                            readonly title: "Endamount";
                                                            readonly description: "When endAmount differs from `startAmount`, the realized amount is calculated linearly based on the time elapsed since the order became active.";
                                                            readonly type: "string";
                                                        };
                                                        readonly recipient: {
                                                            readonly title: "Recipient";
                                                            readonly description: "The address which will receive the consideration item when the order is executed.";
                                                            readonly type: "string";
                                                        };
                                                    };
                                                };
                                            };
                                            readonly startTime: {
                                                readonly title: "Starttime";
                                                readonly description: "The block timestamp at which the order becomes active";
                                                readonly type: "string";
                                            };
                                            readonly endTime: {
                                                readonly title: "Endtime";
                                                readonly description: "The block timestamp at which the order expires";
                                                readonly type: "string";
                                            };
                                            readonly orderType: {
                                                readonly title: "SeaportOrderType";
                                                readonly description: "The type of order, which determines how it can be executed.\n0 = Full Open - No partial fills, anyone can execute\n1 = Partial Open - Partial fills supported, anyone can execute\n2 = Full Restricted - No partial fills, only offerer or zone can check if it can be executed\n3 = Partial Restricted - Partial fills supported, only offerer or zone can check if it can be executed\n4 = Contract - Contract order type, for contract offerers that can dynamically generate orders. Introduced in Seaport v1.4 and currently unsupported\n\n`1` `2` `3` `4`";
                                                readonly enum: readonly [0, 1, 2, 3, 4];
                                                readonly type: "integer";
                                            };
                                            readonly zone: {
                                                readonly title: "Zone";
                                                readonly description: "Optional secondary account attached the order which can cancel orders. Additionally, when the `OrderType` is Restricted, the zone or the offerer are the only entities which can execute the order.\nFor open orders, use the zero address.\nFor restricted orders, use the signed zone address 0x000056f7000000ece9003ca63978907a00ffd100";
                                                readonly type: "string";
                                            };
                                            readonly zoneHash: {
                                                readonly title: "Zonehash";
                                                readonly description: "A value that will be supplied to the zone when fulfilling restricted orders that the zone can utilize when making a determination on whether to authorize the order. Most often this value will be the zero hash 0x0000000000000000000000000000000000000000000000000000000000000000";
                                                readonly type: "string";
                                            };
                                            readonly salt: {
                                                readonly title: "Salt";
                                                readonly description: "an arbitrary source of entropy for the order";
                                                readonly type: "string";
                                            };
                                            readonly conduitKey: {
                                                readonly title: "Conduitkey";
                                                readonly description: "Indicates what conduit, if any, should be utilized as a source for token approvals when performing transfers. By default (i.e. when conduitKey is set to the zero hash), the offerer will grant transfer approvals to Seaport directly. \nTo utilize OpenSea's conduit, use 0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000";
                                                readonly type: "string";
                                            };
                                            readonly totalOriginalConsiderationItems: {
                                                readonly title: "Totaloriginalconsiderationitems";
                                                readonly description: "Size of the consideration array.";
                                                readonly type: "integer";
                                            };
                                            readonly counter: {
                                                readonly title: "Counter";
                                                readonly anyOf: readonly [{
                                                    readonly type: "integer";
                                                }, {
                                                    readonly type: "string";
                                                }];
                                            };
                                        };
                                    };
                                    readonly signature: {
                                        readonly title: "Signature";
                                        readonly description: "The order maker's signature used to validate the order.";
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly protocol_address: {
                                readonly title: "Protocol Address";
                                readonly description: "Exchange contract address";
                                readonly type: "string";
                            };
                        };
                        readonly required: readonly ["order_hash", "chain", "type", "price", "protocol_data", "protocol_address"];
                    };
                };
                readonly next: {
                    readonly title: "Next";
                    readonly description: "Cursor for the next page of results";
                    readonly type: "string";
                };
            };
            readonly required: readonly ["listings", "next"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetBestOfferOnNftV2: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly collection_slug: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Unique string to identify a collection on OpenSea. This can be found by visiting the collection on the OpenSea website and noting the last path parameter.";
                };
                readonly identifier: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The NFT token id.";
                };
            };
            readonly required: readonly ["collection_slug", "identifier"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "Paginated Offer List";
            readonly type: "object";
            readonly properties: {
                readonly offers: {
                    readonly title: "Offers";
                    readonly type: "array";
                    readonly items: {
                        readonly title: "Offer";
                        readonly type: "object";
                        readonly properties: {
                            readonly order_hash: {
                                readonly title: "Order Hash";
                                readonly description: "Order hash";
                                readonly type: "string";
                            };
                            readonly chain: {
                                readonly title: "ChainIdentifier";
                                readonly description: "OpenSea supported chains.\n\n`ethereum` `matic` `klaytn` `bsc` `solana` `arbitrum` `arbitrum_nova` `avalanche` `optimism` `base` `blast` `sei` `zora` `sepolia` `rinkeby` `mumbai` `amoy` `baobab` `bsctestnet` `goerli` `soldev` `arbitrum_goerli` `arbitrum_sepolia` `avalanche_fuji` `optimism_goerli` `optimism_sepolia` `base_goerli` `base_sepolia` `blast_sepolia` `gunzilla_testnet` `sei_devnet` `zora_testnet` `zora_sepolia`";
                                readonly enum: readonly ["ethereum", "matic", "klaytn", "bsc", "solana", "arbitrum", "arbitrum_nova", "avalanche", "optimism", "base", "blast", "sei", "zora", "sepolia", "rinkeby", "mumbai", "amoy", "baobab", "bsctestnet", "goerli", "soldev", "arbitrum_goerli", "arbitrum_sepolia", "avalanche_fuji", "optimism_goerli", "optimism_sepolia", "base_goerli", "base_sepolia", "blast_sepolia", "gunzilla_testnet", "sei_devnet", "zora_testnet", "zora_sepolia"];
                                readonly properties: {};
                                readonly type: "object";
                            };
                            readonly price: {
                                readonly title: "PriceModel";
                                readonly type: "object";
                                readonly properties: {
                                    readonly currency: {
                                        readonly title: "Currency";
                                        readonly type: "string";
                                    };
                                    readonly decimals: {
                                        readonly title: "Decimals";
                                        readonly type: "integer";
                                    };
                                    readonly value: {
                                        readonly title: "Value";
                                        readonly type: "string";
                                    };
                                };
                                readonly required: readonly ["currency", "decimals", "value"];
                            };
                            readonly criteria: {
                                readonly title: "Criteria";
                                readonly description: "Criteria for collection or trait offers";
                                readonly type: "object";
                                readonly required: readonly ["collection", "contract"];
                                readonly properties: {
                                    readonly collection: {
                                        readonly title: "Collection";
                                        readonly description: "The collection in which the criteria offer is being made for.";
                                        readonly type: "object";
                                        readonly required: readonly ["slug"];
                                        readonly properties: {
                                            readonly slug: {
                                                readonly title: "Slug";
                                                readonly description: "Unique string to identify a collection on OpenSea. This can be found by visiting the collection on the OpenSea website and noting the last path parameter.";
                                                readonly type: "string";
                                            };
                                        };
                                    };
                                    readonly contract: {
                                        readonly title: "Contract";
                                        readonly description: "The public blockchain address of the NFT contract";
                                        readonly type: "object";
                                        readonly required: readonly ["address"];
                                        readonly properties: {
                                            readonly address: {
                                                readonly title: "Address";
                                                readonly type: "string";
                                            };
                                        };
                                    };
                                    readonly trait: {
                                        readonly title: "Trait";
                                        readonly description: "The trait that the criteria offer is being made for.";
                                        readonly type: "object";
                                        readonly required: readonly ["type", "value"];
                                        readonly properties: {
                                            readonly type: {
                                                readonly title: "Type";
                                                readonly type: "string";
                                            };
                                            readonly value: {
                                                readonly title: "Value";
                                                readonly type: "string";
                                            };
                                        };
                                    };
                                    readonly encoded_token_ids: {
                                        readonly title: "Encoded Token Ids";
                                        readonly description: "Represents a list of token ids which can be used to fulfill the criteria offer. When decoded using the provided SDK function, developers can now see a list of all tokens that could be used to fulfill the offer.";
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly protocol_data: {
                                readonly title: "Protocol Data";
                                readonly description: "The onchain order data.";
                                readonly type: "object";
                                readonly required: readonly ["parameters"];
                                readonly properties: {
                                    readonly parameters: {
                                        readonly title: "Order";
                                        readonly type: "object";
                                        readonly required: readonly ["offerer", "offer", "consideration", "startTime", "endTime", "orderType", "zone", "zoneHash", "salt", "conduitKey", "totalOriginalConsiderationItems", "counter"];
                                        readonly properties: {
                                            readonly offerer: {
                                                readonly title: "Offerer";
                                                readonly description: "The address which supplies all the items in the offer.";
                                                readonly type: "string";
                                            };
                                            readonly offer: {
                                                readonly title: "Offer";
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly title: "SerializedOfferItem";
                                                    readonly type: "object";
                                                    readonly required: readonly ["itemType", "token", "identifierOrCriteria", "startAmount", "endAmount"];
                                                    readonly properties: {
                                                        readonly itemType: {
                                                            readonly title: "ItemType";
                                                            readonly description: "0 - Native - Ether (or other native token for the given chain)\n1 - ERC20\n2 - ERC721\n3 - ERC1155\n4 - ERC721 with criteria\n5 - ERC1155 with criteria\n\n`1` `2` `3` `4` `5`";
                                                            readonly enum: readonly [0, 1, 2, 3, 4, 5];
                                                            readonly type: "integer";
                                                        };
                                                        readonly token: {
                                                            readonly title: "Token";
                                                            readonly description: "The item's token contract (with the null address used for native tokens)";
                                                            readonly type: "string";
                                                        };
                                                        readonly identifierOrCriteria: {
                                                            readonly title: "Identifierorcriteria";
                                                            readonly description: "The ERC721 or ERC1155 token identifier or, in the case of a criteria-based item type, a merkle root composed of the valid set of token identifiers for the item. This value will be ignored for Ether and ERC20 item types, and can optionally be zero for criteria-based item types to allow for any identifier.";
                                                            readonly type: "string";
                                                        };
                                                        readonly startAmount: {
                                                            readonly title: "Startamount";
                                                            readonly description: "The amount of the token in question that will be required should the order be fulfilled.";
                                                            readonly type: "string";
                                                        };
                                                        readonly endAmount: {
                                                            readonly title: "Endamount";
                                                            readonly description: "When endAmount differs from `startAmount`, the realized amount is calculated linearly based on the time elapsed since the order became active.";
                                                            readonly type: "string";
                                                        };
                                                    };
                                                };
                                            };
                                            readonly consideration: {
                                                readonly title: "Consideration";
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly title: "SerializedConsiderationItem";
                                                    readonly type: "object";
                                                    readonly required: readonly ["itemType", "token", "identifierOrCriteria", "startAmount", "endAmount", "recipient"];
                                                    readonly properties: {
                                                        readonly itemType: {
                                                            readonly title: "ItemType";
                                                            readonly description: "0 - Native - Ether (or other native token for the given chain)\n1 - ERC20\n2 - ERC721\n3 - ERC1155\n4 - ERC721 with criteria\n5 - ERC1155 with criteria\n\n`1` `2` `3` `4` `5`";
                                                            readonly enum: readonly [0, 1, 2, 3, 4, 5];
                                                            readonly type: "integer";
                                                        };
                                                        readonly token: {
                                                            readonly title: "Token";
                                                            readonly description: "The item's token contract (with the null address used for native tokens)";
                                                            readonly type: "string";
                                                        };
                                                        readonly identifierOrCriteria: {
                                                            readonly title: "Identifierorcriteria";
                                                            readonly description: "The ERC721 or ERC1155 token identifier or, in the case of a criteria-based item type, a merkle root composed of the valid set of token identifiers for the item. This value will be ignored for Ether and ERC20 item types, and can optionally be zero for criteria-based item types to allow for any identifier.";
                                                            readonly type: "string";
                                                        };
                                                        readonly startAmount: {
                                                            readonly title: "Startamount";
                                                            readonly description: "The amount of the token in question that will be required should the order be fulfilled.";
                                                            readonly type: "string";
                                                        };
                                                        readonly endAmount: {
                                                            readonly title: "Endamount";
                                                            readonly description: "When endAmount differs from `startAmount`, the realized amount is calculated linearly based on the time elapsed since the order became active.";
                                                            readonly type: "string";
                                                        };
                                                        readonly recipient: {
                                                            readonly title: "Recipient";
                                                            readonly description: "The address which will receive the consideration item when the order is executed.";
                                                            readonly type: "string";
                                                        };
                                                    };
                                                };
                                            };
                                            readonly startTime: {
                                                readonly title: "Starttime";
                                                readonly description: "The block timestamp at which the order becomes active";
                                                readonly type: "string";
                                            };
                                            readonly endTime: {
                                                readonly title: "Endtime";
                                                readonly description: "The block timestamp at which the order expires";
                                                readonly type: "string";
                                            };
                                            readonly orderType: {
                                                readonly title: "SeaportOrderType";
                                                readonly description: "The type of order, which determines how it can be executed.\n0 = Full Open - No partial fills, anyone can execute\n1 = Partial Open - Partial fills supported, anyone can execute\n2 = Full Restricted - No partial fills, only offerer or zone can check if it can be executed\n3 = Partial Restricted - Partial fills supported, only offerer or zone can check if it can be executed\n4 = Contract - Contract order type, for contract offerers that can dynamically generate orders. Introduced in Seaport v1.4 and currently unsupported\n\n`1` `2` `3` `4`";
                                                readonly enum: readonly [0, 1, 2, 3, 4];
                                                readonly type: "integer";
                                            };
                                            readonly zone: {
                                                readonly title: "Zone";
                                                readonly description: "Optional secondary account attached the order which can cancel orders. Additionally, when the `OrderType` is Restricted, the zone or the offerer are the only entities which can execute the order.\nFor open orders, use the zero address.\nFor restricted orders, use the signed zone address 0x000056f7000000ece9003ca63978907a00ffd100";
                                                readonly type: "string";
                                            };
                                            readonly zoneHash: {
                                                readonly title: "Zonehash";
                                                readonly description: "A value that will be supplied to the zone when fulfilling restricted orders that the zone can utilize when making a determination on whether to authorize the order. Most often this value will be the zero hash 0x0000000000000000000000000000000000000000000000000000000000000000";
                                                readonly type: "string";
                                            };
                                            readonly salt: {
                                                readonly title: "Salt";
                                                readonly description: "an arbitrary source of entropy for the order";
                                                readonly type: "string";
                                            };
                                            readonly conduitKey: {
                                                readonly title: "Conduitkey";
                                                readonly description: "Indicates what conduit, if any, should be utilized as a source for token approvals when performing transfers. By default (i.e. when conduitKey is set to the zero hash), the offerer will grant transfer approvals to Seaport directly. \nTo utilize OpenSea's conduit, use 0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000";
                                                readonly type: "string";
                                            };
                                            readonly totalOriginalConsiderationItems: {
                                                readonly title: "Totaloriginalconsiderationitems";
                                                readonly description: "Size of the consideration array.";
                                                readonly type: "integer";
                                            };
                                            readonly counter: {
                                                readonly title: "Counter";
                                                readonly anyOf: readonly [{
                                                    readonly type: "integer";
                                                }, {
                                                    readonly type: "string";
                                                }];
                                            };
                                        };
                                    };
                                    readonly signature: {
                                        readonly title: "Signature";
                                        readonly description: "The order maker's signature used to validate the order.";
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly protocol_address: {
                                readonly title: "Protocol Address";
                                readonly description: "Exchange contract address";
                                readonly type: "string";
                            };
                        };
                        readonly required: readonly ["order_hash", "chain", "price", "criteria", "protocol_data", "protocol_address"];
                    };
                };
                readonly next: {
                    readonly title: "Next";
                    readonly description: "Cursor for the next page of results";
                    readonly type: "string";
                };
            };
            readonly required: readonly ["offers", "next"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetCollection: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly collection_slug: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Unique string to identify a collection on OpenSea. This can be found by visiting the collection on the OpenSea website and noting the last path parameter.";
                };
            };
            readonly required: readonly ["collection_slug"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "DetailedCollectionModel";
            readonly type: "object";
            readonly properties: {
                readonly collection: {
                    readonly title: "Collection";
                    readonly description: "Collection slug. A unique string to identify a collection on OpenSea";
                    readonly type: "string";
                };
                readonly name: {
                    readonly title: "Name";
                    readonly description: "Name of the collection";
                    readonly type: "string";
                };
                readonly description: {
                    readonly title: "Description";
                    readonly description: "Description of the collection";
                    readonly type: "string";
                };
                readonly image_url: {
                    readonly title: "Image Url";
                    readonly description: "Square image used to represent the collection";
                    readonly type: "string";
                };
                readonly banner_image_url: {
                    readonly title: "Banner Image Url";
                    readonly description: "Banner image used to represent the collection";
                    readonly type: "string";
                };
                readonly owner: {
                    readonly title: "Owner";
                    readonly description: "The public blockchain address of the owner.";
                    readonly type: "string";
                };
                readonly safelist_status: {
                    readonly title: "SafelistRequestStatus";
                    readonly description: "Status of the collection verification requests.\n\n`not_requested` `requested` `approved` `verified` `disabled_top_trending`";
                    readonly enum: readonly ["not_requested", "requested", "approved", "verified", "disabled_top_trending"];
                    readonly properties: {};
                    readonly type: "object";
                };
                readonly category: {
                    readonly title: "Category";
                    readonly description: "Category of the collection (e.g. PFPs, Memberships, Art)";
                    readonly type: "string";
                };
                readonly is_disabled: {
                    readonly title: "Is Disabled";
                    readonly description: "If the collection is currently able to be bought or sold using OpenSea";
                    readonly type: "boolean";
                };
                readonly is_nsfw: {
                    readonly title: "Is Nsfw";
                    readonly description: "If the collection is currently classified as 'Not Safe for Work' as defined in [OpenSea's NSFW Policy](https://support.opensea.io/hc/articles/9729972510995).";
                    readonly type: "boolean";
                };
                readonly trait_offers_enabled: {
                    readonly title: "Trait Offers Enabled";
                    readonly description: "If trait offers are currently being accepted for the collection";
                    readonly type: "boolean";
                };
                readonly collection_offers_enabled: {
                    readonly title: "Collection Offers Enabled";
                    readonly description: "If collection offers are currently being accepted for the collection";
                    readonly type: "boolean";
                };
                readonly opensea_url: {
                    readonly title: "Opensea Url";
                    readonly description: "OpenSea Link to collection";
                    readonly type: "string";
                };
                readonly project_url: {
                    readonly title: "Project Url";
                    readonly description: "External URL for the collection's website";
                    readonly type: "string";
                };
                readonly wiki_url: {
                    readonly title: "Wiki Url";
                    readonly description: "External URL for the collection's wiki";
                    readonly type: "string";
                };
                readonly discord_url: {
                    readonly title: "Discord Url";
                    readonly description: "External URL for the collection's Discord server";
                    readonly type: "string";
                };
                readonly telegram_url: {
                    readonly title: "Telegram Url";
                    readonly description: "External URL for the collection's Telegram group";
                    readonly type: "string";
                };
                readonly twitter_username: {
                    readonly title: "Twitter Username";
                    readonly description: "Username for the collection's Twitter account";
                    readonly type: "string";
                };
                readonly instagram_username: {
                    readonly title: "Instagram Username";
                    readonly description: "Username for the collection's Instagram account";
                    readonly type: "string";
                };
                readonly contracts: {
                    readonly title: "Contracts";
                    readonly description: "Contracts for the collection";
                    readonly type: "array";
                    readonly items: {
                        readonly title: "CollectionContractModel";
                        readonly description: "Define the Contract's Addresses and Chain";
                        readonly type: "object";
                        readonly properties: {
                            readonly address: {
                                readonly title: "Address";
                                readonly description: "The public blockchain address of the contract.";
                                readonly type: "string";
                            };
                            readonly chain: {
                                readonly description: "OpenSea supported chains.";
                                readonly title: "ChainIdentifier";
                                readonly enum: readonly ["ethereum", "matic", "klaytn", "bsc", "solana", "arbitrum", "arbitrum_nova", "avalanche", "optimism", "base", "blast", "sei", "zora", "sepolia", "rinkeby", "mumbai", "amoy", "baobab", "bsctestnet", "goerli", "soldev", "arbitrum_goerli", "arbitrum_sepolia", "avalanche_fuji", "optimism_goerli", "optimism_sepolia", "base_goerli", "base_sepolia", "blast_sepolia", "gunzilla_testnet", "sei_devnet", "zora_testnet", "zora_sepolia"];
                            };
                        };
                        readonly required: readonly ["address", "chain"];
                    };
                };
                readonly editors: {
                    readonly title: "Editors";
                    readonly description: "List of editor addresses for the collection";
                    readonly type: "array";
                    readonly items: {
                        readonly type: "string";
                    };
                };
                readonly fees: {
                    readonly title: "Fees";
                    readonly description: "List of fees for the collection including creator earnings and OpenSea fees";
                    readonly type: "array";
                    readonly items: {
                        readonly title: "CollectionFeeModel";
                        readonly type: "object";
                        readonly properties: {
                            readonly fee: {
                                readonly title: "Fee";
                                readonly description: "Percentage of the sale price that is paid to the recipient";
                                readonly type: "number";
                            };
                            readonly recipient: {
                                readonly title: "Recipient";
                                readonly description: "The public blockchain address of the recipient";
                                readonly type: "string";
                            };
                            readonly required: {
                                readonly title: "Required";
                                readonly description: "If the fee is required for the collection";
                                readonly default: false;
                                readonly type: "boolean";
                            };
                        };
                        readonly required: readonly ["fee", "recipient"];
                    };
                };
                readonly required_zone: {
                    readonly title: "Required Zone";
                    readonly description: "If defined, the required zone for all orders for this collection";
                    readonly type: "string";
                };
                readonly rarity: {
                    readonly title: "Rarity";
                    readonly description: "Rarity data for the Collection";
                    readonly type: "object";
                    readonly required: readonly ["strategy_id", "strategy_version", "max_rank", "total_supply"];
                    readonly properties: {
                        readonly strategy_id: {
                            readonly title: "RarityStrategyId";
                            readonly description: "Rarity algorithm used. Currently, always 'openrarity'";
                            readonly enum: readonly ["openrarity"];
                        };
                        readonly strategy_version: {
                            readonly title: "Strategy Version";
                            readonly description: "Version of the rarity algorithm used";
                            readonly type: "string";
                        };
                        readonly calculated_at: {
                            readonly title: "Calculated At";
                            readonly default: "Isoformat datetime when the rarity was calculated";
                            readonly type: "string";
                        };
                        readonly max_rank: {
                            readonly title: "Max Rank";
                            readonly description: "Maximum possible rank for the collection";
                            readonly type: "integer";
                        };
                        readonly total_supply: {
                            readonly title: "Total Supply";
                            readonly description: "Total number of tokens scored in the collection";
                            readonly type: "integer";
                        };
                    };
                };
                readonly payment_tokens: {
                    readonly title: "Payment Tokens";
                    readonly description: "Payment tokens for the collection";
                    readonly type: "array";
                    readonly items: {
                        readonly title: "PaymentTokenModel";
                        readonly type: "object";
                        readonly properties: {
                            readonly symbol: {
                                readonly title: "Symbol";
                                readonly description: "The symbol of the payment token";
                                readonly type: "string";
                            };
                            readonly address: {
                                readonly title: "Address";
                                readonly description: "The public blockchain address of the contract";
                                readonly type: "string";
                            };
                            readonly chain: {
                                readonly title: "Chain";
                                readonly description: "The chain on which the contract exists";
                                readonly type: "string";
                            };
                            readonly image: {
                                readonly title: "Image";
                                readonly description: "The image of the payment token";
                                readonly type: "string";
                            };
                            readonly name: {
                                readonly title: "Name";
                                readonly description: "The name of the contract";
                                readonly type: "string";
                            };
                            readonly decimals: {
                                readonly title: "Decimals";
                                readonly description: "The number of decimals of the contract";
                                readonly type: "integer";
                            };
                            readonly eth_price: {
                                readonly title: "Eth Price";
                                readonly description: "The price of the payment token in ETH";
                                readonly type: "string";
                            };
                            readonly usd_price: {
                                readonly title: "Usd Price";
                                readonly description: "The price of the payment token in USD";
                                readonly type: "string";
                            };
                        };
                        readonly required: readonly ["symbol", "address", "chain", "image", "name", "decimals", "eth_price", "usd_price"];
                    };
                };
                readonly total_supply: {
                    readonly title: "Total Supply";
                    readonly default: "The total supply of the collection (minted minus burned)";
                    readonly type: "integer";
                };
                readonly created_date: {
                    readonly title: "Created Date";
                    readonly description: "The date the collection was created";
                    readonly type: "string";
                    readonly format: "date";
                };
            };
            readonly required: readonly ["collection", "name", "owner", "safelist_status", "category", "is_disabled", "is_nsfw", "trait_offers_enabled", "collection_offers_enabled", "opensea_url", "contracts", "editors", "fees", "created_date"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetCollectionOffersV2: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly collection_slug: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Unique string to identify a collection on OpenSea. This can be found by visiting the collection on the OpenSea website and noting the last path parameter.";
                };
            };
            readonly required: readonly ["collection_slug"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "Offer List";
            readonly type: "object";
            readonly properties: {
                readonly offers: {
                    readonly title: "Offers";
                    readonly type: "array";
                    readonly items: {
                        readonly title: "Offer";
                        readonly type: "object";
                        readonly properties: {
                            readonly order_hash: {
                                readonly title: "Order Hash";
                                readonly description: "Order hash";
                                readonly type: "string";
                            };
                            readonly chain: {
                                readonly title: "ChainIdentifier";
                                readonly description: "OpenSea supported chains.\n\n`ethereum` `matic` `klaytn` `bsc` `solana` `arbitrum` `arbitrum_nova` `avalanche` `optimism` `base` `blast` `sei` `zora` `sepolia` `rinkeby` `mumbai` `amoy` `baobab` `bsctestnet` `goerli` `soldev` `arbitrum_goerli` `arbitrum_sepolia` `avalanche_fuji` `optimism_goerli` `optimism_sepolia` `base_goerli` `base_sepolia` `blast_sepolia` `gunzilla_testnet` `sei_devnet` `zora_testnet` `zora_sepolia`";
                                readonly enum: readonly ["ethereum", "matic", "klaytn", "bsc", "solana", "arbitrum", "arbitrum_nova", "avalanche", "optimism", "base", "blast", "sei", "zora", "sepolia", "rinkeby", "mumbai", "amoy", "baobab", "bsctestnet", "goerli", "soldev", "arbitrum_goerli", "arbitrum_sepolia", "avalanche_fuji", "optimism_goerli", "optimism_sepolia", "base_goerli", "base_sepolia", "blast_sepolia", "gunzilla_testnet", "sei_devnet", "zora_testnet", "zora_sepolia"];
                                readonly properties: {};
                                readonly type: "object";
                            };
                            readonly price: {
                                readonly title: "PriceModel";
                                readonly type: "object";
                                readonly properties: {
                                    readonly currency: {
                                        readonly title: "Currency";
                                        readonly type: "string";
                                    };
                                    readonly decimals: {
                                        readonly title: "Decimals";
                                        readonly type: "integer";
                                    };
                                    readonly value: {
                                        readonly title: "Value";
                                        readonly type: "string";
                                    };
                                };
                                readonly required: readonly ["currency", "decimals", "value"];
                            };
                            readonly criteria: {
                                readonly title: "Criteria";
                                readonly description: "Criteria for collection or trait offers";
                                readonly type: "object";
                                readonly required: readonly ["collection", "contract"];
                                readonly properties: {
                                    readonly collection: {
                                        readonly title: "Collection";
                                        readonly description: "The collection in which the criteria offer is being made for.";
                                        readonly type: "object";
                                        readonly required: readonly ["slug"];
                                        readonly properties: {
                                            readonly slug: {
                                                readonly title: "Slug";
                                                readonly description: "Unique string to identify a collection on OpenSea. This can be found by visiting the collection on the OpenSea website and noting the last path parameter.";
                                                readonly type: "string";
                                            };
                                        };
                                    };
                                    readonly contract: {
                                        readonly title: "Contract";
                                        readonly description: "The public blockchain address of the NFT contract";
                                        readonly type: "object";
                                        readonly required: readonly ["address"];
                                        readonly properties: {
                                            readonly address: {
                                                readonly title: "Address";
                                                readonly type: "string";
                                            };
                                        };
                                    };
                                    readonly trait: {
                                        readonly title: "Trait";
                                        readonly description: "The trait that the criteria offer is being made for.";
                                        readonly type: "object";
                                        readonly required: readonly ["type", "value"];
                                        readonly properties: {
                                            readonly type: {
                                                readonly title: "Type";
                                                readonly type: "string";
                                            };
                                            readonly value: {
                                                readonly title: "Value";
                                                readonly type: "string";
                                            };
                                        };
                                    };
                                    readonly encoded_token_ids: {
                                        readonly title: "Encoded Token Ids";
                                        readonly description: "Represents a list of token ids which can be used to fulfill the criteria offer. When decoded using the provided SDK function, developers can now see a list of all tokens that could be used to fulfill the offer.";
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly protocol_data: {
                                readonly title: "Protocol Data";
                                readonly description: "The onchain order data.";
                                readonly type: "object";
                                readonly required: readonly ["parameters"];
                                readonly properties: {
                                    readonly parameters: {
                                        readonly title: "Order";
                                        readonly type: "object";
                                        readonly required: readonly ["offerer", "offer", "consideration", "startTime", "endTime", "orderType", "zone", "zoneHash", "salt", "conduitKey", "totalOriginalConsiderationItems", "counter"];
                                        readonly properties: {
                                            readonly offerer: {
                                                readonly title: "Offerer";
                                                readonly description: "The address which supplies all the items in the offer.";
                                                readonly type: "string";
                                            };
                                            readonly offer: {
                                                readonly title: "Offer";
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly title: "SerializedOfferItem";
                                                    readonly type: "object";
                                                    readonly required: readonly ["itemType", "token", "identifierOrCriteria", "startAmount", "endAmount"];
                                                    readonly properties: {
                                                        readonly itemType: {
                                                            readonly title: "ItemType";
                                                            readonly description: "0 - Native - Ether (or other native token for the given chain)\n1 - ERC20\n2 - ERC721\n3 - ERC1155\n4 - ERC721 with criteria\n5 - ERC1155 with criteria\n\n`1` `2` `3` `4` `5`";
                                                            readonly enum: readonly [0, 1, 2, 3, 4, 5];
                                                            readonly type: "integer";
                                                        };
                                                        readonly token: {
                                                            readonly title: "Token";
                                                            readonly description: "The item's token contract (with the null address used for native tokens)";
                                                            readonly type: "string";
                                                        };
                                                        readonly identifierOrCriteria: {
                                                            readonly title: "Identifierorcriteria";
                                                            readonly description: "The ERC721 or ERC1155 token identifier or, in the case of a criteria-based item type, a merkle root composed of the valid set of token identifiers for the item. This value will be ignored for Ether and ERC20 item types, and can optionally be zero for criteria-based item types to allow for any identifier.";
                                                            readonly type: "string";
                                                        };
                                                        readonly startAmount: {
                                                            readonly title: "Startamount";
                                                            readonly description: "The amount of the token in question that will be required should the order be fulfilled.";
                                                            readonly type: "string";
                                                        };
                                                        readonly endAmount: {
                                                            readonly title: "Endamount";
                                                            readonly description: "When endAmount differs from `startAmount`, the realized amount is calculated linearly based on the time elapsed since the order became active.";
                                                            readonly type: "string";
                                                        };
                                                    };
                                                };
                                            };
                                            readonly consideration: {
                                                readonly title: "Consideration";
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly title: "SerializedConsiderationItem";
                                                    readonly type: "object";
                                                    readonly required: readonly ["itemType", "token", "identifierOrCriteria", "startAmount", "endAmount", "recipient"];
                                                    readonly properties: {
                                                        readonly itemType: {
                                                            readonly title: "ItemType";
                                                            readonly description: "0 - Native - Ether (or other native token for the given chain)\n1 - ERC20\n2 - ERC721\n3 - ERC1155\n4 - ERC721 with criteria\n5 - ERC1155 with criteria\n\n`1` `2` `3` `4` `5`";
                                                            readonly enum: readonly [0, 1, 2, 3, 4, 5];
                                                            readonly type: "integer";
                                                        };
                                                        readonly token: {
                                                            readonly title: "Token";
                                                            readonly description: "The item's token contract (with the null address used for native tokens)";
                                                            readonly type: "string";
                                                        };
                                                        readonly identifierOrCriteria: {
                                                            readonly title: "Identifierorcriteria";
                                                            readonly description: "The ERC721 or ERC1155 token identifier or, in the case of a criteria-based item type, a merkle root composed of the valid set of token identifiers for the item. This value will be ignored for Ether and ERC20 item types, and can optionally be zero for criteria-based item types to allow for any identifier.";
                                                            readonly type: "string";
                                                        };
                                                        readonly startAmount: {
                                                            readonly title: "Startamount";
                                                            readonly description: "The amount of the token in question that will be required should the order be fulfilled.";
                                                            readonly type: "string";
                                                        };
                                                        readonly endAmount: {
                                                            readonly title: "Endamount";
                                                            readonly description: "When endAmount differs from `startAmount`, the realized amount is calculated linearly based on the time elapsed since the order became active.";
                                                            readonly type: "string";
                                                        };
                                                        readonly recipient: {
                                                            readonly title: "Recipient";
                                                            readonly description: "The address which will receive the consideration item when the order is executed.";
                                                            readonly type: "string";
                                                        };
                                                    };
                                                };
                                            };
                                            readonly startTime: {
                                                readonly title: "Starttime";
                                                readonly description: "The block timestamp at which the order becomes active";
                                                readonly type: "string";
                                            };
                                            readonly endTime: {
                                                readonly title: "Endtime";
                                                readonly description: "The block timestamp at which the order expires";
                                                readonly type: "string";
                                            };
                                            readonly orderType: {
                                                readonly title: "SeaportOrderType";
                                                readonly description: "The type of order, which determines how it can be executed.\n0 = Full Open - No partial fills, anyone can execute\n1 = Partial Open - Partial fills supported, anyone can execute\n2 = Full Restricted - No partial fills, only offerer or zone can check if it can be executed\n3 = Partial Restricted - Partial fills supported, only offerer or zone can check if it can be executed\n4 = Contract - Contract order type, for contract offerers that can dynamically generate orders. Introduced in Seaport v1.4 and currently unsupported\n\n`1` `2` `3` `4`";
                                                readonly enum: readonly [0, 1, 2, 3, 4];
                                                readonly type: "integer";
                                            };
                                            readonly zone: {
                                                readonly title: "Zone";
                                                readonly description: "Optional secondary account attached the order which can cancel orders. Additionally, when the `OrderType` is Restricted, the zone or the offerer are the only entities which can execute the order.\nFor open orders, use the zero address.\nFor restricted orders, use the signed zone address 0x000056f7000000ece9003ca63978907a00ffd100";
                                                readonly type: "string";
                                            };
                                            readonly zoneHash: {
                                                readonly title: "Zonehash";
                                                readonly description: "A value that will be supplied to the zone when fulfilling restricted orders that the zone can utilize when making a determination on whether to authorize the order. Most often this value will be the zero hash 0x0000000000000000000000000000000000000000000000000000000000000000";
                                                readonly type: "string";
                                            };
                                            readonly salt: {
                                                readonly title: "Salt";
                                                readonly description: "an arbitrary source of entropy for the order";
                                                readonly type: "string";
                                            };
                                            readonly conduitKey: {
                                                readonly title: "Conduitkey";
                                                readonly description: "Indicates what conduit, if any, should be utilized as a source for token approvals when performing transfers. By default (i.e. when conduitKey is set to the zero hash), the offerer will grant transfer approvals to Seaport directly. \nTo utilize OpenSea's conduit, use 0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000";
                                                readonly type: "string";
                                            };
                                            readonly totalOriginalConsiderationItems: {
                                                readonly title: "Totaloriginalconsiderationitems";
                                                readonly description: "Size of the consideration array.";
                                                readonly type: "integer";
                                            };
                                            readonly counter: {
                                                readonly title: "Counter";
                                                readonly anyOf: readonly [{
                                                    readonly type: "integer";
                                                }, {
                                                    readonly type: "string";
                                                }];
                                            };
                                        };
                                    };
                                    readonly signature: {
                                        readonly title: "Signature";
                                        readonly description: "The order maker's signature used to validate the order.";
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly protocol_address: {
                                readonly title: "Protocol Address";
                                readonly description: "Exchange contract address";
                                readonly type: "string";
                            };
                        };
                        readonly required: readonly ["order_hash", "chain", "price", "criteria", "protocol_data", "protocol_address"];
                    };
                };
            };
            readonly required: readonly ["offers"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetCollectionStats: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly collection_slug: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Unique string to identify a collection on OpenSea. This can be found by visiting the collection on the OpenSea website and noting the last path parameter.";
                };
            };
            readonly required: readonly ["collection_slug"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "GetCollectionStatsResponse";
            readonly type: "object";
            readonly properties: {
                readonly total: {
                    readonly title: "Total";
                    readonly description: "The aggregate stats over the collection's lifetime";
                    readonly type: "object";
                    readonly required: readonly ["volume", "sales", "average_price", "num_owners", "market_cap", "floor_price", "floor_price_symbol"];
                    readonly properties: {
                        readonly volume: {
                            readonly title: "Volume";
                            readonly description: "The all time volume of sales for the collection";
                            readonly type: "number";
                        };
                        readonly sales: {
                            readonly title: "Sales";
                            readonly description: "The all time number of sales for the collection";
                            readonly type: "integer";
                        };
                        readonly average_price: {
                            readonly title: "Average Price";
                            readonly description: "The all time average sale price of NFTs in the collection";
                            readonly type: "number";
                        };
                        readonly num_owners: {
                            readonly title: "Num Owners";
                            readonly description: "The current number of unique owners of NFTs in the collection";
                            readonly type: "integer";
                        };
                        readonly market_cap: {
                            readonly title: "Market Cap";
                            readonly description: "The current market cap of the collection";
                            readonly type: "number";
                        };
                        readonly floor_price: {
                            readonly title: "Floor Price";
                            readonly description: "The current lowest price of NFTs in the collection";
                            readonly type: "number";
                        };
                        readonly floor_price_symbol: {
                            readonly title: "Floor Price Symbol";
                            readonly description: "The symbol of the payment asset for the floor price";
                            readonly type: "string";
                        };
                    };
                };
                readonly intervals: {
                    readonly title: "Interval Stats";
                    readonly description: "The stats for each interval";
                    readonly type: "array";
                    readonly items: {
                        readonly title: "CollectionStatsIntervalModel";
                        readonly type: "object";
                        readonly properties: {
                            readonly interval: {
                                readonly title: "CollectionStatsInterval";
                                readonly description: "The interval for which the stats are calculated\n\n`one_day` `seven_day` `thirty_day`";
                                readonly enum: readonly ["one_day", "seven_day", "thirty_day"];
                                readonly type: "string";
                                readonly properties: {};
                            };
                            readonly volume: {
                                readonly title: "Volume";
                                readonly description: "The volume of sales for the collection during the specified interval";
                                readonly type: "number";
                            };
                            readonly volume_diff: {
                                readonly title: "Volume Diff";
                                readonly description: "The volume differential compared to the previous interval";
                                readonly type: "number";
                            };
                            readonly volume_change: {
                                readonly title: "Volume Change";
                                readonly description: "The percentage change in volume compared to the previous interval";
                                readonly type: "number";
                            };
                            readonly sales: {
                                readonly title: "Sales";
                                readonly description: "The number of sales for the collection during the specified interval";
                                readonly type: "integer";
                            };
                            readonly sales_diff: {
                                readonly title: "Sales Diff";
                                readonly description: "The percentage change in number of sales compared to the previous interval";
                                readonly type: "number";
                            };
                            readonly average_price: {
                                readonly title: "Average Price";
                                readonly description: "The average sale price of NFTs in the collection during the interval";
                                readonly type: "number";
                            };
                        };
                        readonly required: readonly ["interval", "volume", "volume_diff", "volume_change", "sales", "sales_diff", "average_price"];
                    };
                };
            };
            readonly required: readonly ["total", "intervals"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetContract: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly address: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The public blockchain address.";
                };
                readonly chain: {
                    readonly type: "string";
                    readonly enum: readonly ["amoy", "arbitrum", "arbitrum_nova", "arbitrum_sepolia", "avalanche", "avalanche_fuji", "baobab", "base", "base_sepolia", "blast", "blast_sepolia", "bsc", "bsctestnet", "ethereum", "klaytn", "matic", "mumbai", "optimism", "optimism_sepolia", "sepolia", "solana", "soldev", "zora", "zora_sepolia"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The blockchain on which to filter the results.";
                };
            };
            readonly required: readonly ["address", "chain"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "ContractModel";
            readonly type: "object";
            readonly properties: {
                readonly address: {
                    readonly title: "Address";
                    readonly description: "The public blockchain address of the contract";
                    readonly type: "string";
                };
                readonly chain: {
                    readonly title: "Chain";
                    readonly description: "The chain on which the contract exists";
                    readonly type: "string";
                };
                readonly collection: {
                    readonly title: "Collection";
                    readonly description: "A unique string (collection slug) to identify a collection on OpenSea";
                    readonly type: "string";
                };
                readonly contract_standard: {
                    readonly title: "Contract Standard";
                    readonly description: "The standard of the contract (e.g., ERC721, ERC1155)";
                    readonly type: "string";
                };
                readonly name: {
                    readonly title: "Name";
                    readonly description: "The name of the contract";
                    readonly type: "string";
                };
                readonly total_supply: {
                    readonly title: "Total Supply";
                    readonly description: "The total supply of the contract, only available if the contract has a getter for totalSupply()";
                    readonly type: "integer";
                };
            };
            readonly required: readonly ["address", "chain", "collection", "contract_standard", "name", "total_supply"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetListings: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly chain: {
                    readonly type: "string";
                    readonly enum: readonly ["amoy", "arbitrum", "arbitrum_nova", "arbitrum_sepolia", "avalanche", "avalanche_fuji", "baobab", "base", "base_sepolia", "blast", "blast_sepolia", "bsc", "bsctestnet", "ethereum", "klaytn", "matic", "mumbai", "optimism", "optimism_sepolia", "sepolia", "solana", "soldev", "zora", "zora_sepolia"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The blockchain on which to filter the results.";
                };
                readonly protocol: {
                    readonly type: "string";
                    readonly enum: readonly ["seaport"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The token settlement protocol to use in the request.";
                };
            };
            readonly required: readonly ["chain", "protocol"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly asset_contract_address: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Filter results by the contract address for NFT(s).  \n NOTE: If used, token_ids or token_id is required.";
                };
                readonly cursor: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The cursor for the next page of results. This is returned from a previous request.";
                };
                readonly limit: {
                    readonly type: "integer";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The number of orders to return. Must be between 1 and 50. Default: 20";
                };
                readonly listed_after: {
                    readonly type: "string";
                    readonly format: "date-time";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Filter to only include orders that were listed after the given timestamp. This is a Unix epoch timestamp in seconds.";
                };
                readonly listed_before: {
                    readonly type: "string";
                    readonly format: "date-time";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Filter to only include orders that were listed before the given timestamp. This is a Unix epoch timestamp in seconds.";
                };
                readonly maker: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Filter results by the order maker's wallet address.";
                };
                readonly order_by: {
                    readonly type: "string";
                    readonly enum: readonly ["created_date", "eth_price"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The order in which to sort the results. Default: created_date \n NOTE: If `eth_price` is used, `asset_contract_address` and `token_id` are required.";
                };
                readonly order_direction: {
                    readonly type: "string";
                    readonly enum: readonly ["asc", "desc"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The direction in which to sort the results. Default: desc";
                };
                readonly payment_token_address: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Payment Token Address to filter results. This ensures all returned orders are listed in a single currency.";
                };
                readonly taker: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Filter results by the order taker's wallet address.";
                };
                readonly token_ids: {
                    readonly type: "integer";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "An array of token IDs to search for (e.g. ?token_ids=1&token_ids=209). This endpoint will return a list of orders with token_id matching any of the IDs in this array. \n NOTE: If used, asset_contract_address is required.";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly next: {
                    readonly type: "string";
                    readonly description: "The cursor for the next page of results.";
                };
                readonly previous: {
                    readonly type: "string";
                    readonly description: "The cursor for the previous page of results.";
                };
                readonly orders: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly description: "Models OrderV2 objects to serialize to a 'similar' schema to what we have with OrderV1s";
                        readonly properties: {
                            readonly created_date: {
                                readonly type: "string";
                                readonly format: "date-time";
                                readonly description: "Date the order was created";
                            };
                            readonly closing_date: {
                                readonly type: "string";
                                readonly format: "date-time";
                                readonly description: "Date the order was closed";
                            };
                            readonly listing_time: {
                                readonly type: "integer";
                                readonly readOnly: true;
                                readonly description: "Timestamp representation of created_date";
                            };
                            readonly expiration_time: {
                                readonly type: "integer";
                                readonly readOnly: true;
                                readonly description: "Timestamp representation of closing_date";
                            };
                            readonly order_hash: {
                                readonly type: "string";
                                readonly description: "An identifier for the order";
                            };
                            readonly protocol_data: {
                                readonly readOnly: true;
                                readonly title: "SerializedOrder";
                                readonly type: "object";
                                readonly required: readonly ["parameters"];
                                readonly properties: {
                                    readonly parameters: {
                                        readonly title: "Order";
                                        readonly type: "object";
                                        readonly required: readonly ["offerer", "offer", "consideration", "startTime", "endTime", "orderType", "zone", "zoneHash", "salt", "conduitKey", "totalOriginalConsiderationItems", "counter"];
                                        readonly properties: {
                                            readonly offerer: {
                                                readonly title: "Offerer";
                                                readonly description: "The address which supplies all the items in the offer.";
                                                readonly type: "string";
                                            };
                                            readonly offer: {
                                                readonly title: "Offer";
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly title: "SerializedOfferItem";
                                                    readonly type: "object";
                                                    readonly required: readonly ["itemType", "token", "identifierOrCriteria", "startAmount", "endAmount"];
                                                    readonly properties: {
                                                        readonly itemType: {
                                                            readonly title: "ItemType";
                                                            readonly description: "0 - Native - Ether (or other native token for the given chain)\n1 - ERC20\n2 - ERC721\n3 - ERC1155\n4 - ERC721 with criteria\n5 - ERC1155 with criteria\n\n`1` `2` `3` `4` `5`";
                                                            readonly enum: readonly [0, 1, 2, 3, 4, 5];
                                                            readonly type: "integer";
                                                        };
                                                        readonly token: {
                                                            readonly title: "Token";
                                                            readonly description: "The item's token contract (with the null address used for native tokens)";
                                                            readonly type: "string";
                                                        };
                                                        readonly identifierOrCriteria: {
                                                            readonly title: "Identifierorcriteria";
                                                            readonly description: "The ERC721 or ERC1155 token identifier or, in the case of a criteria-based item type, a merkle root composed of the valid set of token identifiers for the item. This value will be ignored for Ether and ERC20 item types, and can optionally be zero for criteria-based item types to allow for any identifier.";
                                                            readonly type: "string";
                                                        };
                                                        readonly startAmount: {
                                                            readonly title: "Startamount";
                                                            readonly description: "The amount of the token in question that will be required should the order be fulfilled.";
                                                            readonly type: "string";
                                                        };
                                                        readonly endAmount: {
                                                            readonly title: "Endamount";
                                                            readonly description: "When endAmount differs from `startAmount`, the realized amount is calculated linearly based on the time elapsed since the order became active.";
                                                            readonly type: "string";
                                                        };
                                                    };
                                                };
                                            };
                                            readonly consideration: {
                                                readonly title: "Consideration";
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly title: "SerializedConsiderationItem";
                                                    readonly type: "object";
                                                    readonly required: readonly ["itemType", "token", "identifierOrCriteria", "startAmount", "endAmount", "recipient"];
                                                    readonly properties: {
                                                        readonly itemType: {
                                                            readonly title: "ItemType";
                                                            readonly description: "0 - Native - Ether (or other native token for the given chain)\n1 - ERC20\n2 - ERC721\n3 - ERC1155\n4 - ERC721 with criteria\n5 - ERC1155 with criteria\n\n`1` `2` `3` `4` `5`";
                                                            readonly enum: readonly [0, 1, 2, 3, 4, 5];
                                                            readonly type: "integer";
                                                        };
                                                        readonly token: {
                                                            readonly title: "Token";
                                                            readonly description: "The item's token contract (with the null address used for native tokens)";
                                                            readonly type: "string";
                                                        };
                                                        readonly identifierOrCriteria: {
                                                            readonly title: "Identifierorcriteria";
                                                            readonly description: "The ERC721 or ERC1155 token identifier or, in the case of a criteria-based item type, a merkle root composed of the valid set of token identifiers for the item. This value will be ignored for Ether and ERC20 item types, and can optionally be zero for criteria-based item types to allow for any identifier.";
                                                            readonly type: "string";
                                                        };
                                                        readonly startAmount: {
                                                            readonly title: "Startamount";
                                                            readonly description: "The amount of the token in question that will be required should the order be fulfilled.";
                                                            readonly type: "string";
                                                        };
                                                        readonly endAmount: {
                                                            readonly title: "Endamount";
                                                            readonly description: "When endAmount differs from `startAmount`, the realized amount is calculated linearly based on the time elapsed since the order became active.";
                                                            readonly type: "string";
                                                        };
                                                        readonly recipient: {
                                                            readonly title: "Recipient";
                                                            readonly description: "The address which will receive the consideration item when the order is executed.";
                                                            readonly type: "string";
                                                        };
                                                    };
                                                };
                                            };
                                            readonly startTime: {
                                                readonly title: "Starttime";
                                                readonly description: "The block timestamp at which the order becomes active";
                                                readonly type: "string";
                                            };
                                            readonly endTime: {
                                                readonly title: "Endtime";
                                                readonly description: "The block timestamp at which the order expires";
                                                readonly type: "string";
                                            };
                                            readonly orderType: {
                                                readonly title: "SeaportOrderType";
                                                readonly description: "The type of order, which determines how it can be executed.\n0 = Full Open - No partial fills, anyone can execute\n1 = Partial Open - Partial fills supported, anyone can execute\n2 = Full Restricted - No partial fills, only offerer or zone can check if it can be executed\n3 = Partial Restricted - Partial fills supported, only offerer or zone can check if it can be executed\n4 = Contract - Contract order type, for contract offerers that can dynamically generate orders. Introduced in Seaport v1.4 and currently unsupported\n\n`1` `2` `3` `4`";
                                                readonly enum: readonly [0, 1, 2, 3, 4];
                                                readonly type: "integer";
                                            };
                                            readonly zone: {
                                                readonly title: "Zone";
                                                readonly description: "Optional secondary account attached the order which can cancel orders. Additionally, when the `OrderType` is Restricted, the zone or the offerer are the only entities which can execute the order.\nFor open orders, use the zero address.\nFor restricted orders, use the signed zone address 0x000056f7000000ece9003ca63978907a00ffd100";
                                                readonly type: "string";
                                            };
                                            readonly zoneHash: {
                                                readonly title: "Zonehash";
                                                readonly description: "A value that will be supplied to the zone when fulfilling restricted orders that the zone can utilize when making a determination on whether to authorize the order. Most often this value will be the zero hash 0x0000000000000000000000000000000000000000000000000000000000000000";
                                                readonly type: "string";
                                            };
                                            readonly salt: {
                                                readonly title: "Salt";
                                                readonly description: "an arbitrary source of entropy for the order";
                                                readonly type: "string";
                                            };
                                            readonly conduitKey: {
                                                readonly title: "Conduitkey";
                                                readonly description: "Indicates what conduit, if any, should be utilized as a source for token approvals when performing transfers. By default (i.e. when conduitKey is set to the zero hash), the offerer will grant transfer approvals to Seaport directly. \nTo utilize OpenSea's conduit, use 0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000";
                                                readonly type: "string";
                                            };
                                            readonly totalOriginalConsiderationItems: {
                                                readonly title: "Totaloriginalconsiderationitems";
                                                readonly description: "Size of the consideration array.";
                                                readonly type: "integer";
                                            };
                                            readonly counter: {
                                                readonly title: "Counter";
                                                readonly anyOf: readonly [{
                                                    readonly type: "integer";
                                                }, {
                                                    readonly type: "string";
                                                }];
                                            };
                                        };
                                    };
                                    readonly signature: {
                                        readonly title: "Signature";
                                        readonly description: "The order maker's signature used to validate the order.";
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly protocol_address: {
                                readonly type: readonly ["string", "null"];
                                readonly readOnly: true;
                                readonly description: "Exchange Contract Address. Typically the address of the Seaport contract.";
                            };
                            readonly current_price: {
                                readonly type: "string";
                                readonly description: "Current price of the order";
                            };
                            readonly maker: {
                                readonly readOnly: true;
                                readonly description: "The public blockchain address of the order maker.";
                                readonly type: "object";
                                readonly required: readonly ["address", "config", "profile_img_url", "user"];
                                readonly properties: {
                                    readonly user: {
                                        readonly type: readonly ["integer", "null"];
                                        readonly readOnly: true;
                                    };
                                    readonly profile_img_url: {
                                        readonly type: "string";
                                        readonly readOnly: true;
                                        readonly description: "A placeholder image. For the actual profile image, call the Get Account endpoint.";
                                    };
                                    readonly address: {
                                        readonly type: "string";
                                        readonly readOnly: true;
                                        readonly description: "The public blockchain address of the account.";
                                    };
                                    readonly config: {
                                        readonly readOnly: true;
                                        readonly enum: readonly ["affiliate", "affiliate_partner", "affiliate_requested", "affiliate_blacklisted", "verified", "moderator", "staff", "employee"];
                                        readonly type: "string";
                                        readonly description: "* `affiliate` - affiliate\n* `affiliate_partner` - affiliate_partner\n* `affiliate_requested` - affiliate_requested\n* `affiliate_blacklisted` - affiliate_blacklisted\n* `verified` - verified\n* `moderator` - moderator\n* `staff` - staff\n* `employee` - employee\n\n`affiliate` `affiliate_partner` `affiliate_requested` `affiliate_blacklisted` `verified` `moderator` `staff` `employee`";
                                    };
                                };
                            };
                            readonly taker: {
                                readonly readOnly: true;
                                readonly description: "The public blockchain address of the order taker.";
                                readonly type: "object";
                                readonly required: readonly ["address", "config", "profile_img_url", "user"];
                                readonly properties: {
                                    readonly user: {
                                        readonly type: readonly ["integer", "null"];
                                        readonly readOnly: true;
                                    };
                                    readonly profile_img_url: {
                                        readonly type: "string";
                                        readonly readOnly: true;
                                        readonly description: "A placeholder image. For the actual profile image, call the Get Account endpoint.";
                                    };
                                    readonly address: {
                                        readonly type: "string";
                                        readonly readOnly: true;
                                        readonly description: "The public blockchain address of the account.";
                                    };
                                    readonly config: {
                                        readonly readOnly: true;
                                        readonly enum: readonly ["affiliate", "affiliate_partner", "affiliate_requested", "affiliate_blacklisted", "verified", "moderator", "staff", "employee"];
                                        readonly type: "string";
                                        readonly description: "* `affiliate` - affiliate\n* `affiliate_partner` - affiliate_partner\n* `affiliate_requested` - affiliate_requested\n* `affiliate_blacklisted` - affiliate_blacklisted\n* `verified` - verified\n* `moderator` - moderator\n* `staff` - staff\n* `employee` - employee\n\n`affiliate` `affiliate_partner` `affiliate_requested` `affiliate_blacklisted` `verified` `moderator` `staff` `employee`";
                                    };
                                };
                            };
                            readonly maker_fees: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly account: {
                                            readonly readOnly: true;
                                            readonly type: "object";
                                            readonly required: readonly ["address", "config", "profile_img_url", "user"];
                                            readonly properties: {
                                                readonly user: {
                                                    readonly type: readonly ["integer", "null"];
                                                    readonly readOnly: true;
                                                };
                                                readonly profile_img_url: {
                                                    readonly type: "string";
                                                    readonly readOnly: true;
                                                    readonly description: "A placeholder image. For the actual profile image, call the Get Account endpoint.";
                                                };
                                                readonly address: {
                                                    readonly type: "string";
                                                    readonly readOnly: true;
                                                    readonly description: "The public blockchain address of the account.";
                                                };
                                                readonly config: {
                                                    readonly readOnly: true;
                                                    readonly enum: readonly ["affiliate", "affiliate_partner", "affiliate_requested", "affiliate_blacklisted", "verified", "moderator", "staff", "employee"];
                                                    readonly type: "string";
                                                    readonly description: "* `affiliate` - affiliate\n* `affiliate_partner` - affiliate_partner\n* `affiliate_requested` - affiliate_requested\n* `affiliate_blacklisted` - affiliate_blacklisted\n* `verified` - verified\n* `moderator` - moderator\n* `staff` - staff\n* `employee` - employee\n\n`affiliate` `affiliate_partner` `affiliate_requested` `affiliate_blacklisted` `verified` `moderator` `staff` `employee`";
                                                };
                                            };
                                        };
                                        readonly basis_points: {
                                            readonly type: "string";
                                        };
                                    };
                                    readonly required: readonly ["account", "basis_points"];
                                };
                                readonly readOnly: true;
                            };
                            readonly taker_fees: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly account: {
                                            readonly readOnly: true;
                                            readonly type: "object";
                                            readonly required: readonly ["address", "config", "profile_img_url", "user"];
                                            readonly properties: {
                                                readonly user: {
                                                    readonly type: readonly ["integer", "null"];
                                                    readonly readOnly: true;
                                                };
                                                readonly profile_img_url: {
                                                    readonly type: "string";
                                                    readonly readOnly: true;
                                                    readonly description: "A placeholder image. For the actual profile image, call the Get Account endpoint.";
                                                };
                                                readonly address: {
                                                    readonly type: "string";
                                                    readonly readOnly: true;
                                                    readonly description: "The public blockchain address of the account.";
                                                };
                                                readonly config: {
                                                    readonly readOnly: true;
                                                    readonly enum: readonly ["affiliate", "affiliate_partner", "affiliate_requested", "affiliate_blacklisted", "verified", "moderator", "staff", "employee"];
                                                    readonly type: "string";
                                                    readonly description: "* `affiliate` - affiliate\n* `affiliate_partner` - affiliate_partner\n* `affiliate_requested` - affiliate_requested\n* `affiliate_blacklisted` - affiliate_blacklisted\n* `verified` - verified\n* `moderator` - moderator\n* `staff` - staff\n* `employee` - employee\n\n`affiliate` `affiliate_partner` `affiliate_requested` `affiliate_blacklisted` `verified` `moderator` `staff` `employee`";
                                                };
                                            };
                                        };
                                        readonly basis_points: {
                                            readonly type: "string";
                                        };
                                    };
                                    readonly required: readonly ["account", "basis_points"];
                                };
                                readonly readOnly: true;
                            };
                            readonly side: {
                                readonly type: "string";
                                readonly description: "The side of the order, either bid (offer) or ask(listing).";
                            };
                            readonly order_type: {
                                readonly readOnly: true;
                                readonly enum: readonly ["basic", "dutch", "english", "criteria"];
                                readonly type: "string";
                                readonly description: "* `basic` - basic\n* `dutch` - dutch\n* `english` - english\n* `criteria` - criteria\n\n`basic` `dutch` `english` `criteria`";
                            };
                            readonly cancelled: {
                                readonly type: "boolean";
                                readonly description: "If true, the order maker has canceled the order which means it can no longer be filled.";
                            };
                            readonly finalized: {
                                readonly type: "boolean";
                                readonly description: "If true, the order has already been filled.";
                            };
                            readonly marked_invalid: {
                                readonly type: "boolean";
                                readonly readOnly: true;
                                readonly description: "If true, the order is currently invalid and can not be filled.";
                            };
                            readonly remaining_quantity: {
                                readonly type: "integer";
                                readonly description: "The remaining quantity of the order that has not been filled. This is useful for erc1155 orders.";
                            };
                            readonly criteria_proof: {
                                readonly type: readonly ["array", "null"];
                                readonly items: {
                                    readonly type: "string";
                                };
                                readonly readOnly: true;
                                readonly description: "A merkle root composed of the valid set of token identifiers for the order";
                            };
                            readonly maker_asset_bundle: {
                                readonly type: "object";
                                readonly additionalProperties: true;
                                readonly description: "Deprecated Field.";
                                readonly readOnly: true;
                            };
                            readonly taker_asset_bundle: {
                                readonly type: "object";
                                readonly additionalProperties: true;
                                readonly description: "Deprecated Field.";
                                readonly readOnly: true;
                            };
                        };
                        readonly required: readonly ["cancelled", "closing_date", "created_date", "criteria_proof", "current_price", "expiration_time", "finalized", "listing_time", "maker", "maker_asset_bundle", "maker_fees", "marked_invalid", "order_hash", "order_type", "protocol_address", "protocol_data", "remaining_quantity", "side", "taker", "taker_asset_bundle", "taker_fees"];
                    };
                };
            };
            readonly required: readonly ["next", "orders", "previous"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetNft: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly address: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The public blockchain address.";
                };
                readonly chain: {
                    readonly type: "string";
                    readonly enum: readonly ["amoy", "arbitrum", "arbitrum_nova", "arbitrum_sepolia", "avalanche", "avalanche_fuji", "baobab", "base", "base_sepolia", "blast", "blast_sepolia", "bsc", "bsctestnet", "ethereum", "klaytn", "matic", "mumbai", "optimism", "optimism_sepolia", "sepolia", "solana", "soldev", "zora", "zora_sepolia"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The blockchain on which to filter the results.";
                };
                readonly identifier: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The NFT token id.";
                };
            };
            readonly required: readonly ["address", "chain", "identifier"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "GetNftResponse";
            readonly type: "object";
            readonly properties: {
                readonly nft: {
                    readonly title: "DetailedNftModel";
                    readonly type: "object";
                    readonly properties: {
                        readonly identifier: {
                            readonly title: "Identifier";
                            readonly description: "The NFT's unique identifier within the smart contract (also referred to as token_id)";
                            readonly type: "string";
                        };
                        readonly collection: {
                            readonly title: "Collection";
                            readonly description: "Collection slug. A unique string to identify a collection on OpenSea";
                            readonly type: "string";
                        };
                        readonly contract: {
                            readonly title: "Contract";
                            readonly description: "The public blockchain address of the contract";
                            readonly type: "string";
                        };
                        readonly token_standard: {
                            readonly title: "Token Standard";
                            readonly description: "ERC standard of the token (erc721, erc1155)";
                            readonly type: "string";
                        };
                        readonly name: {
                            readonly title: "Name";
                            readonly description: "Name of the NFT";
                            readonly type: "string";
                        };
                        readonly description: {
                            readonly title: "Description";
                            readonly description: "Description of the NFT";
                            readonly type: "string";
                        };
                        readonly image_url: {
                            readonly title: "Image Url";
                            readonly description: "Link to the NFT's original image. This may be an HTTP url, SVG data, or other directly embedded data.";
                            readonly type: "string";
                        };
                        readonly metadata_url: {
                            readonly title: "Metadata Url";
                            readonly description: "Link to the offchain metadata store";
                            readonly type: "string";
                        };
                        readonly opensea_url: {
                            readonly title: "Opensea Url";
                            readonly description: "Link to the NFT on OpenSea";
                            readonly type: "string";
                        };
                        readonly updated_at: {
                            readonly title: "Updated At";
                            readonly description: "Last time that the NFT's metadata was updated by OpenSea";
                            readonly type: "string";
                        };
                        readonly is_disabled: {
                            readonly title: "Is Disabled";
                            readonly description: "If the item is currently able to be bought or sold using OpenSea";
                            readonly type: "boolean";
                        };
                        readonly is_nsfw: {
                            readonly title: "Is Nsfw";
                            readonly description: "If the item is currently classified as 'Not Safe for Work' by OpenSea as defined in [OpenSea's NSFW Policy](https://support.opensea.io/hc/articles/9729972510995).";
                            readonly type: "boolean";
                        };
                        readonly animation_url: {
                            readonly title: "Animation Url";
                            readonly description: "Link to the NFT's original animation.";
                            readonly type: "string";
                        };
                        readonly is_suspicious: {
                            readonly title: "Is Suspicious";
                            readonly description: "If the item has been reported for suspicious activity by OpenSea";
                            readonly type: "boolean";
                        };
                        readonly creator: {
                            readonly title: "Creator";
                            readonly description: "The public blockchain address of the creator";
                            readonly type: "string";
                        };
                        readonly traits: {
                            readonly title: "Traits";
                            readonly description: "List of Trait objects. The field will be null if the NFT has more than 50 traits";
                            readonly type: "array";
                            readonly items: {
                                readonly title: "TraitModel";
                                readonly type: "object";
                                readonly properties: {
                                    readonly trait_type: {
                                        readonly title: "Trait Type";
                                        readonly description: "The name of the trait category (e.g. 'Background')";
                                        readonly maxLength: 150;
                                        readonly type: "string";
                                    };
                                    readonly display_type: {
                                        readonly title: "DisplayTypeField";
                                        readonly description: "A field indicating how to display. None is used for string traits.\n\n`number` `boost_percentage` `boost_number` `author` `date` `None`";
                                        readonly enum: readonly ["number", "boost_percentage", "boost_number", "author", "date", "None"];
                                        readonly type: "string";
                                        readonly properties: {};
                                    };
                                    readonly max_value: {
                                        readonly title: "Max Value";
                                        readonly description: "Ceiling for possible numeric trait values";
                                        readonly type: "string";
                                    };
                                    readonly value: {
                                        readonly title: "Value";
                                        readonly description: "The value of the trait (e.g. 'Red')";
                                        readonly anyOf: readonly [{
                                            readonly type: "number";
                                        }, {
                                            readonly type: "integer";
                                        }, {
                                            readonly type: "string";
                                            readonly format: "date";
                                        }, {
                                            readonly type: "string";
                                        }];
                                    };
                                };
                                readonly required: readonly ["pk", "trait_type", "max_value", "value"];
                            };
                        };
                        readonly owners: {
                            readonly title: "Owners";
                            readonly description: "List of Owners. The field will be null if the NFT has more than 50 owners";
                            readonly type: "array";
                            readonly items: {
                                readonly title: "OwnerModel";
                                readonly type: "object";
                                readonly properties: {
                                    readonly address: {
                                        readonly title: "Address";
                                        readonly description: "The public blockchain address of the owner";
                                        readonly type: "string";
                                    };
                                    readonly quantity: {
                                        readonly title: "Quantity";
                                        readonly description: "The number of tokens owned ";
                                        readonly type: "integer";
                                    };
                                };
                                readonly required: readonly ["address", "quantity"];
                            };
                        };
                        readonly rarity: {
                            readonly title: "Rarity";
                            readonly description: "Rarity data for the NFT";
                            readonly type: "object";
                            readonly required: readonly ["rank"];
                            readonly properties: {
                                readonly strategy_id: {
                                    readonly description: "Rarity algorithm used. Currently, always 'openrarity'";
                                    readonly title: "RarityStrategyId";
                                    readonly enum: readonly ["openrarity"];
                                };
                                readonly strategy_version: {
                                    readonly title: "Strategy Version";
                                    readonly description: "Deprecated Field";
                                    readonly type: "string";
                                };
                                readonly rank: {
                                    readonly title: "Rank";
                                    readonly description: "Rarity Rank of the NFT in the collection";
                                    readonly type: "integer";
                                };
                                readonly score: {
                                    readonly title: "Score";
                                    readonly description: "Deprecated Field";
                                    readonly type: "number";
                                };
                                readonly calculated_at: {
                                    readonly title: "Calculated At";
                                    readonly description: "Deprecated Field";
                                    readonly type: "string";
                                };
                                readonly max_rank: {
                                    readonly title: "Max Rank";
                                    readonly description: "Deprecated Field";
                                    readonly type: "integer";
                                };
                                readonly total_supply: {
                                    readonly title: "Total Supply";
                                    readonly description: "Deprecated Field";
                                    readonly default: 0;
                                    readonly type: "integer";
                                };
                                readonly ranking_features: {
                                    readonly title: "Ranking Features";
                                    readonly description: "Deprecated Field";
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly unique_attribute_count: {
                                            readonly title: "Unique Attribute Count";
                                            readonly description: "Deprecated Field.";
                                            readonly default: 0;
                                            readonly type: "integer";
                                        };
                                    };
                                };
                            };
                        };
                    };
                    readonly required: readonly ["identifier", "collection", "contract", "token_standard", "name", "description", "updated_at", "is_disabled", "is_nsfw", "is_suspicious", "creator", "traits", "owners", "rarity"];
                };
            };
            readonly required: readonly ["nft"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetOffers: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly chain: {
                    readonly type: "string";
                    readonly enum: readonly ["amoy", "arbitrum", "arbitrum_nova", "arbitrum_sepolia", "avalanche", "avalanche_fuji", "baobab", "base", "base_sepolia", "blast", "blast_sepolia", "bsc", "bsctestnet", "ethereum", "klaytn", "matic", "mumbai", "optimism", "optimism_sepolia", "sepolia", "solana", "soldev", "zora", "zora_sepolia"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The blockchain on which to filter the results.";
                };
                readonly protocol: {
                    readonly type: "string";
                    readonly enum: readonly ["seaport"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The token settlement protocol to use in the request.";
                };
            };
            readonly required: readonly ["chain", "protocol"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly asset_contract_address: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Filter results by the contract address for NFT(s).  \n NOTE: If used, token_ids or token_id is required.";
                };
                readonly cursor: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The cursor for the next page of results. This is returned from a previous request.";
                };
                readonly limit: {
                    readonly type: "integer";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The number of orders to return. Must be between 1 and 50. Default: 20";
                };
                readonly listed_after: {
                    readonly type: "string";
                    readonly format: "date-time";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Filter to only include orders that were listed after the given timestamp. This is a Unix epoch timestamp in seconds.";
                };
                readonly listed_before: {
                    readonly type: "string";
                    readonly format: "date-time";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Filter to only include orders that were listed before the given timestamp. This is a Unix epoch timestamp in seconds.";
                };
                readonly maker: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Filter results by the order maker's wallet address.";
                };
                readonly order_by: {
                    readonly type: "string";
                    readonly enum: readonly ["created_date", "eth_price"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The order in which to sort the results. Default: created_date \n NOTE: If `eth_price` is used, `asset_contract_address` and `token_id` are required.";
                };
                readonly order_direction: {
                    readonly type: "string";
                    readonly enum: readonly ["asc", "desc"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The direction in which to sort the results. Default: desc";
                };
                readonly payment_token_address: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Payment Token Address to filter results. This ensures all returned orders are listed in a single currency.";
                };
                readonly taker: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Filter results by the order taker's wallet address.";
                };
                readonly token_ids: {
                    readonly type: "integer";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "An array of token IDs to search for (e.g. ?token_ids=1&token_ids=209). This endpoint will return a list of orders with token_id matching any of the IDs in this array. \n NOTE: If used, asset_contract_address is required.";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly next: {
                    readonly type: "string";
                    readonly description: "The cursor for the next page of results.";
                };
                readonly previous: {
                    readonly type: "string";
                    readonly description: "The cursor for the previous page of results.";
                };
                readonly orders: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly description: "Models OrderV2 objects to serialize to a 'similar' schema to what we have with OrderV1s";
                        readonly properties: {
                            readonly created_date: {
                                readonly type: "string";
                                readonly format: "date-time";
                                readonly description: "Date the order was created";
                            };
                            readonly closing_date: {
                                readonly type: "string";
                                readonly format: "date-time";
                                readonly description: "Date the order was closed";
                            };
                            readonly listing_time: {
                                readonly type: "integer";
                                readonly readOnly: true;
                                readonly description: "Timestamp representation of created_date";
                            };
                            readonly expiration_time: {
                                readonly type: "integer";
                                readonly readOnly: true;
                                readonly description: "Timestamp representation of closing_date";
                            };
                            readonly order_hash: {
                                readonly type: "string";
                                readonly description: "An identifier for the order";
                            };
                            readonly protocol_data: {
                                readonly readOnly: true;
                                readonly title: "SerializedOrder";
                                readonly type: "object";
                                readonly required: readonly ["parameters"];
                                readonly properties: {
                                    readonly parameters: {
                                        readonly title: "Order";
                                        readonly type: "object";
                                        readonly required: readonly ["offerer", "offer", "consideration", "startTime", "endTime", "orderType", "zone", "zoneHash", "salt", "conduitKey", "totalOriginalConsiderationItems", "counter"];
                                        readonly properties: {
                                            readonly offerer: {
                                                readonly title: "Offerer";
                                                readonly description: "The address which supplies all the items in the offer.";
                                                readonly type: "string";
                                            };
                                            readonly offer: {
                                                readonly title: "Offer";
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly title: "SerializedOfferItem";
                                                    readonly type: "object";
                                                    readonly required: readonly ["itemType", "token", "identifierOrCriteria", "startAmount", "endAmount"];
                                                    readonly properties: {
                                                        readonly itemType: {
                                                            readonly title: "ItemType";
                                                            readonly description: "0 - Native - Ether (or other native token for the given chain)\n1 - ERC20\n2 - ERC721\n3 - ERC1155\n4 - ERC721 with criteria\n5 - ERC1155 with criteria\n\n`1` `2` `3` `4` `5`";
                                                            readonly enum: readonly [0, 1, 2, 3, 4, 5];
                                                            readonly type: "integer";
                                                        };
                                                        readonly token: {
                                                            readonly title: "Token";
                                                            readonly description: "The item's token contract (with the null address used for native tokens)";
                                                            readonly type: "string";
                                                        };
                                                        readonly identifierOrCriteria: {
                                                            readonly title: "Identifierorcriteria";
                                                            readonly description: "The ERC721 or ERC1155 token identifier or, in the case of a criteria-based item type, a merkle root composed of the valid set of token identifiers for the item. This value will be ignored for Ether and ERC20 item types, and can optionally be zero for criteria-based item types to allow for any identifier.";
                                                            readonly type: "string";
                                                        };
                                                        readonly startAmount: {
                                                            readonly title: "Startamount";
                                                            readonly description: "The amount of the token in question that will be required should the order be fulfilled.";
                                                            readonly type: "string";
                                                        };
                                                        readonly endAmount: {
                                                            readonly title: "Endamount";
                                                            readonly description: "When endAmount differs from `startAmount`, the realized amount is calculated linearly based on the time elapsed since the order became active.";
                                                            readonly type: "string";
                                                        };
                                                    };
                                                };
                                            };
                                            readonly consideration: {
                                                readonly title: "Consideration";
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly title: "SerializedConsiderationItem";
                                                    readonly type: "object";
                                                    readonly required: readonly ["itemType", "token", "identifierOrCriteria", "startAmount", "endAmount", "recipient"];
                                                    readonly properties: {
                                                        readonly itemType: {
                                                            readonly title: "ItemType";
                                                            readonly description: "0 - Native - Ether (or other native token for the given chain)\n1 - ERC20\n2 - ERC721\n3 - ERC1155\n4 - ERC721 with criteria\n5 - ERC1155 with criteria\n\n`1` `2` `3` `4` `5`";
                                                            readonly enum: readonly [0, 1, 2, 3, 4, 5];
                                                            readonly type: "integer";
                                                        };
                                                        readonly token: {
                                                            readonly title: "Token";
                                                            readonly description: "The item's token contract (with the null address used for native tokens)";
                                                            readonly type: "string";
                                                        };
                                                        readonly identifierOrCriteria: {
                                                            readonly title: "Identifierorcriteria";
                                                            readonly description: "The ERC721 or ERC1155 token identifier or, in the case of a criteria-based item type, a merkle root composed of the valid set of token identifiers for the item. This value will be ignored for Ether and ERC20 item types, and can optionally be zero for criteria-based item types to allow for any identifier.";
                                                            readonly type: "string";
                                                        };
                                                        readonly startAmount: {
                                                            readonly title: "Startamount";
                                                            readonly description: "The amount of the token in question that will be required should the order be fulfilled.";
                                                            readonly type: "string";
                                                        };
                                                        readonly endAmount: {
                                                            readonly title: "Endamount";
                                                            readonly description: "When endAmount differs from `startAmount`, the realized amount is calculated linearly based on the time elapsed since the order became active.";
                                                            readonly type: "string";
                                                        };
                                                        readonly recipient: {
                                                            readonly title: "Recipient";
                                                            readonly description: "The address which will receive the consideration item when the order is executed.";
                                                            readonly type: "string";
                                                        };
                                                    };
                                                };
                                            };
                                            readonly startTime: {
                                                readonly title: "Starttime";
                                                readonly description: "The block timestamp at which the order becomes active";
                                                readonly type: "string";
                                            };
                                            readonly endTime: {
                                                readonly title: "Endtime";
                                                readonly description: "The block timestamp at which the order expires";
                                                readonly type: "string";
                                            };
                                            readonly orderType: {
                                                readonly title: "SeaportOrderType";
                                                readonly description: "The type of order, which determines how it can be executed.\n0 = Full Open - No partial fills, anyone can execute\n1 = Partial Open - Partial fills supported, anyone can execute\n2 = Full Restricted - No partial fills, only offerer or zone can check if it can be executed\n3 = Partial Restricted - Partial fills supported, only offerer or zone can check if it can be executed\n4 = Contract - Contract order type, for contract offerers that can dynamically generate orders. Introduced in Seaport v1.4 and currently unsupported\n\n`1` `2` `3` `4`";
                                                readonly enum: readonly [0, 1, 2, 3, 4];
                                                readonly type: "integer";
                                            };
                                            readonly zone: {
                                                readonly title: "Zone";
                                                readonly description: "Optional secondary account attached the order which can cancel orders. Additionally, when the `OrderType` is Restricted, the zone or the offerer are the only entities which can execute the order.\nFor open orders, use the zero address.\nFor restricted orders, use the signed zone address 0x000056f7000000ece9003ca63978907a00ffd100";
                                                readonly type: "string";
                                            };
                                            readonly zoneHash: {
                                                readonly title: "Zonehash";
                                                readonly description: "A value that will be supplied to the zone when fulfilling restricted orders that the zone can utilize when making a determination on whether to authorize the order. Most often this value will be the zero hash 0x0000000000000000000000000000000000000000000000000000000000000000";
                                                readonly type: "string";
                                            };
                                            readonly salt: {
                                                readonly title: "Salt";
                                                readonly description: "an arbitrary source of entropy for the order";
                                                readonly type: "string";
                                            };
                                            readonly conduitKey: {
                                                readonly title: "Conduitkey";
                                                readonly description: "Indicates what conduit, if any, should be utilized as a source for token approvals when performing transfers. By default (i.e. when conduitKey is set to the zero hash), the offerer will grant transfer approvals to Seaport directly. \nTo utilize OpenSea's conduit, use 0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000";
                                                readonly type: "string";
                                            };
                                            readonly totalOriginalConsiderationItems: {
                                                readonly title: "Totaloriginalconsiderationitems";
                                                readonly description: "Size of the consideration array.";
                                                readonly type: "integer";
                                            };
                                            readonly counter: {
                                                readonly title: "Counter";
                                                readonly anyOf: readonly [{
                                                    readonly type: "integer";
                                                }, {
                                                    readonly type: "string";
                                                }];
                                            };
                                        };
                                    };
                                    readonly signature: {
                                        readonly title: "Signature";
                                        readonly description: "The order maker's signature used to validate the order.";
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly protocol_address: {
                                readonly type: readonly ["string", "null"];
                                readonly readOnly: true;
                                readonly description: "Exchange Contract Address. Typically the address of the Seaport contract.";
                            };
                            readonly current_price: {
                                readonly type: "string";
                                readonly description: "Current price of the order";
                            };
                            readonly maker: {
                                readonly readOnly: true;
                                readonly description: "The public blockchain address of the order maker.";
                                readonly type: "object";
                                readonly required: readonly ["address", "config", "profile_img_url", "user"];
                                readonly properties: {
                                    readonly user: {
                                        readonly type: readonly ["integer", "null"];
                                        readonly readOnly: true;
                                    };
                                    readonly profile_img_url: {
                                        readonly type: "string";
                                        readonly readOnly: true;
                                        readonly description: "A placeholder image. For the actual profile image, call the Get Account endpoint.";
                                    };
                                    readonly address: {
                                        readonly type: "string";
                                        readonly readOnly: true;
                                        readonly description: "The public blockchain address of the account.";
                                    };
                                    readonly config: {
                                        readonly readOnly: true;
                                        readonly enum: readonly ["affiliate", "affiliate_partner", "affiliate_requested", "affiliate_blacklisted", "verified", "moderator", "staff", "employee"];
                                        readonly type: "string";
                                        readonly description: "* `affiliate` - affiliate\n* `affiliate_partner` - affiliate_partner\n* `affiliate_requested` - affiliate_requested\n* `affiliate_blacklisted` - affiliate_blacklisted\n* `verified` - verified\n* `moderator` - moderator\n* `staff` - staff\n* `employee` - employee\n\n`affiliate` `affiliate_partner` `affiliate_requested` `affiliate_blacklisted` `verified` `moderator` `staff` `employee`";
                                    };
                                };
                            };
                            readonly taker: {
                                readonly readOnly: true;
                                readonly description: "The public blockchain address of the order taker.";
                                readonly type: "object";
                                readonly required: readonly ["address", "config", "profile_img_url", "user"];
                                readonly properties: {
                                    readonly user: {
                                        readonly type: readonly ["integer", "null"];
                                        readonly readOnly: true;
                                    };
                                    readonly profile_img_url: {
                                        readonly type: "string";
                                        readonly readOnly: true;
                                        readonly description: "A placeholder image. For the actual profile image, call the Get Account endpoint.";
                                    };
                                    readonly address: {
                                        readonly type: "string";
                                        readonly readOnly: true;
                                        readonly description: "The public blockchain address of the account.";
                                    };
                                    readonly config: {
                                        readonly readOnly: true;
                                        readonly enum: readonly ["affiliate", "affiliate_partner", "affiliate_requested", "affiliate_blacklisted", "verified", "moderator", "staff", "employee"];
                                        readonly type: "string";
                                        readonly description: "* `affiliate` - affiliate\n* `affiliate_partner` - affiliate_partner\n* `affiliate_requested` - affiliate_requested\n* `affiliate_blacklisted` - affiliate_blacklisted\n* `verified` - verified\n* `moderator` - moderator\n* `staff` - staff\n* `employee` - employee\n\n`affiliate` `affiliate_partner` `affiliate_requested` `affiliate_blacklisted` `verified` `moderator` `staff` `employee`";
                                    };
                                };
                            };
                            readonly maker_fees: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly account: {
                                            readonly readOnly: true;
                                            readonly type: "object";
                                            readonly required: readonly ["address", "config", "profile_img_url", "user"];
                                            readonly properties: {
                                                readonly user: {
                                                    readonly type: readonly ["integer", "null"];
                                                    readonly readOnly: true;
                                                };
                                                readonly profile_img_url: {
                                                    readonly type: "string";
                                                    readonly readOnly: true;
                                                    readonly description: "A placeholder image. For the actual profile image, call the Get Account endpoint.";
                                                };
                                                readonly address: {
                                                    readonly type: "string";
                                                    readonly readOnly: true;
                                                    readonly description: "The public blockchain address of the account.";
                                                };
                                                readonly config: {
                                                    readonly readOnly: true;
                                                    readonly enum: readonly ["affiliate", "affiliate_partner", "affiliate_requested", "affiliate_blacklisted", "verified", "moderator", "staff", "employee"];
                                                    readonly type: "string";
                                                    readonly description: "* `affiliate` - affiliate\n* `affiliate_partner` - affiliate_partner\n* `affiliate_requested` - affiliate_requested\n* `affiliate_blacklisted` - affiliate_blacklisted\n* `verified` - verified\n* `moderator` - moderator\n* `staff` - staff\n* `employee` - employee\n\n`affiliate` `affiliate_partner` `affiliate_requested` `affiliate_blacklisted` `verified` `moderator` `staff` `employee`";
                                                };
                                            };
                                        };
                                        readonly basis_points: {
                                            readonly type: "string";
                                        };
                                    };
                                    readonly required: readonly ["account", "basis_points"];
                                };
                                readonly readOnly: true;
                            };
                            readonly taker_fees: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly account: {
                                            readonly readOnly: true;
                                            readonly type: "object";
                                            readonly required: readonly ["address", "config", "profile_img_url", "user"];
                                            readonly properties: {
                                                readonly user: {
                                                    readonly type: readonly ["integer", "null"];
                                                    readonly readOnly: true;
                                                };
                                                readonly profile_img_url: {
                                                    readonly type: "string";
                                                    readonly readOnly: true;
                                                    readonly description: "A placeholder image. For the actual profile image, call the Get Account endpoint.";
                                                };
                                                readonly address: {
                                                    readonly type: "string";
                                                    readonly readOnly: true;
                                                    readonly description: "The public blockchain address of the account.";
                                                };
                                                readonly config: {
                                                    readonly readOnly: true;
                                                    readonly enum: readonly ["affiliate", "affiliate_partner", "affiliate_requested", "affiliate_blacklisted", "verified", "moderator", "staff", "employee"];
                                                    readonly type: "string";
                                                    readonly description: "* `affiliate` - affiliate\n* `affiliate_partner` - affiliate_partner\n* `affiliate_requested` - affiliate_requested\n* `affiliate_blacklisted` - affiliate_blacklisted\n* `verified` - verified\n* `moderator` - moderator\n* `staff` - staff\n* `employee` - employee\n\n`affiliate` `affiliate_partner` `affiliate_requested` `affiliate_blacklisted` `verified` `moderator` `staff` `employee`";
                                                };
                                            };
                                        };
                                        readonly basis_points: {
                                            readonly type: "string";
                                        };
                                    };
                                    readonly required: readonly ["account", "basis_points"];
                                };
                                readonly readOnly: true;
                            };
                            readonly side: {
                                readonly type: "string";
                                readonly description: "The side of the order, either bid (offer) or ask(listing).";
                            };
                            readonly order_type: {
                                readonly readOnly: true;
                                readonly enum: readonly ["basic", "dutch", "english", "criteria"];
                                readonly type: "string";
                                readonly description: "* `basic` - basic\n* `dutch` - dutch\n* `english` - english\n* `criteria` - criteria\n\n`basic` `dutch` `english` `criteria`";
                            };
                            readonly cancelled: {
                                readonly type: "boolean";
                                readonly description: "If true, the order maker has canceled the order which means it can no longer be filled.";
                            };
                            readonly finalized: {
                                readonly type: "boolean";
                                readonly description: "If true, the order has already been filled.";
                            };
                            readonly marked_invalid: {
                                readonly type: "boolean";
                                readonly readOnly: true;
                                readonly description: "If true, the order is currently invalid and can not be filled.";
                            };
                            readonly remaining_quantity: {
                                readonly type: "integer";
                                readonly description: "The remaining quantity of the order that has not been filled. This is useful for erc1155 orders.";
                            };
                            readonly criteria_proof: {
                                readonly type: readonly ["array", "null"];
                                readonly items: {
                                    readonly type: "string";
                                };
                                readonly readOnly: true;
                                readonly description: "A merkle root composed of the valid set of token identifiers for the order";
                            };
                            readonly maker_asset_bundle: {
                                readonly type: "object";
                                readonly additionalProperties: true;
                                readonly description: "Deprecated Field.";
                                readonly readOnly: true;
                            };
                            readonly taker_asset_bundle: {
                                readonly type: "object";
                                readonly additionalProperties: true;
                                readonly description: "Deprecated Field.";
                                readonly readOnly: true;
                            };
                        };
                        readonly required: readonly ["cancelled", "closing_date", "created_date", "criteria_proof", "current_price", "expiration_time", "finalized", "listing_time", "maker", "maker_asset_bundle", "maker_fees", "marked_invalid", "order_hash", "order_type", "protocol_address", "protocol_data", "remaining_quantity", "side", "taker", "taker_asset_bundle", "taker_fees"];
                    };
                };
            };
            readonly required: readonly ["next", "orders", "previous"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetOrder: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly chain: {
                    readonly type: "string";
                    readonly enum: readonly ["amoy", "arbitrum", "arbitrum_nova", "arbitrum_sepolia", "avalanche", "avalanche_fuji", "baobab", "base", "base_sepolia", "blast", "blast_sepolia", "bsc", "bsctestnet", "ethereum", "klaytn", "matic", "mumbai", "optimism", "optimism_sepolia", "sepolia", "solana", "soldev", "zora", "zora_sepolia"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The blockchain on which to filter the results.";
                };
                readonly order_hash: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The hash of the order to retrieve.";
                };
                readonly protocol_address: {
                    readonly type: "string";
                    readonly enum: readonly ["0x0000000000000068f116a894984e2db1123eb395", "0x00000000000000adc04c56bf30ac9d3c0aaf14dc"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The contract address of the protocol to use in the request.";
                };
            };
            readonly required: readonly ["chain", "order_hash", "protocol_address"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "GetOrderResult";
            readonly type: "object";
            readonly properties: {
                readonly order: {
                    readonly title: "Order";
                    readonly anyOf: readonly [{
                        readonly title: "Listing";
                        readonly type: "object";
                        readonly properties: {
                            readonly order_hash: {
                                readonly title: "Order Hash";
                                readonly description: "Order hash";
                                readonly type: "string";
                            };
                            readonly chain: {
                                readonly description: "OpenSea supported chains.";
                                readonly title: "ChainIdentifier";
                                readonly enum: readonly ["ethereum", "matic", "klaytn", "bsc", "solana", "arbitrum", "arbitrum_nova", "avalanche", "optimism", "base", "blast", "sei", "zora", "sepolia", "rinkeby", "mumbai", "amoy", "baobab", "bsctestnet", "goerli", "soldev", "arbitrum_goerli", "arbitrum_sepolia", "avalanche_fuji", "optimism_goerli", "optimism_sepolia", "base_goerli", "base_sepolia", "blast_sepolia", "gunzilla_testnet", "sei_devnet", "zora_testnet", "zora_sepolia"];
                            };
                            readonly type: {
                                readonly title: "OrderType";
                                readonly description: "basic - Quantities are fixed. Used for fixed price listings and offers.\nenglish - The quantity represents the minimum price.\ncriteria - The items that are accepted by this offer will be found in the criteria fields.\n\n`basic` `dutch` `english` `criteria`";
                                readonly enum: readonly ["basic", "dutch", "english", "criteria"];
                                readonly properties: {};
                                readonly type: "object";
                            };
                            readonly price: {
                                readonly title: "BasicListingPrice";
                                readonly type: "object";
                                readonly properties: {
                                    readonly current: {
                                        readonly title: "Price";
                                        readonly type: "object";
                                        readonly required: readonly ["currency", "decimals", "value"];
                                        readonly properties: {
                                            readonly currency: {
                                                readonly title: "Currency";
                                                readonly type: "string";
                                            };
                                            readonly decimals: {
                                                readonly title: "Decimals";
                                                readonly type: "integer";
                                            };
                                            readonly value: {
                                                readonly title: "Value";
                                                readonly type: "string";
                                            };
                                        };
                                    };
                                };
                                readonly required: readonly ["current"];
                            };
                            readonly protocol_data: {
                                readonly title: "Protocol Data";
                                readonly description: "The onchain order data.";
                                readonly type: "object";
                                readonly required: readonly ["parameters"];
                                readonly properties: {
                                    readonly parameters: {
                                        readonly title: "Order";
                                        readonly type: "object";
                                        readonly required: readonly ["offerer", "offer", "consideration", "startTime", "endTime", "orderType", "zone", "zoneHash", "salt", "conduitKey", "totalOriginalConsiderationItems", "counter"];
                                        readonly properties: {
                                            readonly offerer: {
                                                readonly title: "Offerer";
                                                readonly description: "The address which supplies all the items in the offer.";
                                                readonly type: "string";
                                            };
                                            readonly offer: {
                                                readonly title: "Offer";
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly title: "SerializedOfferItem";
                                                    readonly type: "object";
                                                    readonly required: readonly ["itemType", "token", "identifierOrCriteria", "startAmount", "endAmount"];
                                                    readonly properties: {
                                                        readonly itemType: {
                                                            readonly title: "ItemType";
                                                            readonly description: "0 - Native - Ether (or other native token for the given chain)\n1 - ERC20\n2 - ERC721\n3 - ERC1155\n4 - ERC721 with criteria\n5 - ERC1155 with criteria\n\n`1` `2` `3` `4` `5`";
                                                            readonly enum: readonly [0, 1, 2, 3, 4, 5];
                                                            readonly type: "integer";
                                                        };
                                                        readonly token: {
                                                            readonly title: "Token";
                                                            readonly description: "The item's token contract (with the null address used for native tokens)";
                                                            readonly type: "string";
                                                        };
                                                        readonly identifierOrCriteria: {
                                                            readonly title: "Identifierorcriteria";
                                                            readonly description: "The ERC721 or ERC1155 token identifier or, in the case of a criteria-based item type, a merkle root composed of the valid set of token identifiers for the item. This value will be ignored for Ether and ERC20 item types, and can optionally be zero for criteria-based item types to allow for any identifier.";
                                                            readonly type: "string";
                                                        };
                                                        readonly startAmount: {
                                                            readonly title: "Startamount";
                                                            readonly description: "The amount of the token in question that will be required should the order be fulfilled.";
                                                            readonly type: "string";
                                                        };
                                                        readonly endAmount: {
                                                            readonly title: "Endamount";
                                                            readonly description: "When endAmount differs from `startAmount`, the realized amount is calculated linearly based on the time elapsed since the order became active.";
                                                            readonly type: "string";
                                                        };
                                                    };
                                                };
                                            };
                                            readonly consideration: {
                                                readonly title: "Consideration";
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly title: "SerializedConsiderationItem";
                                                    readonly type: "object";
                                                    readonly required: readonly ["itemType", "token", "identifierOrCriteria", "startAmount", "endAmount", "recipient"];
                                                    readonly properties: {
                                                        readonly itemType: {
                                                            readonly title: "ItemType";
                                                            readonly description: "0 - Native - Ether (or other native token for the given chain)\n1 - ERC20\n2 - ERC721\n3 - ERC1155\n4 - ERC721 with criteria\n5 - ERC1155 with criteria\n\n`1` `2` `3` `4` `5`";
                                                            readonly enum: readonly [0, 1, 2, 3, 4, 5];
                                                            readonly type: "integer";
                                                        };
                                                        readonly token: {
                                                            readonly title: "Token";
                                                            readonly description: "The item's token contract (with the null address used for native tokens)";
                                                            readonly type: "string";
                                                        };
                                                        readonly identifierOrCriteria: {
                                                            readonly title: "Identifierorcriteria";
                                                            readonly description: "The ERC721 or ERC1155 token identifier or, in the case of a criteria-based item type, a merkle root composed of the valid set of token identifiers for the item. This value will be ignored for Ether and ERC20 item types, and can optionally be zero for criteria-based item types to allow for any identifier.";
                                                            readonly type: "string";
                                                        };
                                                        readonly startAmount: {
                                                            readonly title: "Startamount";
                                                            readonly description: "The amount of the token in question that will be required should the order be fulfilled.";
                                                            readonly type: "string";
                                                        };
                                                        readonly endAmount: {
                                                            readonly title: "Endamount";
                                                            readonly description: "When endAmount differs from `startAmount`, the realized amount is calculated linearly based on the time elapsed since the order became active.";
                                                            readonly type: "string";
                                                        };
                                                        readonly recipient: {
                                                            readonly title: "Recipient";
                                                            readonly description: "The address which will receive the consideration item when the order is executed.";
                                                            readonly type: "string";
                                                        };
                                                    };
                                                };
                                            };
                                            readonly startTime: {
                                                readonly title: "Starttime";
                                                readonly description: "The block timestamp at which the order becomes active";
                                                readonly type: "string";
                                            };
                                            readonly endTime: {
                                                readonly title: "Endtime";
                                                readonly description: "The block timestamp at which the order expires";
                                                readonly type: "string";
                                            };
                                            readonly orderType: {
                                                readonly title: "SeaportOrderType";
                                                readonly description: "The type of order, which determines how it can be executed.\n0 = Full Open - No partial fills, anyone can execute\n1 = Partial Open - Partial fills supported, anyone can execute\n2 = Full Restricted - No partial fills, only offerer or zone can check if it can be executed\n3 = Partial Restricted - Partial fills supported, only offerer or zone can check if it can be executed\n4 = Contract - Contract order type, for contract offerers that can dynamically generate orders. Introduced in Seaport v1.4 and currently unsupported\n\n`1` `2` `3` `4`";
                                                readonly enum: readonly [0, 1, 2, 3, 4];
                                                readonly type: "integer";
                                            };
                                            readonly zone: {
                                                readonly title: "Zone";
                                                readonly description: "Optional secondary account attached the order which can cancel orders. Additionally, when the `OrderType` is Restricted, the zone or the offerer are the only entities which can execute the order.\nFor open orders, use the zero address.\nFor restricted orders, use the signed zone address 0x000056f7000000ece9003ca63978907a00ffd100";
                                                readonly type: "string";
                                            };
                                            readonly zoneHash: {
                                                readonly title: "Zonehash";
                                                readonly description: "A value that will be supplied to the zone when fulfilling restricted orders that the zone can utilize when making a determination on whether to authorize the order. Most often this value will be the zero hash 0x0000000000000000000000000000000000000000000000000000000000000000";
                                                readonly type: "string";
                                            };
                                            readonly salt: {
                                                readonly title: "Salt";
                                                readonly description: "an arbitrary source of entropy for the order";
                                                readonly type: "string";
                                            };
                                            readonly conduitKey: {
                                                readonly title: "Conduitkey";
                                                readonly description: "Indicates what conduit, if any, should be utilized as a source for token approvals when performing transfers. By default (i.e. when conduitKey is set to the zero hash), the offerer will grant transfer approvals to Seaport directly. \nTo utilize OpenSea's conduit, use 0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000";
                                                readonly type: "string";
                                            };
                                            readonly totalOriginalConsiderationItems: {
                                                readonly title: "Totaloriginalconsiderationitems";
                                                readonly description: "Size of the consideration array.";
                                                readonly type: "integer";
                                            };
                                            readonly counter: {
                                                readonly title: "Counter";
                                                readonly anyOf: readonly [{
                                                    readonly type: "integer";
                                                }, {
                                                    readonly type: "string";
                                                }];
                                            };
                                        };
                                    };
                                    readonly signature: {
                                        readonly title: "Signature";
                                        readonly description: "The order maker's signature used to validate the order.";
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly protocol_address: {
                                readonly title: "Protocol Address";
                                readonly description: "Exchange contract address";
                                readonly type: "string";
                            };
                        };
                        readonly required: readonly ["order_hash", "chain", "type", "price", "protocol_data", "protocol_address"];
                    }, {
                        readonly title: "Offer";
                        readonly type: "object";
                        readonly properties: {
                            readonly order_hash: {
                                readonly title: "Order Hash";
                                readonly description: "Order hash";
                                readonly type: "string";
                            };
                            readonly chain: {
                                readonly title: "ChainIdentifier";
                                readonly description: "OpenSea supported chains.\n\n`ethereum` `matic` `klaytn` `bsc` `solana` `arbitrum` `arbitrum_nova` `avalanche` `optimism` `base` `blast` `sei` `zora` `sepolia` `rinkeby` `mumbai` `amoy` `baobab` `bsctestnet` `goerli` `soldev` `arbitrum_goerli` `arbitrum_sepolia` `avalanche_fuji` `optimism_goerli` `optimism_sepolia` `base_goerli` `base_sepolia` `blast_sepolia` `gunzilla_testnet` `sei_devnet` `zora_testnet` `zora_sepolia`";
                                readonly enum: readonly ["ethereum", "matic", "klaytn", "bsc", "solana", "arbitrum", "arbitrum_nova", "avalanche", "optimism", "base", "blast", "sei", "zora", "sepolia", "rinkeby", "mumbai", "amoy", "baobab", "bsctestnet", "goerli", "soldev", "arbitrum_goerli", "arbitrum_sepolia", "avalanche_fuji", "optimism_goerli", "optimism_sepolia", "base_goerli", "base_sepolia", "blast_sepolia", "gunzilla_testnet", "sei_devnet", "zora_testnet", "zora_sepolia"];
                                readonly properties: {};
                                readonly type: "object";
                            };
                            readonly price: {
                                readonly title: "PriceModel";
                                readonly type: "object";
                                readonly properties: {
                                    readonly currency: {
                                        readonly title: "Currency";
                                        readonly type: "string";
                                    };
                                    readonly decimals: {
                                        readonly title: "Decimals";
                                        readonly type: "integer";
                                    };
                                    readonly value: {
                                        readonly title: "Value";
                                        readonly type: "string";
                                    };
                                };
                                readonly required: readonly ["currency", "decimals", "value"];
                            };
                            readonly criteria: {
                                readonly title: "Criteria";
                                readonly description: "Criteria for collection or trait offers";
                                readonly type: "object";
                                readonly required: readonly ["collection", "contract"];
                                readonly properties: {
                                    readonly collection: {
                                        readonly title: "Collection";
                                        readonly description: "The collection in which the criteria offer is being made for.";
                                        readonly type: "object";
                                        readonly required: readonly ["slug"];
                                        readonly properties: {
                                            readonly slug: {
                                                readonly title: "Slug";
                                                readonly description: "Unique string to identify a collection on OpenSea. This can be found by visiting the collection on the OpenSea website and noting the last path parameter.";
                                                readonly type: "string";
                                            };
                                        };
                                    };
                                    readonly contract: {
                                        readonly title: "Contract";
                                        readonly description: "The public blockchain address of the NFT contract";
                                        readonly type: "object";
                                        readonly required: readonly ["address"];
                                        readonly properties: {
                                            readonly address: {
                                                readonly title: "Address";
                                                readonly type: "string";
                                            };
                                        };
                                    };
                                    readonly trait: {
                                        readonly title: "Trait";
                                        readonly description: "The trait that the criteria offer is being made for.";
                                        readonly type: "object";
                                        readonly required: readonly ["type", "value"];
                                        readonly properties: {
                                            readonly type: {
                                                readonly title: "Type";
                                                readonly type: "string";
                                            };
                                            readonly value: {
                                                readonly title: "Value";
                                                readonly type: "string";
                                            };
                                        };
                                    };
                                    readonly encoded_token_ids: {
                                        readonly title: "Encoded Token Ids";
                                        readonly description: "Represents a list of token ids which can be used to fulfill the criteria offer. When decoded using the provided SDK function, developers can now see a list of all tokens that could be used to fulfill the offer.";
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly protocol_data: {
                                readonly title: "Protocol Data";
                                readonly description: "The onchain order data.";
                                readonly type: "object";
                                readonly required: readonly ["parameters"];
                                readonly properties: {
                                    readonly parameters: {
                                        readonly title: "Order";
                                        readonly type: "object";
                                        readonly required: readonly ["offerer", "offer", "consideration", "startTime", "endTime", "orderType", "zone", "zoneHash", "salt", "conduitKey", "totalOriginalConsiderationItems", "counter"];
                                        readonly properties: {
                                            readonly offerer: {
                                                readonly title: "Offerer";
                                                readonly description: "The address which supplies all the items in the offer.";
                                                readonly type: "string";
                                            };
                                            readonly offer: {
                                                readonly title: "Offer";
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly title: "SerializedOfferItem";
                                                    readonly type: "object";
                                                    readonly required: readonly ["itemType", "token", "identifierOrCriteria", "startAmount", "endAmount"];
                                                    readonly properties: {
                                                        readonly itemType: {
                                                            readonly title: "ItemType";
                                                            readonly description: "0 - Native - Ether (or other native token for the given chain)\n1 - ERC20\n2 - ERC721\n3 - ERC1155\n4 - ERC721 with criteria\n5 - ERC1155 with criteria\n\n`1` `2` `3` `4` `5`";
                                                            readonly enum: readonly [0, 1, 2, 3, 4, 5];
                                                            readonly type: "integer";
                                                        };
                                                        readonly token: {
                                                            readonly title: "Token";
                                                            readonly description: "The item's token contract (with the null address used for native tokens)";
                                                            readonly type: "string";
                                                        };
                                                        readonly identifierOrCriteria: {
                                                            readonly title: "Identifierorcriteria";
                                                            readonly description: "The ERC721 or ERC1155 token identifier or, in the case of a criteria-based item type, a merkle root composed of the valid set of token identifiers for the item. This value will be ignored for Ether and ERC20 item types, and can optionally be zero for criteria-based item types to allow for any identifier.";
                                                            readonly type: "string";
                                                        };
                                                        readonly startAmount: {
                                                            readonly title: "Startamount";
                                                            readonly description: "The amount of the token in question that will be required should the order be fulfilled.";
                                                            readonly type: "string";
                                                        };
                                                        readonly endAmount: {
                                                            readonly title: "Endamount";
                                                            readonly description: "When endAmount differs from `startAmount`, the realized amount is calculated linearly based on the time elapsed since the order became active.";
                                                            readonly type: "string";
                                                        };
                                                    };
                                                };
                                            };
                                            readonly consideration: {
                                                readonly title: "Consideration";
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly title: "SerializedConsiderationItem";
                                                    readonly type: "object";
                                                    readonly required: readonly ["itemType", "token", "identifierOrCriteria", "startAmount", "endAmount", "recipient"];
                                                    readonly properties: {
                                                        readonly itemType: {
                                                            readonly title: "ItemType";
                                                            readonly description: "0 - Native - Ether (or other native token for the given chain)\n1 - ERC20\n2 - ERC721\n3 - ERC1155\n4 - ERC721 with criteria\n5 - ERC1155 with criteria\n\n`1` `2` `3` `4` `5`";
                                                            readonly enum: readonly [0, 1, 2, 3, 4, 5];
                                                            readonly type: "integer";
                                                        };
                                                        readonly token: {
                                                            readonly title: "Token";
                                                            readonly description: "The item's token contract (with the null address used for native tokens)";
                                                            readonly type: "string";
                                                        };
                                                        readonly identifierOrCriteria: {
                                                            readonly title: "Identifierorcriteria";
                                                            readonly description: "The ERC721 or ERC1155 token identifier or, in the case of a criteria-based item type, a merkle root composed of the valid set of token identifiers for the item. This value will be ignored for Ether and ERC20 item types, and can optionally be zero for criteria-based item types to allow for any identifier.";
                                                            readonly type: "string";
                                                        };
                                                        readonly startAmount: {
                                                            readonly title: "Startamount";
                                                            readonly description: "The amount of the token in question that will be required should the order be fulfilled.";
                                                            readonly type: "string";
                                                        };
                                                        readonly endAmount: {
                                                            readonly title: "Endamount";
                                                            readonly description: "When endAmount differs from `startAmount`, the realized amount is calculated linearly based on the time elapsed since the order became active.";
                                                            readonly type: "string";
                                                        };
                                                        readonly recipient: {
                                                            readonly title: "Recipient";
                                                            readonly description: "The address which will receive the consideration item when the order is executed.";
                                                            readonly type: "string";
                                                        };
                                                    };
                                                };
                                            };
                                            readonly startTime: {
                                                readonly title: "Starttime";
                                                readonly description: "The block timestamp at which the order becomes active";
                                                readonly type: "string";
                                            };
                                            readonly endTime: {
                                                readonly title: "Endtime";
                                                readonly description: "The block timestamp at which the order expires";
                                                readonly type: "string";
                                            };
                                            readonly orderType: {
                                                readonly title: "SeaportOrderType";
                                                readonly description: "The type of order, which determines how it can be executed.\n0 = Full Open - No partial fills, anyone can execute\n1 = Partial Open - Partial fills supported, anyone can execute\n2 = Full Restricted - No partial fills, only offerer or zone can check if it can be executed\n3 = Partial Restricted - Partial fills supported, only offerer or zone can check if it can be executed\n4 = Contract - Contract order type, for contract offerers that can dynamically generate orders. Introduced in Seaport v1.4 and currently unsupported\n\n`1` `2` `3` `4`";
                                                readonly enum: readonly [0, 1, 2, 3, 4];
                                                readonly type: "integer";
                                            };
                                            readonly zone: {
                                                readonly title: "Zone";
                                                readonly description: "Optional secondary account attached the order which can cancel orders. Additionally, when the `OrderType` is Restricted, the zone or the offerer are the only entities which can execute the order.\nFor open orders, use the zero address.\nFor restricted orders, use the signed zone address 0x000056f7000000ece9003ca63978907a00ffd100";
                                                readonly type: "string";
                                            };
                                            readonly zoneHash: {
                                                readonly title: "Zonehash";
                                                readonly description: "A value that will be supplied to the zone when fulfilling restricted orders that the zone can utilize when making a determination on whether to authorize the order. Most often this value will be the zero hash 0x0000000000000000000000000000000000000000000000000000000000000000";
                                                readonly type: "string";
                                            };
                                            readonly salt: {
                                                readonly title: "Salt";
                                                readonly description: "an arbitrary source of entropy for the order";
                                                readonly type: "string";
                                            };
                                            readonly conduitKey: {
                                                readonly title: "Conduitkey";
                                                readonly description: "Indicates what conduit, if any, should be utilized as a source for token approvals when performing transfers. By default (i.e. when conduitKey is set to the zero hash), the offerer will grant transfer approvals to Seaport directly. \nTo utilize OpenSea's conduit, use 0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000";
                                                readonly type: "string";
                                            };
                                            readonly totalOriginalConsiderationItems: {
                                                readonly title: "Totaloriginalconsiderationitems";
                                                readonly description: "Size of the consideration array.";
                                                readonly type: "integer";
                                            };
                                            readonly counter: {
                                                readonly title: "Counter";
                                                readonly anyOf: readonly [{
                                                    readonly type: "integer";
                                                }, {
                                                    readonly type: "string";
                                                }];
                                            };
                                        };
                                    };
                                    readonly signature: {
                                        readonly title: "Signature";
                                        readonly description: "The order maker's signature used to validate the order.";
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly protocol_address: {
                                readonly title: "Protocol Address";
                                readonly description: "Exchange contract address";
                                readonly type: "string";
                            };
                        };
                        readonly required: readonly ["order_hash", "chain", "price", "criteria", "protocol_data", "protocol_address"];
                    }];
                };
            };
            readonly required: readonly ["order"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetPaymentToken: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly address: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The public blockchain address.";
                };
                readonly chain: {
                    readonly type: "string";
                    readonly enum: readonly ["amoy", "arbitrum", "arbitrum_nova", "arbitrum_sepolia", "avalanche", "avalanche_fuji", "baobab", "base", "base_sepolia", "blast", "blast_sepolia", "bsc", "bsctestnet", "ethereum", "klaytn", "matic", "mumbai", "optimism", "optimism_sepolia", "sepolia", "solana", "soldev", "zora", "zora_sepolia"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The blockchain on which to filter the results.";
                };
            };
            readonly required: readonly ["address", "chain"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "PaymentTokenModel";
            readonly type: "object";
            readonly properties: {
                readonly symbol: {
                    readonly title: "Symbol";
                    readonly description: "The symbol of the payment token";
                    readonly type: "string";
                };
                readonly address: {
                    readonly title: "Address";
                    readonly description: "The public blockchain address of the contract";
                    readonly type: "string";
                };
                readonly chain: {
                    readonly title: "Chain";
                    readonly description: "The chain on which the contract exists";
                    readonly type: "string";
                };
                readonly image: {
                    readonly title: "Image";
                    readonly description: "The image of the payment token";
                    readonly type: "string";
                };
                readonly name: {
                    readonly title: "Name";
                    readonly description: "The name of the contract";
                    readonly type: "string";
                };
                readonly decimals: {
                    readonly title: "Decimals";
                    readonly description: "The number of decimals of the contract";
                    readonly type: "integer";
                };
                readonly eth_price: {
                    readonly title: "Eth Price";
                    readonly description: "The price of the payment token in ETH";
                    readonly type: "string";
                };
                readonly usd_price: {
                    readonly title: "Usd Price";
                    readonly description: "The price of the payment token in USD";
                    readonly type: "string";
                };
            };
            readonly required: readonly ["symbol", "address", "chain", "image", "name", "decimals", "eth_price", "usd_price"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetTraitOffersV2: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly collection_slug: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Unique string to identify a collection on OpenSea. This can be found by visiting the collection on the OpenSea website and noting the last path parameter.";
                };
            };
            readonly required: readonly ["collection_slug"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly float_value: {
                    readonly type: "number";
                    readonly format: "float";
                    readonly minimum: -3.402823669209385e+38;
                    readonly maximum: 3.402823669209385e+38;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The value of the trait (e.g. `0.5`). This is only used for decimal-based numeric traits to ensure it is parsed correctly.";
                };
                readonly int_value: {
                    readonly type: "integer";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The value of the trait (e.g. `10`). This is only used for numeric traits to ensure it is parsed correctly.";
                };
                readonly type: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The name of the trait (e.g. 'Background')";
                };
                readonly value: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The value of the trait (e.g. 'Red')";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "Offer List";
            readonly type: "object";
            readonly properties: {
                readonly offers: {
                    readonly title: "Offers";
                    readonly type: "array";
                    readonly items: {
                        readonly title: "Offer";
                        readonly type: "object";
                        readonly properties: {
                            readonly order_hash: {
                                readonly title: "Order Hash";
                                readonly description: "Order hash";
                                readonly type: "string";
                            };
                            readonly chain: {
                                readonly title: "ChainIdentifier";
                                readonly description: "OpenSea supported chains.\n\n`ethereum` `matic` `klaytn` `bsc` `solana` `arbitrum` `arbitrum_nova` `avalanche` `optimism` `base` `blast` `sei` `zora` `sepolia` `rinkeby` `mumbai` `amoy` `baobab` `bsctestnet` `goerli` `soldev` `arbitrum_goerli` `arbitrum_sepolia` `avalanche_fuji` `optimism_goerli` `optimism_sepolia` `base_goerli` `base_sepolia` `blast_sepolia` `gunzilla_testnet` `sei_devnet` `zora_testnet` `zora_sepolia`";
                                readonly enum: readonly ["ethereum", "matic", "klaytn", "bsc", "solana", "arbitrum", "arbitrum_nova", "avalanche", "optimism", "base", "blast", "sei", "zora", "sepolia", "rinkeby", "mumbai", "amoy", "baobab", "bsctestnet", "goerli", "soldev", "arbitrum_goerli", "arbitrum_sepolia", "avalanche_fuji", "optimism_goerli", "optimism_sepolia", "base_goerli", "base_sepolia", "blast_sepolia", "gunzilla_testnet", "sei_devnet", "zora_testnet", "zora_sepolia"];
                                readonly properties: {};
                                readonly type: "object";
                            };
                            readonly price: {
                                readonly title: "PriceModel";
                                readonly type: "object";
                                readonly properties: {
                                    readonly currency: {
                                        readonly title: "Currency";
                                        readonly type: "string";
                                    };
                                    readonly decimals: {
                                        readonly title: "Decimals";
                                        readonly type: "integer";
                                    };
                                    readonly value: {
                                        readonly title: "Value";
                                        readonly type: "string";
                                    };
                                };
                                readonly required: readonly ["currency", "decimals", "value"];
                            };
                            readonly criteria: {
                                readonly title: "Criteria";
                                readonly description: "Criteria for collection or trait offers";
                                readonly type: "object";
                                readonly required: readonly ["collection", "contract"];
                                readonly properties: {
                                    readonly collection: {
                                        readonly title: "Collection";
                                        readonly description: "The collection in which the criteria offer is being made for.";
                                        readonly type: "object";
                                        readonly required: readonly ["slug"];
                                        readonly properties: {
                                            readonly slug: {
                                                readonly title: "Slug";
                                                readonly description: "Unique string to identify a collection on OpenSea. This can be found by visiting the collection on the OpenSea website and noting the last path parameter.";
                                                readonly type: "string";
                                            };
                                        };
                                    };
                                    readonly contract: {
                                        readonly title: "Contract";
                                        readonly description: "The public blockchain address of the NFT contract";
                                        readonly type: "object";
                                        readonly required: readonly ["address"];
                                        readonly properties: {
                                            readonly address: {
                                                readonly title: "Address";
                                                readonly type: "string";
                                            };
                                        };
                                    };
                                    readonly trait: {
                                        readonly title: "Trait";
                                        readonly description: "The trait that the criteria offer is being made for.";
                                        readonly type: "object";
                                        readonly required: readonly ["type", "value"];
                                        readonly properties: {
                                            readonly type: {
                                                readonly title: "Type";
                                                readonly type: "string";
                                            };
                                            readonly value: {
                                                readonly title: "Value";
                                                readonly type: "string";
                                            };
                                        };
                                    };
                                    readonly encoded_token_ids: {
                                        readonly title: "Encoded Token Ids";
                                        readonly description: "Represents a list of token ids which can be used to fulfill the criteria offer. When decoded using the provided SDK function, developers can now see a list of all tokens that could be used to fulfill the offer.";
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly protocol_data: {
                                readonly title: "Protocol Data";
                                readonly description: "The onchain order data.";
                                readonly type: "object";
                                readonly required: readonly ["parameters"];
                                readonly properties: {
                                    readonly parameters: {
                                        readonly title: "Order";
                                        readonly type: "object";
                                        readonly required: readonly ["offerer", "offer", "consideration", "startTime", "endTime", "orderType", "zone", "zoneHash", "salt", "conduitKey", "totalOriginalConsiderationItems", "counter"];
                                        readonly properties: {
                                            readonly offerer: {
                                                readonly title: "Offerer";
                                                readonly description: "The address which supplies all the items in the offer.";
                                                readonly type: "string";
                                            };
                                            readonly offer: {
                                                readonly title: "Offer";
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly title: "SerializedOfferItem";
                                                    readonly type: "object";
                                                    readonly required: readonly ["itemType", "token", "identifierOrCriteria", "startAmount", "endAmount"];
                                                    readonly properties: {
                                                        readonly itemType: {
                                                            readonly title: "ItemType";
                                                            readonly description: "0 - Native - Ether (or other native token for the given chain)\n1 - ERC20\n2 - ERC721\n3 - ERC1155\n4 - ERC721 with criteria\n5 - ERC1155 with criteria\n\n`1` `2` `3` `4` `5`";
                                                            readonly enum: readonly [0, 1, 2, 3, 4, 5];
                                                            readonly type: "integer";
                                                        };
                                                        readonly token: {
                                                            readonly title: "Token";
                                                            readonly description: "The item's token contract (with the null address used for native tokens)";
                                                            readonly type: "string";
                                                        };
                                                        readonly identifierOrCriteria: {
                                                            readonly title: "Identifierorcriteria";
                                                            readonly description: "The ERC721 or ERC1155 token identifier or, in the case of a criteria-based item type, a merkle root composed of the valid set of token identifiers for the item. This value will be ignored for Ether and ERC20 item types, and can optionally be zero for criteria-based item types to allow for any identifier.";
                                                            readonly type: "string";
                                                        };
                                                        readonly startAmount: {
                                                            readonly title: "Startamount";
                                                            readonly description: "The amount of the token in question that will be required should the order be fulfilled.";
                                                            readonly type: "string";
                                                        };
                                                        readonly endAmount: {
                                                            readonly title: "Endamount";
                                                            readonly description: "When endAmount differs from `startAmount`, the realized amount is calculated linearly based on the time elapsed since the order became active.";
                                                            readonly type: "string";
                                                        };
                                                    };
                                                };
                                            };
                                            readonly consideration: {
                                                readonly title: "Consideration";
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly title: "SerializedConsiderationItem";
                                                    readonly type: "object";
                                                    readonly required: readonly ["itemType", "token", "identifierOrCriteria", "startAmount", "endAmount", "recipient"];
                                                    readonly properties: {
                                                        readonly itemType: {
                                                            readonly title: "ItemType";
                                                            readonly description: "0 - Native - Ether (or other native token for the given chain)\n1 - ERC20\n2 - ERC721\n3 - ERC1155\n4 - ERC721 with criteria\n5 - ERC1155 with criteria\n\n`1` `2` `3` `4` `5`";
                                                            readonly enum: readonly [0, 1, 2, 3, 4, 5];
                                                            readonly type: "integer";
                                                        };
                                                        readonly token: {
                                                            readonly title: "Token";
                                                            readonly description: "The item's token contract (with the null address used for native tokens)";
                                                            readonly type: "string";
                                                        };
                                                        readonly identifierOrCriteria: {
                                                            readonly title: "Identifierorcriteria";
                                                            readonly description: "The ERC721 or ERC1155 token identifier or, in the case of a criteria-based item type, a merkle root composed of the valid set of token identifiers for the item. This value will be ignored for Ether and ERC20 item types, and can optionally be zero for criteria-based item types to allow for any identifier.";
                                                            readonly type: "string";
                                                        };
                                                        readonly startAmount: {
                                                            readonly title: "Startamount";
                                                            readonly description: "The amount of the token in question that will be required should the order be fulfilled.";
                                                            readonly type: "string";
                                                        };
                                                        readonly endAmount: {
                                                            readonly title: "Endamount";
                                                            readonly description: "When endAmount differs from `startAmount`, the realized amount is calculated linearly based on the time elapsed since the order became active.";
                                                            readonly type: "string";
                                                        };
                                                        readonly recipient: {
                                                            readonly title: "Recipient";
                                                            readonly description: "The address which will receive the consideration item when the order is executed.";
                                                            readonly type: "string";
                                                        };
                                                    };
                                                };
                                            };
                                            readonly startTime: {
                                                readonly title: "Starttime";
                                                readonly description: "The block timestamp at which the order becomes active";
                                                readonly type: "string";
                                            };
                                            readonly endTime: {
                                                readonly title: "Endtime";
                                                readonly description: "The block timestamp at which the order expires";
                                                readonly type: "string";
                                            };
                                            readonly orderType: {
                                                readonly title: "SeaportOrderType";
                                                readonly description: "The type of order, which determines how it can be executed.\n0 = Full Open - No partial fills, anyone can execute\n1 = Partial Open - Partial fills supported, anyone can execute\n2 = Full Restricted - No partial fills, only offerer or zone can check if it can be executed\n3 = Partial Restricted - Partial fills supported, only offerer or zone can check if it can be executed\n4 = Contract - Contract order type, for contract offerers that can dynamically generate orders. Introduced in Seaport v1.4 and currently unsupported\n\n`1` `2` `3` `4`";
                                                readonly enum: readonly [0, 1, 2, 3, 4];
                                                readonly type: "integer";
                                            };
                                            readonly zone: {
                                                readonly title: "Zone";
                                                readonly description: "Optional secondary account attached the order which can cancel orders. Additionally, when the `OrderType` is Restricted, the zone or the offerer are the only entities which can execute the order.\nFor open orders, use the zero address.\nFor restricted orders, use the signed zone address 0x000056f7000000ece9003ca63978907a00ffd100";
                                                readonly type: "string";
                                            };
                                            readonly zoneHash: {
                                                readonly title: "Zonehash";
                                                readonly description: "A value that will be supplied to the zone when fulfilling restricted orders that the zone can utilize when making a determination on whether to authorize the order. Most often this value will be the zero hash 0x0000000000000000000000000000000000000000000000000000000000000000";
                                                readonly type: "string";
                                            };
                                            readonly salt: {
                                                readonly title: "Salt";
                                                readonly description: "an arbitrary source of entropy for the order";
                                                readonly type: "string";
                                            };
                                            readonly conduitKey: {
                                                readonly title: "Conduitkey";
                                                readonly description: "Indicates what conduit, if any, should be utilized as a source for token approvals when performing transfers. By default (i.e. when conduitKey is set to the zero hash), the offerer will grant transfer approvals to Seaport directly. \nTo utilize OpenSea's conduit, use 0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000";
                                                readonly type: "string";
                                            };
                                            readonly totalOriginalConsiderationItems: {
                                                readonly title: "Totaloriginalconsiderationitems";
                                                readonly description: "Size of the consideration array.";
                                                readonly type: "integer";
                                            };
                                            readonly counter: {
                                                readonly title: "Counter";
                                                readonly anyOf: readonly [{
                                                    readonly type: "integer";
                                                }, {
                                                    readonly type: "string";
                                                }];
                                            };
                                        };
                                    };
                                    readonly signature: {
                                        readonly title: "Signature";
                                        readonly description: "The order maker's signature used to validate the order.";
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly protocol_address: {
                                readonly title: "Protocol Address";
                                readonly description: "Exchange contract address";
                                readonly type: "string";
                            };
                        };
                        readonly required: readonly ["order_hash", "chain", "price", "criteria", "protocol_data", "protocol_address"];
                    };
                };
            };
            readonly required: readonly ["offers"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetTraits: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly collection_slug: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Unique string to identify a collection on OpenSea. This can be found by visiting the collection on the OpenSea website and noting the last path parameter.";
                };
            };
            readonly required: readonly ["collection_slug"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "GetTraitResponse";
            readonly type: "object";
            readonly properties: {
                readonly categories: {
                    readonly description: "List of trait categories, e.g. Background, in the collection and their type, e.g. string";
                    readonly type: "object";
                    readonly additionalProperties: {
                        readonly title: "CategoryType";
                        readonly description: "An enumeration.\n\n`string` `number`";
                        readonly enum: readonly ["string", "number"];
                        readonly type: "string";
                        readonly properties: {};
                    };
                };
                readonly counts: {
                    readonly title: "Counts";
                    readonly description: "If the category type is STRING, the dict will contain each trait value and its count. Otherwise, the dict will contain the min and max value seen in the collection";
                    readonly type: "object";
                    readonly additionalProperties: {
                        readonly type: "object";
                        readonly additionalProperties: {
                            readonly type: "integer";
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const ListCollections: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly chain: {
                    readonly type: "string";
                    readonly enum: readonly ["amoy", "arbitrum", "arbitrum_nova", "arbitrum_sepolia", "avalanche", "avalanche_fuji", "baobab", "base", "base_sepolia", "blast", "blast_sepolia", "bsc", "bsctestnet", "ethereum", "klaytn", "matic", "mumbai", "optimism", "optimism_sepolia", "sepolia", "solana", "soldev", "zora", "zora_sepolia"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The blockchain on which to filter the results.";
                };
                readonly creator_username: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "If set, will only return collections created by the given OpenSea username.";
                };
                readonly include_hidden: {
                    readonly type: "boolean";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "If true, will return hidden collections. Default: false";
                };
                readonly limit: {
                    readonly type: "integer";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The number of collections to return. Must be between 1 and 100. Default: 100";
                };
                readonly next: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The cursor for the next page of results. This is returned from a previous request.";
                };
                readonly order_by: {
                    readonly type: "string";
                    readonly enum: readonly ["created_date", "market_cap", "num_owners", "one_day_change", "seven_day_change", "seven_day_volume"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The order in which to sort the collections. Default: created_date";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "ListCollectionsResponse";
            readonly type: "object";
            readonly properties: {
                readonly collections: {
                    readonly title: "Collection";
                    readonly type: "array";
                    readonly items: {
                        readonly title: "CollectionModel";
                        readonly type: "object";
                        readonly properties: {
                            readonly collection: {
                                readonly title: "Collection";
                                readonly description: "Collection slug. A unique string to identify a collection on OpenSea";
                                readonly type: "string";
                            };
                            readonly name: {
                                readonly title: "Name";
                                readonly description: "Name of the collection";
                                readonly type: "string";
                            };
                            readonly description: {
                                readonly title: "Description";
                                readonly description: "Description of the collection";
                                readonly type: "string";
                            };
                            readonly image_url: {
                                readonly title: "Image Url";
                                readonly description: "Square image used to represent the collection";
                                readonly type: "string";
                            };
                            readonly banner_image_url: {
                                readonly title: "Banner Image Url";
                                readonly description: "Banner image used to represent the collection";
                                readonly type: "string";
                            };
                            readonly owner: {
                                readonly title: "Owner";
                                readonly description: "The public blockchain address of the owner.";
                                readonly type: "string";
                            };
                            readonly safelist_status: {
                                readonly title: "SafelistRequestStatus";
                                readonly description: "Status of the collection verification requests.\n\n`not_requested` `requested` `approved` `verified` `disabled_top_trending`";
                                readonly enum: readonly ["not_requested", "requested", "approved", "verified", "disabled_top_trending"];
                                readonly properties: {};
                                readonly type: "object";
                            };
                            readonly category: {
                                readonly title: "Category";
                                readonly description: "Category of the collection (e.g. PFPs, Memberships, Art)";
                                readonly type: "string";
                            };
                            readonly is_disabled: {
                                readonly title: "Is Disabled";
                                readonly description: "If the collection is currently able to be bought or sold using OpenSea";
                                readonly type: "boolean";
                            };
                            readonly is_nsfw: {
                                readonly title: "Is Nsfw";
                                readonly description: "If the collection is currently classified as 'Not Safe for Work' as defined in [OpenSea's NSFW Policy](https://support.opensea.io/hc/articles/9729972510995).";
                                readonly type: "boolean";
                            };
                            readonly trait_offers_enabled: {
                                readonly title: "Trait Offers Enabled";
                                readonly description: "If trait offers are currently being accepted for the collection";
                                readonly type: "boolean";
                            };
                            readonly collection_offers_enabled: {
                                readonly title: "Collection Offers Enabled";
                                readonly description: "If collection offers are currently being accepted for the collection";
                                readonly type: "boolean";
                            };
                            readonly opensea_url: {
                                readonly title: "Opensea Url";
                                readonly description: "OpenSea Link to collection";
                                readonly type: "string";
                            };
                            readonly project_url: {
                                readonly title: "Project Url";
                                readonly description: "External URL for the collection's website";
                                readonly type: "string";
                            };
                            readonly wiki_url: {
                                readonly title: "Wiki Url";
                                readonly description: "External URL for the collection's wiki";
                                readonly type: "string";
                            };
                            readonly discord_url: {
                                readonly title: "Discord Url";
                                readonly description: "External URL for the collection's Discord server";
                                readonly type: "string";
                            };
                            readonly telegram_url: {
                                readonly title: "Telegram Url";
                                readonly description: "External URL for the collection's Telegram group";
                                readonly type: "string";
                            };
                            readonly twitter_username: {
                                readonly title: "Twitter Username";
                                readonly description: "Username for the collection's Twitter account";
                                readonly type: "string";
                            };
                            readonly instagram_username: {
                                readonly title: "Instagram Username";
                                readonly description: "Username for the collection's Instagram account";
                                readonly type: "string";
                            };
                            readonly contracts: {
                                readonly title: "Contracts";
                                readonly description: "Contracts for the collection";
                                readonly type: "array";
                                readonly items: {
                                    readonly title: "CollectionContractModel";
                                    readonly description: "Define the Contract's Addresses and Chain";
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly address: {
                                            readonly title: "Address";
                                            readonly description: "The public blockchain address of the contract.";
                                            readonly type: "string";
                                        };
                                        readonly chain: {
                                            readonly description: "OpenSea supported chains.";
                                            readonly title: "ChainIdentifier";
                                            readonly enum: readonly ["ethereum", "matic", "klaytn", "bsc", "solana", "arbitrum", "arbitrum_nova", "avalanche", "optimism", "base", "blast", "sei", "zora", "sepolia", "rinkeby", "mumbai", "amoy", "baobab", "bsctestnet", "goerli", "soldev", "arbitrum_goerli", "arbitrum_sepolia", "avalanche_fuji", "optimism_goerli", "optimism_sepolia", "base_goerli", "base_sepolia", "blast_sepolia", "gunzilla_testnet", "sei_devnet", "zora_testnet", "zora_sepolia"];
                                        };
                                    };
                                    readonly required: readonly ["address", "chain"];
                                };
                            };
                        };
                        readonly required: readonly ["collection", "name", "owner", "safelist_status", "category", "is_disabled", "is_nsfw", "trait_offers_enabled", "collection_offers_enabled", "opensea_url", "contracts"];
                    };
                };
                readonly next: {
                    readonly title: "Next";
                    readonly description: "Cursor for the next page of results";
                    readonly type: "string";
                };
            };
            readonly required: readonly ["collections", "next"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const ListEvents: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly after: {
                    readonly type: "number";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Filter to only include events that occurred at or after the given timestamp. The Unix epoch timstamp must be in seconds";
                };
                readonly before: {
                    readonly type: "number";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Filter to only include events that occurred before the given timestamp. The Unix epoch timstamp must be in seconds.";
                };
                readonly event_type: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "string";
                        readonly enum: readonly ["all", "cancel", "listing", "offer", "order", "redemption", "sale", "transfer"];
                    };
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The type of event to filter by. If not provided, only sales will be returned.";
                };
                readonly limit: {
                    readonly type: "integer";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The number of events to return. Must be between 1 and 50. Default: 50";
                };
                readonly next: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The cursor for the next page of results. This is returned from a previous request.";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "ListEventsResponse";
            readonly type: "object";
            readonly properties: {
                readonly asset_events: {
                    readonly title: "Events";
                    readonly type: "array";
                    readonly items: {
                        readonly anyOf: readonly [{
                            readonly title: "CancelEventModel";
                            readonly type: "object";
                            readonly properties: {
                                readonly event_type: {
                                    readonly title: "Event Type";
                                    readonly default: "cancel";
                                    readonly enum: readonly ["cancel"];
                                    readonly type: "string";
                                    readonly description: "`cancel`";
                                };
                                readonly order_hash: {
                                    readonly title: "Order Hash";
                                    readonly description: "Order hash for the order which was cancelled";
                                    readonly type: "string";
                                };
                                readonly order_type: {
                                    readonly description: "An enumeration.";
                                    readonly title: "APIOrderType";
                                    readonly enum: readonly ["listing", "auction", "item_offer", "collection_offer", "trait_offer"];
                                };
                                readonly maker: {
                                    readonly title: "Maker";
                                    readonly description: "Maker of the original order";
                                    readonly type: "string";
                                };
                                readonly chain: {
                                    readonly description: "OpenSea supported chains.";
                                    readonly title: "ChainIdentifier";
                                    readonly enum: readonly ["ethereum", "matic", "klaytn", "bsc", "solana", "arbitrum", "arbitrum_nova", "avalanche", "optimism", "base", "blast", "sei", "zora", "sepolia", "rinkeby", "mumbai", "amoy", "baobab", "bsctestnet", "goerli", "soldev", "arbitrum_goerli", "arbitrum_sepolia", "avalanche_fuji", "optimism_goerli", "optimism_sepolia", "base_goerli", "base_sepolia", "blast_sepolia", "gunzilla_testnet", "sei_devnet", "zora_testnet", "zora_sepolia"];
                                };
                                readonly event_timestamp: {
                                    readonly title: "Event Timestamp";
                                    readonly description: "The Posix timestamp at which the event occurred";
                                    readonly type: "integer";
                                };
                                readonly nft: {
                                    readonly title: "Nft";
                                    readonly description: "The NFT which was cancelled";
                                    readonly type: "object";
                                    readonly required: readonly ["identifier", "collection", "contract", "token_standard", "name", "description", "updated_at", "is_disabled", "is_nsfw"];
                                    readonly properties: {
                                        readonly identifier: {
                                            readonly title: "Identifier";
                                            readonly description: "The NFT's unique identifier within the smart contract (also referred to as token_id)";
                                            readonly type: "string";
                                        };
                                        readonly collection: {
                                            readonly title: "Collection";
                                            readonly description: "Collection slug. A unique string to identify a collection on OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly contract: {
                                            readonly title: "Contract";
                                            readonly description: "The public blockchain address of the contract";
                                            readonly type: "string";
                                        };
                                        readonly token_standard: {
                                            readonly title: "Token Standard";
                                            readonly description: "ERC standard of the token (erc721, erc1155)";
                                            readonly type: "string";
                                        };
                                        readonly name: {
                                            readonly title: "Name";
                                            readonly description: "Name of the NFT";
                                            readonly type: "string";
                                        };
                                        readonly description: {
                                            readonly title: "Description";
                                            readonly description: "Description of the NFT";
                                            readonly type: "string";
                                        };
                                        readonly image_url: {
                                            readonly title: "Image Url";
                                            readonly description: "Link to the image associated with the NFT";
                                            readonly type: "string";
                                        };
                                        readonly metadata_url: {
                                            readonly title: "Metadata Url";
                                            readonly description: "Link to the offchain metadata store";
                                            readonly type: "string";
                                        };
                                        readonly opensea_url: {
                                            readonly title: "Opensea Url";
                                            readonly description: "Link to the NFT on OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly updated_at: {
                                            readonly title: "Updated At";
                                            readonly description: "Last time that the NFT's metadata was updated by OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly is_disabled: {
                                            readonly title: "Is Disabled";
                                            readonly description: "If the item is currently able to be bought or sold using OpenSea";
                                            readonly type: "boolean";
                                        };
                                        readonly is_nsfw: {
                                            readonly title: "Is Nsfw";
                                            readonly description: "If the item is currently classified as 'Not Safe for Work' by OpenSea as defined in [OpenSea's NSFW Policy](https://support.opensea.io/hc/articles/9729972510995).";
                                            readonly type: "boolean";
                                        };
                                    };
                                };
                            };
                            readonly required: readonly ["order_hash", "order_type", "maker", "chain", "event_timestamp", "nft"];
                        }, {
                            readonly title: "OrderEventModel";
                            readonly type: "object";
                            readonly properties: {
                                readonly event_type: {
                                    readonly title: "Event Type";
                                    readonly default: "order";
                                    readonly enum: readonly ["order"];
                                    readonly type: "string";
                                    readonly description: "`order`";
                                };
                                readonly order_hash: {
                                    readonly title: "Order Hash";
                                    readonly description: "Order hash for the newly created order";
                                    readonly type: "string";
                                };
                                readonly order_type: {
                                    readonly title: "APIOrderType";
                                    readonly description: "An enumeration.\n\n`listing` `auction` `item_offer` `collection_offer` `trait_offer`";
                                    readonly enum: readonly ["listing", "auction", "item_offer", "collection_offer", "trait_offer"];
                                    readonly properties: {};
                                    readonly type: "object";
                                };
                                readonly chain: {
                                    readonly description: "OpenSea supported chains.";
                                    readonly title: "ChainIdentifier";
                                    readonly enum: readonly ["ethereum", "matic", "klaytn", "bsc", "solana", "arbitrum", "arbitrum_nova", "avalanche", "optimism", "base", "blast", "sei", "zora", "sepolia", "rinkeby", "mumbai", "amoy", "baobab", "bsctestnet", "goerli", "soldev", "arbitrum_goerli", "arbitrum_sepolia", "avalanche_fuji", "optimism_goerli", "optimism_sepolia", "base_goerli", "base_sepolia", "blast_sepolia", "gunzilla_testnet", "sei_devnet", "zora_testnet", "zora_sepolia"];
                                };
                                readonly protocol_address: {
                                    readonly title: "Protocol Address";
                                    readonly description: "Exchange contract address for the order";
                                    readonly type: "string";
                                };
                                readonly start_date: {
                                    readonly title: "Start Date";
                                    readonly description: "The Posix timestamp at which the order was created";
                                    readonly type: "integer";
                                };
                                readonly expiration_date: {
                                    readonly title: "Expiration Date";
                                    readonly description: "The Posix timestamp at which the order will close. When no expiration date is set, this value will be 0.";
                                    readonly type: "integer";
                                };
                                readonly asset: {
                                    readonly title: "Asset";
                                    readonly description: "The nft being listed or bid on. Empty object for collection or trait offers.";
                                    readonly type: "object";
                                    readonly required: readonly ["identifier", "collection", "contract", "token_standard", "name", "description", "updated_at", "is_disabled", "is_nsfw"];
                                    readonly properties: {
                                        readonly identifier: {
                                            readonly title: "Identifier";
                                            readonly description: "The NFT's unique identifier within the smart contract (also referred to as token_id)";
                                            readonly type: "string";
                                        };
                                        readonly collection: {
                                            readonly title: "Collection";
                                            readonly description: "Collection slug. A unique string to identify a collection on OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly contract: {
                                            readonly title: "Contract";
                                            readonly description: "The public blockchain address of the contract";
                                            readonly type: "string";
                                        };
                                        readonly token_standard: {
                                            readonly title: "Token Standard";
                                            readonly description: "ERC standard of the token (erc721, erc1155)";
                                            readonly type: "string";
                                        };
                                        readonly name: {
                                            readonly title: "Name";
                                            readonly description: "Name of the NFT";
                                            readonly type: "string";
                                        };
                                        readonly description: {
                                            readonly title: "Description";
                                            readonly description: "Description of the NFT";
                                            readonly type: "string";
                                        };
                                        readonly image_url: {
                                            readonly title: "Image Url";
                                            readonly description: "Link to the image associated with the NFT";
                                            readonly type: "string";
                                        };
                                        readonly metadata_url: {
                                            readonly title: "Metadata Url";
                                            readonly description: "Link to the offchain metadata store";
                                            readonly type: "string";
                                        };
                                        readonly opensea_url: {
                                            readonly title: "Opensea Url";
                                            readonly description: "Link to the NFT on OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly updated_at: {
                                            readonly title: "Updated At";
                                            readonly description: "Last time that the NFT's metadata was updated by OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly is_disabled: {
                                            readonly title: "Is Disabled";
                                            readonly description: "If the item is currently able to be bought or sold using OpenSea";
                                            readonly type: "boolean";
                                        };
                                        readonly is_nsfw: {
                                            readonly title: "Is Nsfw";
                                            readonly description: "If the item is currently classified as 'Not Safe for Work' by OpenSea as defined in [OpenSea's NSFW Policy](https://support.opensea.io/hc/articles/9729972510995).";
                                            readonly type: "boolean";
                                        };
                                    };
                                };
                                readonly quantity: {
                                    readonly title: "Quantity";
                                    readonly description: "Number of assets in the order";
                                    readonly type: "integer";
                                };
                                readonly maker: {
                                    readonly title: "Maker";
                                    readonly description: "Maker of the order";
                                    readonly type: "string";
                                };
                                readonly taker: {
                                    readonly title: "Taker";
                                    readonly description: "Taker of the order. This will only be set for private listings.";
                                    readonly type: "string";
                                };
                                readonly payment: {
                                    readonly title: "Information about the payment";
                                    readonly type: "object";
                                    readonly required: readonly ["quantity", "token_address", "decimals", "symbol"];
                                    readonly properties: {
                                        readonly quantity: {
                                            readonly title: "Quantity";
                                            readonly description: "Amount of tokens in the order. Defaults to 0 if quantity can not be determined.";
                                            readonly type: "string";
                                        };
                                        readonly token_address: {
                                            readonly title: "Token Address";
                                            readonly description: "The contract address for the ERC20 token";
                                            readonly type: "string";
                                        };
                                        readonly decimals: {
                                            readonly title: "Decimals";
                                            readonly description: "Returns the number of decimals the token uses - e.g. 8, means to divide the token amount by 100000000 to get its user representation.";
                                            readonly type: "integer";
                                        };
                                        readonly symbol: {
                                            readonly title: "Symbol";
                                            readonly description: "Returns the symbol of the token, e.g. ETH, WETH, USDC, etc";
                                            readonly type: "string";
                                        };
                                    };
                                };
                                readonly criteria: {
                                    readonly title: "Criteria";
                                    readonly description: "For collection and trait offers, this object will contain the criteria needed to fulfill the offer.";
                                    readonly anyOf: readonly [{
                                        readonly title: "Criteria";
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly collection: {
                                                readonly title: "Collection";
                                                readonly description: "The collection in which the criteria offer is being made for.";
                                                readonly type: "object";
                                                readonly required: readonly ["slug"];
                                                readonly properties: {
                                                    readonly slug: {
                                                        readonly title: "Slug";
                                                        readonly description: "Unique string to identify a collection on OpenSea. This can be found by visiting the collection on the OpenSea website and noting the last path parameter.";
                                                        readonly type: "string";
                                                    };
                                                };
                                            };
                                            readonly contract: {
                                                readonly title: "Contract";
                                                readonly description: "The public blockchain address of the NFT contract";
                                                readonly type: "object";
                                                readonly required: readonly ["address"];
                                                readonly properties: {
                                                    readonly address: {
                                                        readonly title: "Address";
                                                        readonly type: "string";
                                                    };
                                                };
                                            };
                                            readonly trait: {
                                                readonly title: "Trait";
                                                readonly description: "The trait that the criteria offer is being made for.";
                                                readonly type: "object";
                                                readonly required: readonly ["type", "value"];
                                                readonly properties: {
                                                    readonly type: {
                                                        readonly title: "Type";
                                                        readonly type: "string";
                                                    };
                                                    readonly value: {
                                                        readonly title: "Value";
                                                        readonly type: "string";
                                                    };
                                                };
                                            };
                                            readonly encoded_token_ids: {
                                                readonly title: "Encoded Token Ids";
                                                readonly description: "Represents a list of token ids which can be used to fulfill the criteria offer. When decoded using the provided SDK function, developers can now see a list of all tokens that could be used to fulfill the offer.";
                                                readonly type: "string";
                                            };
                                        };
                                        readonly required: readonly ["collection", "contract"];
                                    }, {
                                        readonly type: "object";
                                        readonly additionalProperties: true;
                                    }];
                                };
                                readonly event_timestamp: {
                                    readonly title: "Event Timestamp";
                                    readonly description: "The Posix timestamp at which the event occurred";
                                    readonly type: "integer";
                                };
                                readonly is_private_listing: {
                                    readonly title: "Is Private Listing";
                                    readonly description: "Whether the order is a private listing";
                                    readonly type: "boolean";
                                };
                            };
                            readonly required: readonly ["order_hash", "chain", "protocol_address", "start_date", "expiration_date", "asset", "quantity", "maker", "taker", "payment", "criteria", "event_timestamp", "is_private_listing"];
                        }, {
                            readonly title: "SaleEventModel";
                            readonly type: "object";
                            readonly properties: {
                                readonly event_type: {
                                    readonly title: "Event Type";
                                    readonly default: "sale";
                                    readonly enum: readonly ["sale"];
                                    readonly type: "string";
                                    readonly description: "`sale`";
                                };
                                readonly order_hash: {
                                    readonly title: "Order Hash";
                                    readonly description: "Order hash for the order which was fulfilled";
                                    readonly type: "string";
                                };
                                readonly chain: {
                                    readonly description: "OpenSea supported chains.";
                                    readonly title: "ChainIdentifier";
                                    readonly enum: readonly ["ethereum", "matic", "klaytn", "bsc", "solana", "arbitrum", "arbitrum_nova", "avalanche", "optimism", "base", "blast", "sei", "zora", "sepolia", "rinkeby", "mumbai", "amoy", "baobab", "bsctestnet", "goerli", "soldev", "arbitrum_goerli", "arbitrum_sepolia", "avalanche_fuji", "optimism_goerli", "optimism_sepolia", "base_goerli", "base_sepolia", "blast_sepolia", "gunzilla_testnet", "sei_devnet", "zora_testnet", "zora_sepolia"];
                                };
                                readonly protocol_address: {
                                    readonly title: "Protocol Address";
                                    readonly description: "Exchange contract address which fulfilled the order";
                                    readonly type: "string";
                                };
                                readonly closing_date: {
                                    readonly title: "Closing Date";
                                    readonly description: "The Posix timestamp at which the transaction which filled the order occurred";
                                    readonly type: "integer";
                                };
                                readonly nft: {
                                    readonly title: "Nft";
                                    readonly description: "The NFT which was sold.";
                                    readonly type: "object";
                                    readonly required: readonly ["identifier", "collection", "contract", "token_standard", "name", "description", "updated_at", "is_disabled", "is_nsfw"];
                                    readonly properties: {
                                        readonly identifier: {
                                            readonly title: "Identifier";
                                            readonly description: "The NFT's unique identifier within the smart contract (also referred to as token_id)";
                                            readonly type: "string";
                                        };
                                        readonly collection: {
                                            readonly title: "Collection";
                                            readonly description: "Collection slug. A unique string to identify a collection on OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly contract: {
                                            readonly title: "Contract";
                                            readonly description: "The public blockchain address of the contract";
                                            readonly type: "string";
                                        };
                                        readonly token_standard: {
                                            readonly title: "Token Standard";
                                            readonly description: "ERC standard of the token (erc721, erc1155)";
                                            readonly type: "string";
                                        };
                                        readonly name: {
                                            readonly title: "Name";
                                            readonly description: "Name of the NFT";
                                            readonly type: "string";
                                        };
                                        readonly description: {
                                            readonly title: "Description";
                                            readonly description: "Description of the NFT";
                                            readonly type: "string";
                                        };
                                        readonly image_url: {
                                            readonly title: "Image Url";
                                            readonly description: "Link to the image associated with the NFT";
                                            readonly type: "string";
                                        };
                                        readonly metadata_url: {
                                            readonly title: "Metadata Url";
                                            readonly description: "Link to the offchain metadata store";
                                            readonly type: "string";
                                        };
                                        readonly opensea_url: {
                                            readonly title: "Opensea Url";
                                            readonly description: "Link to the NFT on OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly updated_at: {
                                            readonly title: "Updated At";
                                            readonly description: "Last time that the NFT's metadata was updated by OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly is_disabled: {
                                            readonly title: "Is Disabled";
                                            readonly description: "If the item is currently able to be bought or sold using OpenSea";
                                            readonly type: "boolean";
                                        };
                                        readonly is_nsfw: {
                                            readonly title: "Is Nsfw";
                                            readonly description: "If the item is currently classified as 'Not Safe for Work' by OpenSea as defined in [OpenSea's NSFW Policy](https://support.opensea.io/hc/articles/9729972510995).";
                                            readonly type: "boolean";
                                        };
                                    };
                                };
                                readonly quantity: {
                                    readonly title: "Quantity";
                                    readonly description: "Number of assets transferred";
                                    readonly type: "integer";
                                };
                                readonly seller: {
                                    readonly title: "Seller";
                                    readonly description: "Seller of the NFT";
                                    readonly type: "string";
                                };
                                readonly buyer: {
                                    readonly title: "Buyer";
                                    readonly description: "Buyer of the NFT";
                                    readonly type: "string";
                                };
                                readonly payment: {
                                    readonly title: "Information about the payment";
                                    readonly type: "object";
                                    readonly required: readonly ["quantity", "token_address", "decimals", "symbol"];
                                    readonly properties: {
                                        readonly quantity: {
                                            readonly title: "Quantity";
                                            readonly description: "Amount of tokens in the order. Defaults to 0 if quantity can not be determined.";
                                            readonly type: "string";
                                        };
                                        readonly token_address: {
                                            readonly title: "Token Address";
                                            readonly description: "The contract address for the ERC20 token";
                                            readonly type: "string";
                                        };
                                        readonly decimals: {
                                            readonly title: "Decimals";
                                            readonly description: "Returns the number of decimals the token uses - e.g. 8, means to divide the token amount by 100000000 to get its user representation.";
                                            readonly type: "integer";
                                        };
                                        readonly symbol: {
                                            readonly title: "Symbol";
                                            readonly description: "Returns the symbol of the token, e.g. ETH, WETH, USDC, etc";
                                            readonly type: "string";
                                        };
                                    };
                                };
                                readonly transaction: {
                                    readonly title: "Transaction";
                                    readonly description: "Transaction hash for the order fulfillment";
                                    readonly type: "string";
                                };
                                readonly event_timestamp: {
                                    readonly title: "Event Timestamp";
                                    readonly description: "The Posix timestamp at which the event occurred";
                                    readonly type: "integer";
                                };
                            };
                            readonly required: readonly ["order_hash", "chain", "protocol_address", "closing_date", "nft", "quantity", "seller", "buyer", "payment", "transaction", "event_timestamp"];
                        }, {
                            readonly title: "TransferEventModel";
                            readonly type: "object";
                            readonly properties: {
                                readonly event_type: {
                                    readonly title: "Event Type";
                                    readonly default: "transfer";
                                    readonly enum: readonly ["transfer"];
                                    readonly type: "string";
                                    readonly description: "`transfer`";
                                };
                                readonly chain: {
                                    readonly description: "OpenSea supported chains.";
                                    readonly title: "ChainIdentifier";
                                    readonly enum: readonly ["ethereum", "matic", "klaytn", "bsc", "solana", "arbitrum", "arbitrum_nova", "avalanche", "optimism", "base", "blast", "sei", "zora", "sepolia", "rinkeby", "mumbai", "amoy", "baobab", "bsctestnet", "goerli", "soldev", "arbitrum_goerli", "arbitrum_sepolia", "avalanche_fuji", "optimism_goerli", "optimism_sepolia", "base_goerli", "base_sepolia", "blast_sepolia", "gunzilla_testnet", "sei_devnet", "zora_testnet", "zora_sepolia"];
                                };
                                readonly transaction: {
                                    readonly title: "Transaction";
                                    readonly description: "Transaction hash for the transfer";
                                    readonly type: "string";
                                };
                                readonly from_address: {
                                    readonly title: "From Address";
                                    readonly description: "Address of the sender";
                                    readonly type: "string";
                                };
                                readonly to_address: {
                                    readonly title: "To Address";
                                    readonly description: "Address of the recipient";
                                    readonly type: "string";
                                };
                                readonly quantity: {
                                    readonly title: "Quantity";
                                    readonly description: "Number of assets transferred";
                                    readonly type: "integer";
                                };
                                readonly nft: {
                                    readonly title: "Nft";
                                    readonly description: "The NFT which was transferred";
                                    readonly type: "object";
                                    readonly required: readonly ["identifier", "collection", "contract", "token_standard", "name", "description", "updated_at", "is_disabled", "is_nsfw"];
                                    readonly properties: {
                                        readonly identifier: {
                                            readonly title: "Identifier";
                                            readonly description: "The NFT's unique identifier within the smart contract (also referred to as token_id)";
                                            readonly type: "string";
                                        };
                                        readonly collection: {
                                            readonly title: "Collection";
                                            readonly description: "Collection slug. A unique string to identify a collection on OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly contract: {
                                            readonly title: "Contract";
                                            readonly description: "The public blockchain address of the contract";
                                            readonly type: "string";
                                        };
                                        readonly token_standard: {
                                            readonly title: "Token Standard";
                                            readonly description: "ERC standard of the token (erc721, erc1155)";
                                            readonly type: "string";
                                        };
                                        readonly name: {
                                            readonly title: "Name";
                                            readonly description: "Name of the NFT";
                                            readonly type: "string";
                                        };
                                        readonly description: {
                                            readonly title: "Description";
                                            readonly description: "Description of the NFT";
                                            readonly type: "string";
                                        };
                                        readonly image_url: {
                                            readonly title: "Image Url";
                                            readonly description: "Link to the image associated with the NFT";
                                            readonly type: "string";
                                        };
                                        readonly metadata_url: {
                                            readonly title: "Metadata Url";
                                            readonly description: "Link to the offchain metadata store";
                                            readonly type: "string";
                                        };
                                        readonly opensea_url: {
                                            readonly title: "Opensea Url";
                                            readonly description: "Link to the NFT on OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly updated_at: {
                                            readonly title: "Updated At";
                                            readonly description: "Last time that the NFT's metadata was updated by OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly is_disabled: {
                                            readonly title: "Is Disabled";
                                            readonly description: "If the item is currently able to be bought or sold using OpenSea";
                                            readonly type: "boolean";
                                        };
                                        readonly is_nsfw: {
                                            readonly title: "Is Nsfw";
                                            readonly description: "If the item is currently classified as 'Not Safe for Work' by OpenSea as defined in [OpenSea's NSFW Policy](https://support.opensea.io/hc/articles/9729972510995).";
                                            readonly type: "boolean";
                                        };
                                    };
                                };
                                readonly event_timestamp: {
                                    readonly title: "Event Timestamp";
                                    readonly description: "The Posix timestamp at which the event occurred";
                                    readonly type: "integer";
                                };
                            };
                            readonly required: readonly ["chain", "transaction", "from_address", "to_address", "quantity", "nft", "event_timestamp"];
                        }, {
                            readonly title: "RedemptionEventModel";
                            readonly type: "object";
                            readonly properties: {
                                readonly event_type: {
                                    readonly title: "Event Type";
                                    readonly default: "redemption";
                                    readonly enum: readonly ["redemption"];
                                    readonly type: "string";
                                    readonly description: "`redemption`";
                                };
                                readonly chain: {
                                    readonly description: "OpenSea supported chains.";
                                    readonly title: "ChainIdentifier";
                                    readonly enum: readonly ["ethereum", "matic", "klaytn", "bsc", "solana", "arbitrum", "arbitrum_nova", "avalanche", "optimism", "base", "blast", "sei", "zora", "sepolia", "rinkeby", "mumbai", "amoy", "baobab", "bsctestnet", "goerli", "soldev", "arbitrum_goerli", "arbitrum_sepolia", "avalanche_fuji", "optimism_goerli", "optimism_sepolia", "base_goerli", "base_sepolia", "blast_sepolia", "gunzilla_testnet", "sei_devnet", "zora_testnet", "zora_sepolia"];
                                };
                                readonly from_address: {
                                    readonly title: "From Address";
                                    readonly description: "Address of the sender";
                                    readonly type: "string";
                                };
                                readonly to_address: {
                                    readonly title: "To Address";
                                    readonly description: "Address of the recipient";
                                    readonly type: "string";
                                };
                                readonly asset: {
                                    readonly title: "Asset";
                                    readonly description: "The asset being redeemed.";
                                    readonly type: "object";
                                    readonly required: readonly ["identifier", "collection", "contract", "token_standard", "name", "description", "updated_at", "is_disabled", "is_nsfw"];
                                    readonly properties: {
                                        readonly identifier: {
                                            readonly title: "Identifier";
                                            readonly description: "The NFT's unique identifier within the smart contract (also referred to as token_id)";
                                            readonly type: "string";
                                        };
                                        readonly collection: {
                                            readonly title: "Collection";
                                            readonly description: "Collection slug. A unique string to identify a collection on OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly contract: {
                                            readonly title: "Contract";
                                            readonly description: "The public blockchain address of the contract";
                                            readonly type: "string";
                                        };
                                        readonly token_standard: {
                                            readonly title: "Token Standard";
                                            readonly description: "ERC standard of the token (erc721, erc1155)";
                                            readonly type: "string";
                                        };
                                        readonly name: {
                                            readonly title: "Name";
                                            readonly description: "Name of the NFT";
                                            readonly type: "string";
                                        };
                                        readonly description: {
                                            readonly title: "Description";
                                            readonly description: "Description of the NFT";
                                            readonly type: "string";
                                        };
                                        readonly image_url: {
                                            readonly title: "Image Url";
                                            readonly description: "Link to the image associated with the NFT";
                                            readonly type: "string";
                                        };
                                        readonly metadata_url: {
                                            readonly title: "Metadata Url";
                                            readonly description: "Link to the offchain metadata store";
                                            readonly type: "string";
                                        };
                                        readonly opensea_url: {
                                            readonly title: "Opensea Url";
                                            readonly description: "Link to the NFT on OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly updated_at: {
                                            readonly title: "Updated At";
                                            readonly description: "Last time that the NFT's metadata was updated by OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly is_disabled: {
                                            readonly title: "Is Disabled";
                                            readonly description: "If the item is currently able to be bought or sold using OpenSea";
                                            readonly type: "boolean";
                                        };
                                        readonly is_nsfw: {
                                            readonly title: "Is Nsfw";
                                            readonly description: "If the item is currently classified as 'Not Safe for Work' by OpenSea as defined in [OpenSea's NSFW Policy](https://support.opensea.io/hc/articles/9729972510995).";
                                            readonly type: "boolean";
                                        };
                                    };
                                };
                                readonly quantity: {
                                    readonly title: "Quantity";
                                    readonly description: "Number of assets redeemed";
                                    readonly type: "integer";
                                };
                                readonly transaction: {
                                    readonly title: "Transaction";
                                    readonly description: "Transaction hash for the redemption";
                                    readonly type: "string";
                                };
                                readonly event_timestamp: {
                                    readonly title: "Event Timestamp";
                                    readonly description: "The Posix timestamp at which the event occurred";
                                    readonly type: "integer";
                                };
                            };
                            readonly required: readonly ["chain", "from_address", "to_address", "asset", "quantity", "transaction", "event_timestamp"];
                        }];
                    };
                };
                readonly next: {
                    readonly title: "Next";
                    readonly description: "Cursor for the next page of results";
                    readonly type: "string";
                };
            };
            readonly required: readonly ["asset_events", "next"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const ListEventsByAccount: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly address: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The public blockchain address.";
                };
            };
            readonly required: readonly ["address"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly after: {
                    readonly type: "number";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Filter to only include events that occurred at or after the given timestamp. The Unix epoch timstamp must be in seconds";
                };
                readonly before: {
                    readonly type: "number";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Filter to only include events that occurred before the given timestamp. The Unix epoch timstamp must be in seconds.";
                };
                readonly chain: {
                    readonly type: "string";
                    readonly enum: readonly ["amoy", "arbitrum", "arbitrum_nova", "arbitrum_sepolia", "avalanche", "avalanche_fuji", "baobab", "base", "base_sepolia", "blast", "blast_sepolia", "bsc", "bsctestnet", "ethereum", "klaytn", "matic", "mumbai", "optimism", "optimism_sepolia", "sepolia", "solana", "soldev", "zora", "zora_sepolia"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The blockchain on which to filter the results.";
                };
                readonly event_type: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "string";
                        readonly enum: readonly ["all", "cancel", "listing", "offer", "order", "redemption", "sale", "transfer"];
                    };
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The type of event to filter by. If not provided, only sales will be returned.";
                };
                readonly limit: {
                    readonly type: "integer";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The number of events to return. Must be between 1 and 50. Default: 50";
                };
                readonly next: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The cursor for the next page of results. This is returned from a previous request.";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "ListEventsResponse";
            readonly type: "object";
            readonly properties: {
                readonly asset_events: {
                    readonly title: "Events";
                    readonly type: "array";
                    readonly items: {
                        readonly anyOf: readonly [{
                            readonly title: "CancelEventModel";
                            readonly type: "object";
                            readonly properties: {
                                readonly event_type: {
                                    readonly title: "Event Type";
                                    readonly default: "cancel";
                                    readonly enum: readonly ["cancel"];
                                    readonly type: "string";
                                    readonly description: "`cancel`";
                                };
                                readonly order_hash: {
                                    readonly title: "Order Hash";
                                    readonly description: "Order hash for the order which was cancelled";
                                    readonly type: "string";
                                };
                                readonly order_type: {
                                    readonly description: "An enumeration.";
                                    readonly title: "APIOrderType";
                                    readonly enum: readonly ["listing", "auction", "item_offer", "collection_offer", "trait_offer"];
                                };
                                readonly maker: {
                                    readonly title: "Maker";
                                    readonly description: "Maker of the original order";
                                    readonly type: "string";
                                };
                                readonly chain: {
                                    readonly description: "OpenSea supported chains.";
                                    readonly title: "ChainIdentifier";
                                    readonly enum: readonly ["ethereum", "matic", "klaytn", "bsc", "solana", "arbitrum", "arbitrum_nova", "avalanche", "optimism", "base", "blast", "sei", "zora", "sepolia", "rinkeby", "mumbai", "amoy", "baobab", "bsctestnet", "goerli", "soldev", "arbitrum_goerli", "arbitrum_sepolia", "avalanche_fuji", "optimism_goerli", "optimism_sepolia", "base_goerli", "base_sepolia", "blast_sepolia", "gunzilla_testnet", "sei_devnet", "zora_testnet", "zora_sepolia"];
                                };
                                readonly event_timestamp: {
                                    readonly title: "Event Timestamp";
                                    readonly description: "The Posix timestamp at which the event occurred";
                                    readonly type: "integer";
                                };
                                readonly nft: {
                                    readonly title: "Nft";
                                    readonly description: "The NFT which was cancelled";
                                    readonly type: "object";
                                    readonly required: readonly ["identifier", "collection", "contract", "token_standard", "name", "description", "updated_at", "is_disabled", "is_nsfw"];
                                    readonly properties: {
                                        readonly identifier: {
                                            readonly title: "Identifier";
                                            readonly description: "The NFT's unique identifier within the smart contract (also referred to as token_id)";
                                            readonly type: "string";
                                        };
                                        readonly collection: {
                                            readonly title: "Collection";
                                            readonly description: "Collection slug. A unique string to identify a collection on OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly contract: {
                                            readonly title: "Contract";
                                            readonly description: "The public blockchain address of the contract";
                                            readonly type: "string";
                                        };
                                        readonly token_standard: {
                                            readonly title: "Token Standard";
                                            readonly description: "ERC standard of the token (erc721, erc1155)";
                                            readonly type: "string";
                                        };
                                        readonly name: {
                                            readonly title: "Name";
                                            readonly description: "Name of the NFT";
                                            readonly type: "string";
                                        };
                                        readonly description: {
                                            readonly title: "Description";
                                            readonly description: "Description of the NFT";
                                            readonly type: "string";
                                        };
                                        readonly image_url: {
                                            readonly title: "Image Url";
                                            readonly description: "Link to the image associated with the NFT";
                                            readonly type: "string";
                                        };
                                        readonly metadata_url: {
                                            readonly title: "Metadata Url";
                                            readonly description: "Link to the offchain metadata store";
                                            readonly type: "string";
                                        };
                                        readonly opensea_url: {
                                            readonly title: "Opensea Url";
                                            readonly description: "Link to the NFT on OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly updated_at: {
                                            readonly title: "Updated At";
                                            readonly description: "Last time that the NFT's metadata was updated by OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly is_disabled: {
                                            readonly title: "Is Disabled";
                                            readonly description: "If the item is currently able to be bought or sold using OpenSea";
                                            readonly type: "boolean";
                                        };
                                        readonly is_nsfw: {
                                            readonly title: "Is Nsfw";
                                            readonly description: "If the item is currently classified as 'Not Safe for Work' by OpenSea as defined in [OpenSea's NSFW Policy](https://support.opensea.io/hc/articles/9729972510995).";
                                            readonly type: "boolean";
                                        };
                                    };
                                };
                            };
                            readonly required: readonly ["order_hash", "order_type", "maker", "chain", "event_timestamp", "nft"];
                        }, {
                            readonly title: "OrderEventModel";
                            readonly type: "object";
                            readonly properties: {
                                readonly event_type: {
                                    readonly title: "Event Type";
                                    readonly default: "order";
                                    readonly enum: readonly ["order"];
                                    readonly type: "string";
                                    readonly description: "`order`";
                                };
                                readonly order_hash: {
                                    readonly title: "Order Hash";
                                    readonly description: "Order hash for the newly created order";
                                    readonly type: "string";
                                };
                                readonly order_type: {
                                    readonly title: "APIOrderType";
                                    readonly description: "An enumeration.\n\n`listing` `auction` `item_offer` `collection_offer` `trait_offer`";
                                    readonly enum: readonly ["listing", "auction", "item_offer", "collection_offer", "trait_offer"];
                                    readonly properties: {};
                                    readonly type: "object";
                                };
                                readonly chain: {
                                    readonly description: "OpenSea supported chains.";
                                    readonly title: "ChainIdentifier";
                                    readonly enum: readonly ["ethereum", "matic", "klaytn", "bsc", "solana", "arbitrum", "arbitrum_nova", "avalanche", "optimism", "base", "blast", "sei", "zora", "sepolia", "rinkeby", "mumbai", "amoy", "baobab", "bsctestnet", "goerli", "soldev", "arbitrum_goerli", "arbitrum_sepolia", "avalanche_fuji", "optimism_goerli", "optimism_sepolia", "base_goerli", "base_sepolia", "blast_sepolia", "gunzilla_testnet", "sei_devnet", "zora_testnet", "zora_sepolia"];
                                };
                                readonly protocol_address: {
                                    readonly title: "Protocol Address";
                                    readonly description: "Exchange contract address for the order";
                                    readonly type: "string";
                                };
                                readonly start_date: {
                                    readonly title: "Start Date";
                                    readonly description: "The Posix timestamp at which the order was created";
                                    readonly type: "integer";
                                };
                                readonly expiration_date: {
                                    readonly title: "Expiration Date";
                                    readonly description: "The Posix timestamp at which the order will close. When no expiration date is set, this value will be 0.";
                                    readonly type: "integer";
                                };
                                readonly asset: {
                                    readonly title: "Asset";
                                    readonly description: "The nft being listed or bid on. Empty object for collection or trait offers.";
                                    readonly type: "object";
                                    readonly required: readonly ["identifier", "collection", "contract", "token_standard", "name", "description", "updated_at", "is_disabled", "is_nsfw"];
                                    readonly properties: {
                                        readonly identifier: {
                                            readonly title: "Identifier";
                                            readonly description: "The NFT's unique identifier within the smart contract (also referred to as token_id)";
                                            readonly type: "string";
                                        };
                                        readonly collection: {
                                            readonly title: "Collection";
                                            readonly description: "Collection slug. A unique string to identify a collection on OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly contract: {
                                            readonly title: "Contract";
                                            readonly description: "The public blockchain address of the contract";
                                            readonly type: "string";
                                        };
                                        readonly token_standard: {
                                            readonly title: "Token Standard";
                                            readonly description: "ERC standard of the token (erc721, erc1155)";
                                            readonly type: "string";
                                        };
                                        readonly name: {
                                            readonly title: "Name";
                                            readonly description: "Name of the NFT";
                                            readonly type: "string";
                                        };
                                        readonly description: {
                                            readonly title: "Description";
                                            readonly description: "Description of the NFT";
                                            readonly type: "string";
                                        };
                                        readonly image_url: {
                                            readonly title: "Image Url";
                                            readonly description: "Link to the image associated with the NFT";
                                            readonly type: "string";
                                        };
                                        readonly metadata_url: {
                                            readonly title: "Metadata Url";
                                            readonly description: "Link to the offchain metadata store";
                                            readonly type: "string";
                                        };
                                        readonly opensea_url: {
                                            readonly title: "Opensea Url";
                                            readonly description: "Link to the NFT on OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly updated_at: {
                                            readonly title: "Updated At";
                                            readonly description: "Last time that the NFT's metadata was updated by OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly is_disabled: {
                                            readonly title: "Is Disabled";
                                            readonly description: "If the item is currently able to be bought or sold using OpenSea";
                                            readonly type: "boolean";
                                        };
                                        readonly is_nsfw: {
                                            readonly title: "Is Nsfw";
                                            readonly description: "If the item is currently classified as 'Not Safe for Work' by OpenSea as defined in [OpenSea's NSFW Policy](https://support.opensea.io/hc/articles/9729972510995).";
                                            readonly type: "boolean";
                                        };
                                    };
                                };
                                readonly quantity: {
                                    readonly title: "Quantity";
                                    readonly description: "Number of assets in the order";
                                    readonly type: "integer";
                                };
                                readonly maker: {
                                    readonly title: "Maker";
                                    readonly description: "Maker of the order";
                                    readonly type: "string";
                                };
                                readonly taker: {
                                    readonly title: "Taker";
                                    readonly description: "Taker of the order. This will only be set for private listings.";
                                    readonly type: "string";
                                };
                                readonly payment: {
                                    readonly title: "Information about the payment";
                                    readonly type: "object";
                                    readonly required: readonly ["quantity", "token_address", "decimals", "symbol"];
                                    readonly properties: {
                                        readonly quantity: {
                                            readonly title: "Quantity";
                                            readonly description: "Amount of tokens in the order. Defaults to 0 if quantity can not be determined.";
                                            readonly type: "string";
                                        };
                                        readonly token_address: {
                                            readonly title: "Token Address";
                                            readonly description: "The contract address for the ERC20 token";
                                            readonly type: "string";
                                        };
                                        readonly decimals: {
                                            readonly title: "Decimals";
                                            readonly description: "Returns the number of decimals the token uses - e.g. 8, means to divide the token amount by 100000000 to get its user representation.";
                                            readonly type: "integer";
                                        };
                                        readonly symbol: {
                                            readonly title: "Symbol";
                                            readonly description: "Returns the symbol of the token, e.g. ETH, WETH, USDC, etc";
                                            readonly type: "string";
                                        };
                                    };
                                };
                                readonly criteria: {
                                    readonly title: "Criteria";
                                    readonly description: "For collection and trait offers, this object will contain the criteria needed to fulfill the offer.";
                                    readonly anyOf: readonly [{
                                        readonly title: "Criteria";
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly collection: {
                                                readonly title: "Collection";
                                                readonly description: "The collection in which the criteria offer is being made for.";
                                                readonly type: "object";
                                                readonly required: readonly ["slug"];
                                                readonly properties: {
                                                    readonly slug: {
                                                        readonly title: "Slug";
                                                        readonly description: "Unique string to identify a collection on OpenSea. This can be found by visiting the collection on the OpenSea website and noting the last path parameter.";
                                                        readonly type: "string";
                                                    };
                                                };
                                            };
                                            readonly contract: {
                                                readonly title: "Contract";
                                                readonly description: "The public blockchain address of the NFT contract";
                                                readonly type: "object";
                                                readonly required: readonly ["address"];
                                                readonly properties: {
                                                    readonly address: {
                                                        readonly title: "Address";
                                                        readonly type: "string";
                                                    };
                                                };
                                            };
                                            readonly trait: {
                                                readonly title: "Trait";
                                                readonly description: "The trait that the criteria offer is being made for.";
                                                readonly type: "object";
                                                readonly required: readonly ["type", "value"];
                                                readonly properties: {
                                                    readonly type: {
                                                        readonly title: "Type";
                                                        readonly type: "string";
                                                    };
                                                    readonly value: {
                                                        readonly title: "Value";
                                                        readonly type: "string";
                                                    };
                                                };
                                            };
                                            readonly encoded_token_ids: {
                                                readonly title: "Encoded Token Ids";
                                                readonly description: "Represents a list of token ids which can be used to fulfill the criteria offer. When decoded using the provided SDK function, developers can now see a list of all tokens that could be used to fulfill the offer.";
                                                readonly type: "string";
                                            };
                                        };
                                        readonly required: readonly ["collection", "contract"];
                                    }, {
                                        readonly type: "object";
                                        readonly additionalProperties: true;
                                    }];
                                };
                                readonly event_timestamp: {
                                    readonly title: "Event Timestamp";
                                    readonly description: "The Posix timestamp at which the event occurred";
                                    readonly type: "integer";
                                };
                                readonly is_private_listing: {
                                    readonly title: "Is Private Listing";
                                    readonly description: "Whether the order is a private listing";
                                    readonly type: "boolean";
                                };
                            };
                            readonly required: readonly ["order_hash", "chain", "protocol_address", "start_date", "expiration_date", "asset", "quantity", "maker", "taker", "payment", "criteria", "event_timestamp", "is_private_listing"];
                        }, {
                            readonly title: "SaleEventModel";
                            readonly type: "object";
                            readonly properties: {
                                readonly event_type: {
                                    readonly title: "Event Type";
                                    readonly default: "sale";
                                    readonly enum: readonly ["sale"];
                                    readonly type: "string";
                                    readonly description: "`sale`";
                                };
                                readonly order_hash: {
                                    readonly title: "Order Hash";
                                    readonly description: "Order hash for the order which was fulfilled";
                                    readonly type: "string";
                                };
                                readonly chain: {
                                    readonly description: "OpenSea supported chains.";
                                    readonly title: "ChainIdentifier";
                                    readonly enum: readonly ["ethereum", "matic", "klaytn", "bsc", "solana", "arbitrum", "arbitrum_nova", "avalanche", "optimism", "base", "blast", "sei", "zora", "sepolia", "rinkeby", "mumbai", "amoy", "baobab", "bsctestnet", "goerli", "soldev", "arbitrum_goerli", "arbitrum_sepolia", "avalanche_fuji", "optimism_goerli", "optimism_sepolia", "base_goerli", "base_sepolia", "blast_sepolia", "gunzilla_testnet", "sei_devnet", "zora_testnet", "zora_sepolia"];
                                };
                                readonly protocol_address: {
                                    readonly title: "Protocol Address";
                                    readonly description: "Exchange contract address which fulfilled the order";
                                    readonly type: "string";
                                };
                                readonly closing_date: {
                                    readonly title: "Closing Date";
                                    readonly description: "The Posix timestamp at which the transaction which filled the order occurred";
                                    readonly type: "integer";
                                };
                                readonly nft: {
                                    readonly title: "Nft";
                                    readonly description: "The NFT which was sold.";
                                    readonly type: "object";
                                    readonly required: readonly ["identifier", "collection", "contract", "token_standard", "name", "description", "updated_at", "is_disabled", "is_nsfw"];
                                    readonly properties: {
                                        readonly identifier: {
                                            readonly title: "Identifier";
                                            readonly description: "The NFT's unique identifier within the smart contract (also referred to as token_id)";
                                            readonly type: "string";
                                        };
                                        readonly collection: {
                                            readonly title: "Collection";
                                            readonly description: "Collection slug. A unique string to identify a collection on OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly contract: {
                                            readonly title: "Contract";
                                            readonly description: "The public blockchain address of the contract";
                                            readonly type: "string";
                                        };
                                        readonly token_standard: {
                                            readonly title: "Token Standard";
                                            readonly description: "ERC standard of the token (erc721, erc1155)";
                                            readonly type: "string";
                                        };
                                        readonly name: {
                                            readonly title: "Name";
                                            readonly description: "Name of the NFT";
                                            readonly type: "string";
                                        };
                                        readonly description: {
                                            readonly title: "Description";
                                            readonly description: "Description of the NFT";
                                            readonly type: "string";
                                        };
                                        readonly image_url: {
                                            readonly title: "Image Url";
                                            readonly description: "Link to the image associated with the NFT";
                                            readonly type: "string";
                                        };
                                        readonly metadata_url: {
                                            readonly title: "Metadata Url";
                                            readonly description: "Link to the offchain metadata store";
                                            readonly type: "string";
                                        };
                                        readonly opensea_url: {
                                            readonly title: "Opensea Url";
                                            readonly description: "Link to the NFT on OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly updated_at: {
                                            readonly title: "Updated At";
                                            readonly description: "Last time that the NFT's metadata was updated by OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly is_disabled: {
                                            readonly title: "Is Disabled";
                                            readonly description: "If the item is currently able to be bought or sold using OpenSea";
                                            readonly type: "boolean";
                                        };
                                        readonly is_nsfw: {
                                            readonly title: "Is Nsfw";
                                            readonly description: "If the item is currently classified as 'Not Safe for Work' by OpenSea as defined in [OpenSea's NSFW Policy](https://support.opensea.io/hc/articles/9729972510995).";
                                            readonly type: "boolean";
                                        };
                                    };
                                };
                                readonly quantity: {
                                    readonly title: "Quantity";
                                    readonly description: "Number of assets transferred";
                                    readonly type: "integer";
                                };
                                readonly seller: {
                                    readonly title: "Seller";
                                    readonly description: "Seller of the NFT";
                                    readonly type: "string";
                                };
                                readonly buyer: {
                                    readonly title: "Buyer";
                                    readonly description: "Buyer of the NFT";
                                    readonly type: "string";
                                };
                                readonly payment: {
                                    readonly title: "Information about the payment";
                                    readonly type: "object";
                                    readonly required: readonly ["quantity", "token_address", "decimals", "symbol"];
                                    readonly properties: {
                                        readonly quantity: {
                                            readonly title: "Quantity";
                                            readonly description: "Amount of tokens in the order. Defaults to 0 if quantity can not be determined.";
                                            readonly type: "string";
                                        };
                                        readonly token_address: {
                                            readonly title: "Token Address";
                                            readonly description: "The contract address for the ERC20 token";
                                            readonly type: "string";
                                        };
                                        readonly decimals: {
                                            readonly title: "Decimals";
                                            readonly description: "Returns the number of decimals the token uses - e.g. 8, means to divide the token amount by 100000000 to get its user representation.";
                                            readonly type: "integer";
                                        };
                                        readonly symbol: {
                                            readonly title: "Symbol";
                                            readonly description: "Returns the symbol of the token, e.g. ETH, WETH, USDC, etc";
                                            readonly type: "string";
                                        };
                                    };
                                };
                                readonly transaction: {
                                    readonly title: "Transaction";
                                    readonly description: "Transaction hash for the order fulfillment";
                                    readonly type: "string";
                                };
                                readonly event_timestamp: {
                                    readonly title: "Event Timestamp";
                                    readonly description: "The Posix timestamp at which the event occurred";
                                    readonly type: "integer";
                                };
                            };
                            readonly required: readonly ["order_hash", "chain", "protocol_address", "closing_date", "nft", "quantity", "seller", "buyer", "payment", "transaction", "event_timestamp"];
                        }, {
                            readonly title: "TransferEventModel";
                            readonly type: "object";
                            readonly properties: {
                                readonly event_type: {
                                    readonly title: "Event Type";
                                    readonly default: "transfer";
                                    readonly enum: readonly ["transfer"];
                                    readonly type: "string";
                                    readonly description: "`transfer`";
                                };
                                readonly chain: {
                                    readonly description: "OpenSea supported chains.";
                                    readonly title: "ChainIdentifier";
                                    readonly enum: readonly ["ethereum", "matic", "klaytn", "bsc", "solana", "arbitrum", "arbitrum_nova", "avalanche", "optimism", "base", "blast", "sei", "zora", "sepolia", "rinkeby", "mumbai", "amoy", "baobab", "bsctestnet", "goerli", "soldev", "arbitrum_goerli", "arbitrum_sepolia", "avalanche_fuji", "optimism_goerli", "optimism_sepolia", "base_goerli", "base_sepolia", "blast_sepolia", "gunzilla_testnet", "sei_devnet", "zora_testnet", "zora_sepolia"];
                                };
                                readonly transaction: {
                                    readonly title: "Transaction";
                                    readonly description: "Transaction hash for the transfer";
                                    readonly type: "string";
                                };
                                readonly from_address: {
                                    readonly title: "From Address";
                                    readonly description: "Address of the sender";
                                    readonly type: "string";
                                };
                                readonly to_address: {
                                    readonly title: "To Address";
                                    readonly description: "Address of the recipient";
                                    readonly type: "string";
                                };
                                readonly quantity: {
                                    readonly title: "Quantity";
                                    readonly description: "Number of assets transferred";
                                    readonly type: "integer";
                                };
                                readonly nft: {
                                    readonly title: "Nft";
                                    readonly description: "The NFT which was transferred";
                                    readonly type: "object";
                                    readonly required: readonly ["identifier", "collection", "contract", "token_standard", "name", "description", "updated_at", "is_disabled", "is_nsfw"];
                                    readonly properties: {
                                        readonly identifier: {
                                            readonly title: "Identifier";
                                            readonly description: "The NFT's unique identifier within the smart contract (also referred to as token_id)";
                                            readonly type: "string";
                                        };
                                        readonly collection: {
                                            readonly title: "Collection";
                                            readonly description: "Collection slug. A unique string to identify a collection on OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly contract: {
                                            readonly title: "Contract";
                                            readonly description: "The public blockchain address of the contract";
                                            readonly type: "string";
                                        };
                                        readonly token_standard: {
                                            readonly title: "Token Standard";
                                            readonly description: "ERC standard of the token (erc721, erc1155)";
                                            readonly type: "string";
                                        };
                                        readonly name: {
                                            readonly title: "Name";
                                            readonly description: "Name of the NFT";
                                            readonly type: "string";
                                        };
                                        readonly description: {
                                            readonly title: "Description";
                                            readonly description: "Description of the NFT";
                                            readonly type: "string";
                                        };
                                        readonly image_url: {
                                            readonly title: "Image Url";
                                            readonly description: "Link to the image associated with the NFT";
                                            readonly type: "string";
                                        };
                                        readonly metadata_url: {
                                            readonly title: "Metadata Url";
                                            readonly description: "Link to the offchain metadata store";
                                            readonly type: "string";
                                        };
                                        readonly opensea_url: {
                                            readonly title: "Opensea Url";
                                            readonly description: "Link to the NFT on OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly updated_at: {
                                            readonly title: "Updated At";
                                            readonly description: "Last time that the NFT's metadata was updated by OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly is_disabled: {
                                            readonly title: "Is Disabled";
                                            readonly description: "If the item is currently able to be bought or sold using OpenSea";
                                            readonly type: "boolean";
                                        };
                                        readonly is_nsfw: {
                                            readonly title: "Is Nsfw";
                                            readonly description: "If the item is currently classified as 'Not Safe for Work' by OpenSea as defined in [OpenSea's NSFW Policy](https://support.opensea.io/hc/articles/9729972510995).";
                                            readonly type: "boolean";
                                        };
                                    };
                                };
                                readonly event_timestamp: {
                                    readonly title: "Event Timestamp";
                                    readonly description: "The Posix timestamp at which the event occurred";
                                    readonly type: "integer";
                                };
                            };
                            readonly required: readonly ["chain", "transaction", "from_address", "to_address", "quantity", "nft", "event_timestamp"];
                        }, {
                            readonly title: "RedemptionEventModel";
                            readonly type: "object";
                            readonly properties: {
                                readonly event_type: {
                                    readonly title: "Event Type";
                                    readonly default: "redemption";
                                    readonly enum: readonly ["redemption"];
                                    readonly type: "string";
                                    readonly description: "`redemption`";
                                };
                                readonly chain: {
                                    readonly description: "OpenSea supported chains.";
                                    readonly title: "ChainIdentifier";
                                    readonly enum: readonly ["ethereum", "matic", "klaytn", "bsc", "solana", "arbitrum", "arbitrum_nova", "avalanche", "optimism", "base", "blast", "sei", "zora", "sepolia", "rinkeby", "mumbai", "amoy", "baobab", "bsctestnet", "goerli", "soldev", "arbitrum_goerli", "arbitrum_sepolia", "avalanche_fuji", "optimism_goerli", "optimism_sepolia", "base_goerli", "base_sepolia", "blast_sepolia", "gunzilla_testnet", "sei_devnet", "zora_testnet", "zora_sepolia"];
                                };
                                readonly from_address: {
                                    readonly title: "From Address";
                                    readonly description: "Address of the sender";
                                    readonly type: "string";
                                };
                                readonly to_address: {
                                    readonly title: "To Address";
                                    readonly description: "Address of the recipient";
                                    readonly type: "string";
                                };
                                readonly asset: {
                                    readonly title: "Asset";
                                    readonly description: "The asset being redeemed.";
                                    readonly type: "object";
                                    readonly required: readonly ["identifier", "collection", "contract", "token_standard", "name", "description", "updated_at", "is_disabled", "is_nsfw"];
                                    readonly properties: {
                                        readonly identifier: {
                                            readonly title: "Identifier";
                                            readonly description: "The NFT's unique identifier within the smart contract (also referred to as token_id)";
                                            readonly type: "string";
                                        };
                                        readonly collection: {
                                            readonly title: "Collection";
                                            readonly description: "Collection slug. A unique string to identify a collection on OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly contract: {
                                            readonly title: "Contract";
                                            readonly description: "The public blockchain address of the contract";
                                            readonly type: "string";
                                        };
                                        readonly token_standard: {
                                            readonly title: "Token Standard";
                                            readonly description: "ERC standard of the token (erc721, erc1155)";
                                            readonly type: "string";
                                        };
                                        readonly name: {
                                            readonly title: "Name";
                                            readonly description: "Name of the NFT";
                                            readonly type: "string";
                                        };
                                        readonly description: {
                                            readonly title: "Description";
                                            readonly description: "Description of the NFT";
                                            readonly type: "string";
                                        };
                                        readonly image_url: {
                                            readonly title: "Image Url";
                                            readonly description: "Link to the image associated with the NFT";
                                            readonly type: "string";
                                        };
                                        readonly metadata_url: {
                                            readonly title: "Metadata Url";
                                            readonly description: "Link to the offchain metadata store";
                                            readonly type: "string";
                                        };
                                        readonly opensea_url: {
                                            readonly title: "Opensea Url";
                                            readonly description: "Link to the NFT on OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly updated_at: {
                                            readonly title: "Updated At";
                                            readonly description: "Last time that the NFT's metadata was updated by OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly is_disabled: {
                                            readonly title: "Is Disabled";
                                            readonly description: "If the item is currently able to be bought or sold using OpenSea";
                                            readonly type: "boolean";
                                        };
                                        readonly is_nsfw: {
                                            readonly title: "Is Nsfw";
                                            readonly description: "If the item is currently classified as 'Not Safe for Work' by OpenSea as defined in [OpenSea's NSFW Policy](https://support.opensea.io/hc/articles/9729972510995).";
                                            readonly type: "boolean";
                                        };
                                    };
                                };
                                readonly quantity: {
                                    readonly title: "Quantity";
                                    readonly description: "Number of assets redeemed";
                                    readonly type: "integer";
                                };
                                readonly transaction: {
                                    readonly title: "Transaction";
                                    readonly description: "Transaction hash for the redemption";
                                    readonly type: "string";
                                };
                                readonly event_timestamp: {
                                    readonly title: "Event Timestamp";
                                    readonly description: "The Posix timestamp at which the event occurred";
                                    readonly type: "integer";
                                };
                            };
                            readonly required: readonly ["chain", "from_address", "to_address", "asset", "quantity", "transaction", "event_timestamp"];
                        }];
                    };
                };
                readonly next: {
                    readonly title: "Next";
                    readonly description: "Cursor for the next page of results";
                    readonly type: "string";
                };
            };
            readonly required: readonly ["asset_events", "next"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const ListEventsByCollection: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly collection_slug: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Unique string to identify a collection on OpenSea. This can be found by visiting the collection on the OpenSea website and noting the last path parameter.";
                };
            };
            readonly required: readonly ["collection_slug"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly after: {
                    readonly type: "number";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Filter to only include events that occurred at or after the given timestamp. The Unix epoch timstamp must be in seconds";
                };
                readonly before: {
                    readonly type: "number";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Filter to only include events that occurred before the given timestamp. The Unix epoch timstamp must be in seconds.";
                };
                readonly event_type: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "string";
                        readonly enum: readonly ["all", "cancel", "listing", "offer", "order", "redemption", "sale", "transfer"];
                    };
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The type of event to filter by. If not provided, only sales will be returned.";
                };
                readonly limit: {
                    readonly type: "integer";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The number of events to return. Must be between 1 and 50. Default: 50";
                };
                readonly next: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The cursor for the next page of results. This is returned from a previous request.";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "ListEventsResponse";
            readonly type: "object";
            readonly properties: {
                readonly asset_events: {
                    readonly title: "Events";
                    readonly type: "array";
                    readonly items: {
                        readonly anyOf: readonly [{
                            readonly title: "CancelEventModel";
                            readonly type: "object";
                            readonly properties: {
                                readonly event_type: {
                                    readonly title: "Event Type";
                                    readonly default: "cancel";
                                    readonly enum: readonly ["cancel"];
                                    readonly type: "string";
                                    readonly description: "`cancel`";
                                };
                                readonly order_hash: {
                                    readonly title: "Order Hash";
                                    readonly description: "Order hash for the order which was cancelled";
                                    readonly type: "string";
                                };
                                readonly order_type: {
                                    readonly description: "An enumeration.";
                                    readonly title: "APIOrderType";
                                    readonly enum: readonly ["listing", "auction", "item_offer", "collection_offer", "trait_offer"];
                                };
                                readonly maker: {
                                    readonly title: "Maker";
                                    readonly description: "Maker of the original order";
                                    readonly type: "string";
                                };
                                readonly chain: {
                                    readonly description: "OpenSea supported chains.";
                                    readonly title: "ChainIdentifier";
                                    readonly enum: readonly ["ethereum", "matic", "klaytn", "bsc", "solana", "arbitrum", "arbitrum_nova", "avalanche", "optimism", "base", "blast", "sei", "zora", "sepolia", "rinkeby", "mumbai", "amoy", "baobab", "bsctestnet", "goerli", "soldev", "arbitrum_goerli", "arbitrum_sepolia", "avalanche_fuji", "optimism_goerli", "optimism_sepolia", "base_goerli", "base_sepolia", "blast_sepolia", "gunzilla_testnet", "sei_devnet", "zora_testnet", "zora_sepolia"];
                                };
                                readonly event_timestamp: {
                                    readonly title: "Event Timestamp";
                                    readonly description: "The Posix timestamp at which the event occurred";
                                    readonly type: "integer";
                                };
                                readonly nft: {
                                    readonly title: "Nft";
                                    readonly description: "The NFT which was cancelled";
                                    readonly type: "object";
                                    readonly required: readonly ["identifier", "collection", "contract", "token_standard", "name", "description", "updated_at", "is_disabled", "is_nsfw"];
                                    readonly properties: {
                                        readonly identifier: {
                                            readonly title: "Identifier";
                                            readonly description: "The NFT's unique identifier within the smart contract (also referred to as token_id)";
                                            readonly type: "string";
                                        };
                                        readonly collection: {
                                            readonly title: "Collection";
                                            readonly description: "Collection slug. A unique string to identify a collection on OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly contract: {
                                            readonly title: "Contract";
                                            readonly description: "The public blockchain address of the contract";
                                            readonly type: "string";
                                        };
                                        readonly token_standard: {
                                            readonly title: "Token Standard";
                                            readonly description: "ERC standard of the token (erc721, erc1155)";
                                            readonly type: "string";
                                        };
                                        readonly name: {
                                            readonly title: "Name";
                                            readonly description: "Name of the NFT";
                                            readonly type: "string";
                                        };
                                        readonly description: {
                                            readonly title: "Description";
                                            readonly description: "Description of the NFT";
                                            readonly type: "string";
                                        };
                                        readonly image_url: {
                                            readonly title: "Image Url";
                                            readonly description: "Link to the image associated with the NFT";
                                            readonly type: "string";
                                        };
                                        readonly metadata_url: {
                                            readonly title: "Metadata Url";
                                            readonly description: "Link to the offchain metadata store";
                                            readonly type: "string";
                                        };
                                        readonly opensea_url: {
                                            readonly title: "Opensea Url";
                                            readonly description: "Link to the NFT on OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly updated_at: {
                                            readonly title: "Updated At";
                                            readonly description: "Last time that the NFT's metadata was updated by OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly is_disabled: {
                                            readonly title: "Is Disabled";
                                            readonly description: "If the item is currently able to be bought or sold using OpenSea";
                                            readonly type: "boolean";
                                        };
                                        readonly is_nsfw: {
                                            readonly title: "Is Nsfw";
                                            readonly description: "If the item is currently classified as 'Not Safe for Work' by OpenSea as defined in [OpenSea's NSFW Policy](https://support.opensea.io/hc/articles/9729972510995).";
                                            readonly type: "boolean";
                                        };
                                    };
                                };
                            };
                            readonly required: readonly ["order_hash", "order_type", "maker", "chain", "event_timestamp", "nft"];
                        }, {
                            readonly title: "OrderEventModel";
                            readonly type: "object";
                            readonly properties: {
                                readonly event_type: {
                                    readonly title: "Event Type";
                                    readonly default: "order";
                                    readonly enum: readonly ["order"];
                                    readonly type: "string";
                                    readonly description: "`order`";
                                };
                                readonly order_hash: {
                                    readonly title: "Order Hash";
                                    readonly description: "Order hash for the newly created order";
                                    readonly type: "string";
                                };
                                readonly order_type: {
                                    readonly title: "APIOrderType";
                                    readonly description: "An enumeration.\n\n`listing` `auction` `item_offer` `collection_offer` `trait_offer`";
                                    readonly enum: readonly ["listing", "auction", "item_offer", "collection_offer", "trait_offer"];
                                    readonly properties: {};
                                    readonly type: "object";
                                };
                                readonly chain: {
                                    readonly description: "OpenSea supported chains.";
                                    readonly title: "ChainIdentifier";
                                    readonly enum: readonly ["ethereum", "matic", "klaytn", "bsc", "solana", "arbitrum", "arbitrum_nova", "avalanche", "optimism", "base", "blast", "sei", "zora", "sepolia", "rinkeby", "mumbai", "amoy", "baobab", "bsctestnet", "goerli", "soldev", "arbitrum_goerli", "arbitrum_sepolia", "avalanche_fuji", "optimism_goerli", "optimism_sepolia", "base_goerli", "base_sepolia", "blast_sepolia", "gunzilla_testnet", "sei_devnet", "zora_testnet", "zora_sepolia"];
                                };
                                readonly protocol_address: {
                                    readonly title: "Protocol Address";
                                    readonly description: "Exchange contract address for the order";
                                    readonly type: "string";
                                };
                                readonly start_date: {
                                    readonly title: "Start Date";
                                    readonly description: "The Posix timestamp at which the order was created";
                                    readonly type: "integer";
                                };
                                readonly expiration_date: {
                                    readonly title: "Expiration Date";
                                    readonly description: "The Posix timestamp at which the order will close. When no expiration date is set, this value will be 0.";
                                    readonly type: "integer";
                                };
                                readonly asset: {
                                    readonly title: "Asset";
                                    readonly description: "The nft being listed or bid on. Empty object for collection or trait offers.";
                                    readonly type: "object";
                                    readonly required: readonly ["identifier", "collection", "contract", "token_standard", "name", "description", "updated_at", "is_disabled", "is_nsfw"];
                                    readonly properties: {
                                        readonly identifier: {
                                            readonly title: "Identifier";
                                            readonly description: "The NFT's unique identifier within the smart contract (also referred to as token_id)";
                                            readonly type: "string";
                                        };
                                        readonly collection: {
                                            readonly title: "Collection";
                                            readonly description: "Collection slug. A unique string to identify a collection on OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly contract: {
                                            readonly title: "Contract";
                                            readonly description: "The public blockchain address of the contract";
                                            readonly type: "string";
                                        };
                                        readonly token_standard: {
                                            readonly title: "Token Standard";
                                            readonly description: "ERC standard of the token (erc721, erc1155)";
                                            readonly type: "string";
                                        };
                                        readonly name: {
                                            readonly title: "Name";
                                            readonly description: "Name of the NFT";
                                            readonly type: "string";
                                        };
                                        readonly description: {
                                            readonly title: "Description";
                                            readonly description: "Description of the NFT";
                                            readonly type: "string";
                                        };
                                        readonly image_url: {
                                            readonly title: "Image Url";
                                            readonly description: "Link to the image associated with the NFT";
                                            readonly type: "string";
                                        };
                                        readonly metadata_url: {
                                            readonly title: "Metadata Url";
                                            readonly description: "Link to the offchain metadata store";
                                            readonly type: "string";
                                        };
                                        readonly opensea_url: {
                                            readonly title: "Opensea Url";
                                            readonly description: "Link to the NFT on OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly updated_at: {
                                            readonly title: "Updated At";
                                            readonly description: "Last time that the NFT's metadata was updated by OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly is_disabled: {
                                            readonly title: "Is Disabled";
                                            readonly description: "If the item is currently able to be bought or sold using OpenSea";
                                            readonly type: "boolean";
                                        };
                                        readonly is_nsfw: {
                                            readonly title: "Is Nsfw";
                                            readonly description: "If the item is currently classified as 'Not Safe for Work' by OpenSea as defined in [OpenSea's NSFW Policy](https://support.opensea.io/hc/articles/9729972510995).";
                                            readonly type: "boolean";
                                        };
                                    };
                                };
                                readonly quantity: {
                                    readonly title: "Quantity";
                                    readonly description: "Number of assets in the order";
                                    readonly type: "integer";
                                };
                                readonly maker: {
                                    readonly title: "Maker";
                                    readonly description: "Maker of the order";
                                    readonly type: "string";
                                };
                                readonly taker: {
                                    readonly title: "Taker";
                                    readonly description: "Taker of the order. This will only be set for private listings.";
                                    readonly type: "string";
                                };
                                readonly payment: {
                                    readonly title: "Information about the payment";
                                    readonly type: "object";
                                    readonly required: readonly ["quantity", "token_address", "decimals", "symbol"];
                                    readonly properties: {
                                        readonly quantity: {
                                            readonly title: "Quantity";
                                            readonly description: "Amount of tokens in the order. Defaults to 0 if quantity can not be determined.";
                                            readonly type: "string";
                                        };
                                        readonly token_address: {
                                            readonly title: "Token Address";
                                            readonly description: "The contract address for the ERC20 token";
                                            readonly type: "string";
                                        };
                                        readonly decimals: {
                                            readonly title: "Decimals";
                                            readonly description: "Returns the number of decimals the token uses - e.g. 8, means to divide the token amount by 100000000 to get its user representation.";
                                            readonly type: "integer";
                                        };
                                        readonly symbol: {
                                            readonly title: "Symbol";
                                            readonly description: "Returns the symbol of the token, e.g. ETH, WETH, USDC, etc";
                                            readonly type: "string";
                                        };
                                    };
                                };
                                readonly criteria: {
                                    readonly title: "Criteria";
                                    readonly description: "For collection and trait offers, this object will contain the criteria needed to fulfill the offer.";
                                    readonly anyOf: readonly [{
                                        readonly title: "Criteria";
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly collection: {
                                                readonly title: "Collection";
                                                readonly description: "The collection in which the criteria offer is being made for.";
                                                readonly type: "object";
                                                readonly required: readonly ["slug"];
                                                readonly properties: {
                                                    readonly slug: {
                                                        readonly title: "Slug";
                                                        readonly description: "Unique string to identify a collection on OpenSea. This can be found by visiting the collection on the OpenSea website and noting the last path parameter.";
                                                        readonly type: "string";
                                                    };
                                                };
                                            };
                                            readonly contract: {
                                                readonly title: "Contract";
                                                readonly description: "The public blockchain address of the NFT contract";
                                                readonly type: "object";
                                                readonly required: readonly ["address"];
                                                readonly properties: {
                                                    readonly address: {
                                                        readonly title: "Address";
                                                        readonly type: "string";
                                                    };
                                                };
                                            };
                                            readonly trait: {
                                                readonly title: "Trait";
                                                readonly description: "The trait that the criteria offer is being made for.";
                                                readonly type: "object";
                                                readonly required: readonly ["type", "value"];
                                                readonly properties: {
                                                    readonly type: {
                                                        readonly title: "Type";
                                                        readonly type: "string";
                                                    };
                                                    readonly value: {
                                                        readonly title: "Value";
                                                        readonly type: "string";
                                                    };
                                                };
                                            };
                                            readonly encoded_token_ids: {
                                                readonly title: "Encoded Token Ids";
                                                readonly description: "Represents a list of token ids which can be used to fulfill the criteria offer. When decoded using the provided SDK function, developers can now see a list of all tokens that could be used to fulfill the offer.";
                                                readonly type: "string";
                                            };
                                        };
                                        readonly required: readonly ["collection", "contract"];
                                    }, {
                                        readonly type: "object";
                                        readonly additionalProperties: true;
                                    }];
                                };
                                readonly event_timestamp: {
                                    readonly title: "Event Timestamp";
                                    readonly description: "The Posix timestamp at which the event occurred";
                                    readonly type: "integer";
                                };
                                readonly is_private_listing: {
                                    readonly title: "Is Private Listing";
                                    readonly description: "Whether the order is a private listing";
                                    readonly type: "boolean";
                                };
                            };
                            readonly required: readonly ["order_hash", "chain", "protocol_address", "start_date", "expiration_date", "asset", "quantity", "maker", "taker", "payment", "criteria", "event_timestamp", "is_private_listing"];
                        }, {
                            readonly title: "SaleEventModel";
                            readonly type: "object";
                            readonly properties: {
                                readonly event_type: {
                                    readonly title: "Event Type";
                                    readonly default: "sale";
                                    readonly enum: readonly ["sale"];
                                    readonly type: "string";
                                    readonly description: "`sale`";
                                };
                                readonly order_hash: {
                                    readonly title: "Order Hash";
                                    readonly description: "Order hash for the order which was fulfilled";
                                    readonly type: "string";
                                };
                                readonly chain: {
                                    readonly description: "OpenSea supported chains.";
                                    readonly title: "ChainIdentifier";
                                    readonly enum: readonly ["ethereum", "matic", "klaytn", "bsc", "solana", "arbitrum", "arbitrum_nova", "avalanche", "optimism", "base", "blast", "sei", "zora", "sepolia", "rinkeby", "mumbai", "amoy", "baobab", "bsctestnet", "goerli", "soldev", "arbitrum_goerli", "arbitrum_sepolia", "avalanche_fuji", "optimism_goerli", "optimism_sepolia", "base_goerli", "base_sepolia", "blast_sepolia", "gunzilla_testnet", "sei_devnet", "zora_testnet", "zora_sepolia"];
                                };
                                readonly protocol_address: {
                                    readonly title: "Protocol Address";
                                    readonly description: "Exchange contract address which fulfilled the order";
                                    readonly type: "string";
                                };
                                readonly closing_date: {
                                    readonly title: "Closing Date";
                                    readonly description: "The Posix timestamp at which the transaction which filled the order occurred";
                                    readonly type: "integer";
                                };
                                readonly nft: {
                                    readonly title: "Nft";
                                    readonly description: "The NFT which was sold.";
                                    readonly type: "object";
                                    readonly required: readonly ["identifier", "collection", "contract", "token_standard", "name", "description", "updated_at", "is_disabled", "is_nsfw"];
                                    readonly properties: {
                                        readonly identifier: {
                                            readonly title: "Identifier";
                                            readonly description: "The NFT's unique identifier within the smart contract (also referred to as token_id)";
                                            readonly type: "string";
                                        };
                                        readonly collection: {
                                            readonly title: "Collection";
                                            readonly description: "Collection slug. A unique string to identify a collection on OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly contract: {
                                            readonly title: "Contract";
                                            readonly description: "The public blockchain address of the contract";
                                            readonly type: "string";
                                        };
                                        readonly token_standard: {
                                            readonly title: "Token Standard";
                                            readonly description: "ERC standard of the token (erc721, erc1155)";
                                            readonly type: "string";
                                        };
                                        readonly name: {
                                            readonly title: "Name";
                                            readonly description: "Name of the NFT";
                                            readonly type: "string";
                                        };
                                        readonly description: {
                                            readonly title: "Description";
                                            readonly description: "Description of the NFT";
                                            readonly type: "string";
                                        };
                                        readonly image_url: {
                                            readonly title: "Image Url";
                                            readonly description: "Link to the image associated with the NFT";
                                            readonly type: "string";
                                        };
                                        readonly metadata_url: {
                                            readonly title: "Metadata Url";
                                            readonly description: "Link to the offchain metadata store";
                                            readonly type: "string";
                                        };
                                        readonly opensea_url: {
                                            readonly title: "Opensea Url";
                                            readonly description: "Link to the NFT on OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly updated_at: {
                                            readonly title: "Updated At";
                                            readonly description: "Last time that the NFT's metadata was updated by OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly is_disabled: {
                                            readonly title: "Is Disabled";
                                            readonly description: "If the item is currently able to be bought or sold using OpenSea";
                                            readonly type: "boolean";
                                        };
                                        readonly is_nsfw: {
                                            readonly title: "Is Nsfw";
                                            readonly description: "If the item is currently classified as 'Not Safe for Work' by OpenSea as defined in [OpenSea's NSFW Policy](https://support.opensea.io/hc/articles/9729972510995).";
                                            readonly type: "boolean";
                                        };
                                    };
                                };
                                readonly quantity: {
                                    readonly title: "Quantity";
                                    readonly description: "Number of assets transferred";
                                    readonly type: "integer";
                                };
                                readonly seller: {
                                    readonly title: "Seller";
                                    readonly description: "Seller of the NFT";
                                    readonly type: "string";
                                };
                                readonly buyer: {
                                    readonly title: "Buyer";
                                    readonly description: "Buyer of the NFT";
                                    readonly type: "string";
                                };
                                readonly payment: {
                                    readonly title: "Information about the payment";
                                    readonly type: "object";
                                    readonly required: readonly ["quantity", "token_address", "decimals", "symbol"];
                                    readonly properties: {
                                        readonly quantity: {
                                            readonly title: "Quantity";
                                            readonly description: "Amount of tokens in the order. Defaults to 0 if quantity can not be determined.";
                                            readonly type: "string";
                                        };
                                        readonly token_address: {
                                            readonly title: "Token Address";
                                            readonly description: "The contract address for the ERC20 token";
                                            readonly type: "string";
                                        };
                                        readonly decimals: {
                                            readonly title: "Decimals";
                                            readonly description: "Returns the number of decimals the token uses - e.g. 8, means to divide the token amount by 100000000 to get its user representation.";
                                            readonly type: "integer";
                                        };
                                        readonly symbol: {
                                            readonly title: "Symbol";
                                            readonly description: "Returns the symbol of the token, e.g. ETH, WETH, USDC, etc";
                                            readonly type: "string";
                                        };
                                    };
                                };
                                readonly transaction: {
                                    readonly title: "Transaction";
                                    readonly description: "Transaction hash for the order fulfillment";
                                    readonly type: "string";
                                };
                                readonly event_timestamp: {
                                    readonly title: "Event Timestamp";
                                    readonly description: "The Posix timestamp at which the event occurred";
                                    readonly type: "integer";
                                };
                            };
                            readonly required: readonly ["order_hash", "chain", "protocol_address", "closing_date", "nft", "quantity", "seller", "buyer", "payment", "transaction", "event_timestamp"];
                        }, {
                            readonly title: "TransferEventModel";
                            readonly type: "object";
                            readonly properties: {
                                readonly event_type: {
                                    readonly title: "Event Type";
                                    readonly default: "transfer";
                                    readonly enum: readonly ["transfer"];
                                    readonly type: "string";
                                    readonly description: "`transfer`";
                                };
                                readonly chain: {
                                    readonly description: "OpenSea supported chains.";
                                    readonly title: "ChainIdentifier";
                                    readonly enum: readonly ["ethereum", "matic", "klaytn", "bsc", "solana", "arbitrum", "arbitrum_nova", "avalanche", "optimism", "base", "blast", "sei", "zora", "sepolia", "rinkeby", "mumbai", "amoy", "baobab", "bsctestnet", "goerli", "soldev", "arbitrum_goerli", "arbitrum_sepolia", "avalanche_fuji", "optimism_goerli", "optimism_sepolia", "base_goerli", "base_sepolia", "blast_sepolia", "gunzilla_testnet", "sei_devnet", "zora_testnet", "zora_sepolia"];
                                };
                                readonly transaction: {
                                    readonly title: "Transaction";
                                    readonly description: "Transaction hash for the transfer";
                                    readonly type: "string";
                                };
                                readonly from_address: {
                                    readonly title: "From Address";
                                    readonly description: "Address of the sender";
                                    readonly type: "string";
                                };
                                readonly to_address: {
                                    readonly title: "To Address";
                                    readonly description: "Address of the recipient";
                                    readonly type: "string";
                                };
                                readonly quantity: {
                                    readonly title: "Quantity";
                                    readonly description: "Number of assets transferred";
                                    readonly type: "integer";
                                };
                                readonly nft: {
                                    readonly title: "Nft";
                                    readonly description: "The NFT which was transferred";
                                    readonly type: "object";
                                    readonly required: readonly ["identifier", "collection", "contract", "token_standard", "name", "description", "updated_at", "is_disabled", "is_nsfw"];
                                    readonly properties: {
                                        readonly identifier: {
                                            readonly title: "Identifier";
                                            readonly description: "The NFT's unique identifier within the smart contract (also referred to as token_id)";
                                            readonly type: "string";
                                        };
                                        readonly collection: {
                                            readonly title: "Collection";
                                            readonly description: "Collection slug. A unique string to identify a collection on OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly contract: {
                                            readonly title: "Contract";
                                            readonly description: "The public blockchain address of the contract";
                                            readonly type: "string";
                                        };
                                        readonly token_standard: {
                                            readonly title: "Token Standard";
                                            readonly description: "ERC standard of the token (erc721, erc1155)";
                                            readonly type: "string";
                                        };
                                        readonly name: {
                                            readonly title: "Name";
                                            readonly description: "Name of the NFT";
                                            readonly type: "string";
                                        };
                                        readonly description: {
                                            readonly title: "Description";
                                            readonly description: "Description of the NFT";
                                            readonly type: "string";
                                        };
                                        readonly image_url: {
                                            readonly title: "Image Url";
                                            readonly description: "Link to the image associated with the NFT";
                                            readonly type: "string";
                                        };
                                        readonly metadata_url: {
                                            readonly title: "Metadata Url";
                                            readonly description: "Link to the offchain metadata store";
                                            readonly type: "string";
                                        };
                                        readonly opensea_url: {
                                            readonly title: "Opensea Url";
                                            readonly description: "Link to the NFT on OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly updated_at: {
                                            readonly title: "Updated At";
                                            readonly description: "Last time that the NFT's metadata was updated by OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly is_disabled: {
                                            readonly title: "Is Disabled";
                                            readonly description: "If the item is currently able to be bought or sold using OpenSea";
                                            readonly type: "boolean";
                                        };
                                        readonly is_nsfw: {
                                            readonly title: "Is Nsfw";
                                            readonly description: "If the item is currently classified as 'Not Safe for Work' by OpenSea as defined in [OpenSea's NSFW Policy](https://support.opensea.io/hc/articles/9729972510995).";
                                            readonly type: "boolean";
                                        };
                                    };
                                };
                                readonly event_timestamp: {
                                    readonly title: "Event Timestamp";
                                    readonly description: "The Posix timestamp at which the event occurred";
                                    readonly type: "integer";
                                };
                            };
                            readonly required: readonly ["chain", "transaction", "from_address", "to_address", "quantity", "nft", "event_timestamp"];
                        }, {
                            readonly title: "RedemptionEventModel";
                            readonly type: "object";
                            readonly properties: {
                                readonly event_type: {
                                    readonly title: "Event Type";
                                    readonly default: "redemption";
                                    readonly enum: readonly ["redemption"];
                                    readonly type: "string";
                                    readonly description: "`redemption`";
                                };
                                readonly chain: {
                                    readonly description: "OpenSea supported chains.";
                                    readonly title: "ChainIdentifier";
                                    readonly enum: readonly ["ethereum", "matic", "klaytn", "bsc", "solana", "arbitrum", "arbitrum_nova", "avalanche", "optimism", "base", "blast", "sei", "zora", "sepolia", "rinkeby", "mumbai", "amoy", "baobab", "bsctestnet", "goerli", "soldev", "arbitrum_goerli", "arbitrum_sepolia", "avalanche_fuji", "optimism_goerli", "optimism_sepolia", "base_goerli", "base_sepolia", "blast_sepolia", "gunzilla_testnet", "sei_devnet", "zora_testnet", "zora_sepolia"];
                                };
                                readonly from_address: {
                                    readonly title: "From Address";
                                    readonly description: "Address of the sender";
                                    readonly type: "string";
                                };
                                readonly to_address: {
                                    readonly title: "To Address";
                                    readonly description: "Address of the recipient";
                                    readonly type: "string";
                                };
                                readonly asset: {
                                    readonly title: "Asset";
                                    readonly description: "The asset being redeemed.";
                                    readonly type: "object";
                                    readonly required: readonly ["identifier", "collection", "contract", "token_standard", "name", "description", "updated_at", "is_disabled", "is_nsfw"];
                                    readonly properties: {
                                        readonly identifier: {
                                            readonly title: "Identifier";
                                            readonly description: "The NFT's unique identifier within the smart contract (also referred to as token_id)";
                                            readonly type: "string";
                                        };
                                        readonly collection: {
                                            readonly title: "Collection";
                                            readonly description: "Collection slug. A unique string to identify a collection on OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly contract: {
                                            readonly title: "Contract";
                                            readonly description: "The public blockchain address of the contract";
                                            readonly type: "string";
                                        };
                                        readonly token_standard: {
                                            readonly title: "Token Standard";
                                            readonly description: "ERC standard of the token (erc721, erc1155)";
                                            readonly type: "string";
                                        };
                                        readonly name: {
                                            readonly title: "Name";
                                            readonly description: "Name of the NFT";
                                            readonly type: "string";
                                        };
                                        readonly description: {
                                            readonly title: "Description";
                                            readonly description: "Description of the NFT";
                                            readonly type: "string";
                                        };
                                        readonly image_url: {
                                            readonly title: "Image Url";
                                            readonly description: "Link to the image associated with the NFT";
                                            readonly type: "string";
                                        };
                                        readonly metadata_url: {
                                            readonly title: "Metadata Url";
                                            readonly description: "Link to the offchain metadata store";
                                            readonly type: "string";
                                        };
                                        readonly opensea_url: {
                                            readonly title: "Opensea Url";
                                            readonly description: "Link to the NFT on OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly updated_at: {
                                            readonly title: "Updated At";
                                            readonly description: "Last time that the NFT's metadata was updated by OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly is_disabled: {
                                            readonly title: "Is Disabled";
                                            readonly description: "If the item is currently able to be bought or sold using OpenSea";
                                            readonly type: "boolean";
                                        };
                                        readonly is_nsfw: {
                                            readonly title: "Is Nsfw";
                                            readonly description: "If the item is currently classified as 'Not Safe for Work' by OpenSea as defined in [OpenSea's NSFW Policy](https://support.opensea.io/hc/articles/9729972510995).";
                                            readonly type: "boolean";
                                        };
                                    };
                                };
                                readonly quantity: {
                                    readonly title: "Quantity";
                                    readonly description: "Number of assets redeemed";
                                    readonly type: "integer";
                                };
                                readonly transaction: {
                                    readonly title: "Transaction";
                                    readonly description: "Transaction hash for the redemption";
                                    readonly type: "string";
                                };
                                readonly event_timestamp: {
                                    readonly title: "Event Timestamp";
                                    readonly description: "The Posix timestamp at which the event occurred";
                                    readonly type: "integer";
                                };
                            };
                            readonly required: readonly ["chain", "from_address", "to_address", "asset", "quantity", "transaction", "event_timestamp"];
                        }];
                    };
                };
                readonly next: {
                    readonly title: "Next";
                    readonly description: "Cursor for the next page of results";
                    readonly type: "string";
                };
            };
            readonly required: readonly ["asset_events", "next"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const ListEventsByNft: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly address: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The public blockchain address.";
                };
                readonly chain: {
                    readonly type: "string";
                    readonly enum: readonly ["amoy", "arbitrum", "arbitrum_nova", "arbitrum_sepolia", "avalanche", "avalanche_fuji", "baobab", "base", "base_sepolia", "blast", "blast_sepolia", "bsc", "bsctestnet", "ethereum", "klaytn", "matic", "mumbai", "optimism", "optimism_sepolia", "sepolia", "solana", "soldev", "zora", "zora_sepolia"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The blockchain on which to filter the results.";
                };
                readonly identifier: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The NFT token id.";
                };
            };
            readonly required: readonly ["address", "chain", "identifier"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly after: {
                    readonly type: "number";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Filter to only include events that occurred at or after the given timestamp. The Unix epoch timstamp must be in seconds";
                };
                readonly before: {
                    readonly type: "number";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Filter to only include events that occurred before the given timestamp. The Unix epoch timstamp must be in seconds.";
                };
                readonly event_type: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "string";
                        readonly enum: readonly ["all", "cancel", "listing", "offer", "order", "redemption", "sale", "transfer"];
                    };
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The type of event to filter by. If not provided, only sales will be returned.";
                };
                readonly limit: {
                    readonly type: "integer";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The number of events to return. Must be between 1 and 50. Default: 50";
                };
                readonly next: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The cursor for the next page of results. This is returned from a previous request.";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "ListEventsResponse";
            readonly type: "object";
            readonly properties: {
                readonly asset_events: {
                    readonly title: "Events";
                    readonly type: "array";
                    readonly items: {
                        readonly anyOf: readonly [{
                            readonly title: "CancelEventModel";
                            readonly type: "object";
                            readonly properties: {
                                readonly event_type: {
                                    readonly title: "Event Type";
                                    readonly default: "cancel";
                                    readonly enum: readonly ["cancel"];
                                    readonly type: "string";
                                    readonly description: "`cancel`";
                                };
                                readonly order_hash: {
                                    readonly title: "Order Hash";
                                    readonly description: "Order hash for the order which was cancelled";
                                    readonly type: "string";
                                };
                                readonly order_type: {
                                    readonly description: "An enumeration.";
                                    readonly title: "APIOrderType";
                                    readonly enum: readonly ["listing", "auction", "item_offer", "collection_offer", "trait_offer"];
                                };
                                readonly maker: {
                                    readonly title: "Maker";
                                    readonly description: "Maker of the original order";
                                    readonly type: "string";
                                };
                                readonly chain: {
                                    readonly description: "OpenSea supported chains.";
                                    readonly title: "ChainIdentifier";
                                    readonly enum: readonly ["ethereum", "matic", "klaytn", "bsc", "solana", "arbitrum", "arbitrum_nova", "avalanche", "optimism", "base", "blast", "sei", "zora", "sepolia", "rinkeby", "mumbai", "amoy", "baobab", "bsctestnet", "goerli", "soldev", "arbitrum_goerli", "arbitrum_sepolia", "avalanche_fuji", "optimism_goerli", "optimism_sepolia", "base_goerli", "base_sepolia", "blast_sepolia", "gunzilla_testnet", "sei_devnet", "zora_testnet", "zora_sepolia"];
                                };
                                readonly event_timestamp: {
                                    readonly title: "Event Timestamp";
                                    readonly description: "The Posix timestamp at which the event occurred";
                                    readonly type: "integer";
                                };
                                readonly nft: {
                                    readonly title: "Nft";
                                    readonly description: "The NFT which was cancelled";
                                    readonly type: "object";
                                    readonly required: readonly ["identifier", "collection", "contract", "token_standard", "name", "description", "updated_at", "is_disabled", "is_nsfw"];
                                    readonly properties: {
                                        readonly identifier: {
                                            readonly title: "Identifier";
                                            readonly description: "The NFT's unique identifier within the smart contract (also referred to as token_id)";
                                            readonly type: "string";
                                        };
                                        readonly collection: {
                                            readonly title: "Collection";
                                            readonly description: "Collection slug. A unique string to identify a collection on OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly contract: {
                                            readonly title: "Contract";
                                            readonly description: "The public blockchain address of the contract";
                                            readonly type: "string";
                                        };
                                        readonly token_standard: {
                                            readonly title: "Token Standard";
                                            readonly description: "ERC standard of the token (erc721, erc1155)";
                                            readonly type: "string";
                                        };
                                        readonly name: {
                                            readonly title: "Name";
                                            readonly description: "Name of the NFT";
                                            readonly type: "string";
                                        };
                                        readonly description: {
                                            readonly title: "Description";
                                            readonly description: "Description of the NFT";
                                            readonly type: "string";
                                        };
                                        readonly image_url: {
                                            readonly title: "Image Url";
                                            readonly description: "Link to the image associated with the NFT";
                                            readonly type: "string";
                                        };
                                        readonly metadata_url: {
                                            readonly title: "Metadata Url";
                                            readonly description: "Link to the offchain metadata store";
                                            readonly type: "string";
                                        };
                                        readonly opensea_url: {
                                            readonly title: "Opensea Url";
                                            readonly description: "Link to the NFT on OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly updated_at: {
                                            readonly title: "Updated At";
                                            readonly description: "Last time that the NFT's metadata was updated by OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly is_disabled: {
                                            readonly title: "Is Disabled";
                                            readonly description: "If the item is currently able to be bought or sold using OpenSea";
                                            readonly type: "boolean";
                                        };
                                        readonly is_nsfw: {
                                            readonly title: "Is Nsfw";
                                            readonly description: "If the item is currently classified as 'Not Safe for Work' by OpenSea as defined in [OpenSea's NSFW Policy](https://support.opensea.io/hc/articles/9729972510995).";
                                            readonly type: "boolean";
                                        };
                                    };
                                };
                            };
                            readonly required: readonly ["order_hash", "order_type", "maker", "chain", "event_timestamp", "nft"];
                        }, {
                            readonly title: "OrderEventModel";
                            readonly type: "object";
                            readonly properties: {
                                readonly event_type: {
                                    readonly title: "Event Type";
                                    readonly default: "order";
                                    readonly enum: readonly ["order"];
                                    readonly type: "string";
                                    readonly description: "`order`";
                                };
                                readonly order_hash: {
                                    readonly title: "Order Hash";
                                    readonly description: "Order hash for the newly created order";
                                    readonly type: "string";
                                };
                                readonly order_type: {
                                    readonly title: "APIOrderType";
                                    readonly description: "An enumeration.\n\n`listing` `auction` `item_offer` `collection_offer` `trait_offer`";
                                    readonly enum: readonly ["listing", "auction", "item_offer", "collection_offer", "trait_offer"];
                                    readonly properties: {};
                                    readonly type: "object";
                                };
                                readonly chain: {
                                    readonly description: "OpenSea supported chains.";
                                    readonly title: "ChainIdentifier";
                                    readonly enum: readonly ["ethereum", "matic", "klaytn", "bsc", "solana", "arbitrum", "arbitrum_nova", "avalanche", "optimism", "base", "blast", "sei", "zora", "sepolia", "rinkeby", "mumbai", "amoy", "baobab", "bsctestnet", "goerli", "soldev", "arbitrum_goerli", "arbitrum_sepolia", "avalanche_fuji", "optimism_goerli", "optimism_sepolia", "base_goerli", "base_sepolia", "blast_sepolia", "gunzilla_testnet", "sei_devnet", "zora_testnet", "zora_sepolia"];
                                };
                                readonly protocol_address: {
                                    readonly title: "Protocol Address";
                                    readonly description: "Exchange contract address for the order";
                                    readonly type: "string";
                                };
                                readonly start_date: {
                                    readonly title: "Start Date";
                                    readonly description: "The Posix timestamp at which the order was created";
                                    readonly type: "integer";
                                };
                                readonly expiration_date: {
                                    readonly title: "Expiration Date";
                                    readonly description: "The Posix timestamp at which the order will close. When no expiration date is set, this value will be 0.";
                                    readonly type: "integer";
                                };
                                readonly asset: {
                                    readonly title: "Asset";
                                    readonly description: "The nft being listed or bid on. Empty object for collection or trait offers.";
                                    readonly type: "object";
                                    readonly required: readonly ["identifier", "collection", "contract", "token_standard", "name", "description", "updated_at", "is_disabled", "is_nsfw"];
                                    readonly properties: {
                                        readonly identifier: {
                                            readonly title: "Identifier";
                                            readonly description: "The NFT's unique identifier within the smart contract (also referred to as token_id)";
                                            readonly type: "string";
                                        };
                                        readonly collection: {
                                            readonly title: "Collection";
                                            readonly description: "Collection slug. A unique string to identify a collection on OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly contract: {
                                            readonly title: "Contract";
                                            readonly description: "The public blockchain address of the contract";
                                            readonly type: "string";
                                        };
                                        readonly token_standard: {
                                            readonly title: "Token Standard";
                                            readonly description: "ERC standard of the token (erc721, erc1155)";
                                            readonly type: "string";
                                        };
                                        readonly name: {
                                            readonly title: "Name";
                                            readonly description: "Name of the NFT";
                                            readonly type: "string";
                                        };
                                        readonly description: {
                                            readonly title: "Description";
                                            readonly description: "Description of the NFT";
                                            readonly type: "string";
                                        };
                                        readonly image_url: {
                                            readonly title: "Image Url";
                                            readonly description: "Link to the image associated with the NFT";
                                            readonly type: "string";
                                        };
                                        readonly metadata_url: {
                                            readonly title: "Metadata Url";
                                            readonly description: "Link to the offchain metadata store";
                                            readonly type: "string";
                                        };
                                        readonly opensea_url: {
                                            readonly title: "Opensea Url";
                                            readonly description: "Link to the NFT on OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly updated_at: {
                                            readonly title: "Updated At";
                                            readonly description: "Last time that the NFT's metadata was updated by OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly is_disabled: {
                                            readonly title: "Is Disabled";
                                            readonly description: "If the item is currently able to be bought or sold using OpenSea";
                                            readonly type: "boolean";
                                        };
                                        readonly is_nsfw: {
                                            readonly title: "Is Nsfw";
                                            readonly description: "If the item is currently classified as 'Not Safe for Work' by OpenSea as defined in [OpenSea's NSFW Policy](https://support.opensea.io/hc/articles/9729972510995).";
                                            readonly type: "boolean";
                                        };
                                    };
                                };
                                readonly quantity: {
                                    readonly title: "Quantity";
                                    readonly description: "Number of assets in the order";
                                    readonly type: "integer";
                                };
                                readonly maker: {
                                    readonly title: "Maker";
                                    readonly description: "Maker of the order";
                                    readonly type: "string";
                                };
                                readonly taker: {
                                    readonly title: "Taker";
                                    readonly description: "Taker of the order. This will only be set for private listings.";
                                    readonly type: "string";
                                };
                                readonly payment: {
                                    readonly title: "Information about the payment";
                                    readonly type: "object";
                                    readonly required: readonly ["quantity", "token_address", "decimals", "symbol"];
                                    readonly properties: {
                                        readonly quantity: {
                                            readonly title: "Quantity";
                                            readonly description: "Amount of tokens in the order. Defaults to 0 if quantity can not be determined.";
                                            readonly type: "string";
                                        };
                                        readonly token_address: {
                                            readonly title: "Token Address";
                                            readonly description: "The contract address for the ERC20 token";
                                            readonly type: "string";
                                        };
                                        readonly decimals: {
                                            readonly title: "Decimals";
                                            readonly description: "Returns the number of decimals the token uses - e.g. 8, means to divide the token amount by 100000000 to get its user representation.";
                                            readonly type: "integer";
                                        };
                                        readonly symbol: {
                                            readonly title: "Symbol";
                                            readonly description: "Returns the symbol of the token, e.g. ETH, WETH, USDC, etc";
                                            readonly type: "string";
                                        };
                                    };
                                };
                                readonly criteria: {
                                    readonly title: "Criteria";
                                    readonly description: "For collection and trait offers, this object will contain the criteria needed to fulfill the offer.";
                                    readonly anyOf: readonly [{
                                        readonly title: "Criteria";
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly collection: {
                                                readonly title: "Collection";
                                                readonly description: "The collection in which the criteria offer is being made for.";
                                                readonly type: "object";
                                                readonly required: readonly ["slug"];
                                                readonly properties: {
                                                    readonly slug: {
                                                        readonly title: "Slug";
                                                        readonly description: "Unique string to identify a collection on OpenSea. This can be found by visiting the collection on the OpenSea website and noting the last path parameter.";
                                                        readonly type: "string";
                                                    };
                                                };
                                            };
                                            readonly contract: {
                                                readonly title: "Contract";
                                                readonly description: "The public blockchain address of the NFT contract";
                                                readonly type: "object";
                                                readonly required: readonly ["address"];
                                                readonly properties: {
                                                    readonly address: {
                                                        readonly title: "Address";
                                                        readonly type: "string";
                                                    };
                                                };
                                            };
                                            readonly trait: {
                                                readonly title: "Trait";
                                                readonly description: "The trait that the criteria offer is being made for.";
                                                readonly type: "object";
                                                readonly required: readonly ["type", "value"];
                                                readonly properties: {
                                                    readonly type: {
                                                        readonly title: "Type";
                                                        readonly type: "string";
                                                    };
                                                    readonly value: {
                                                        readonly title: "Value";
                                                        readonly type: "string";
                                                    };
                                                };
                                            };
                                            readonly encoded_token_ids: {
                                                readonly title: "Encoded Token Ids";
                                                readonly description: "Represents a list of token ids which can be used to fulfill the criteria offer. When decoded using the provided SDK function, developers can now see a list of all tokens that could be used to fulfill the offer.";
                                                readonly type: "string";
                                            };
                                        };
                                        readonly required: readonly ["collection", "contract"];
                                    }, {
                                        readonly type: "object";
                                        readonly additionalProperties: true;
                                    }];
                                };
                                readonly event_timestamp: {
                                    readonly title: "Event Timestamp";
                                    readonly description: "The Posix timestamp at which the event occurred";
                                    readonly type: "integer";
                                };
                                readonly is_private_listing: {
                                    readonly title: "Is Private Listing";
                                    readonly description: "Whether the order is a private listing";
                                    readonly type: "boolean";
                                };
                            };
                            readonly required: readonly ["order_hash", "chain", "protocol_address", "start_date", "expiration_date", "asset", "quantity", "maker", "taker", "payment", "criteria", "event_timestamp", "is_private_listing"];
                        }, {
                            readonly title: "SaleEventModel";
                            readonly type: "object";
                            readonly properties: {
                                readonly event_type: {
                                    readonly title: "Event Type";
                                    readonly default: "sale";
                                    readonly enum: readonly ["sale"];
                                    readonly type: "string";
                                    readonly description: "`sale`";
                                };
                                readonly order_hash: {
                                    readonly title: "Order Hash";
                                    readonly description: "Order hash for the order which was fulfilled";
                                    readonly type: "string";
                                };
                                readonly chain: {
                                    readonly description: "OpenSea supported chains.";
                                    readonly title: "ChainIdentifier";
                                    readonly enum: readonly ["ethereum", "matic", "klaytn", "bsc", "solana", "arbitrum", "arbitrum_nova", "avalanche", "optimism", "base", "blast", "sei", "zora", "sepolia", "rinkeby", "mumbai", "amoy", "baobab", "bsctestnet", "goerli", "soldev", "arbitrum_goerli", "arbitrum_sepolia", "avalanche_fuji", "optimism_goerli", "optimism_sepolia", "base_goerli", "base_sepolia", "blast_sepolia", "gunzilla_testnet", "sei_devnet", "zora_testnet", "zora_sepolia"];
                                };
                                readonly protocol_address: {
                                    readonly title: "Protocol Address";
                                    readonly description: "Exchange contract address which fulfilled the order";
                                    readonly type: "string";
                                };
                                readonly closing_date: {
                                    readonly title: "Closing Date";
                                    readonly description: "The Posix timestamp at which the transaction which filled the order occurred";
                                    readonly type: "integer";
                                };
                                readonly nft: {
                                    readonly title: "Nft";
                                    readonly description: "The NFT which was sold.";
                                    readonly type: "object";
                                    readonly required: readonly ["identifier", "collection", "contract", "token_standard", "name", "description", "updated_at", "is_disabled", "is_nsfw"];
                                    readonly properties: {
                                        readonly identifier: {
                                            readonly title: "Identifier";
                                            readonly description: "The NFT's unique identifier within the smart contract (also referred to as token_id)";
                                            readonly type: "string";
                                        };
                                        readonly collection: {
                                            readonly title: "Collection";
                                            readonly description: "Collection slug. A unique string to identify a collection on OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly contract: {
                                            readonly title: "Contract";
                                            readonly description: "The public blockchain address of the contract";
                                            readonly type: "string";
                                        };
                                        readonly token_standard: {
                                            readonly title: "Token Standard";
                                            readonly description: "ERC standard of the token (erc721, erc1155)";
                                            readonly type: "string";
                                        };
                                        readonly name: {
                                            readonly title: "Name";
                                            readonly description: "Name of the NFT";
                                            readonly type: "string";
                                        };
                                        readonly description: {
                                            readonly title: "Description";
                                            readonly description: "Description of the NFT";
                                            readonly type: "string";
                                        };
                                        readonly image_url: {
                                            readonly title: "Image Url";
                                            readonly description: "Link to the image associated with the NFT";
                                            readonly type: "string";
                                        };
                                        readonly metadata_url: {
                                            readonly title: "Metadata Url";
                                            readonly description: "Link to the offchain metadata store";
                                            readonly type: "string";
                                        };
                                        readonly opensea_url: {
                                            readonly title: "Opensea Url";
                                            readonly description: "Link to the NFT on OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly updated_at: {
                                            readonly title: "Updated At";
                                            readonly description: "Last time that the NFT's metadata was updated by OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly is_disabled: {
                                            readonly title: "Is Disabled";
                                            readonly description: "If the item is currently able to be bought or sold using OpenSea";
                                            readonly type: "boolean";
                                        };
                                        readonly is_nsfw: {
                                            readonly title: "Is Nsfw";
                                            readonly description: "If the item is currently classified as 'Not Safe for Work' by OpenSea as defined in [OpenSea's NSFW Policy](https://support.opensea.io/hc/articles/9729972510995).";
                                            readonly type: "boolean";
                                        };
                                    };
                                };
                                readonly quantity: {
                                    readonly title: "Quantity";
                                    readonly description: "Number of assets transferred";
                                    readonly type: "integer";
                                };
                                readonly seller: {
                                    readonly title: "Seller";
                                    readonly description: "Seller of the NFT";
                                    readonly type: "string";
                                };
                                readonly buyer: {
                                    readonly title: "Buyer";
                                    readonly description: "Buyer of the NFT";
                                    readonly type: "string";
                                };
                                readonly payment: {
                                    readonly title: "Information about the payment";
                                    readonly type: "object";
                                    readonly required: readonly ["quantity", "token_address", "decimals", "symbol"];
                                    readonly properties: {
                                        readonly quantity: {
                                            readonly title: "Quantity";
                                            readonly description: "Amount of tokens in the order. Defaults to 0 if quantity can not be determined.";
                                            readonly type: "string";
                                        };
                                        readonly token_address: {
                                            readonly title: "Token Address";
                                            readonly description: "The contract address for the ERC20 token";
                                            readonly type: "string";
                                        };
                                        readonly decimals: {
                                            readonly title: "Decimals";
                                            readonly description: "Returns the number of decimals the token uses - e.g. 8, means to divide the token amount by 100000000 to get its user representation.";
                                            readonly type: "integer";
                                        };
                                        readonly symbol: {
                                            readonly title: "Symbol";
                                            readonly description: "Returns the symbol of the token, e.g. ETH, WETH, USDC, etc";
                                            readonly type: "string";
                                        };
                                    };
                                };
                                readonly transaction: {
                                    readonly title: "Transaction";
                                    readonly description: "Transaction hash for the order fulfillment";
                                    readonly type: "string";
                                };
                                readonly event_timestamp: {
                                    readonly title: "Event Timestamp";
                                    readonly description: "The Posix timestamp at which the event occurred";
                                    readonly type: "integer";
                                };
                            };
                            readonly required: readonly ["order_hash", "chain", "protocol_address", "closing_date", "nft", "quantity", "seller", "buyer", "payment", "transaction", "event_timestamp"];
                        }, {
                            readonly title: "TransferEventModel";
                            readonly type: "object";
                            readonly properties: {
                                readonly event_type: {
                                    readonly title: "Event Type";
                                    readonly default: "transfer";
                                    readonly enum: readonly ["transfer"];
                                    readonly type: "string";
                                    readonly description: "`transfer`";
                                };
                                readonly chain: {
                                    readonly description: "OpenSea supported chains.";
                                    readonly title: "ChainIdentifier";
                                    readonly enum: readonly ["ethereum", "matic", "klaytn", "bsc", "solana", "arbitrum", "arbitrum_nova", "avalanche", "optimism", "base", "blast", "sei", "zora", "sepolia", "rinkeby", "mumbai", "amoy", "baobab", "bsctestnet", "goerli", "soldev", "arbitrum_goerli", "arbitrum_sepolia", "avalanche_fuji", "optimism_goerli", "optimism_sepolia", "base_goerli", "base_sepolia", "blast_sepolia", "gunzilla_testnet", "sei_devnet", "zora_testnet", "zora_sepolia"];
                                };
                                readonly transaction: {
                                    readonly title: "Transaction";
                                    readonly description: "Transaction hash for the transfer";
                                    readonly type: "string";
                                };
                                readonly from_address: {
                                    readonly title: "From Address";
                                    readonly description: "Address of the sender";
                                    readonly type: "string";
                                };
                                readonly to_address: {
                                    readonly title: "To Address";
                                    readonly description: "Address of the recipient";
                                    readonly type: "string";
                                };
                                readonly quantity: {
                                    readonly title: "Quantity";
                                    readonly description: "Number of assets transferred";
                                    readonly type: "integer";
                                };
                                readonly nft: {
                                    readonly title: "Nft";
                                    readonly description: "The NFT which was transferred";
                                    readonly type: "object";
                                    readonly required: readonly ["identifier", "collection", "contract", "token_standard", "name", "description", "updated_at", "is_disabled", "is_nsfw"];
                                    readonly properties: {
                                        readonly identifier: {
                                            readonly title: "Identifier";
                                            readonly description: "The NFT's unique identifier within the smart contract (also referred to as token_id)";
                                            readonly type: "string";
                                        };
                                        readonly collection: {
                                            readonly title: "Collection";
                                            readonly description: "Collection slug. A unique string to identify a collection on OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly contract: {
                                            readonly title: "Contract";
                                            readonly description: "The public blockchain address of the contract";
                                            readonly type: "string";
                                        };
                                        readonly token_standard: {
                                            readonly title: "Token Standard";
                                            readonly description: "ERC standard of the token (erc721, erc1155)";
                                            readonly type: "string";
                                        };
                                        readonly name: {
                                            readonly title: "Name";
                                            readonly description: "Name of the NFT";
                                            readonly type: "string";
                                        };
                                        readonly description: {
                                            readonly title: "Description";
                                            readonly description: "Description of the NFT";
                                            readonly type: "string";
                                        };
                                        readonly image_url: {
                                            readonly title: "Image Url";
                                            readonly description: "Link to the image associated with the NFT";
                                            readonly type: "string";
                                        };
                                        readonly metadata_url: {
                                            readonly title: "Metadata Url";
                                            readonly description: "Link to the offchain metadata store";
                                            readonly type: "string";
                                        };
                                        readonly opensea_url: {
                                            readonly title: "Opensea Url";
                                            readonly description: "Link to the NFT on OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly updated_at: {
                                            readonly title: "Updated At";
                                            readonly description: "Last time that the NFT's metadata was updated by OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly is_disabled: {
                                            readonly title: "Is Disabled";
                                            readonly description: "If the item is currently able to be bought or sold using OpenSea";
                                            readonly type: "boolean";
                                        };
                                        readonly is_nsfw: {
                                            readonly title: "Is Nsfw";
                                            readonly description: "If the item is currently classified as 'Not Safe for Work' by OpenSea as defined in [OpenSea's NSFW Policy](https://support.opensea.io/hc/articles/9729972510995).";
                                            readonly type: "boolean";
                                        };
                                    };
                                };
                                readonly event_timestamp: {
                                    readonly title: "Event Timestamp";
                                    readonly description: "The Posix timestamp at which the event occurred";
                                    readonly type: "integer";
                                };
                            };
                            readonly required: readonly ["chain", "transaction", "from_address", "to_address", "quantity", "nft", "event_timestamp"];
                        }, {
                            readonly title: "RedemptionEventModel";
                            readonly type: "object";
                            readonly properties: {
                                readonly event_type: {
                                    readonly title: "Event Type";
                                    readonly default: "redemption";
                                    readonly enum: readonly ["redemption"];
                                    readonly type: "string";
                                    readonly description: "`redemption`";
                                };
                                readonly chain: {
                                    readonly description: "OpenSea supported chains.";
                                    readonly title: "ChainIdentifier";
                                    readonly enum: readonly ["ethereum", "matic", "klaytn", "bsc", "solana", "arbitrum", "arbitrum_nova", "avalanche", "optimism", "base", "blast", "sei", "zora", "sepolia", "rinkeby", "mumbai", "amoy", "baobab", "bsctestnet", "goerli", "soldev", "arbitrum_goerli", "arbitrum_sepolia", "avalanche_fuji", "optimism_goerli", "optimism_sepolia", "base_goerli", "base_sepolia", "blast_sepolia", "gunzilla_testnet", "sei_devnet", "zora_testnet", "zora_sepolia"];
                                };
                                readonly from_address: {
                                    readonly title: "From Address";
                                    readonly description: "Address of the sender";
                                    readonly type: "string";
                                };
                                readonly to_address: {
                                    readonly title: "To Address";
                                    readonly description: "Address of the recipient";
                                    readonly type: "string";
                                };
                                readonly asset: {
                                    readonly title: "Asset";
                                    readonly description: "The asset being redeemed.";
                                    readonly type: "object";
                                    readonly required: readonly ["identifier", "collection", "contract", "token_standard", "name", "description", "updated_at", "is_disabled", "is_nsfw"];
                                    readonly properties: {
                                        readonly identifier: {
                                            readonly title: "Identifier";
                                            readonly description: "The NFT's unique identifier within the smart contract (also referred to as token_id)";
                                            readonly type: "string";
                                        };
                                        readonly collection: {
                                            readonly title: "Collection";
                                            readonly description: "Collection slug. A unique string to identify a collection on OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly contract: {
                                            readonly title: "Contract";
                                            readonly description: "The public blockchain address of the contract";
                                            readonly type: "string";
                                        };
                                        readonly token_standard: {
                                            readonly title: "Token Standard";
                                            readonly description: "ERC standard of the token (erc721, erc1155)";
                                            readonly type: "string";
                                        };
                                        readonly name: {
                                            readonly title: "Name";
                                            readonly description: "Name of the NFT";
                                            readonly type: "string";
                                        };
                                        readonly description: {
                                            readonly title: "Description";
                                            readonly description: "Description of the NFT";
                                            readonly type: "string";
                                        };
                                        readonly image_url: {
                                            readonly title: "Image Url";
                                            readonly description: "Link to the image associated with the NFT";
                                            readonly type: "string";
                                        };
                                        readonly metadata_url: {
                                            readonly title: "Metadata Url";
                                            readonly description: "Link to the offchain metadata store";
                                            readonly type: "string";
                                        };
                                        readonly opensea_url: {
                                            readonly title: "Opensea Url";
                                            readonly description: "Link to the NFT on OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly updated_at: {
                                            readonly title: "Updated At";
                                            readonly description: "Last time that the NFT's metadata was updated by OpenSea";
                                            readonly type: "string";
                                        };
                                        readonly is_disabled: {
                                            readonly title: "Is Disabled";
                                            readonly description: "If the item is currently able to be bought or sold using OpenSea";
                                            readonly type: "boolean";
                                        };
                                        readonly is_nsfw: {
                                            readonly title: "Is Nsfw";
                                            readonly description: "If the item is currently classified as 'Not Safe for Work' by OpenSea as defined in [OpenSea's NSFW Policy](https://support.opensea.io/hc/articles/9729972510995).";
                                            readonly type: "boolean";
                                        };
                                    };
                                };
                                readonly quantity: {
                                    readonly title: "Quantity";
                                    readonly description: "Number of assets redeemed";
                                    readonly type: "integer";
                                };
                                readonly transaction: {
                                    readonly title: "Transaction";
                                    readonly description: "Transaction hash for the redemption";
                                    readonly type: "string";
                                };
                                readonly event_timestamp: {
                                    readonly title: "Event Timestamp";
                                    readonly description: "The Posix timestamp at which the event occurred";
                                    readonly type: "integer";
                                };
                            };
                            readonly required: readonly ["chain", "from_address", "to_address", "asset", "quantity", "transaction", "event_timestamp"];
                        }];
                    };
                };
                readonly next: {
                    readonly title: "Next";
                    readonly description: "Cursor for the next page of results";
                    readonly type: "string";
                };
            };
            readonly required: readonly ["asset_events", "next"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const ListNftsByAccount: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly address: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The public blockchain address.";
                };
                readonly chain: {
                    readonly type: "string";
                    readonly enum: readonly ["amoy", "arbitrum", "arbitrum_nova", "arbitrum_sepolia", "avalanche", "avalanche_fuji", "baobab", "base", "base_sepolia", "blast", "blast_sepolia", "bsc", "bsctestnet", "ethereum", "klaytn", "matic", "mumbai", "optimism", "optimism_sepolia", "sepolia", "solana", "soldev", "zora", "zora_sepolia"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The blockchain on which to filter the results.";
                };
            };
            readonly required: readonly ["address", "chain"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly collection: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Unique string to identify a collection on OpenSea. This can be found by visiting the collection on the OpenSea website and noting the last path parameter.";
                };
                readonly limit: {
                    readonly type: "integer";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The number of NFTs to return. Must be between 1 and 200. Default: 50";
                };
                readonly next: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The cursor for the next page of results. This is returned from a previous request.";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "ListNftsResponse";
            readonly type: "object";
            readonly properties: {
                readonly nfts: {
                    readonly title: "NFT";
                    readonly type: "array";
                    readonly items: {
                        readonly title: "NftModel";
                        readonly type: "object";
                        readonly properties: {
                            readonly identifier: {
                                readonly title: "Identifier";
                                readonly description: "The NFT's unique identifier within the smart contract (also referred to as token_id)";
                                readonly type: "string";
                            };
                            readonly collection: {
                                readonly title: "Collection";
                                readonly description: "Collection slug. A unique string to identify a collection on OpenSea";
                                readonly type: "string";
                            };
                            readonly contract: {
                                readonly title: "Contract";
                                readonly description: "The public blockchain address of the contract";
                                readonly type: "string";
                            };
                            readonly token_standard: {
                                readonly title: "Token Standard";
                                readonly description: "ERC standard of the token (erc721, erc1155)";
                                readonly type: "string";
                            };
                            readonly name: {
                                readonly title: "Name";
                                readonly description: "Name of the NFT";
                                readonly type: "string";
                            };
                            readonly description: {
                                readonly title: "Description";
                                readonly description: "Description of the NFT";
                                readonly type: "string";
                            };
                            readonly image_url: {
                                readonly title: "Image Url";
                                readonly description: "Link to the image associated with the NFT";
                                readonly type: "string";
                            };
                            readonly metadata_url: {
                                readonly title: "Metadata Url";
                                readonly description: "Link to the offchain metadata store";
                                readonly type: "string";
                            };
                            readonly opensea_url: {
                                readonly title: "Opensea Url";
                                readonly description: "Link to the NFT on OpenSea";
                                readonly type: "string";
                            };
                            readonly updated_at: {
                                readonly title: "Updated At";
                                readonly description: "Last time that the NFT's metadata was updated by OpenSea";
                                readonly type: "string";
                            };
                            readonly is_disabled: {
                                readonly title: "Is Disabled";
                                readonly description: "If the item is currently able to be bought or sold using OpenSea";
                                readonly type: "boolean";
                            };
                            readonly is_nsfw: {
                                readonly title: "Is Nsfw";
                                readonly description: "If the item is currently classified as 'Not Safe for Work' by OpenSea as defined in [OpenSea's NSFW Policy](https://support.opensea.io/hc/articles/9729972510995).";
                                readonly type: "boolean";
                            };
                        };
                        readonly required: readonly ["identifier", "collection", "contract", "token_standard", "name", "description", "updated_at", "is_disabled", "is_nsfw"];
                    };
                };
                readonly next: {
                    readonly title: "Next";
                    readonly description: "Cursor for the next page of results";
                    readonly type: "string";
                };
            };
            readonly required: readonly ["nfts", "next"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const ListNftsByCollection: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly collection_slug: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Unique string to identify a collection on OpenSea. This can be found by visiting the collection on the OpenSea website and noting the last path parameter.";
                };
            };
            readonly required: readonly ["collection_slug"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly limit: {
                    readonly type: "integer";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The number of NFTs to return. Must be between 1 and 200. Default: 50";
                };
                readonly next: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The cursor for the next page of results. This is returned from a previous request.";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "ListNftsResponse";
            readonly type: "object";
            readonly properties: {
                readonly nfts: {
                    readonly title: "NFT";
                    readonly type: "array";
                    readonly items: {
                        readonly title: "NftModel";
                        readonly type: "object";
                        readonly properties: {
                            readonly identifier: {
                                readonly title: "Identifier";
                                readonly description: "The NFT's unique identifier within the smart contract (also referred to as token_id)";
                                readonly type: "string";
                            };
                            readonly collection: {
                                readonly title: "Collection";
                                readonly description: "Collection slug. A unique string to identify a collection on OpenSea";
                                readonly type: "string";
                            };
                            readonly contract: {
                                readonly title: "Contract";
                                readonly description: "The public blockchain address of the contract";
                                readonly type: "string";
                            };
                            readonly token_standard: {
                                readonly title: "Token Standard";
                                readonly description: "ERC standard of the token (erc721, erc1155)";
                                readonly type: "string";
                            };
                            readonly name: {
                                readonly title: "Name";
                                readonly description: "Name of the NFT";
                                readonly type: "string";
                            };
                            readonly description: {
                                readonly title: "Description";
                                readonly description: "Description of the NFT";
                                readonly type: "string";
                            };
                            readonly image_url: {
                                readonly title: "Image Url";
                                readonly description: "Link to the image associated with the NFT";
                                readonly type: "string";
                            };
                            readonly metadata_url: {
                                readonly title: "Metadata Url";
                                readonly description: "Link to the offchain metadata store";
                                readonly type: "string";
                            };
                            readonly opensea_url: {
                                readonly title: "Opensea Url";
                                readonly description: "Link to the NFT on OpenSea";
                                readonly type: "string";
                            };
                            readonly updated_at: {
                                readonly title: "Updated At";
                                readonly description: "Last time that the NFT's metadata was updated by OpenSea";
                                readonly type: "string";
                            };
                            readonly is_disabled: {
                                readonly title: "Is Disabled";
                                readonly description: "If the item is currently able to be bought or sold using OpenSea";
                                readonly type: "boolean";
                            };
                            readonly is_nsfw: {
                                readonly title: "Is Nsfw";
                                readonly description: "If the item is currently classified as 'Not Safe for Work' by OpenSea as defined in [OpenSea's NSFW Policy](https://support.opensea.io/hc/articles/9729972510995).";
                                readonly type: "boolean";
                            };
                        };
                        readonly required: readonly ["identifier", "collection", "contract", "token_standard", "name", "description", "updated_at", "is_disabled", "is_nsfw"];
                    };
                };
                readonly next: {
                    readonly title: "Next";
                    readonly description: "Cursor for the next page of results";
                    readonly type: "string";
                };
            };
            readonly required: readonly ["nfts", "next"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const ListNftsByContract: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly address: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The public blockchain address.";
                };
                readonly chain: {
                    readonly type: "string";
                    readonly enum: readonly ["amoy", "arbitrum", "arbitrum_nova", "arbitrum_sepolia", "avalanche", "avalanche_fuji", "baobab", "base", "base_sepolia", "blast", "blast_sepolia", "bsc", "bsctestnet", "ethereum", "klaytn", "matic", "mumbai", "optimism", "optimism_sepolia", "sepolia", "solana", "soldev", "zora", "zora_sepolia"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The blockchain on which to filter the results.";
                };
            };
            readonly required: readonly ["address", "chain"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly limit: {
                    readonly type: "integer";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The number of NFTs to return. Must be between 1 and 200. Default: 50";
                };
                readonly next: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The cursor for the next page of results. This is returned from a previous request.";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "ListNftsResponse";
            readonly type: "object";
            readonly properties: {
                readonly nfts: {
                    readonly title: "NFT";
                    readonly type: "array";
                    readonly items: {
                        readonly title: "NftModel";
                        readonly type: "object";
                        readonly properties: {
                            readonly identifier: {
                                readonly title: "Identifier";
                                readonly description: "The NFT's unique identifier within the smart contract (also referred to as token_id)";
                                readonly type: "string";
                            };
                            readonly collection: {
                                readonly title: "Collection";
                                readonly description: "Collection slug. A unique string to identify a collection on OpenSea";
                                readonly type: "string";
                            };
                            readonly contract: {
                                readonly title: "Contract";
                                readonly description: "The public blockchain address of the contract";
                                readonly type: "string";
                            };
                            readonly token_standard: {
                                readonly title: "Token Standard";
                                readonly description: "ERC standard of the token (erc721, erc1155)";
                                readonly type: "string";
                            };
                            readonly name: {
                                readonly title: "Name";
                                readonly description: "Name of the NFT";
                                readonly type: "string";
                            };
                            readonly description: {
                                readonly title: "Description";
                                readonly description: "Description of the NFT";
                                readonly type: "string";
                            };
                            readonly image_url: {
                                readonly title: "Image Url";
                                readonly description: "Link to the image associated with the NFT";
                                readonly type: "string";
                            };
                            readonly metadata_url: {
                                readonly title: "Metadata Url";
                                readonly description: "Link to the offchain metadata store";
                                readonly type: "string";
                            };
                            readonly opensea_url: {
                                readonly title: "Opensea Url";
                                readonly description: "Link to the NFT on OpenSea";
                                readonly type: "string";
                            };
                            readonly updated_at: {
                                readonly title: "Updated At";
                                readonly description: "Last time that the NFT's metadata was updated by OpenSea";
                                readonly type: "string";
                            };
                            readonly is_disabled: {
                                readonly title: "Is Disabled";
                                readonly description: "If the item is currently able to be bought or sold using OpenSea";
                                readonly type: "boolean";
                            };
                            readonly is_nsfw: {
                                readonly title: "Is Nsfw";
                                readonly description: "If the item is currently classified as 'Not Safe for Work' by OpenSea as defined in [OpenSea's NSFW Policy](https://support.opensea.io/hc/articles/9729972510995).";
                                readonly type: "boolean";
                            };
                        };
                        readonly required: readonly ["identifier", "collection", "contract", "token_standard", "name", "description", "updated_at", "is_disabled", "is_nsfw"];
                    };
                };
                readonly next: {
                    readonly title: "Next";
                    readonly description: "Cursor for the next page of results";
                    readonly type: "string";
                };
            };
            readonly required: readonly ["nfts", "next"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const PostCriteriaOfferV2: {
    readonly body: {
        readonly title: "PostCriteriaOfferInput";
        readonly type: "object";
        readonly properties: {
            readonly protocol_data: {
                readonly title: "Signed Seaport Order";
                readonly description: "The signed order which will be submitted to Seaport";
                readonly type: "object";
                readonly required: readonly ["parameters", "signature"];
                readonly properties: {
                    readonly parameters: {
                        readonly title: "Order Components";
                        readonly type: "object";
                        readonly required: readonly ["offerer", "offer", "consideration", "startTime", "endTime", "orderType", "zone", "zoneHash", "salt", "conduitKey", "totalOriginalConsiderationItems", "counter"];
                        readonly properties: {
                            readonly offerer: {
                                readonly title: "Offerer";
                                readonly description: "The address which supplies all the items in the offer.";
                                readonly type: "string";
                            };
                            readonly offer: {
                                readonly title: "Offer";
                                readonly description: "Array of items that may be transferred from the offerer's account.";
                                readonly type: "array";
                                readonly items: {
                                    readonly title: "OfferItem";
                                    readonly type: "object";
                                    readonly required: readonly ["itemType", "token", "identifierOrCriteria", "startAmount", "endAmount"];
                                    readonly properties: {
                                        readonly itemType: {
                                            readonly title: "ItemType";
                                            readonly description: "0 - Native - Ether (or other native token for the given chain)\n1 - ERC20\n2 - ERC721\n3 - ERC1155\n4 - ERC721 with criteria\n5 - ERC1155 with criteria";
                                            readonly enum: readonly [0, 1, 2, 3, 4, 5];
                                            readonly type: "integer";
                                        };
                                        readonly token: {
                                            readonly title: "Token";
                                            readonly description: "The item's token contract (with the null address used for native tokens)";
                                            readonly type: "string";
                                        };
                                        readonly identifierOrCriteria: {
                                            readonly title: "Identifierorcriteria";
                                            readonly description: "The ERC721 or ERC1155 token identifier or, in the case of a criteria-based item type, a merkle root composed of the valid set of token identifiers for the item. This value will be ignored for Ether and ERC20 item types, and can optionally be zero for criteria-based item types to allow for any identifier.";
                                            readonly type: "integer";
                                        };
                                        readonly startAmount: {
                                            readonly title: "Startamount";
                                            readonly description: "The amount of the token in question that will be required should the order be fulfilled.";
                                            readonly type: "integer";
                                        };
                                        readonly endAmount: {
                                            readonly title: "Endamount";
                                            readonly description: "When endAmount differs from `startAmount`, the realized amount is calculated linearly based on the time elapsed since the order became active.";
                                            readonly type: "integer";
                                        };
                                    };
                                };
                            };
                            readonly consideration: {
                                readonly title: "Consideration";
                                readonly description: "Array of items which must be received by a recipient to fulfill the order. One of the consideration items must be the OpenSea marketplace fee.";
                                readonly type: "array";
                                readonly items: {
                                    readonly title: "ConsiderationItem";
                                    readonly type: "object";
                                    readonly required: readonly ["itemType", "token", "identifierOrCriteria", "startAmount", "endAmount", "recipient"];
                                    readonly properties: {
                                        readonly itemType: {
                                            readonly title: "ItemType";
                                            readonly description: "0 - Native - Ether (or other native token for the given chain)\n1 - ERC20\n2 - ERC721\n3 - ERC1155\n4 - ERC721 with criteria\n5 - ERC1155 with criteria";
                                            readonly enum: readonly [0, 1, 2, 3, 4, 5];
                                            readonly type: "integer";
                                        };
                                        readonly token: {
                                            readonly title: "Token";
                                            readonly description: "The item's token contract (with the null address used for native tokens)";
                                            readonly type: "string";
                                        };
                                        readonly identifierOrCriteria: {
                                            readonly title: "Identifierorcriteria";
                                            readonly description: "The ERC721 or ERC1155 token identifier or, in the case of a criteria-based item type, a merkle root composed of the valid set of token identifiers for the item. This value will be ignored for Ether and ERC20 item types, and can optionally be zero for criteria-based item types to allow for any identifier.";
                                            readonly type: "integer";
                                        };
                                        readonly startAmount: {
                                            readonly title: "Startamount";
                                            readonly description: "The amount of the token in question that will be required should the order be fulfilled.";
                                            readonly type: "integer";
                                        };
                                        readonly endAmount: {
                                            readonly title: "Endamount";
                                            readonly description: "When endAmount differs from `startAmount`, the realized amount is calculated linearly based on the time elapsed since the order became active.";
                                            readonly type: "integer";
                                        };
                                        readonly recipient: {
                                            readonly title: "Recipient";
                                            readonly description: "The address which will receive the consideration item when the order is executed.";
                                            readonly type: "string";
                                        };
                                    };
                                };
                            };
                            readonly startTime: {
                                readonly title: "Starttime";
                                readonly description: "The block timestamp at which the order becomes active";
                                readonly type: "integer";
                            };
                            readonly endTime: {
                                readonly title: "Endtime";
                                readonly description: "The block timestamp at which the order expires.";
                                readonly type: "integer";
                            };
                            readonly orderType: {
                                readonly title: "SeaportOrderType";
                                readonly description: "The type of order, which determines how it can be executed.\n0 = Full Open - No partial fills, anyone can execute\n1 = Partial Open - Partial fills supported, anyone can execute\n2 = Full Restricted - No partial fills, only offerer or zone can check if it can be executed\n3 = Partial Restricted - Partial fills supported, only offerer or zone can check if it can be executed\n4 = Contract - Contract order type, for contract offerers that can dynamically generate orders. Introduced in Seaport v1.4 and currently unsupported";
                                readonly enum: readonly [0, 1, 2, 3, 4];
                                readonly type: "integer";
                            };
                            readonly zone: {
                                readonly title: "Zone";
                                readonly description: "Optional secondary account attached the order which can cancel orders. Additionally, when the `OrderType` is Restricted, the zone or the offerer are the only entities which can execute the order.\nFor open orders, use the zero address.\nFor restricted orders, use the signed zone address 0x000056f7000000ece9003ca63978907a00ffd100";
                                readonly type: "string";
                            };
                            readonly zoneHash: {
                                readonly title: "Zonehash";
                                readonly description: "A value that will be supplied to the zone when fulfilling restricted orders that the zone can utilize when making a determination on whether to authorize the order. Most often this value will be the zero hash 0x0000000000000000000000000000000000000000000000000000000000000000";
                                readonly type: "string";
                            };
                            readonly salt: {
                                readonly title: "Salt";
                                readonly description: "an arbitrary source of entropy for the order";
                                readonly type: "string";
                            };
                            readonly conduitKey: {
                                readonly title: "Conduitkey";
                                readonly description: "Indicates what conduit, if any, should be utilized as a source for token approvals when performing transfers. By default (i.e. when conduitKey is set to the zero hash), the offerer will grant transfer approvals to Seaport directly. \nTo utilize OpenSea's conduit, use 0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000";
                                readonly type: "string";
                            };
                            readonly totalOriginalConsiderationItems: {
                                readonly title: "Totaloriginalconsiderationitems";
                                readonly description: "Size of the consideration array.";
                                readonly type: "integer";
                            };
                            readonly counter: {
                                readonly title: "Counter";
                                readonly description: "Must match the current counter for the given offerer. If you are unsure of the current counter, it can be [read from the contract](https://etherscan.io/address/0x00000000000000adc04c56bf30ac9d3c0aaf14dc#readContract#F2) on etherscan.";
                                readonly type: "string";
                            };
                        };
                    };
                    readonly signature: {
                        readonly title: "Signature";
                        readonly description: "Signature of the signed type data represented by the parameters field.";
                        readonly type: "string";
                    };
                };
            };
            readonly criteria: {
                readonly title: "Criteria";
                readonly description: "Criteria for the collection or trait offer";
                readonly type: "object";
                readonly required: readonly ["collection", "contract"];
                readonly properties: {
                    readonly collection: {
                        readonly title: "Collection";
                        readonly description: "The collection in which the criteria offer is being made for.";
                        readonly type: "object";
                        readonly required: readonly ["slug"];
                        readonly properties: {
                            readonly slug: {
                                readonly title: "Slug";
                                readonly description: "Unique string to identify a collection on OpenSea. This can be found by visiting the collection on the OpenSea website and noting the last path parameter.";
                                readonly type: "string";
                            };
                        };
                    };
                    readonly contract: {
                        readonly title: "Contract";
                        readonly description: "The public blockchain address of the NFT contract";
                        readonly type: "object";
                        readonly required: readonly ["address"];
                        readonly properties: {
                            readonly address: {
                                readonly title: "Address";
                                readonly type: "string";
                            };
                        };
                    };
                    readonly trait: {
                        readonly title: "Trait";
                        readonly description: "The trait that the criteria offer is being made for.";
                        readonly type: "object";
                        readonly required: readonly ["type", "value"];
                        readonly properties: {
                            readonly type: {
                                readonly title: "Type";
                                readonly type: "string";
                            };
                            readonly value: {
                                readonly title: "Value";
                                readonly type: "string";
                            };
                        };
                    };
                    readonly encoded_token_ids: {
                        readonly title: "Encoded Token Ids";
                        readonly description: "Represents a list of token ids which can be used to fulfill the criteria offer. When decoded using the provided SDK function, developers can now see a list of all tokens that could be used to fulfill the offer.";
                        readonly type: "string";
                    };
                };
            };
            readonly protocol_address: {
                readonly title: "Protocol Address";
                readonly description: "Exchange contract address. Must be one of ['0x0000000000000068f116a894984e2db1123eb395']";
                readonly type: "string";
            };
        };
        readonly required: readonly ["protocol_data", "criteria", "protocol_address"];
        readonly additionalProperties: false;
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly title: "Offer";
            readonly type: "object";
            readonly properties: {
                readonly order_hash: {
                    readonly title: "Order Hash";
                    readonly description: "Order hash";
                    readonly type: "string";
                };
                readonly chain: {
                    readonly title: "ChainIdentifier";
                    readonly description: "OpenSea supported chains.\n\n`ethereum` `matic` `klaytn` `bsc` `solana` `arbitrum` `arbitrum_nova` `avalanche` `optimism` `base` `blast` `sei` `zora` `sepolia` `rinkeby` `mumbai` `amoy` `baobab` `bsctestnet` `goerli` `soldev` `arbitrum_goerli` `arbitrum_sepolia` `avalanche_fuji` `optimism_goerli` `optimism_sepolia` `base_goerli` `base_sepolia` `blast_sepolia` `gunzilla_testnet` `sei_devnet` `zora_testnet` `zora_sepolia`";
                    readonly enum: readonly ["ethereum", "matic", "klaytn", "bsc", "solana", "arbitrum", "arbitrum_nova", "avalanche", "optimism", "base", "blast", "sei", "zora", "sepolia", "rinkeby", "mumbai", "amoy", "baobab", "bsctestnet", "goerli", "soldev", "arbitrum_goerli", "arbitrum_sepolia", "avalanche_fuji", "optimism_goerli", "optimism_sepolia", "base_goerli", "base_sepolia", "blast_sepolia", "gunzilla_testnet", "sei_devnet", "zora_testnet", "zora_sepolia"];
                    readonly properties: {};
                    readonly type: "object";
                };
                readonly price: {
                    readonly title: "PriceModel";
                    readonly type: "object";
                    readonly properties: {
                        readonly currency: {
                            readonly title: "Currency";
                            readonly type: "string";
                        };
                        readonly decimals: {
                            readonly title: "Decimals";
                            readonly type: "integer";
                        };
                        readonly value: {
                            readonly title: "Value";
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["currency", "decimals", "value"];
                };
                readonly criteria: {
                    readonly title: "Criteria";
                    readonly description: "Criteria for collection or trait offers";
                    readonly type: "object";
                    readonly required: readonly ["collection", "contract"];
                    readonly properties: {
                        readonly collection: {
                            readonly title: "Collection";
                            readonly description: "The collection in which the criteria offer is being made for.";
                            readonly type: "object";
                            readonly required: readonly ["slug"];
                            readonly properties: {
                                readonly slug: {
                                    readonly title: "Slug";
                                    readonly description: "Unique string to identify a collection on OpenSea. This can be found by visiting the collection on the OpenSea website and noting the last path parameter.";
                                    readonly type: "string";
                                };
                            };
                        };
                        readonly contract: {
                            readonly title: "Contract";
                            readonly description: "The public blockchain address of the NFT contract";
                            readonly type: "object";
                            readonly required: readonly ["address"];
                            readonly properties: {
                                readonly address: {
                                    readonly title: "Address";
                                    readonly type: "string";
                                };
                            };
                        };
                        readonly trait: {
                            readonly title: "Trait";
                            readonly description: "The trait that the criteria offer is being made for.";
                            readonly type: "object";
                            readonly required: readonly ["type", "value"];
                            readonly properties: {
                                readonly type: {
                                    readonly title: "Type";
                                    readonly type: "string";
                                };
                                readonly value: {
                                    readonly title: "Value";
                                    readonly type: "string";
                                };
                            };
                        };
                        readonly encoded_token_ids: {
                            readonly title: "Encoded Token Ids";
                            readonly description: "Represents a list of token ids which can be used to fulfill the criteria offer. When decoded using the provided SDK function, developers can now see a list of all tokens that could be used to fulfill the offer.";
                            readonly type: "string";
                        };
                    };
                };
                readonly protocol_data: {
                    readonly title: "Protocol Data";
                    readonly description: "The onchain order data.";
                    readonly type: "object";
                    readonly required: readonly ["parameters"];
                    readonly properties: {
                        readonly parameters: {
                            readonly title: "Order";
                            readonly type: "object";
                            readonly required: readonly ["offerer", "offer", "consideration", "startTime", "endTime", "orderType", "zone", "zoneHash", "salt", "conduitKey", "totalOriginalConsiderationItems", "counter"];
                            readonly properties: {
                                readonly offerer: {
                                    readonly title: "Offerer";
                                    readonly description: "The address which supplies all the items in the offer.";
                                    readonly type: "string";
                                };
                                readonly offer: {
                                    readonly title: "Offer";
                                    readonly type: "array";
                                    readonly items: {
                                        readonly title: "SerializedOfferItem";
                                        readonly type: "object";
                                        readonly required: readonly ["itemType", "token", "identifierOrCriteria", "startAmount", "endAmount"];
                                        readonly properties: {
                                            readonly itemType: {
                                                readonly title: "ItemType";
                                                readonly description: "0 - Native - Ether (or other native token for the given chain)\n1 - ERC20\n2 - ERC721\n3 - ERC1155\n4 - ERC721 with criteria\n5 - ERC1155 with criteria\n\n`1` `2` `3` `4` `5`";
                                                readonly enum: readonly [0, 1, 2, 3, 4, 5];
                                                readonly type: "integer";
                                            };
                                            readonly token: {
                                                readonly title: "Token";
                                                readonly description: "The item's token contract (with the null address used for native tokens)";
                                                readonly type: "string";
                                            };
                                            readonly identifierOrCriteria: {
                                                readonly title: "Identifierorcriteria";
                                                readonly description: "The ERC721 or ERC1155 token identifier or, in the case of a criteria-based item type, a merkle root composed of the valid set of token identifiers for the item. This value will be ignored for Ether and ERC20 item types, and can optionally be zero for criteria-based item types to allow for any identifier.";
                                                readonly type: "string";
                                            };
                                            readonly startAmount: {
                                                readonly title: "Startamount";
                                                readonly description: "The amount of the token in question that will be required should the order be fulfilled.";
                                                readonly type: "string";
                                            };
                                            readonly endAmount: {
                                                readonly title: "Endamount";
                                                readonly description: "When endAmount differs from `startAmount`, the realized amount is calculated linearly based on the time elapsed since the order became active.";
                                                readonly type: "string";
                                            };
                                        };
                                    };
                                };
                                readonly consideration: {
                                    readonly title: "Consideration";
                                    readonly type: "array";
                                    readonly items: {
                                        readonly title: "SerializedConsiderationItem";
                                        readonly type: "object";
                                        readonly required: readonly ["itemType", "token", "identifierOrCriteria", "startAmount", "endAmount", "recipient"];
                                        readonly properties: {
                                            readonly itemType: {
                                                readonly title: "ItemType";
                                                readonly description: "0 - Native - Ether (or other native token for the given chain)\n1 - ERC20\n2 - ERC721\n3 - ERC1155\n4 - ERC721 with criteria\n5 - ERC1155 with criteria\n\n`1` `2` `3` `4` `5`";
                                                readonly enum: readonly [0, 1, 2, 3, 4, 5];
                                                readonly type: "integer";
                                            };
                                            readonly token: {
                                                readonly title: "Token";
                                                readonly description: "The item's token contract (with the null address used for native tokens)";
                                                readonly type: "string";
                                            };
                                            readonly identifierOrCriteria: {
                                                readonly title: "Identifierorcriteria";
                                                readonly description: "The ERC721 or ERC1155 token identifier or, in the case of a criteria-based item type, a merkle root composed of the valid set of token identifiers for the item. This value will be ignored for Ether and ERC20 item types, and can optionally be zero for criteria-based item types to allow for any identifier.";
                                                readonly type: "string";
                                            };
                                            readonly startAmount: {
                                                readonly title: "Startamount";
                                                readonly description: "The amount of the token in question that will be required should the order be fulfilled.";
                                                readonly type: "string";
                                            };
                                            readonly endAmount: {
                                                readonly title: "Endamount";
                                                readonly description: "When endAmount differs from `startAmount`, the realized amount is calculated linearly based on the time elapsed since the order became active.";
                                                readonly type: "string";
                                            };
                                            readonly recipient: {
                                                readonly title: "Recipient";
                                                readonly description: "The address which will receive the consideration item when the order is executed.";
                                                readonly type: "string";
                                            };
                                        };
                                    };
                                };
                                readonly startTime: {
                                    readonly title: "Starttime";
                                    readonly description: "The block timestamp at which the order becomes active";
                                    readonly type: "string";
                                };
                                readonly endTime: {
                                    readonly title: "Endtime";
                                    readonly description: "The block timestamp at which the order expires";
                                    readonly type: "string";
                                };
                                readonly orderType: {
                                    readonly title: "SeaportOrderType";
                                    readonly description: "The type of order, which determines how it can be executed.\n0 = Full Open - No partial fills, anyone can execute\n1 = Partial Open - Partial fills supported, anyone can execute\n2 = Full Restricted - No partial fills, only offerer or zone can check if it can be executed\n3 = Partial Restricted - Partial fills supported, only offerer or zone can check if it can be executed\n4 = Contract - Contract order type, for contract offerers that can dynamically generate orders. Introduced in Seaport v1.4 and currently unsupported\n\n`1` `2` `3` `4`";
                                    readonly enum: readonly [0, 1, 2, 3, 4];
                                    readonly type: "integer";
                                };
                                readonly zone: {
                                    readonly title: "Zone";
                                    readonly description: "Optional secondary account attached the order which can cancel orders. Additionally, when the `OrderType` is Restricted, the zone or the offerer are the only entities which can execute the order.\nFor open orders, use the zero address.\nFor restricted orders, use the signed zone address 0x000056f7000000ece9003ca63978907a00ffd100";
                                    readonly type: "string";
                                };
                                readonly zoneHash: {
                                    readonly title: "Zonehash";
                                    readonly description: "A value that will be supplied to the zone when fulfilling restricted orders that the zone can utilize when making a determination on whether to authorize the order. Most often this value will be the zero hash 0x0000000000000000000000000000000000000000000000000000000000000000";
                                    readonly type: "string";
                                };
                                readonly salt: {
                                    readonly title: "Salt";
                                    readonly description: "an arbitrary source of entropy for the order";
                                    readonly type: "string";
                                };
                                readonly conduitKey: {
                                    readonly title: "Conduitkey";
                                    readonly description: "Indicates what conduit, if any, should be utilized as a source for token approvals when performing transfers. By default (i.e. when conduitKey is set to the zero hash), the offerer will grant transfer approvals to Seaport directly. \nTo utilize OpenSea's conduit, use 0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000";
                                    readonly type: "string";
                                };
                                readonly totalOriginalConsiderationItems: {
                                    readonly title: "Totaloriginalconsiderationitems";
                                    readonly description: "Size of the consideration array.";
                                    readonly type: "integer";
                                };
                                readonly counter: {
                                    readonly title: "Counter";
                                    readonly anyOf: readonly [{
                                        readonly type: "integer";
                                    }, {
                                        readonly type: "string";
                                    }];
                                };
                            };
                        };
                        readonly signature: {
                            readonly title: "Signature";
                            readonly description: "The order maker's signature used to validate the order.";
                            readonly type: "string";
                        };
                    };
                };
                readonly protocol_address: {
                    readonly title: "Protocol Address";
                    readonly description: "Exchange contract address";
                    readonly type: "string";
                };
            };
            readonly required: readonly ["order_hash", "chain", "price", "criteria", "protocol_data", "protocol_address"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const PostListing: {
    readonly body: {
        readonly title: "OrderInputWithProtocol";
        readonly type: "object";
        readonly properties: {
            readonly parameters: {
                readonly title: "Order Components";
                readonly type: "object";
                readonly required: readonly ["offerer", "offer", "consideration", "startTime", "endTime", "orderType", "zone", "zoneHash", "salt", "conduitKey", "totalOriginalConsiderationItems", "counter"];
                readonly properties: {
                    readonly offerer: {
                        readonly title: "Offerer";
                        readonly description: "The address which supplies all the items in the offer.";
                        readonly type: "string";
                    };
                    readonly offer: {
                        readonly title: "Offer";
                        readonly description: "Array of items that may be transferred from the offerer's account.";
                        readonly type: "array";
                        readonly items: {
                            readonly title: "OfferItem";
                            readonly type: "object";
                            readonly required: readonly ["itemType", "token", "identifierOrCriteria", "startAmount", "endAmount"];
                            readonly properties: {
                                readonly itemType: {
                                    readonly title: "ItemType";
                                    readonly description: "0 - Native - Ether (or other native token for the given chain)\n1 - ERC20\n2 - ERC721\n3 - ERC1155\n4 - ERC721 with criteria\n5 - ERC1155 with criteria";
                                    readonly enum: readonly [0, 1, 2, 3, 4, 5];
                                    readonly type: "integer";
                                };
                                readonly token: {
                                    readonly title: "Token";
                                    readonly description: "The item's token contract (with the null address used for native tokens)";
                                    readonly type: "string";
                                };
                                readonly identifierOrCriteria: {
                                    readonly title: "Identifierorcriteria";
                                    readonly description: "The ERC721 or ERC1155 token identifier or, in the case of a criteria-based item type, a merkle root composed of the valid set of token identifiers for the item. This value will be ignored for Ether and ERC20 item types, and can optionally be zero for criteria-based item types to allow for any identifier.";
                                    readonly type: "integer";
                                };
                                readonly startAmount: {
                                    readonly title: "Startamount";
                                    readonly description: "The amount of the token in question that will be required should the order be fulfilled.";
                                    readonly type: "integer";
                                };
                                readonly endAmount: {
                                    readonly title: "Endamount";
                                    readonly description: "When endAmount differs from `startAmount`, the realized amount is calculated linearly based on the time elapsed since the order became active.";
                                    readonly type: "integer";
                                };
                            };
                        };
                    };
                    readonly consideration: {
                        readonly title: "Consideration";
                        readonly description: "Array of items which must be received by a recipient to fulfill the order. One of the consideration items must be the OpenSea marketplace fee.";
                        readonly type: "array";
                        readonly items: {
                            readonly title: "ConsiderationItem";
                            readonly type: "object";
                            readonly required: readonly ["itemType", "token", "identifierOrCriteria", "startAmount", "endAmount", "recipient"];
                            readonly properties: {
                                readonly itemType: {
                                    readonly title: "ItemType";
                                    readonly description: "0 - Native - Ether (or other native token for the given chain)\n1 - ERC20\n2 - ERC721\n3 - ERC1155\n4 - ERC721 with criteria\n5 - ERC1155 with criteria";
                                    readonly enum: readonly [0, 1, 2, 3, 4, 5];
                                    readonly type: "integer";
                                };
                                readonly token: {
                                    readonly title: "Token";
                                    readonly description: "The item's token contract (with the null address used for native tokens)";
                                    readonly type: "string";
                                };
                                readonly identifierOrCriteria: {
                                    readonly title: "Identifierorcriteria";
                                    readonly description: "The ERC721 or ERC1155 token identifier or, in the case of a criteria-based item type, a merkle root composed of the valid set of token identifiers for the item. This value will be ignored for Ether and ERC20 item types, and can optionally be zero for criteria-based item types to allow for any identifier.";
                                    readonly type: "integer";
                                };
                                readonly startAmount: {
                                    readonly title: "Startamount";
                                    readonly description: "The amount of the token in question that will be required should the order be fulfilled.";
                                    readonly type: "integer";
                                };
                                readonly endAmount: {
                                    readonly title: "Endamount";
                                    readonly description: "When endAmount differs from `startAmount`, the realized amount is calculated linearly based on the time elapsed since the order became active.";
                                    readonly type: "integer";
                                };
                                readonly recipient: {
                                    readonly title: "Recipient";
                                    readonly description: "The address which will receive the consideration item when the order is executed.";
                                    readonly type: "string";
                                };
                            };
                        };
                    };
                    readonly startTime: {
                        readonly title: "Starttime";
                        readonly description: "The block timestamp at which the order becomes active";
                        readonly type: "integer";
                    };
                    readonly endTime: {
                        readonly title: "Endtime";
                        readonly description: "The block timestamp at which the order expires.";
                        readonly type: "integer";
                    };
                    readonly orderType: {
                        readonly title: "SeaportOrderType";
                        readonly description: "The type of order, which determines how it can be executed.\n0 = Full Open - No partial fills, anyone can execute\n1 = Partial Open - Partial fills supported, anyone can execute\n2 = Full Restricted - No partial fills, only offerer or zone can check if it can be executed\n3 = Partial Restricted - Partial fills supported, only offerer or zone can check if it can be executed\n4 = Contract - Contract order type, for contract offerers that can dynamically generate orders. Introduced in Seaport v1.4 and currently unsupported";
                        readonly enum: readonly [0, 1, 2, 3, 4];
                        readonly type: "integer";
                    };
                    readonly zone: {
                        readonly title: "Zone";
                        readonly description: "Optional secondary account attached the order which can cancel orders. Additionally, when the `OrderType` is Restricted, the zone or the offerer are the only entities which can execute the order.\nFor open orders, use the zero address.\nFor restricted orders, use the signed zone address 0x000056f7000000ece9003ca63978907a00ffd100";
                        readonly type: "string";
                    };
                    readonly zoneHash: {
                        readonly title: "Zonehash";
                        readonly description: "A value that will be supplied to the zone when fulfilling restricted orders that the zone can utilize when making a determination on whether to authorize the order. Most often this value will be the zero hash 0x0000000000000000000000000000000000000000000000000000000000000000";
                        readonly type: "string";
                    };
                    readonly salt: {
                        readonly title: "Salt";
                        readonly description: "an arbitrary source of entropy for the order";
                        readonly type: "string";
                    };
                    readonly conduitKey: {
                        readonly title: "Conduitkey";
                        readonly description: "Indicates what conduit, if any, should be utilized as a source for token approvals when performing transfers. By default (i.e. when conduitKey is set to the zero hash), the offerer will grant transfer approvals to Seaport directly. \nTo utilize OpenSea's conduit, use 0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000";
                        readonly type: "string";
                    };
                    readonly totalOriginalConsiderationItems: {
                        readonly title: "Totaloriginalconsiderationitems";
                        readonly description: "Size of the consideration array.";
                        readonly type: "integer";
                    };
                    readonly counter: {
                        readonly title: "Counter";
                        readonly description: "Must match the current counter for the given offerer. If you are unsure of the current counter, it can be [read from the contract](https://etherscan.io/address/0x00000000000000adc04c56bf30ac9d3c0aaf14dc#readContract#F2) on etherscan.";
                        readonly type: "string";
                    };
                };
            };
            readonly signature: {
                readonly title: "Signature";
                readonly description: "Signature of the signed type data represented by the parameters field.";
                readonly type: "string";
            };
            readonly protocol_address: {
                readonly title: "Protocol Address";
                readonly description: "Exchange contract address. Must be one of ['0x0000000000000068f116a894984e2db1123eb395']";
                readonly type: "string";
            };
        };
        readonly required: readonly ["parameters", "signature", "protocol_address"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly chain: {
                    readonly type: "string";
                    readonly enum: readonly ["amoy", "arbitrum", "arbitrum_nova", "arbitrum_sepolia", "avalanche", "avalanche_fuji", "baobab", "base", "base_sepolia", "blast", "blast_sepolia", "bsc", "bsctestnet", "ethereum", "klaytn", "matic", "mumbai", "optimism", "optimism_sepolia", "sepolia", "solana", "soldev", "zora", "zora_sepolia"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The blockchain on which to filter the results.";
                };
                readonly protocol: {
                    readonly type: "string";
                    readonly enum: readonly ["seaport"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The token settlement protocol to use in the request.";
                };
            };
            readonly required: readonly ["chain", "protocol"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly order: {
                    readonly type: "object";
                    readonly description: "OpenSea Order Object";
                    readonly properties: {
                        readonly created_date: {
                            readonly type: "string";
                            readonly format: "date-time";
                            readonly description: "Date the order was created";
                        };
                        readonly closing_date: {
                            readonly type: "string";
                            readonly format: "date-time";
                            readonly description: "Date the order was closed";
                        };
                        readonly listing_time: {
                            readonly type: "integer";
                            readonly readOnly: true;
                            readonly description: "Timestamp representation of created_date";
                        };
                        readonly expiration_time: {
                            readonly type: "integer";
                            readonly readOnly: true;
                            readonly description: "Timestamp representation of closing_date";
                        };
                        readonly order_hash: {
                            readonly type: "string";
                            readonly description: "An identifier for the order";
                        };
                        readonly protocol_data: {
                            readonly readOnly: true;
                            readonly title: "SerializedOrder";
                            readonly type: "object";
                            readonly required: readonly ["parameters"];
                            readonly properties: {
                                readonly parameters: {
                                    readonly title: "Order";
                                    readonly type: "object";
                                    readonly required: readonly ["offerer", "offer", "consideration", "startTime", "endTime", "orderType", "zone", "zoneHash", "salt", "conduitKey", "totalOriginalConsiderationItems", "counter"];
                                    readonly properties: {
                                        readonly offerer: {
                                            readonly title: "Offerer";
                                            readonly description: "The address which supplies all the items in the offer.";
                                            readonly type: "string";
                                        };
                                        readonly offer: {
                                            readonly title: "Offer";
                                            readonly type: "array";
                                            readonly items: {
                                                readonly title: "SerializedOfferItem";
                                                readonly type: "object";
                                                readonly required: readonly ["itemType", "token", "identifierOrCriteria", "startAmount", "endAmount"];
                                                readonly properties: {
                                                    readonly itemType: {
                                                        readonly title: "ItemType";
                                                        readonly description: "0 - Native - Ether (or other native token for the given chain)\n1 - ERC20\n2 - ERC721\n3 - ERC1155\n4 - ERC721 with criteria\n5 - ERC1155 with criteria\n\n`1` `2` `3` `4` `5`";
                                                        readonly enum: readonly [0, 1, 2, 3, 4, 5];
                                                        readonly type: "integer";
                                                    };
                                                    readonly token: {
                                                        readonly title: "Token";
                                                        readonly description: "The item's token contract (with the null address used for native tokens)";
                                                        readonly type: "string";
                                                    };
                                                    readonly identifierOrCriteria: {
                                                        readonly title: "Identifierorcriteria";
                                                        readonly description: "The ERC721 or ERC1155 token identifier or, in the case of a criteria-based item type, a merkle root composed of the valid set of token identifiers for the item. This value will be ignored for Ether and ERC20 item types, and can optionally be zero for criteria-based item types to allow for any identifier.";
                                                        readonly type: "string";
                                                    };
                                                    readonly startAmount: {
                                                        readonly title: "Startamount";
                                                        readonly description: "The amount of the token in question that will be required should the order be fulfilled.";
                                                        readonly type: "string";
                                                    };
                                                    readonly endAmount: {
                                                        readonly title: "Endamount";
                                                        readonly description: "When endAmount differs from `startAmount`, the realized amount is calculated linearly based on the time elapsed since the order became active.";
                                                        readonly type: "string";
                                                    };
                                                };
                                            };
                                        };
                                        readonly consideration: {
                                            readonly title: "Consideration";
                                            readonly type: "array";
                                            readonly items: {
                                                readonly title: "SerializedConsiderationItem";
                                                readonly type: "object";
                                                readonly required: readonly ["itemType", "token", "identifierOrCriteria", "startAmount", "endAmount", "recipient"];
                                                readonly properties: {
                                                    readonly itemType: {
                                                        readonly title: "ItemType";
                                                        readonly description: "0 - Native - Ether (or other native token for the given chain)\n1 - ERC20\n2 - ERC721\n3 - ERC1155\n4 - ERC721 with criteria\n5 - ERC1155 with criteria\n\n`1` `2` `3` `4` `5`";
                                                        readonly enum: readonly [0, 1, 2, 3, 4, 5];
                                                        readonly type: "integer";
                                                    };
                                                    readonly token: {
                                                        readonly title: "Token";
                                                        readonly description: "The item's token contract (with the null address used for native tokens)";
                                                        readonly type: "string";
                                                    };
                                                    readonly identifierOrCriteria: {
                                                        readonly title: "Identifierorcriteria";
                                                        readonly description: "The ERC721 or ERC1155 token identifier or, in the case of a criteria-based item type, a merkle root composed of the valid set of token identifiers for the item. This value will be ignored for Ether and ERC20 item types, and can optionally be zero for criteria-based item types to allow for any identifier.";
                                                        readonly type: "string";
                                                    };
                                                    readonly startAmount: {
                                                        readonly title: "Startamount";
                                                        readonly description: "The amount of the token in question that will be required should the order be fulfilled.";
                                                        readonly type: "string";
                                                    };
                                                    readonly endAmount: {
                                                        readonly title: "Endamount";
                                                        readonly description: "When endAmount differs from `startAmount`, the realized amount is calculated linearly based on the time elapsed since the order became active.";
                                                        readonly type: "string";
                                                    };
                                                    readonly recipient: {
                                                        readonly title: "Recipient";
                                                        readonly description: "The address which will receive the consideration item when the order is executed.";
                                                        readonly type: "string";
                                                    };
                                                };
                                            };
                                        };
                                        readonly startTime: {
                                            readonly title: "Starttime";
                                            readonly description: "The block timestamp at which the order becomes active";
                                            readonly type: "string";
                                        };
                                        readonly endTime: {
                                            readonly title: "Endtime";
                                            readonly description: "The block timestamp at which the order expires";
                                            readonly type: "string";
                                        };
                                        readonly orderType: {
                                            readonly title: "SeaportOrderType";
                                            readonly description: "The type of order, which determines how it can be executed.\n0 = Full Open - No partial fills, anyone can execute\n1 = Partial Open - Partial fills supported, anyone can execute\n2 = Full Restricted - No partial fills, only offerer or zone can check if it can be executed\n3 = Partial Restricted - Partial fills supported, only offerer or zone can check if it can be executed\n4 = Contract - Contract order type, for contract offerers that can dynamically generate orders. Introduced in Seaport v1.4 and currently unsupported\n\n`1` `2` `3` `4`";
                                            readonly enum: readonly [0, 1, 2, 3, 4];
                                            readonly type: "integer";
                                        };
                                        readonly zone: {
                                            readonly title: "Zone";
                                            readonly description: "Optional secondary account attached the order which can cancel orders. Additionally, when the `OrderType` is Restricted, the zone or the offerer are the only entities which can execute the order.\nFor open orders, use the zero address.\nFor restricted orders, use the signed zone address 0x000056f7000000ece9003ca63978907a00ffd100";
                                            readonly type: "string";
                                        };
                                        readonly zoneHash: {
                                            readonly title: "Zonehash";
                                            readonly description: "A value that will be supplied to the zone when fulfilling restricted orders that the zone can utilize when making a determination on whether to authorize the order. Most often this value will be the zero hash 0x0000000000000000000000000000000000000000000000000000000000000000";
                                            readonly type: "string";
                                        };
                                        readonly salt: {
                                            readonly title: "Salt";
                                            readonly description: "an arbitrary source of entropy for the order";
                                            readonly type: "string";
                                        };
                                        readonly conduitKey: {
                                            readonly title: "Conduitkey";
                                            readonly description: "Indicates what conduit, if any, should be utilized as a source for token approvals when performing transfers. By default (i.e. when conduitKey is set to the zero hash), the offerer will grant transfer approvals to Seaport directly. \nTo utilize OpenSea's conduit, use 0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000";
                                            readonly type: "string";
                                        };
                                        readonly totalOriginalConsiderationItems: {
                                            readonly title: "Totaloriginalconsiderationitems";
                                            readonly description: "Size of the consideration array.";
                                            readonly type: "integer";
                                        };
                                        readonly counter: {
                                            readonly title: "Counter";
                                            readonly anyOf: readonly [{
                                                readonly type: "integer";
                                            }, {
                                                readonly type: "string";
                                            }];
                                        };
                                    };
                                };
                                readonly signature: {
                                    readonly title: "Signature";
                                    readonly description: "The order maker's signature used to validate the order.";
                                    readonly type: "string";
                                };
                            };
                        };
                        readonly protocol_address: {
                            readonly type: readonly ["string", "null"];
                            readonly readOnly: true;
                            readonly description: "Exchange Contract Address. Typically the address of the Seaport contract.";
                        };
                        readonly current_price: {
                            readonly type: "string";
                            readonly description: "Current price of the order";
                        };
                        readonly maker: {
                            readonly readOnly: true;
                            readonly description: "The public blockchain address of the order maker.";
                            readonly type: "object";
                            readonly required: readonly ["address", "config", "profile_img_url", "user"];
                            readonly properties: {
                                readonly user: {
                                    readonly type: readonly ["integer", "null"];
                                    readonly readOnly: true;
                                };
                                readonly profile_img_url: {
                                    readonly type: "string";
                                    readonly readOnly: true;
                                    readonly description: "A placeholder image. For the actual profile image, call the Get Account endpoint.";
                                };
                                readonly address: {
                                    readonly type: "string";
                                    readonly readOnly: true;
                                    readonly description: "The public blockchain address of the account.";
                                };
                                readonly config: {
                                    readonly readOnly: true;
                                    readonly enum: readonly ["affiliate", "affiliate_partner", "affiliate_requested", "affiliate_blacklisted", "verified", "moderator", "staff", "employee"];
                                    readonly type: "string";
                                    readonly description: "* `affiliate` - affiliate\n* `affiliate_partner` - affiliate_partner\n* `affiliate_requested` - affiliate_requested\n* `affiliate_blacklisted` - affiliate_blacklisted\n* `verified` - verified\n* `moderator` - moderator\n* `staff` - staff\n* `employee` - employee\n\n`affiliate` `affiliate_partner` `affiliate_requested` `affiliate_blacklisted` `verified` `moderator` `staff` `employee`";
                                };
                            };
                        };
                        readonly taker: {
                            readonly readOnly: true;
                            readonly description: "The public blockchain address of the order taker.";
                            readonly type: "object";
                            readonly required: readonly ["address", "config", "profile_img_url", "user"];
                            readonly properties: {
                                readonly user: {
                                    readonly type: readonly ["integer", "null"];
                                    readonly readOnly: true;
                                };
                                readonly profile_img_url: {
                                    readonly type: "string";
                                    readonly readOnly: true;
                                    readonly description: "A placeholder image. For the actual profile image, call the Get Account endpoint.";
                                };
                                readonly address: {
                                    readonly type: "string";
                                    readonly readOnly: true;
                                    readonly description: "The public blockchain address of the account.";
                                };
                                readonly config: {
                                    readonly readOnly: true;
                                    readonly enum: readonly ["affiliate", "affiliate_partner", "affiliate_requested", "affiliate_blacklisted", "verified", "moderator", "staff", "employee"];
                                    readonly type: "string";
                                    readonly description: "* `affiliate` - affiliate\n* `affiliate_partner` - affiliate_partner\n* `affiliate_requested` - affiliate_requested\n* `affiliate_blacklisted` - affiliate_blacklisted\n* `verified` - verified\n* `moderator` - moderator\n* `staff` - staff\n* `employee` - employee\n\n`affiliate` `affiliate_partner` `affiliate_requested` `affiliate_blacklisted` `verified` `moderator` `staff` `employee`";
                                };
                            };
                        };
                        readonly maker_fees: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly account: {
                                        readonly readOnly: true;
                                        readonly type: "object";
                                        readonly required: readonly ["address", "config", "profile_img_url", "user"];
                                        readonly properties: {
                                            readonly user: {
                                                readonly type: readonly ["integer", "null"];
                                                readonly readOnly: true;
                                            };
                                            readonly profile_img_url: {
                                                readonly type: "string";
                                                readonly readOnly: true;
                                                readonly description: "A placeholder image. For the actual profile image, call the Get Account endpoint.";
                                            };
                                            readonly address: {
                                                readonly type: "string";
                                                readonly readOnly: true;
                                                readonly description: "The public blockchain address of the account.";
                                            };
                                            readonly config: {
                                                readonly readOnly: true;
                                                readonly enum: readonly ["affiliate", "affiliate_partner", "affiliate_requested", "affiliate_blacklisted", "verified", "moderator", "staff", "employee"];
                                                readonly type: "string";
                                                readonly description: "* `affiliate` - affiliate\n* `affiliate_partner` - affiliate_partner\n* `affiliate_requested` - affiliate_requested\n* `affiliate_blacklisted` - affiliate_blacklisted\n* `verified` - verified\n* `moderator` - moderator\n* `staff` - staff\n* `employee` - employee\n\n`affiliate` `affiliate_partner` `affiliate_requested` `affiliate_blacklisted` `verified` `moderator` `staff` `employee`";
                                            };
                                        };
                                    };
                                    readonly basis_points: {
                                        readonly type: "string";
                                    };
                                };
                                readonly required: readonly ["account", "basis_points"];
                            };
                            readonly readOnly: true;
                        };
                        readonly taker_fees: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly account: {
                                        readonly readOnly: true;
                                        readonly type: "object";
                                        readonly required: readonly ["address", "config", "profile_img_url", "user"];
                                        readonly properties: {
                                            readonly user: {
                                                readonly type: readonly ["integer", "null"];
                                                readonly readOnly: true;
                                            };
                                            readonly profile_img_url: {
                                                readonly type: "string";
                                                readonly readOnly: true;
                                                readonly description: "A placeholder image. For the actual profile image, call the Get Account endpoint.";
                                            };
                                            readonly address: {
                                                readonly type: "string";
                                                readonly readOnly: true;
                                                readonly description: "The public blockchain address of the account.";
                                            };
                                            readonly config: {
                                                readonly readOnly: true;
                                                readonly enum: readonly ["affiliate", "affiliate_partner", "affiliate_requested", "affiliate_blacklisted", "verified", "moderator", "staff", "employee"];
                                                readonly type: "string";
                                                readonly description: "* `affiliate` - affiliate\n* `affiliate_partner` - affiliate_partner\n* `affiliate_requested` - affiliate_requested\n* `affiliate_blacklisted` - affiliate_blacklisted\n* `verified` - verified\n* `moderator` - moderator\n* `staff` - staff\n* `employee` - employee\n\n`affiliate` `affiliate_partner` `affiliate_requested` `affiliate_blacklisted` `verified` `moderator` `staff` `employee`";
                                            };
                                        };
                                    };
                                    readonly basis_points: {
                                        readonly type: "string";
                                    };
                                };
                                readonly required: readonly ["account", "basis_points"];
                            };
                            readonly readOnly: true;
                        };
                        readonly side: {
                            readonly type: "string";
                            readonly description: "The side of the order, either bid (offer) or ask(listing).";
                        };
                        readonly order_type: {
                            readonly readOnly: true;
                            readonly enum: readonly ["basic", "dutch", "english", "criteria"];
                            readonly type: "string";
                            readonly description: "* `basic` - basic\n* `dutch` - dutch\n* `english` - english\n* `criteria` - criteria\n\n`basic` `dutch` `english` `criteria`";
                        };
                        readonly cancelled: {
                            readonly type: "boolean";
                            readonly description: "If true, the order maker has canceled the order which means it can no longer be filled.";
                        };
                        readonly finalized: {
                            readonly type: "boolean";
                            readonly description: "If true, the order has already been filled.";
                        };
                        readonly marked_invalid: {
                            readonly type: "boolean";
                            readonly readOnly: true;
                            readonly description: "If true, the order is currently invalid and can not be filled.";
                        };
                        readonly remaining_quantity: {
                            readonly type: "integer";
                            readonly description: "The remaining quantity of the order that has not been filled. This is useful for erc1155 orders.";
                        };
                        readonly criteria_proof: {
                            readonly type: readonly ["array", "null"];
                            readonly items: {
                                readonly type: "string";
                            };
                            readonly readOnly: true;
                            readonly description: "A merkle root composed of the valid set of token identifiers for the order";
                        };
                    };
                    readonly required: readonly ["cancelled", "closing_date", "created_date", "criteria_proof", "current_price", "expiration_time", "finalized", "listing_time", "maker", "maker_fees", "marked_invalid", "order_hash", "order_type", "protocol_address", "protocol_data", "remaining_quantity", "side", "taker", "taker_fees"];
                };
            };
            readonly required: readonly ["order"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const PostOffer: {
    readonly body: {
        readonly title: "OrderInputWithProtocol";
        readonly type: "object";
        readonly properties: {
            readonly parameters: {
                readonly title: "Order Components";
                readonly type: "object";
                readonly required: readonly ["offerer", "offer", "consideration", "startTime", "endTime", "orderType", "zone", "zoneHash", "salt", "conduitKey", "totalOriginalConsiderationItems", "counter"];
                readonly properties: {
                    readonly offerer: {
                        readonly title: "Offerer";
                        readonly description: "The address which supplies all the items in the offer.";
                        readonly type: "string";
                    };
                    readonly offer: {
                        readonly title: "Offer";
                        readonly description: "Array of items that may be transferred from the offerer's account.";
                        readonly type: "array";
                        readonly items: {
                            readonly title: "OfferItem";
                            readonly type: "object";
                            readonly required: readonly ["itemType", "token", "identifierOrCriteria", "startAmount", "endAmount"];
                            readonly properties: {
                                readonly itemType: {
                                    readonly title: "ItemType";
                                    readonly description: "0 - Native - Ether (or other native token for the given chain)\n1 - ERC20\n2 - ERC721\n3 - ERC1155\n4 - ERC721 with criteria\n5 - ERC1155 with criteria";
                                    readonly enum: readonly [0, 1, 2, 3, 4, 5];
                                    readonly type: "integer";
                                };
                                readonly token: {
                                    readonly title: "Token";
                                    readonly description: "The item's token contract (with the null address used for native tokens)";
                                    readonly type: "string";
                                };
                                readonly identifierOrCriteria: {
                                    readonly title: "Identifierorcriteria";
                                    readonly description: "The ERC721 or ERC1155 token identifier or, in the case of a criteria-based item type, a merkle root composed of the valid set of token identifiers for the item. This value will be ignored for Ether and ERC20 item types, and can optionally be zero for criteria-based item types to allow for any identifier.";
                                    readonly type: "integer";
                                };
                                readonly startAmount: {
                                    readonly title: "Startamount";
                                    readonly description: "The amount of the token in question that will be required should the order be fulfilled.";
                                    readonly type: "integer";
                                };
                                readonly endAmount: {
                                    readonly title: "Endamount";
                                    readonly description: "When endAmount differs from `startAmount`, the realized amount is calculated linearly based on the time elapsed since the order became active.";
                                    readonly type: "integer";
                                };
                            };
                        };
                    };
                    readonly consideration: {
                        readonly title: "Consideration";
                        readonly description: "Array of items which must be received by a recipient to fulfill the order. One of the consideration items must be the OpenSea marketplace fee.";
                        readonly type: "array";
                        readonly items: {
                            readonly title: "ConsiderationItem";
                            readonly type: "object";
                            readonly required: readonly ["itemType", "token", "identifierOrCriteria", "startAmount", "endAmount", "recipient"];
                            readonly properties: {
                                readonly itemType: {
                                    readonly title: "ItemType";
                                    readonly description: "0 - Native - Ether (or other native token for the given chain)\n1 - ERC20\n2 - ERC721\n3 - ERC1155\n4 - ERC721 with criteria\n5 - ERC1155 with criteria";
                                    readonly enum: readonly [0, 1, 2, 3, 4, 5];
                                    readonly type: "integer";
                                };
                                readonly token: {
                                    readonly title: "Token";
                                    readonly description: "The item's token contract (with the null address used for native tokens)";
                                    readonly type: "string";
                                };
                                readonly identifierOrCriteria: {
                                    readonly title: "Identifierorcriteria";
                                    readonly description: "The ERC721 or ERC1155 token identifier or, in the case of a criteria-based item type, a merkle root composed of the valid set of token identifiers for the item. This value will be ignored for Ether and ERC20 item types, and can optionally be zero for criteria-based item types to allow for any identifier.";
                                    readonly type: "integer";
                                };
                                readonly startAmount: {
                                    readonly title: "Startamount";
                                    readonly description: "The amount of the token in question that will be required should the order be fulfilled.";
                                    readonly type: "integer";
                                };
                                readonly endAmount: {
                                    readonly title: "Endamount";
                                    readonly description: "When endAmount differs from `startAmount`, the realized amount is calculated linearly based on the time elapsed since the order became active.";
                                    readonly type: "integer";
                                };
                                readonly recipient: {
                                    readonly title: "Recipient";
                                    readonly description: "The address which will receive the consideration item when the order is executed.";
                                    readonly type: "string";
                                };
                            };
                        };
                    };
                    readonly startTime: {
                        readonly title: "Starttime";
                        readonly description: "The block timestamp at which the order becomes active";
                        readonly type: "integer";
                    };
                    readonly endTime: {
                        readonly title: "Endtime";
                        readonly description: "The block timestamp at which the order expires.";
                        readonly type: "integer";
                    };
                    readonly orderType: {
                        readonly title: "SeaportOrderType";
                        readonly description: "The type of order, which determines how it can be executed.\n0 = Full Open - No partial fills, anyone can execute\n1 = Partial Open - Partial fills supported, anyone can execute\n2 = Full Restricted - No partial fills, only offerer or zone can check if it can be executed\n3 = Partial Restricted - Partial fills supported, only offerer or zone can check if it can be executed\n4 = Contract - Contract order type, for contract offerers that can dynamically generate orders. Introduced in Seaport v1.4 and currently unsupported";
                        readonly enum: readonly [0, 1, 2, 3, 4];
                        readonly type: "integer";
                    };
                    readonly zone: {
                        readonly title: "Zone";
                        readonly description: "Optional secondary account attached the order which can cancel orders. Additionally, when the `OrderType` is Restricted, the zone or the offerer are the only entities which can execute the order.\nFor open orders, use the zero address.\nFor restricted orders, use the signed zone address 0x000056f7000000ece9003ca63978907a00ffd100";
                        readonly type: "string";
                    };
                    readonly zoneHash: {
                        readonly title: "Zonehash";
                        readonly description: "A value that will be supplied to the zone when fulfilling restricted orders that the zone can utilize when making a determination on whether to authorize the order. Most often this value will be the zero hash 0x0000000000000000000000000000000000000000000000000000000000000000";
                        readonly type: "string";
                    };
                    readonly salt: {
                        readonly title: "Salt";
                        readonly description: "an arbitrary source of entropy for the order";
                        readonly type: "string";
                    };
                    readonly conduitKey: {
                        readonly title: "Conduitkey";
                        readonly description: "Indicates what conduit, if any, should be utilized as a source for token approvals when performing transfers. By default (i.e. when conduitKey is set to the zero hash), the offerer will grant transfer approvals to Seaport directly. \nTo utilize OpenSea's conduit, use 0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000";
                        readonly type: "string";
                    };
                    readonly totalOriginalConsiderationItems: {
                        readonly title: "Totaloriginalconsiderationitems";
                        readonly description: "Size of the consideration array.";
                        readonly type: "integer";
                    };
                    readonly counter: {
                        readonly title: "Counter";
                        readonly description: "Must match the current counter for the given offerer. If you are unsure of the current counter, it can be [read from the contract](https://etherscan.io/address/0x00000000000000adc04c56bf30ac9d3c0aaf14dc#readContract#F2) on etherscan.";
                        readonly type: "string";
                    };
                };
            };
            readonly signature: {
                readonly title: "Signature";
                readonly description: "Signature of the signed type data represented by the parameters field.";
                readonly type: "string";
            };
            readonly protocol_address: {
                readonly title: "Protocol Address";
                readonly description: "Exchange contract address. Must be one of ['0x0000000000000068f116a894984e2db1123eb395']";
                readonly type: "string";
            };
        };
        readonly required: readonly ["parameters", "signature", "protocol_address"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly chain: {
                    readonly type: "string";
                    readonly enum: readonly ["amoy", "arbitrum", "arbitrum_nova", "arbitrum_sepolia", "avalanche", "avalanche_fuji", "baobab", "base", "base_sepolia", "blast", "blast_sepolia", "bsc", "bsctestnet", "ethereum", "klaytn", "matic", "mumbai", "optimism", "optimism_sepolia", "sepolia", "solana", "soldev", "zora", "zora_sepolia"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The blockchain on which to filter the results.";
                };
                readonly protocol: {
                    readonly type: "string";
                    readonly enum: readonly ["seaport"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The token settlement protocol to use in the request.";
                };
            };
            readonly required: readonly ["chain", "protocol"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly order: {
                    readonly type: "object";
                    readonly description: "OpenSea Order Object";
                    readonly properties: {
                        readonly created_date: {
                            readonly type: "string";
                            readonly format: "date-time";
                            readonly description: "Date the order was created";
                        };
                        readonly closing_date: {
                            readonly type: "string";
                            readonly format: "date-time";
                            readonly description: "Date the order was closed";
                        };
                        readonly listing_time: {
                            readonly type: "integer";
                            readonly readOnly: true;
                            readonly description: "Timestamp representation of created_date";
                        };
                        readonly expiration_time: {
                            readonly type: "integer";
                            readonly readOnly: true;
                            readonly description: "Timestamp representation of closing_date";
                        };
                        readonly order_hash: {
                            readonly type: "string";
                            readonly description: "An identifier for the order";
                        };
                        readonly protocol_data: {
                            readonly readOnly: true;
                            readonly title: "SerializedOrder";
                            readonly type: "object";
                            readonly required: readonly ["parameters"];
                            readonly properties: {
                                readonly parameters: {
                                    readonly title: "Order";
                                    readonly type: "object";
                                    readonly required: readonly ["offerer", "offer", "consideration", "startTime", "endTime", "orderType", "zone", "zoneHash", "salt", "conduitKey", "totalOriginalConsiderationItems", "counter"];
                                    readonly properties: {
                                        readonly offerer: {
                                            readonly title: "Offerer";
                                            readonly description: "The address which supplies all the items in the offer.";
                                            readonly type: "string";
                                        };
                                        readonly offer: {
                                            readonly title: "Offer";
                                            readonly type: "array";
                                            readonly items: {
                                                readonly title: "SerializedOfferItem";
                                                readonly type: "object";
                                                readonly required: readonly ["itemType", "token", "identifierOrCriteria", "startAmount", "endAmount"];
                                                readonly properties: {
                                                    readonly itemType: {
                                                        readonly title: "ItemType";
                                                        readonly description: "0 - Native - Ether (or other native token for the given chain)\n1 - ERC20\n2 - ERC721\n3 - ERC1155\n4 - ERC721 with criteria\n5 - ERC1155 with criteria\n\n`1` `2` `3` `4` `5`";
                                                        readonly enum: readonly [0, 1, 2, 3, 4, 5];
                                                        readonly type: "integer";
                                                    };
                                                    readonly token: {
                                                        readonly title: "Token";
                                                        readonly description: "The item's token contract (with the null address used for native tokens)";
                                                        readonly type: "string";
                                                    };
                                                    readonly identifierOrCriteria: {
                                                        readonly title: "Identifierorcriteria";
                                                        readonly description: "The ERC721 or ERC1155 token identifier or, in the case of a criteria-based item type, a merkle root composed of the valid set of token identifiers for the item. This value will be ignored for Ether and ERC20 item types, and can optionally be zero for criteria-based item types to allow for any identifier.";
                                                        readonly type: "string";
                                                    };
                                                    readonly startAmount: {
                                                        readonly title: "Startamount";
                                                        readonly description: "The amount of the token in question that will be required should the order be fulfilled.";
                                                        readonly type: "string";
                                                    };
                                                    readonly endAmount: {
                                                        readonly title: "Endamount";
                                                        readonly description: "When endAmount differs from `startAmount`, the realized amount is calculated linearly based on the time elapsed since the order became active.";
                                                        readonly type: "string";
                                                    };
                                                };
                                            };
                                        };
                                        readonly consideration: {
                                            readonly title: "Consideration";
                                            readonly type: "array";
                                            readonly items: {
                                                readonly title: "SerializedConsiderationItem";
                                                readonly type: "object";
                                                readonly required: readonly ["itemType", "token", "identifierOrCriteria", "startAmount", "endAmount", "recipient"];
                                                readonly properties: {
                                                    readonly itemType: {
                                                        readonly title: "ItemType";
                                                        readonly description: "0 - Native - Ether (or other native token for the given chain)\n1 - ERC20\n2 - ERC721\n3 - ERC1155\n4 - ERC721 with criteria\n5 - ERC1155 with criteria\n\n`1` `2` `3` `4` `5`";
                                                        readonly enum: readonly [0, 1, 2, 3, 4, 5];
                                                        readonly type: "integer";
                                                    };
                                                    readonly token: {
                                                        readonly title: "Token";
                                                        readonly description: "The item's token contract (with the null address used for native tokens)";
                                                        readonly type: "string";
                                                    };
                                                    readonly identifierOrCriteria: {
                                                        readonly title: "Identifierorcriteria";
                                                        readonly description: "The ERC721 or ERC1155 token identifier or, in the case of a criteria-based item type, a merkle root composed of the valid set of token identifiers for the item. This value will be ignored for Ether and ERC20 item types, and can optionally be zero for criteria-based item types to allow for any identifier.";
                                                        readonly type: "string";
                                                    };
                                                    readonly startAmount: {
                                                        readonly title: "Startamount";
                                                        readonly description: "The amount of the token in question that will be required should the order be fulfilled.";
                                                        readonly type: "string";
                                                    };
                                                    readonly endAmount: {
                                                        readonly title: "Endamount";
                                                        readonly description: "When endAmount differs from `startAmount`, the realized amount is calculated linearly based on the time elapsed since the order became active.";
                                                        readonly type: "string";
                                                    };
                                                    readonly recipient: {
                                                        readonly title: "Recipient";
                                                        readonly description: "The address which will receive the consideration item when the order is executed.";
                                                        readonly type: "string";
                                                    };
                                                };
                                            };
                                        };
                                        readonly startTime: {
                                            readonly title: "Starttime";
                                            readonly description: "The block timestamp at which the order becomes active";
                                            readonly type: "string";
                                        };
                                        readonly endTime: {
                                            readonly title: "Endtime";
                                            readonly description: "The block timestamp at which the order expires";
                                            readonly type: "string";
                                        };
                                        readonly orderType: {
                                            readonly title: "SeaportOrderType";
                                            readonly description: "The type of order, which determines how it can be executed.\n0 = Full Open - No partial fills, anyone can execute\n1 = Partial Open - Partial fills supported, anyone can execute\n2 = Full Restricted - No partial fills, only offerer or zone can check if it can be executed\n3 = Partial Restricted - Partial fills supported, only offerer or zone can check if it can be executed\n4 = Contract - Contract order type, for contract offerers that can dynamically generate orders. Introduced in Seaport v1.4 and currently unsupported\n\n`1` `2` `3` `4`";
                                            readonly enum: readonly [0, 1, 2, 3, 4];
                                            readonly type: "integer";
                                        };
                                        readonly zone: {
                                            readonly title: "Zone";
                                            readonly description: "Optional secondary account attached the order which can cancel orders. Additionally, when the `OrderType` is Restricted, the zone or the offerer are the only entities which can execute the order.\nFor open orders, use the zero address.\nFor restricted orders, use the signed zone address 0x000056f7000000ece9003ca63978907a00ffd100";
                                            readonly type: "string";
                                        };
                                        readonly zoneHash: {
                                            readonly title: "Zonehash";
                                            readonly description: "A value that will be supplied to the zone when fulfilling restricted orders that the zone can utilize when making a determination on whether to authorize the order. Most often this value will be the zero hash 0x0000000000000000000000000000000000000000000000000000000000000000";
                                            readonly type: "string";
                                        };
                                        readonly salt: {
                                            readonly title: "Salt";
                                            readonly description: "an arbitrary source of entropy for the order";
                                            readonly type: "string";
                                        };
                                        readonly conduitKey: {
                                            readonly title: "Conduitkey";
                                            readonly description: "Indicates what conduit, if any, should be utilized as a source for token approvals when performing transfers. By default (i.e. when conduitKey is set to the zero hash), the offerer will grant transfer approvals to Seaport directly. \nTo utilize OpenSea's conduit, use 0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000";
                                            readonly type: "string";
                                        };
                                        readonly totalOriginalConsiderationItems: {
                                            readonly title: "Totaloriginalconsiderationitems";
                                            readonly description: "Size of the consideration array.";
                                            readonly type: "integer";
                                        };
                                        readonly counter: {
                                            readonly title: "Counter";
                                            readonly anyOf: readonly [{
                                                readonly type: "integer";
                                            }, {
                                                readonly type: "string";
                                            }];
                                        };
                                    };
                                };
                                readonly signature: {
                                    readonly title: "Signature";
                                    readonly description: "The order maker's signature used to validate the order.";
                                    readonly type: "string";
                                };
                            };
                        };
                        readonly protocol_address: {
                            readonly type: readonly ["string", "null"];
                            readonly readOnly: true;
                            readonly description: "Exchange Contract Address. Typically the address of the Seaport contract.";
                        };
                        readonly current_price: {
                            readonly type: "string";
                            readonly description: "Current price of the order";
                        };
                        readonly maker: {
                            readonly readOnly: true;
                            readonly description: "The public blockchain address of the order maker.";
                            readonly type: "object";
                            readonly required: readonly ["address", "config", "profile_img_url", "user"];
                            readonly properties: {
                                readonly user: {
                                    readonly type: readonly ["integer", "null"];
                                    readonly readOnly: true;
                                };
                                readonly profile_img_url: {
                                    readonly type: "string";
                                    readonly readOnly: true;
                                    readonly description: "A placeholder image. For the actual profile image, call the Get Account endpoint.";
                                };
                                readonly address: {
                                    readonly type: "string";
                                    readonly readOnly: true;
                                    readonly description: "The public blockchain address of the account.";
                                };
                                readonly config: {
                                    readonly readOnly: true;
                                    readonly enum: readonly ["affiliate", "affiliate_partner", "affiliate_requested", "affiliate_blacklisted", "verified", "moderator", "staff", "employee"];
                                    readonly type: "string";
                                    readonly description: "* `affiliate` - affiliate\n* `affiliate_partner` - affiliate_partner\n* `affiliate_requested` - affiliate_requested\n* `affiliate_blacklisted` - affiliate_blacklisted\n* `verified` - verified\n* `moderator` - moderator\n* `staff` - staff\n* `employee` - employee\n\n`affiliate` `affiliate_partner` `affiliate_requested` `affiliate_blacklisted` `verified` `moderator` `staff` `employee`";
                                };
                            };
                        };
                        readonly taker: {
                            readonly readOnly: true;
                            readonly description: "The public blockchain address of the order taker.";
                            readonly type: "object";
                            readonly required: readonly ["address", "config", "profile_img_url", "user"];
                            readonly properties: {
                                readonly user: {
                                    readonly type: readonly ["integer", "null"];
                                    readonly readOnly: true;
                                };
                                readonly profile_img_url: {
                                    readonly type: "string";
                                    readonly readOnly: true;
                                    readonly description: "A placeholder image. For the actual profile image, call the Get Account endpoint.";
                                };
                                readonly address: {
                                    readonly type: "string";
                                    readonly readOnly: true;
                                    readonly description: "The public blockchain address of the account.";
                                };
                                readonly config: {
                                    readonly readOnly: true;
                                    readonly enum: readonly ["affiliate", "affiliate_partner", "affiliate_requested", "affiliate_blacklisted", "verified", "moderator", "staff", "employee"];
                                    readonly type: "string";
                                    readonly description: "* `affiliate` - affiliate\n* `affiliate_partner` - affiliate_partner\n* `affiliate_requested` - affiliate_requested\n* `affiliate_blacklisted` - affiliate_blacklisted\n* `verified` - verified\n* `moderator` - moderator\n* `staff` - staff\n* `employee` - employee\n\n`affiliate` `affiliate_partner` `affiliate_requested` `affiliate_blacklisted` `verified` `moderator` `staff` `employee`";
                                };
                            };
                        };
                        readonly maker_fees: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly account: {
                                        readonly readOnly: true;
                                        readonly type: "object";
                                        readonly required: readonly ["address", "config", "profile_img_url", "user"];
                                        readonly properties: {
                                            readonly user: {
                                                readonly type: readonly ["integer", "null"];
                                                readonly readOnly: true;
                                            };
                                            readonly profile_img_url: {
                                                readonly type: "string";
                                                readonly readOnly: true;
                                                readonly description: "A placeholder image. For the actual profile image, call the Get Account endpoint.";
                                            };
                                            readonly address: {
                                                readonly type: "string";
                                                readonly readOnly: true;
                                                readonly description: "The public blockchain address of the account.";
                                            };
                                            readonly config: {
                                                readonly readOnly: true;
                                                readonly enum: readonly ["affiliate", "affiliate_partner", "affiliate_requested", "affiliate_blacklisted", "verified", "moderator", "staff", "employee"];
                                                readonly type: "string";
                                                readonly description: "* `affiliate` - affiliate\n* `affiliate_partner` - affiliate_partner\n* `affiliate_requested` - affiliate_requested\n* `affiliate_blacklisted` - affiliate_blacklisted\n* `verified` - verified\n* `moderator` - moderator\n* `staff` - staff\n* `employee` - employee\n\n`affiliate` `affiliate_partner` `affiliate_requested` `affiliate_blacklisted` `verified` `moderator` `staff` `employee`";
                                            };
                                        };
                                    };
                                    readonly basis_points: {
                                        readonly type: "string";
                                    };
                                };
                                readonly required: readonly ["account", "basis_points"];
                            };
                            readonly readOnly: true;
                        };
                        readonly taker_fees: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly account: {
                                        readonly readOnly: true;
                                        readonly type: "object";
                                        readonly required: readonly ["address", "config", "profile_img_url", "user"];
                                        readonly properties: {
                                            readonly user: {
                                                readonly type: readonly ["integer", "null"];
                                                readonly readOnly: true;
                                            };
                                            readonly profile_img_url: {
                                                readonly type: "string";
                                                readonly readOnly: true;
                                                readonly description: "A placeholder image. For the actual profile image, call the Get Account endpoint.";
                                            };
                                            readonly address: {
                                                readonly type: "string";
                                                readonly readOnly: true;
                                                readonly description: "The public blockchain address of the account.";
                                            };
                                            readonly config: {
                                                readonly readOnly: true;
                                                readonly enum: readonly ["affiliate", "affiliate_partner", "affiliate_requested", "affiliate_blacklisted", "verified", "moderator", "staff", "employee"];
                                                readonly type: "string";
                                                readonly description: "* `affiliate` - affiliate\n* `affiliate_partner` - affiliate_partner\n* `affiliate_requested` - affiliate_requested\n* `affiliate_blacklisted` - affiliate_blacklisted\n* `verified` - verified\n* `moderator` - moderator\n* `staff` - staff\n* `employee` - employee\n\n`affiliate` `affiliate_partner` `affiliate_requested` `affiliate_blacklisted` `verified` `moderator` `staff` `employee`";
                                            };
                                        };
                                    };
                                    readonly basis_points: {
                                        readonly type: "string";
                                    };
                                };
                                readonly required: readonly ["account", "basis_points"];
                            };
                            readonly readOnly: true;
                        };
                        readonly side: {
                            readonly type: "string";
                            readonly description: "The side of the order, either bid (offer) or ask(listing).";
                        };
                        readonly order_type: {
                            readonly readOnly: true;
                            readonly enum: readonly ["basic", "dutch", "english", "criteria"];
                            readonly type: "string";
                            readonly description: "* `basic` - basic\n* `dutch` - dutch\n* `english` - english\n* `criteria` - criteria\n\n`basic` `dutch` `english` `criteria`";
                        };
                        readonly cancelled: {
                            readonly type: "boolean";
                            readonly description: "If true, the order maker has canceled the order which means it can no longer be filled.";
                        };
                        readonly finalized: {
                            readonly type: "boolean";
                            readonly description: "If true, the order has already been filled.";
                        };
                        readonly marked_invalid: {
                            readonly type: "boolean";
                            readonly readOnly: true;
                            readonly description: "If true, the order is currently invalid and can not be filled.";
                        };
                        readonly remaining_quantity: {
                            readonly type: "integer";
                            readonly description: "The remaining quantity of the order that has not been filled. This is useful for erc1155 orders.";
                        };
                        readonly criteria_proof: {
                            readonly type: readonly ["array", "null"];
                            readonly items: {
                                readonly type: "string";
                            };
                            readonly readOnly: true;
                            readonly description: "A merkle root composed of the valid set of token identifiers for the order";
                        };
                    };
                    readonly required: readonly ["cancelled", "closing_date", "created_date", "criteria_proof", "current_price", "expiration_time", "finalized", "listing_time", "maker", "maker_fees", "marked_invalid", "order_hash", "order_type", "protocol_address", "protocol_data", "remaining_quantity", "side", "taker", "taker_fees"];
                };
            };
            readonly required: readonly ["order"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const RefreshNft: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly address: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The public blockchain address.";
                };
                readonly chain: {
                    readonly type: "string";
                    readonly enum: readonly ["amoy", "arbitrum", "arbitrum_nova", "arbitrum_sepolia", "avalanche", "avalanche_fuji", "baobab", "base", "base_sepolia", "blast", "blast_sepolia", "bsc", "bsctestnet", "ethereum", "klaytn", "matic", "mumbai", "optimism", "optimism_sepolia", "sepolia", "solana", "soldev", "zora", "zora_sepolia"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The blockchain on which to filter the results.";
                };
                readonly identifier: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The NFT token id.";
                };
            };
            readonly required: readonly ["address", "chain", "identifier"];
        }];
    };
};
export { BuildOfferV2, CancelOrder, GenerateListingFulfillmentDataV2, GenerateOfferFulfillmentDataV2, GetAccount, GetAllListingsOnCollectionV2, GetAllOffersOnCollectionV2, GetBestListingOnNftV2, GetBestListingsOnCollectionV2, GetBestOfferOnNftV2, GetCollection, GetCollectionOffersV2, GetCollectionStats, GetContract, GetListings, GetNft, GetOffers, GetOrder, GetPaymentToken, GetTraitOffersV2, GetTraits, ListCollections, ListEvents, ListEventsByAccount, ListEventsByCollection, ListEventsByNft, ListNftsByAccount, ListNftsByCollection, ListNftsByContract, PostCriteriaOfferV2, PostListing, PostOffer, RefreshNft };
