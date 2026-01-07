export type StoreItem = {
  id?: string
  key: string
  title: string
  type: 'virtual' | 'privilege' | 'service'
  pricePoints: number
  status: 'active' | 'inactive'
  stock?: number | null
  createdAt?: string
  updatedAt?: string
}

export type StoreOrder = {
  id: string
  userId: string
  itemId: string
  status: 'created' | 'paid' | 'delivered' | 'failed' | 'refunded'
  pointsCharged: number
  quantity: number
  deliveryResult?: Record<string, any> | null
  createdAt?: string
  updatedAt?: string
}

export type ListStoreOrdersDto = {
  userId?: string
  itemId?: string
  status?: 'created' | 'paid' | 'delivered' | 'failed' | 'refunded'
  from?: string
  to?: string
  page: number
  pageSize: number
}

export type CreateStoreItemDto = {
  key: string
  title: string
  type: 'virtual' | 'privilege' | 'service'
  pricePoints: number
  status?: 'active' | 'inactive'
  stock?: number | null
}

export type UpdateStoreItemDto = {
  id?: string
  title?: string
  type?: 'virtual' | 'privilege' | 'service'
  pricePoints?: number
  status?: 'active' | 'inactive'
  stock?: number | null
}

export type ToggleStoreItemDto = {
  id?: string
  key?: string
  status: 'active' | 'inactive'
}

export type DeleteStoreItemDto = {
  id?: string
  key?: string
}

export type AdjustBonusDto = {
  userId: string
  amount: number
  type: 'credit' | 'debit'
  reason: string
  ref?: string
}

export type BonusAdjustment = {
  id: string
  userId: string
  amount: number
  type: 'credit' | 'debit'
  reason: string
  ref?: string | null
  operator?: string
  createdAt?: string
}

export type ListBonusAdjustmentsDto = {
  userId?: string
  start?: string
  end?: string
  page: number
  pageSize: number
}

