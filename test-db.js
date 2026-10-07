require('dotenv').config();

const {
    connectDatabases,
    getReadDB,
    getWriteDB
} = require('./config/db');

async function testDatabaseConnections() {
    try {
        await connectDatabases();

        const readResult = await getReadDB()
            .collection('books')
            .findOne({});

        console.log('READ test:', readResult);

        const writeCollection = getWriteDB().collection('books');

        const testBook = {
            productCode: '119TEST',
            title: 'Test Book',
            author: 'Test Author',
            price: 100
        };

        const writeResult = await writeCollection.insertOne(testBook);

        console.log('WRITE test:', writeResult.acknowledged);

        process.exit(0);
    } catch (error) {
        console.error('Database test failed:', error);
        process.exit(1);
    }
}

testDatabaseConnections();
