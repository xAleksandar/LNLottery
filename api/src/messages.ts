export const Messages = {
  commonUserIdLengthError: (length: number) =>
    `User ID should be ${length.toString()} characters`,
  commonUserNotFoundById: (userId: string) =>
    `User with ID ${userId} not found`,
  commonUserNotFoundByEmail: (email: string) =>
    `User with email ${email} not found`,
  commonUserExistsByEmail: (email: string) =>
    `User with email ${email} already exists`,
  commonUserExistsByUsername: (username: string) =>
    `User with username ${username} already exists`,
  commonPaymentNotFound: () => 'Payment not found',
  commonUserNotFound: () => 'User not found',
};
