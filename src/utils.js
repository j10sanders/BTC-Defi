export const determineHelperText = (
  sigsRequired,
  submittedInitialDepositAmount,
  pendingDepositAddress
) => {
  if (
    (!submittedInitialDepositAmount && !pendingDepositAddress) ||
    sigsRequired === 2
  )
    return "Select deposit amount";
  if (sigsRequired === 1) return "One more signature left to go!";
  if (sigsRequired === 0) return "Deposit created";
};
