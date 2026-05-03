/**
 * @description
 * A type that represents the relationship between a parent stop and its child stops.
 * It can be an array of objects where each object has a `parent` property (a string) and a `children` property (an array of strings),
 * or it can be an array of strings representing the parent stops without any children. (In this case, the parent stops have children seen under `Oznacniky`)
 */
export type StopParentChildrenRelation = ({ parent: string; children: string[] } | string)[]