const { MongoClient } = require('mongodb');

const mongoOptions = {
    family: 4,
    maxPoolSize: 1,
    maxConnecting: 1,
    minPoolSize: 0,
    maxIdleTimeMS: 30000,
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000
};

const readClient = new MongoClient(
    process.env.MONGODB_READ_URI,
    mongoOptions
);

const writeClient = new MongoClient(
    process.env.MONGODB_WRITE_URI,
    mongoOptions
);

let readDB;
let writeDB;

async function connectWithRetry(client, name, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            await client.connect();
            console.log(`${name} database connected`);
            return;
        } catch (error) {
            console.log(
                `${name} connection attempt ${attempt}/${retries} failed`
            );

            if (attempt === retries) {
                throw error;
            }

            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }
}

async function connectDatabases() {
    try {
        await connectWithRetry(readClient, 'READ');
        await connectWithRetry(writeClient, 'WRITE');

        readDB = readClient.db('DB_23IT119');
        writeDB = writeClient.db('DB_23IT119');

    } catch (error) {
        try {
            await readClient.close();
        } catch {}

        try {
            await writeClient.close();
        } catch {}

        throw error;
    }
}

function getReadDB() {
    if (!readDB) {
        throw new Error('READ database is not connected');
    }

    return readDB;
}

function getWriteDB() {
    if (!writeDB) {
        throw new Error('WRITE database is not connected');
    }

    return writeDB;
}

module.exports = {
    connectDatabases,
    getReadDB,
    getWriteDB,
    getWriteClient: () => writeClient
};