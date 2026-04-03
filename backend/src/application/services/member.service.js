import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { PersonRepository } from '../../infrastructure/repositories/person.repository.js';
import { writeAuditLog } from './audit.service.js';

const personRepository = new PersonRepository();

const getDescendants = (targetId, people) => {
  const byParent = new Map();
  people.forEach((p) => {
    if (!byParent.has(p.parentId)) byParent.set(p.parentId, []);
    byParent.get(p.parentId).push(p._id);
  });
  const descendants = [];
  const stack = [targetId];
  while (stack.length) {
    const current = stack.pop();
    const children = byParent.get(current) || [];
    for (const child of children) {
      descendants.push(child);
      stack.push(child);
    }
  }
  return descendants;
};

export class MemberService {
  async listMembers() {
    return personRepository.findAll();
  }

  async createMember(input, user) {
    const id = input.id && uuidValidate(input.id) ? input.id : input.id || uuidv4();
    const payload = {
      _id: id,
      name: input.name,
      hindiName: input.hindiName,
      isLate: Boolean(input.isLate),
      parentId: input.parentId || null,
      childrenIds: [],
      isRoot: Boolean(input.isRoot)
    };
    const created = await personRepository.create(payload);
    if (payload.parentId) {
      const parent = await personRepository.findById(payload.parentId);
      if (parent) {
        parent.childrenIds = [...new Set([...(parent.childrenIds || []), created._id])];
        await parent.save();
      }
    }
    await writeAuditLog({ action: 'member.create', userId: user.id, entityId: created._id, entityType: 'Person', changes: payload });
    return created;
  }

  async updateMember(id, input, user) {
    const before = await personRepository.findById(id);
    const updated = await personRepository.update(id, input);
    await writeAuditLog({ action: 'member.update', userId: user.id, entityId: id, entityType: 'Person', changes: { before, after: updated } });
    return updated;
  }

  async deleteMember(id, strategy, reassignTo, user) {
    const target = await personRepository.findById(id);
    if (!target) throw new Error('Member not found');
    if (target.isRoot) throw new Error('Root member cannot be deleted');

    const people = await personRepository.findAll();
    const descendants = getDescendants(id, people);

    if (descendants.length && strategy === 'reassign') {
      if (!reassignTo) throw new Error('reassignTo required for reassign strategy');
      for (const childId of target.childrenIds || []) {
        await personRepository.update(childId, { parentId: reassignTo });
      }
      const newParent = await personRepository.findById(reassignTo);
      if (newParent) {
        newParent.childrenIds = [...new Set([...(newParent.childrenIds || []), ...(target.childrenIds || [])])];
        await newParent.save();
      }
      await personRepository.softDelete(id);
    } else {
      await personRepository.softDeleteMany([id, ...descendants]);
    }

    if (target.parentId) {
      const parent = await personRepository.findById(target.parentId);
      if (parent) {
        parent.childrenIds = (parent.childrenIds || []).filter((childId) => childId !== id);
        await parent.save();
      }
    }

    await writeAuditLog({ action: 'member.delete', userId: user.id, entityId: id, entityType: 'Person', changes: { strategy, reassignTo, descendants } });
    return { success: true };
  }
}
