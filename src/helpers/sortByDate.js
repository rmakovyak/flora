import { DateTime } from 'luxon';

export default function sortByDate(list) {
  return list.sort(
    (a, b) =>
      DateTime.fromISO(a.creationDate) - DateTime.fromISO(b.creationDate),
  );
}
