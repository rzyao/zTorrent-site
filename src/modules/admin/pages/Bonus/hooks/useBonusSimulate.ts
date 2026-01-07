import { useRef, useState } from 'react'
import { BonusService, CancelablePromise } from '@/api'
import type { SimulationRequestDto, SimulationResultDto } from '@/api'

export function useBonusSimulate() {
  const [result, setResult] = useState<SimulationResultDto | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const pendingRef = useRef<CancelablePromise<any> | null>(null)

  const simulate = (payload: SimulationRequestDto) => {
    if (loading) return Promise.resolve()
    setLoading(true)
    setError(null)
    pendingRef.current?.cancel()
    const p = BonusService.bonusSimulatorControllerSimulate(payload as any)
    pendingRef.current = p
    return p.then((res: any) => {
      const data: SimulationResultDto = (res as any)?.data ?? (res as any)
      setResult(data ?? null)
    }).catch((e: any) => {
      setError(e?.message ?? '计算失败')
      setResult(null)
    }).finally(() => {
      setLoading(false)
      if (pendingRef.current === p) pendingRef.current = null
    })
  }

  return { result, loading, error, simulate }
}
