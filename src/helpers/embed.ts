import {MouseEvent, ChangeEvent } from 'react';

function isEmptyEmbed(embed: any): boolean {
  const keys = Object.keys(embed);

  const visibleKeys = [
    'title',
    'author name',
    'fields',
    'footer text',
    'thumbnail url',
    'description',
    'image'
  ];

  for (const key of visibleKeys) {
    const [k, l] = key.split(' ');

    if (keys.includes(k) && ((l && embed[k][l]) || (!l && embed[k]))) {
      return false;
    }
  }

  return true;
}

function getClickedField(
  messageId: number,
  e:
    | MouseEvent<HTMLLabelElement>
    | ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
): number | null {
  const parent = e.currentTarget.parentElement;
  const fieldsContainer = document.querySelector(`[id='${messageId}']`);
  const fields = fieldsContainer?.querySelectorAll('.field');

  if (!fields) return null;

  let clickedField: number | null = null;
  for (const [i, f] of Object.entries(fields)) {
    if (f === parent) {
      clickedField = +i;
      break;
    }
  }
  return clickedField;
}

export { isEmptyEmbed, getClickedField };
