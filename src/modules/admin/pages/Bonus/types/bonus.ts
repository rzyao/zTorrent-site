export type UserBonusBalance = {
  userId: string
  username?: string
  balance: string
  lockedBalance: string
  isFrozen: 0 | 1
  updatedAt?: string
}

export type UserBonusLedger = {
  userId: string
  username?: string
  delta: string
  reason: string
  refType?: string
  refId?: string
  externalRef?: string
  type: string
  correlationId?: string
  createdAt?: string
  balanceAfter?: string
}

export type PageResp<T> = {
  items: T[]
  total: number
  page: number
  pageSize: number
}
