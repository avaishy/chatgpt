 14:27  error  Missing radix parameter  radix
  14:59  error  Missing radix parameter  radix
  15:10  error  Missing radix parameter  radix
  15:44  error  Missing radix parameter  radix
  54:9   error  'toast' is not defined   no-undef
   const formatDuration = (durationStr) => {
    if (!durationStr) return 'NA';
    const [hours, minutes, seconds] = durationStr.split(':');
    const formatted = `${(Number.parseInt(hours) > 0 ? `${Number.parseInt(hours)}h ` : '')
      + (Number.parseInt(minutes) > 0 ? `${Number.parseInt(minutes)}m ` : '')
    }${Math.floor(Number.parseFloat(seconds))}s`;
    return formatted;
  };
