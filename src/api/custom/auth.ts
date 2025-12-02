import { OpenAPI } from '../core/OpenAPI'
import { request as __request } from '../core/request'

export async function getProfile(): Promise<any> {
  const resp = await __request(OpenAPI, {
    method: 'POST',
    url: '/auth/profile',
    body: {},
    mediaType: 'application/json',
  })
  return (resp as any)?.data ?? resp
}
