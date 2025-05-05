import _ from 'lodash'

export function getObjectHasChanged<T>(
  dirtyFields: any,
  formData: any,
): Partial<T> {
  // omit remove key: false
  const keys1 = _.keysIn(_.omitBy(dirtyFields, (value) => value === false))
  let obj = {}
  for (let key of keys1) {
    if (dirtyFields[key as keyof T] !== formData[key as keyof T]) {
      if (formData[key as keyof T]) {
        _.assign(obj, { [key]: formData[key as keyof T] })
      }
    }
  }
  return obj
}

export function getMetadataHasChanged<T>(currentData: T, data: T): Partial<T> {
  const keys1 = _.keysIn(currentData)
  let obj = {}
  for (let key of keys1) {
    if (currentData[key as keyof T] !== data[key as keyof T]) {
      if (data[key as keyof T]) {
        _.assign(obj, { [key]: data[key as keyof T] })
      }
    }
  }
  return obj
}

// export function ObjectRemoveNull<T>(obj: any): Partial<T> {
//   const object = Object.fromEntries(
//     Object.entries(obj).filter(([_, v]) => v != null)
//   );
//   return object;
// }
