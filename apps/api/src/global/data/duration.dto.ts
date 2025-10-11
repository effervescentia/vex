import { t } from 'elysia';
import parseDuration from 'parse-duration';

export const DurationDTO = t
  .Transform(t.String({ minLength: 2, maxLength: 10 }))
  .Decode((value) => {
    const seconds = parseDuration(value, 's');

    if (seconds === null) throw new Error(`Duration '${value}' is not valid`);

    return seconds;
  })
  .Encode(null!);
