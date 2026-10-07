require('dotenv').config();

const { webcrypto } = require('crypto');
globalThis.crypto = webcrypto;

const { MongoClient } = require('mongodb');

const client = new MongoClient(
    process.env.MONGODB_READ_URI,
    {
        family: 4,
        maxPoolSize: 1,
        serverSelectionTimeoutMS: 30000
    }
);

async function testReadPermission() {
    try {
        await client.connect();

        const db = client.db('DB_23IT119');
        const books = db.collection('books');

        console.log('READ connection: OK');

        try {
            await books.insertOne({
                productCode: '119READTEST',
                title: 'READ Test',
                author: 'Test',
                priceBeforeTax: 100,
                priceAfterTax: 115,
                vat: 15
            });

            console.log('READ INSERT: UNEXPECTEDLY SUCCEEDED');
        } catch (error) {
            console.log('READ INSERT: DENIED');
            console.log('Error code:', error.code);
            console.log('Error codeName:', error.codeName);
        }

    } catch (error) {
        console.error('Connection test failed:', error);
    } finally {
        await client.close();
    }
}

testReadPermission();
