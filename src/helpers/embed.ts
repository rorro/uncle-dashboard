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

export { isEmptyEmbed };
