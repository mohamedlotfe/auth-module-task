import { MongoRepository, ObjectLiteral } from 'typeorm';
import { ObjectId } from 'mongodb';

export abstract class MongoBaseRepository<T extends ObjectLiteral> {
  constructor(protected readonly repository: MongoRepository<T>) {}

  findAll(): Promise<T[]> {
    return this.repository.find();
  }

  findById(id: string | ObjectId): Promise<T | null> {
    return this.repository.findOne({ where: { _id: new ObjectId(id) } });
  }

  create(entity: Partial<T>): Promise<T> {
    const newEntity = this.repository.create(entity as T);
    return this.repository.save(newEntity);
  }

  async update(id: string | ObjectId, entity: Partial<T>): Promise<T | null> {
    await this.repository.update(new ObjectId(id), entity);
    return this.findById(new ObjectId(id));
  }

  async delete(id: string | ObjectId): Promise<boolean> {
    const result = await this.repository.delete(new ObjectId(id));
    return (result.affected ?? 0) > 0;
  }

  findOne(filter: Partial<T>): Promise<T | null> {
    return this.repository.findOne({ where: filter });
  }

  findMany(filter: Partial<T>): Promise<T[]> {
    return this.repository.find({ where: filter });
  }
}
