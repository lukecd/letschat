import readline from "readline";
import process from "process";

import Irys from "@irys/sdk";
import Query from "@irys/query";

import dotenv from "dotenv";
dotenv.config();

// Connects to an Irys node
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

// Checks if we have a funded balance and funds if not
const fundOnLoad = async () => {
	try {
		const irys = await getIrys();

		const atomicBalance = await irys.getLoadedBalance();
		const convertedBalance = irys.utils.fromAtomic(atomicBalance);
		if (convertedBalance <= 0.05) {
			const fundTx = await irys.fund(irys.utils.toAtomic(0.05));
		}
	} catch (e) {
		console.log("Error funding node ", e);
	}
};

// Utility function to format timestamps
const formatTimestamp = (unixTimestamp) => {
	const date = new Date(unixTimestamp);
	return date.toLocaleString("en-US", { hour12: true, hour: "numeric", minute: "numeric" });
};

// Utility function to parse tags
const parseTags = (tags) => {
	const screenNameTag = tags.find((tag) => tag.name === "screenName");
	const messageTag = tags.find((tag) => tag.name === "message");
	return {
		screenName: screenNameTag ? screenNameTag.value : "Unknown",
		message: messageTag ? messageTag.value : "",
	};
};

// Write the latest message to Arweave using Irys
const storeMessage = async (message) => {
	const irys = await getIrys();
	const tags = [
		{ name: "application-id", value: "letschat" },
		{ name: "screenName", value: screenName },
		{ name: "message", value: message },
	];

	try {
		const receipt = await irys.upload(message, { tags });
		// console.log(`Message stored at https://gateway.irys.xyz/${receipt.id}`);
	} catch (e) {
		console.log("Error uploading data ", e);
	}
};

// Get the chat history and updates the chat
const updateChat = async () => {
	const myQuery = new Query({ url: "https://devnet.irys.xyz/graphql" });
	const results = await myQuery
		.search("irys:transactions")
		.tags([{ name: "application-id", values: ["letschat"] }])
		.sort("ASC");
	// .limit(20);

	// Move cursor to the beginning and clear down
	readline.cursorTo(process.stdout, 0, 0);
	readline.clearScreenDown(process.stdout);

	console.log("Latest Chats:\n");
	results.forEach((msg) => {
		const { screenName, message } = parseTags(msg.tags);
		console.log(`[${formatTimestamp(msg.timestamp)}] ${screenName}: ${message}`);
	});

	// Reset the prompt position
	rl.prompt(true);
};

// Ensure the user passed in a screen name
const [, , screenName] = process.argv;
if (!screenName) {
	console.error("Please provide a screen name.");
	process.exit(1);
}

// Read in a new line of data
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	prompt: `${screenName}> `,
});

// Check that we have enough funds to pay for uploads
fundOnLoad();

// Get the chat history
updateChat();

// Update chat every .5 seconds
setInterval(updateChat, 500);

rl.on("line", (line) => {
	storeMessage(line);
	updateChat();
}).on("close", () => {
	process.exit(0);
});
