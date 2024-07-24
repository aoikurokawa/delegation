import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";

import wallet from "./dev-wallet.json";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

const from = Keypair.fromSeed(Uint8Array.from(bs58.decode(wallet).slice(0, 32)));
const to = new PublicKey("GLtaTaYiTQrgz411iPJD79rsoee59HhEy18rtRdrhEUJ");;

const connection = new Connection("https://api.devnet.solana.com");

(async () => {
    try {
        const transaction = new Transaction();
        transaction.add(SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: to,
            lamports: LAMPORTS_PER_SOL / 100,
        }));
        transaction.recentBlockhash = (await connection.getLatestBlockhash("confirmed")).blockhash;
        transaction.feePayer = from.publicKey;

        const signature = await sendAndConfirmTransaction(connection, transaction, [from]);
        console.log(`Success! Check out your TX here: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
    } catch (error) {
        console.error(`Oops, something went wrong: ${error}`);
    }
})();

(async () => {
    try {
        const balance = await connection.getBalance(from.publicKey);

        const transaction = new Transaction();
        transaction.add(SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: to,
            lamports: balance,
        }));
        transaction.recentBlockhash = (await connection.getLatestBlockhash("confirmed")).blockhash;
        transaction.feePayer = from.publicKey;

        const fee = (await connection.getFeeForMessage(transaction.compileMessage(), "confirmed")).value || 0;

        transaction.instructions.pop();

        transaction.add(SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: to,
            lamports: balance - fee,
        }));

        const signature = await sendAndConfirmTransaction(connection, transaction, [from]);
        console.log(`Success! Check out your TX here: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
    } catch (error) {
        console.error(`Oops, something went wrong: ${error}`);
    }
})();