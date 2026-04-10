import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";
if (typeof window !== "undefined") {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const networks = {
    testnet: {
        networkPassphrase: "Test SDF Network ; September 2015",
        contractId: "CCETTUF5VTAAKLCHOJMZGXXJYJMDARZQIR5MVTFRDLRL6XCV2NW3PEMO",
    }
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy(null, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAAAQAAAAAAAAAAAAAABEJvb2sAAAADAAAAAAAAAAZhdXRob3IAAAAAABAAAAAAAAAABW93bmVyAAAAAAAAEwAAAAAAAAAFdGl0bGUAAAAAAAAQ",
            "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAQAAAAEAAAAAAAAABEJvb2sAAAABAAAABg==",
            "AAAAAAAAAAAAAAAEbWludAAAAAQAAAAAAAAAAmlkAAAAAAAGAAAAAAAAAAV0aXRsZQAAAAAAABAAAAAAAAAABmF1dGhvcgAAAAAAEAAAAAAAAAAFb3duZXIAAAAAAAATAAAAAA==",
            "AAAAAAAAAAAAAAAIZ2V0X2Jvb2sAAAABAAAAAAAAAAJpZAAAAAAABgAAAAEAAAfQAAAABEJvb2s=",
            "AAAAAAAAAAAAAAAIdHJhbnNmZXIAAAACAAAAAAAAAAJpZAAAAAAABgAAAAAAAAAJbmV3X293bmVyAAAAAAAAEwAAAAA="]), options);
        this.options = options;
    }
    fromJSON = {
        mint: (this.txFromJSON),
        get_book: (this.txFromJSON),
        transfer: (this.txFromJSON)
    };
}
