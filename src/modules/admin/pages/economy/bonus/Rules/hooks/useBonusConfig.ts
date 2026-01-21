import { useEffect, useRef, useState } from 'react'
import { BonusService, CancelablePromise } from '@/api'
import type { BonusConfigDto } from '@/api'

export function useBonusConfig() {
  const [config, setConfig] = useState<BonusConfigDto | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const pendingRef = useRef<CancelablePromise<any> | null>(null)

  const reload = () => {
    setLoading(true)
    setError(null)
    pendingRef.current?.cancel()
    const p = BonusService.bonusConfigControllerRead()
    pendingRef.current = p
    p.then((res: any) => {
      const data: BonusConfigDto = (res as any)?.data ?? (res as any)
      setConfig(data ?? null)
    }).catch((e: any) => {
      setError(e?.message ?? '加载配置失败')
    }).finally(() => {
      setLoading(false)
      if (pendingRef.current === p) pendingRef.current = null
    })
  }

  const save = (payload: BonusConfigDto) => {
    if (saving) return Promise.resolve()
    setSaving(true)
    setError(null)
    pendingRef.current?.cancel()
    const p = BonusService.bonusConfigControllerUpdate(payload as any)
    pendingRef.current = p
    return p.then(() => reload())
      .catch((e: any) => {
        setError(e?.message ?? '保存配置失败')
      }).finally(() => {
        setSaving(false)
        pendingRef.current = null
      })
  }

  useEffect(() => {
    reload()
    return () => pendingRef.current?.cancel()
  }, [])

  return { config, loading, error, saving, reload, save }
}
