export function set(obj: any, path: string|string[], value: any): void {
  const pathArray: string[] = Array.isArray(path) ? path : path.match(/([^[.\]])+/g);

  pathArray.reduce((acc: string, key: string, i: number) => {
    if (acc[key] === undefined) {
      acc[key] = {};
    }

    if (i === pathArray.length - 1) {
      acc[key] = value;
    }

    return acc[key];
  }, obj);
}
