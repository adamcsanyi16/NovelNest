function ketElem(first, second, value1, value2, data) {
  return (
    (first && second) ||
    (data.toLowerCase() === `${value1}` && data.toLowerCase() === `${value2}`)
  );
}

module.exports = { ketElem };
