function arr2obj<T>(arr: T[], key: keyof T) {
  return arr.reduce((obj, item) => {
    return { ...obj, [item[key] as number | string]: item };
  }, {});
}

export default arr2obj;
