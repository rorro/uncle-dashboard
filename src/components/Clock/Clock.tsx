import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useEffect, useState } from 'react';

dayjs.extend(utc);

function Clock() {
  const [now, setNow] = useState<Dayjs>(dayjs());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(dayjs());
    }, 60 * 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const currentTimeInUTC = now.utc().format('MMMM DD, YYYY HH:mm UTC');

  return <span className="current_time">{currentTimeInUTC}</span>;
}

export default Clock;
