import { PersonModel } from '../db/models/person.model.js';

export class PersonRepository {
  findAll() {
    return PersonModel.find({ isDeleted: false }).lean();
  }

  findById(id) {
    return PersonModel.findOne({ _id: id, isDeleted: false });
  }

  create(payload) {
    return PersonModel.create(payload);
  }

  update(id, payload) {
    return PersonModel.findOneAndUpdate({ _id: id, isDeleted: false }, payload, { new: true });
  }

  async softDelete(id) {
    return PersonModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  }

  async softDeleteMany(ids) {
    return PersonModel.updateMany({ _id: { $in: ids } }, { isDeleted: true });
  }
}
