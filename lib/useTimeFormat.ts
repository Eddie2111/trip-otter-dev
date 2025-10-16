
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export const formatTimeAgo = (timestampValue: number) => {
  const date = dayjs(timestampValue);
  const today = dayjs();
  if (date.isSame(today, 'day')) {
    return date.fromNow();
  }
  else {
    return date.format("MMM D, YYYY h:mm A");
  }
};