const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();


async function main() {
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri, { useNewUrlParser: true });

    try {
        await client.connect();

        // await listDatabases(client);
        await createDatabase(client, 'cryptocore');
        await createListing(client, {
            name: 'Bitcoin',
            symbol: 'BTC',
            price: '$12,000',
            difference: '1.2%',
            low: '$10,000',
            high: '$13,000',
            circulatingSupply: '18,874,850.00 BTC',
            circulatingSupplyPercent: '90%',
            maxSupply: '21,000,000.00 BTC',
            volume: '$45,811,949,125',
            volumePercent: '65.22',
        });
        await listDatabases(client);
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

// create an async function that checks if database exists and creates it if it doesn't
async function createDatabase(client, dbName) {
    const db = client.db(dbName);
    const result = await db.admin().listDatabases();
    if (result.databases.some(db => db.name === dbName)) {
        console.log(`Database ${dbName} already exists`);
    } else {
        await db.createCollection('customers');
        console.log(`Database ${dbName} created`);
    }
}

async function listDatabases(client) {
    const databaseList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databaseList.databases.forEach(db => {
        console.log(`- ${db.name}`);
    });
}

async function createListing(client, newListing) {
    const result = await client.db('cryptocore').collection('currencies').insertOne(newListing);

    console.log(`New listing created with following id: ${result.insertedId}`);
}

main().catch(console.error);