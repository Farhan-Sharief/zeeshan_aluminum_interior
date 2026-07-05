function normalizeCategoryName(name) {
  if (!name) return '';
  return name
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map(word => {
      if (word === 'tv') return 'TV';
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

module.exports = normalizeCategoryName;
