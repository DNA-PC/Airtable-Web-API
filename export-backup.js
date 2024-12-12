const Airtable = require('airtable');
const fs = require('fs');
const path = require('path');

const BASE_ID = 'apppvmEYnXEXlBqtp';
const API_KEY = 'patOvmYCU09qjXnbD.1eb2b6b8fcd2a9f3e45fb4835494cad3d9782f12fe7314b4eb7edb14deccf4f5'; // FYI Nope, it's not valid anymore!

const airtable = new Airtable({ apiKey: API_KEY });
const base = airtable.base(BASE_ID);

// Generate dynamic folder with timestamp
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupFolder = path.resolve(__dirname, 'backups', timestamp);
fs.mkdirSync(backupFolder, { recursive: true });

// Export schema
async function fetchSchema() {
  const schemaUrl = `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables`;
  const response = await fetch(schemaUrl, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch schema: ${response.statusText}`);
  }

  const schema = await response.json();

  // Save schema to schema.json
  const schemaFilePath = path.resolve(backupFolder, 'schema.json');
  fs.writeFileSync(schemaFilePath, JSON.stringify(schema, null, 2));

  console.log(`Schema exported to ${schemaFilePath}`);
  return schema;
}

// Fetch data from all tables
async function exportData() {
  const schema = await fetchSchema();
  const tables = schema.tables;

  for (const table of tables) {
    const tableName = table.name;
    const records = [];

    let offset = 0; // Must be a number

    do {
      const response = await base(tableName).select({
        offset: offset,
        pageSize: 100,
      }).eachPage((pageRecords, fetchNextPage) => {
        records.push(...pageRecords);
        fetchNextPage();
      });

      offset = records.length % 100 === 0 ? records.length : null;
    } while (offset);

    const formattedRecords = records.map((record) => ({
      id: record.id,
      ...record.fields,
    }));

    // Save as CSV
    const csvFilePath = path.resolve(backupFolder, `${tableName}.csv`);
    const csvData = convertToCSV(formattedRecords);
    fs.writeFileSync(csvFilePath, csvData);
    console.log(`Exported data for table ${tableName} to ${csvFilePath}`);

    // Save as JSON
    const jsonFilePath = path.resolve(backupFolder, `${tableName}.json`);
    fs.writeFileSync(jsonFilePath, JSON.stringify(formattedRecords, null, 2));
    console.log(`Exported data for table ${tableName} to ${jsonFilePath}`);
  }
}

// Convert JSON data to CSV
function convertToCSV(data) {
  if (!data.length) return '';

  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers.map((header) => JSON.stringify(row[header] || '')).join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}

(async () => {
  try {
    console.log(`Exporting backup to ${backupFolder}...`);
    await exportData();
    console.log('Data export completed successfully.');
  } catch (error) {
    console.error('Error exporting data:', error);
  }
})();
