import { SyntheticEvent } from 'react';
import BrokenLink from '../broken-link.svg';

function handleIconError(e: SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.src = BrokenLink;
}

export { handleIconError };
