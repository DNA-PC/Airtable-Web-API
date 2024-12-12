const Airtable = require('airtable');

const BASE_ID = 'apppvmEYnXEXlBqtp';
const API_KEY = 'patOvmYCU09qjXnbD.1483e1c2f4ccc9f7d3178547175216cf6ad0c6d501f9273eef39fdd04f6d3064';
const TABLE_NAME = 'People';

// Static data as dataset
const dataset = Array.from({ length: 35 }, (_, i) => ({
  id: `rec${i + 1}`,
  name: `Person ${i + 1}`,
  email: `person${i + 1}@example.com`,
  age: Math.floor(Math.random() * 50), // Random age between 0 and 49
}));

// Initialize Airtable
const base = new Airtable({ apiKey: API_KEY }).base(BASE_ID);

async function upsertRecords() {
  const existingRecords = await base(TABLE_NAME).select({
    fields: ['id'],
  }).all();

  const existingRecordMap = existingRecords.reduce((acc, record) => {
    acc[record.fields.id] = record.id;
    return acc;
  }, {});

  // Process records in batches of 10
  for (let i = 0; i < dataset.length; i += 10) {
    const batch = dataset.slice(i, i + 10);
    const createPromises = [];
    const updatePromises = [];

    for (const record of batch) {
      const { id, ...fields } = record;

      if (existingRecordMap[id]) {
        // Update existing record
        updatePromises.push(base(TABLE_NAME).update(existingRecordMap[id], fields));
      } else {
        // Create a new record
        createPromises.push(base(TABLE_NAME).create({ id, ...fields }));
      }
    }

    // Await all batch operations
    await Promise.all([...createPromises, ...updatePromises]);
  }
}

async function deleteUnderageRecords() {
  const recordsToDelete = await base(TABLE_NAME)
    .select({
      filterByFormula: 'age < 18',
    })
    .all();

  const deletePromises = [];

  for (let i = 0; i < recordsToDelete.length; i += 10) {
    const batch = recordsToDelete.slice(i, i + 10);
    const idsToDelete = batch.map((record) => record.id);

    deletePromises.push(base(TABLE_NAME).destroy(idsToDelete));
  }

  await Promise.all(deletePromises);
}

(async () => {
  try {
    await upsertRecords();
    console.log('Records processed successfully.');

    await deleteUnderageRecords();
    console.log('Underage records deleted successfully.');
  } catch (error) {
    console.error('Error processing records:', error);
  }
})();
