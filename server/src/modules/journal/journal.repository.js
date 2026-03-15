import Journal from './journal.model.js';

class JournalRepository {
  async find(query, sort = { date: -1 }, limit = 10) {
    return Journal.find(query).sort(sort).limit(limit);
  }

  async findOne(query) {
    return Journal.findOne(query);
  }

  async create(data) {
    const journal = new Journal(data);
    return journal.save();
  }

  async delete(id, userId) {
    return Journal.findOneAndDelete({ _id: id, userId });
  }
}

export default new JournalRepository();
