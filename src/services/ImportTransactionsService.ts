import { getRepository, In } from 'typeorm';
import csvParse from 'csv-parse';
import fs from 'fs';
import Category from '../models/Category';
import Transaction from '../models/Transaction';

// import Transaction from '../models/Transaction';

interface CSVTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const contactsReadStream = fs.createReadStream(filePath);

    const transactions: CSVTransaction[] = [];
    const categories: string[] = [];

    const categoryRepository = getRepository(Category);
    const transactionRepository = getRepository(Transaction);

    const parsers = csvParse({
      from_line: 2,
    });

    const parserCSV = contactsReadStream.pipe(parsers);

    parserCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );

      if (!title || !type || !value) return;

      categories.push(category);

      transactions.push({ title, type, value, category });
    });

    await new Promise(resolve => parserCSV.on('end', resolve));

    // Mapeando CATEGORIAS no banco de dados
    const existsCategory = await categoryRepository.find({
      where: {
        title: In(categories),
      },
    });

    const existsCategoryTitle = existsCategory.map(
      (category: Category) => category.title,
    );

    const addCategoryTitles = categories
      .filter(category => !existsCategoryTitle.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);

    const newCategories = categoryRepository.create(
      addCategoryTitles.map(title => ({
        title,
      })),
    );

    await categoryRepository.save(newCategories);

    const finalCategories = [...newCategories, ...existsCategory];

    const createTransactions = transactionRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: finalCategories.find(category => category.title),
      })),
    );

    await transactionRepository.save(createTransactions);

    await fs.promises.unlink(filePath);

    return createTransactions;
  }
}

export default ImportTransactionsService;
