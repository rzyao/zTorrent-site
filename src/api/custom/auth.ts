import { getOpenAPI, getRequest } from '../lazy'

export async function getProfile(): Promise<any> {
  const OpenAPI = await getOpenAPI();
  const request = await getRequest();
  const resp = await (request as any)(OpenAPI, {
    method: 'POST',
    url: '/auth/profile',
    body: {},
    mediaType: 'application/json',
  })
  return (resp as any)?.data ?? resp
}
