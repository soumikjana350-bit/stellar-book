import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
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
} as const


export interface Book {
  author: string;
  owner: string;
  title: string;
}

export type DataKey = {tag: "Book", values: readonly [u64]};

export interface Client {
  /**
   * Construct and simulate a mint transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  mint: ({id, title, author, owner}: {id: u64, title: string, author: string, owner: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_book transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_book: ({id}: {id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<Book>>

  /**
   * Construct and simulate a transfer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  transfer: ({id, new_owner}: {id: u64, new_owner: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAQAAAAAAAAAAAAAABEJvb2sAAAADAAAAAAAAAAZhdXRob3IAAAAAABAAAAAAAAAABW93bmVyAAAAAAAAEwAAAAAAAAAFdGl0bGUAAAAAAAAQ",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAQAAAAEAAAAAAAAABEJvb2sAAAABAAAABg==",
        "AAAAAAAAAAAAAAAEbWludAAAAAQAAAAAAAAAAmlkAAAAAAAGAAAAAAAAAAV0aXRsZQAAAAAAABAAAAAAAAAABmF1dGhvcgAAAAAAEAAAAAAAAAAFb3duZXIAAAAAAAATAAAAAA==",
        "AAAAAAAAAAAAAAAIZ2V0X2Jvb2sAAAABAAAAAAAAAAJpZAAAAAAABgAAAAEAAAfQAAAABEJvb2s=",
        "AAAAAAAAAAAAAAAIdHJhbnNmZXIAAAACAAAAAAAAAAJpZAAAAAAABgAAAAAAAAAJbmV3X293bmVyAAAAAAAAEwAAAAA=" ]),
      options
    )
  }
  public readonly fromJSON = {
    mint: this.txFromJSON<null>,
        get_book: this.txFromJSON<Book>,
        transfer: this.txFromJSON<null>
  }
}