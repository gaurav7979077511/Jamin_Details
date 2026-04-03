import { connectDb } from '../config/db.js';
import { flattenTree } from '../utils/tree.js';
import { PersonModel } from '../infrastructure/db/models/person.model.js';
import { UserModel } from '../infrastructure/db/models/user.model.js';
import { registerUser } from '../application/services/auth.service.js';
import tree from './family-tree.json' assert { type: 'json' };

const run = async () => {
  await connectDb();
  const flattened = flattenTree(tree);
  await PersonModel.deleteMany({});
  await PersonModel.insertMany(flattened);

  await UserModel.deleteMany({ email: { $in: ['editor@example.com', 'viewer@example.com'] } });
  await registerUser({ name: 'Editor', email: 'editor@example.com', password: 'password123', role: 'editor' });
  await registerUser({ name: 'Viewer', email: 'viewer@example.com', password: 'password123', role: 'viewer' });

  console.log(`Seeded ${flattened.length} people`);
  process.exit(0);
};

run();
