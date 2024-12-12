const Airtable = require('airtable');
const fs = require('fs');
const path = require('path');

const BASE_ID = 'apppvmEYnXEXlBqtp';
const API_KEY = 'patOvmYCU09qjXnbD.1eb2b6b8fcd2a9f3e45fb4835494cad3d9782f12fe7314b4eb7edb14deccf4f5'; // FYI Nope, it's not valid anymore!

const airtable = new Airtable({ apiKey: API_KEY });
const base = airtable.base(BASE_ID);

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

  return response.json();
}

// Fetch data from all tables
async function exportData() {
  const schema = await fetchSchema();
  const tables = schema.tables;

  for (const table of tables) {
    const tableName = table.name;
    const records = [];

    let offset = 0;

    do {
      const response = await base(tableName).select({
        view: "Grid view", // Adjust as needed
        offset: offset,
      }).all();

      records.push(...response);

      offset = response.offset;
    } while (offset);

    const formattedRecords = records.map((record) => ({
      id: record.id,
      ...record.fields,
    }));

    const filePath = path.resolve(__dirname, `${tableName}.csv`);
    const csvData = convertToCSV(formattedRecords);

    fs.writeFileSync(filePath, csvData);

    console.log(`Exported data for table ${tableName} to ${filePath}`);
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
    console.log('Fetching schema...');
    await exportData();
    console.log('Data export completed successfully.');
  } catch (error) {
    console.error('Error exporting data:', error);
  }
})();
