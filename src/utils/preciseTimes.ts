enum PeriodsInMillseconds {
  hour = 60 * 60 * 1000,
  minute = 60 * 1000,
  second = 1000,
  tick = 600
}

export function timeInMilliseconds(time: string) {
  const splitTime = time.split(':');
  const hours: number = Number(splitTime.at(-3))
    ? Number(splitTime.at(-3)) * PeriodsInMillseconds.hour
    : 0;
  const minutes: number = Number(splitTime.at(-2))
    ? Number(splitTime.at(-2)) * PeriodsInMillseconds.minute
    : 0;
  const seconds: number = Number(splitTime.at(-1)?.split('.')[0])
    ? Number(splitTime.at(-1)?.split('.')[0]) * PeriodsInMillseconds.second
    : 0;
  const milliseconds: number = Number(splitTime.at(-1)?.split('.')[1])
    ? Number(splitTime.at(-1)?.split('.')[1]) * 10
    : 0;

  return hours + minutes + seconds + milliseconds;
}

export function timeInHumanReadable(time: number): string {
  const hours = Math.floor(time / PeriodsInMillseconds.hour);
  const minutes = Math.floor((time - hours * PeriodsInMillseconds.hour) / PeriodsInMillseconds.minute);
  const seconds = Math.floor(
    (time - hours * PeriodsInMillseconds.hour - minutes * PeriodsInMillseconds.minute) /
      PeriodsInMillseconds.second
  );
  const milliseconds =
    (time -
      hours * PeriodsInMillseconds.hour -
      minutes * PeriodsInMillseconds.minute -
      seconds * PeriodsInMillseconds.second) /
    10;

  let humanReadable = '';
  humanReadable +=
    hours > 0
      ? `${padNumber(hours)}:${padNumber(minutes)}:${padNumber(seconds)}.${padNumber(milliseconds)}`
      : minutes > 0
      ? `${padNumber(minutes)}:${padNumber(seconds)}.${padNumber(milliseconds)}`
      : `${padNumber(seconds)}.${padNumber(milliseconds)}`;

  return humanReadable;
}

function padNumber(num: number): string {
  if (num < 10) {
    return '0' + num;
  } else {
    return num + '';
  }
}

function isMultipleOfTick(time: string) {
  return timeInMilliseconds(time) % PeriodsInMillseconds.tick === 0;
}

export function findNextMultiple(time: string) {
  const to_test = [time + '.00', time + '.20', time + '.40'];
  for (const tt of to_test) {
    if (isMultipleOfTick(tt)) {
      return tt;
    }
  }

  return 'No multiple';
}
