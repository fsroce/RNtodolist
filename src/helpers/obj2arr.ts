function obj2arr <T extends Record<string | number, any>> (obj: T): T[keyof T][] {
  return Object.keys(obj).map(key => obj[key]);
}

export default obj2arr;
