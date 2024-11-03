import * as bcrypt from 'bcryptjs';

export const encryptPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(4);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};
