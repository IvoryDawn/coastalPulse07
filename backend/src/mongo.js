import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';

dotenv.config();

let cachedClient = null;
let cachedDb = null;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'pro0039';

export async function getMongoClient() {
	if (cachedClient && cachedDb) return cachedClient;
	const client = new MongoClient(MONGODB_URI, {
		serverApi: {
			version: ServerApiVersion.v1,
			strict: false,
			deprecationErrors: false,
		},
	});
	await client.connect();
	cachedClient = client;
	cachedDb = client.db(MONGODB_DB);
	return cachedClient;
}

export async function getDb() {
	if (!cachedDb) {
		await getMongoClient();
	}
	return cachedDb;
}

export async function getCollection(name) {
	const db = await getDb();
	return db.collection(name);
}

export async function disconnectMongo() {
	if (cachedClient) {
		await cachedClient.close();
		cachedClient = null;
		cachedDb = null;
	}
}

