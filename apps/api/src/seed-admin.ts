import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { User, UserRole } from './users/user.entity';

const ds = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User],
});

async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      'ADMIN_EMAIL and ADMIN_PASSWORD must be set in the environment',
    );
  }

  await ds.initialize();

  const userRepo = ds.getRepository(User);

  const existingAdmin = await userRepo.findOne({
    where: { email: adminEmail },
  });

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  if (existingAdmin) {
    existingAdmin.passwordHash = passwordHash;
    existingAdmin.role = UserRole.ADMIN;
    existingAdmin.isActive = true;

    await userRepo.save(existingAdmin);

    console.log(`Admin user updated: ${adminEmail}`);
  } else {
    const admin = userRepo.create({
      email: adminEmail,
      passwordHash,
      role: UserRole.ADMIN,
      isActive: true,
    });

    await userRepo.save(admin);

    console.log(`Admin user created: ${adminEmail}`);
  }

  await ds.destroy();
}

seedAdmin().catch(async (error) => {
  console.error('Admin seed failed:', error);

  if (ds.isInitialized) {
    await ds.destroy();
  }

  process.exit(1);
});
