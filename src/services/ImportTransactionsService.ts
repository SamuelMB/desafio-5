import Transaction from '../models/Transaction';
import uploadConfig from '../config/upload';
import path from 'path';
import fs from 'fs';
import parse from 'csv-parse';
import { getRepository, getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from './CreateTransactionService';

interface csvDTO {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(filename: string): Promise<Transaction[]> {
    const createTransactionService = new CreateTransactionService();

    const filePath = path.join(uploadConfig.directory, filename);

    const records = await this.parseCsvFile(filePath);

    return Promise.all(
      records.map(async record => {
        return await createTransactionService.execute({
          title: record.title,
          type: record.type,
          value: record.value,
          categoryTitle: record.category,
        });
      }),
    );
  }

  private parseCsvFile(filePath: string): Promise<csvDTO[]> {
    return new Promise((resolve, reject) => {
      const records: any[] = [];
      const parser = parse({ delimiter: ',', columns: true, trim: true });
      fs.createReadStream(filePath)
        .pipe(parser)
        .on('data', row => {
          records.push({
            title: row.title,
            type: row.type.trim(),
            value: Number(row.value.trim()),
            category: row.category.trim(),
          });
        })
        .on('end', () => resolve(records))
        .on('error', error => reject(error));
    });
  }
}

export default ImportTransactionsService;
