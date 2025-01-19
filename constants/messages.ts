export const Messages = {
  commonUserIdLengthError: (length: number) =>
    `User ID should be ${length.toString()} characters`,
  commonUserNotFoundById: (userId: string) =>
    `User with ID ${userId} not found`,
  commonUserNotFoundByEmail: (email: string) =>
    `User with email ${email} not found`,
  commonUserExistsByEmail: () => `This email is already taken`,
  commonUserExistsByUsername: (username: string) =>
    `User with username ${username} already exists`,
  commonDepositNotFound: () => "Deposit not found",
  commonUserNotFound: () => "User not found",
  commonInsufficientFunds: () => "Insufficient funds",
  commonLoginSuccess: () => "Login successful",
  commonLogoutSuccess: () => "Logout successful",
  commonTokenActive: () => "Token is active",
  commonWelcomeToGateway: () => "Welcome to LN Gateway",
};
