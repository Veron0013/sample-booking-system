import * as bcrypt from 'bcrypt';
import { User } from 'generated/prisma/client';
const saltRounds = 10;

export const hashPassword = async (
  myPlaintextPassword: string,
): Promise<string> => {
  const hash = await bcrypt.hash(myPlaintextPassword.trim(), saltRounds);

  return hash;
};

export const isPasswordsEqual = async (
  plainPassword: string,
  hashedPassword: User['password'],
) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};
