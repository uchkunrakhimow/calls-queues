export const convertUnix = (milliseconds: number) => {
  const currentUnixTimeInSeconds = Math.floor(Date.now() / 1000);
  const elapsedSeconds = currentUnixTimeInSeconds - milliseconds;

  const elapsedDateTime = new Date(elapsedSeconds * 1000);
  const elapsedHours = elapsedDateTime.getUTCHours();
  const elapsedMinutes = elapsedDateTime.getUTCMinutes();
  const elapsedSecondsOnly = elapsedDateTime.getUTCSeconds();

  const formatTwoDigits = (value: number) =>
    value < 10 ? `0${value}` : `${value}`;

  return `${formatTwoDigits(elapsedHours)}:${formatTwoDigits(
    elapsedMinutes
  )}:${formatTwoDigits(elapsedSecondsOnly)}`;
};
