import { SyntheticEvent } from 'react';

function handleIconError(e: SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.src = 'https://i.imgur.com/F0yt4Gr.png';
}

export { handleIconError };
