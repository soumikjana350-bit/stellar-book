"use client";

import {
  Networks,
  TransactionBuilder,
  Keypair,
  rpc,
} from "@stellar/stellar-sdk";
import { AssembledTransaction } from "@stellar/stellar-sdk/contract";
import {
  isConnected,
  getAddress,
  signTransaction,
  setAllowed,
  isAllowed,
  requestAccess,
} from "@stellar/freighter-api";
import * as contractClient from "../packages/contract/dist";

// ============================================================
// CONSTANTS — Update these for your contract
// ============================================================

/** Your deployed Soroban contract ID */
export const CONTRACT_ADDRESS =
  "CCETTUF5VTAAKLCHOJMZGXXJYJMDARZQIR5MVTFRDLRL6XCV2NW3PEMO";

/** Network passphrase (testnet by default) */
export const NETWORK_PASSPHRASE = Networks.TESTNET;

/** Soroban RPC URL */
export const RPC_URL = "https://soroban-testnet.stellar.org";

/** Horizon URL */
export const HORIZON_URL = "https://horizon-testnet.stellar.org";

/** Network name for Freighter */
export const NETWORK = "TESTNET";

// ============================================================
// RPC Server Instance
// ============================================================

const server = new rpc.Server(RPC_URL);

// ============================================================
// Wallet Helpers
// ============================================================

export async function checkConnection(): Promise<boolean> {
  const result = await isConnected();
  return result.isConnected;
}

export async function connectWallet(): Promise<string> {
  const connResult = await isConnected();
  if (!connResult.isConnected) {
    throw new Error("Freighter extension is not installed or not available.");
  }

  const allowedResult = await isAllowed();
  if (!allowedResult.isAllowed) {
    await setAllowed();
    await requestAccess();
  }

  const { address } = await getAddress();
  if (!address) {
    throw new Error("Could not retrieve wallet address from Freighter.");
  }
  return address;
}

export async function getWalletAddress(): Promise<string | null> {
  try {
    const connResult = await isConnected();
    if (!connResult.isConnected) return null;

    const allowedResult = await isAllowed();
    if (!allowedResult.isAllowed) return null;

    const { address } = await getAddress();
    return address || null;
  } catch {
    return null;
  }
}

// ============================================================
// Contract Client Helpers
// ============================================================

/**
 * Sign and send a transaction using the contract client's built-in method.
 */
async function signAndSend(tx: { signAndSend: () => Promise<unknown> }) {
  try {
    const signed = await tx.signAndSend();
    return signed;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "Transaction failed");
  }
}

// ============================================================
// Book NFT — Contract Methods
// ============================================================

/**
 * Mint a Book NFT.
 * Calls: mint(id: u64, title: String, author: String, owner: Address)
 */
export async function mintBook(
  caller: string,
  id: number,
  title: string,
  author: string
) {
  const client = new contractClient.Client({
    networkPassphrase: NETWORK_PASSPHRASE,
    contractId: CONTRACT_ADDRESS,
    rpcUrl: RPC_URL,
  });

  const tx = await client.mint({
    id: BigInt(id),
    title,
    author,
    owner: caller,
  });

  return signAndSend(tx);
}

/**
 * Get a Book's details (read-only).
 * Calls: get_book(id: u64) -> Book
 * Returns: { title: string, author: string, owner: string } or null
 */
export async function getBook(id: number, caller?: string) {
  const client = new contractClient.Client({
    networkPassphrase: NETWORK_PASSPHRASE,
    contractId: CONTRACT_ADDRESS,
    rpcUrl: RPC_URL,
  });

  try {
    const tx = await client.get_book({ id: BigInt(id) });
    const result = await tx.simulate();
    return result.result;
  } catch {
    return null;
  }
}

/**
 * Transfer ownership of a Book NFT.
 * Calls: transfer(id: u64, new_owner: Address)
 */
export async function transferBook(
  caller: string,
  id: number,
  newOwner: string
) {
  const client = new contractClient.Client({
    networkPassphrase: NETWORK_PASSPHRASE,
    contractId: CONTRACT_ADDRESS,
    rpcUrl: RPC_URL,
  });

  const tx = await client.transfer({
    id: BigInt(id),
    new_owner: newOwner,
  });

  return signAndSend(tx);
}