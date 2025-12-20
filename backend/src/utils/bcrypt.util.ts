import * as bcrypt from 'bcrypt';
const saltRounds = 10;

export const hashPassword = async (
  myPlaintextPassword: string,
): Promise<string> => {
  const hash = await bcrypt.hash(myPlaintextPassword.trim(), saltRounds);

  return hash;
};
