import 'dotenv/config';
import { execSync } from 'child_process';

try {
  const result = execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: { ...process.env }
  });
  console.log('Migration completed successfully');
  process.exit(0);
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
}
