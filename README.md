# Let's Chat

Let's Chat is a simple decentralized chat app demonstrating the [Irys SDK](https://docs.irys.xyz/developer-docs/irys-sdk) and [query package](https://docs.irys.xyz/developer-docs/querying/query-package).

It allows users across the globe to chat using a simple CLI interface. New chats are posted to Irys; the chat message and screen name are stored as metadata tags. The timestamp of each chat message is generated by Irys at upload time and is contained in the upload receipt.

The chat history is generated in real-time using the Irys query package. There is no local caching of chat messages or history, this is obviously bad from a performance standpoint and was done to simply the project.

## Installation

1. Rename `.env.example` to be `.env` and populate it with an EVM-style private key linked to a wallet [funded with Mumbai MATIC](https://mumbaifaucet.com/).
2. `npm install`
3. `npm run letschat.js _____` (make sure to give yourself a handle)

## How To Use

Just chat.

## Moving Off Devnet

Let's Chat is configured to run on Irys' Devnet where uploads are paid by free faucet currencies and where uploads are kept for ~60 days.

On Irys' Node 2, uploads of less than 100Kib are currently free and since chat messages are generally short, you could move this app to Node 2 and (likely) continue to run it for free. To do so, you would change the `getIrys()` function from:

```js
const getIrys = async () => {
	const url = "https://devnet.irys.xyz";
	const providerUrl = "https://rpc-mumbai.maticvigil.com";
	const token = "matic";

	const irys = new Irys({
		url, // URL of the node you want to connect to
		token, // Token used for payment
		key: process.env.PRIVATE_KEY, // Private key
		config: { providerUrl }, // Optional provider URL, only required when using Devnet
	});
	return irys;
};
```

to

```js
const getIrys = async () => {
	const url = "https://node2.irys.xyz";
	const providerUrl = "https://rpc-mumbai.maticvigil.com";
	const token = "matic";

	const irys = new Irys({
		url, // URL of the node you want to connect to
		token, // Token used for payment
		key: process.env.PRIVATE_KEY, // Private key
	});
	return irys;
};
```

and also comment out `fundOnLoad()`, as funding would no longer be needed.

## About Irys

Irys is the only provenance layer. It enables users to scale permanent data and precisely attribute its origin.

A provenance layer is a ledger of record for digital information, tracking the origins and modifications of data.

Data [uploaded to Irys](https://docs.irys.xyz/learn/transaction-lifecycle) is permanent, precise, and unconstrained.

-   **Permanent**: 
    Data stored on Irys is [censorship-resistant and immutable, forever](https://docs.irys.xyz/overview/permanent-data). There's no counterparty
    risk of data being removed.

-   **Precise**: 
    Each piece of data is [timestamped with a high-precision timestamp](https://docs.irys.xyz/learn/receipts), providing a reliable sequence of
    events.

-   **Unconstrained**: 
    Users can always read, write, and easily discover data at any scale, making the data fully composable. Irys is permissionless
    and offers limitless permanent data, enabling it to provide provenance for all information.

All uploads to Irys are verifiable. After uploading data, you’re given a receipt that can be used by anyone to [verify](https://docs.irys.xyz/learn/receipts) the data’s provenance at any time.

## Building with Irys

Irys's [developer tools](https://docs.irys.xyz/overview/tools) make it easy to add permanent data with strong provenance to your projects.
