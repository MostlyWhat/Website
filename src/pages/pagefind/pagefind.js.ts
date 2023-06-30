import type { APIContext } from "astro"

export async function get(_: APIContext) {
  return {
    body: 'export const search = () => {return {results: []}}'
  }
}