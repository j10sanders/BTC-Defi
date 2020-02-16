export const determineHelperText = (
  sigsRequired,
  submittedInitialDepositAmount,
  pendingDepositAddress
) => {
  if (
    (!submittedInitialDepositAmount && !pendingDepositAddress) ||
    sigsRequired === 2
  )
    return "Choose the amount of Bitcoin you'd like to deposit";
  if (sigsRequired === 1) return "One more signature left to go!";
  if (sigsRequired === 0) return "Deposit created";
};
