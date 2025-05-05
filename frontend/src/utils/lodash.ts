import _ from 'lodash'

export const takeRightSlug = (slug: string, key?: string): string => {
  const array = _.takeRight(_.split(slug, key || '-'))
  return array[0]
  // slug = "a-b-c-1" => return 1
}

export const split = (slug: string, key: string): string[] => {
  return _.split(slug, key)
  // slug ="/a/b/c/d" =>  ["a","b","c","d"]
}

export const setSearchParams = (slug: string): string => {
  return _.replace(slug, ' ', '+')
  // slug = "a b c 1" => return "a+b+c+1"
}

export const getSearchParams = (slug: string): string => {
  return _.replace(slug, '+', ' ')
  // slug = "a+b+c+1" => return "a b c 1"
}

// javascript
// get items in array
const array = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const firstFourItems = array.slice(0, 4)
// Output: [1, 2, 3, 4]

const lastFourItems = array.slice(-4)
// Output: [6, 7, 8, 9]

// remove item in array by key
export const lodash_pull = (list: string[], removekey: string) =>
  _.pull(list, removekey) //list = ['a','b','c','d'] => ['a', 'c', 'd']

// check item in array
export const lodash_includes = (array: string[], key: string): boolean => {
  // _.includes([1,2,3] , 1) => true
  return _.includes(array, key)
}

export function lodash_differenceBy<T>(source: T[], des: any, key: string) {
  // source = [{x:1, y:2}, {x:5, y:6}]
  // des = {x:1}]
  // key = "x" => return [{x:5,y:6}]
  return _.differenceBy(source, des, key)
}

export const concatItemToArray = (arr1: string[], arr2: string[]) =>
  _.concat(arr1, arr2)
