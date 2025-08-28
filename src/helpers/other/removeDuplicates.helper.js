const removeCaseInsensitiveDuplicates = (arr) => {
  if (!Array.isArray(arr)) return arr;
  const seen = new Set();
  return arr.filter((item) => {
    const lower = String(item).toLowerCase();
    if (seen.has(lower)) return false;
    seen.add(lower);
    return true;
  });
};

module.exports = {removeCaseInsensitiveDuplicates}