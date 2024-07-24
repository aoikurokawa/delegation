import { Connection, Keypair, PublicKey } from "@solana/web3.js";

import wallet from "./dev-wallet.json";
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { IDL, WbaPrereq } from "./programs/wba_prereq";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

// const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
const keypair = Keypair.fromSeed(Uint8Array.from(bs58.decode(wallet).slice(0, 32)));

const connection = new Connection("https://api.devnet.solana.com");

const github = Buffer.from("aoikurokawa", "utf-8");

const provider = new AnchorProvider(connection, new Wallet(keypair), {commitment: "confirmed"});

const program: Program<WbaPrereq> = new Program(IDL, provider);

const enrollment_seeds = [Buffer.from("prereq"), keypair.publicKey.toBuffer()];
const [enrollment_key, _bump] = PublicKey.findProgramAddressSync(enrollment_seeds, program.programId);

(async () => {
    try {
        const txHash = await program.methods.complete(github).accounts({signer: keypair.publicKey}).signers([keypair]).rpc();

        console.log(`Success! Check out your TX here: https://explorer.com/tx/${txHash}?cluster=devnet`);
    } catch (error) {
        console.log(`Oops, something went wrong: ${error}`);
    }
})();
