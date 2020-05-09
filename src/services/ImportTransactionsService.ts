import csvParse from 'csv-parse';
import fs from 'fs';
// import Transaction from '../models/Transaction';

class ImportTransactionsService {
  async execute(filePath: string): Promise<void> {
    const contacsReadStream = fs.createReadStream(filePath);

    const transcations = [];
    const categories = [];

    const parsers = csvParse({
      from_line: 2,
    });

    const parserCSV = contacsReadStream.pipe(parsers);

    const response = await parserCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );

      if (!title || !type || !value) return;

      categories.push(category);

      transcations.push({ title, type, value, category });
    });

    console.log(response);
  }
}

export default ImportTransactionsService;
