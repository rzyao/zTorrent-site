import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { BonusService, CancelablePromise } from "@/api";
import type { BonusConfigDto, SimulationRequestDto, SimulationResultDto } from "@/api";

export function useBonusRules() {
  const [volRate, setVolRate] = useState(0.5);
  const [slotMax, setSlotMax] = useState(1);
  const [sigmoidC, setSigmoidC] = useState(20);
  const [basePrice, setBasePrice] = useState(20);
  const [kt, setKt] = useState(0.05);
  const [kn, setKn] = useState(0.5);
  const [pMinRatio, setPMinRatio] = useState(0.1);
  const [kAge, setKAge] = useState(0);
  const [costCurveC, setCostCurveC] = useState(1);

  const [loadingConfig, setLoadingConfig] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [baseline, setBaseline] = useState<BonusConfigDto | null>(null);

  // Simulation State
  const [userDays, setUserDays] = useState(30);
  const [userCount, setUserCount] = useState(100);
  const [avgSize, setAvgSize] = useState(5);
  const [dormantDays, setDormantDays] = useState(5);
  const [peers, setPeers] = useState(5);
  const [age, setAge] = useState(0);
  const [upload, setUpload] = useState(0);
  const [download, setDownload] = useState(0);

  const [loadingSim, setLoadingSim] = useState(false);
  const [simError, setSimError] = useState<string | null>(null);
  const [simResult, setSimResult] = useState<SimulationResultDto | null>(null);

  // Confirmation Dialog State
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);

  const configPendingRef = useRef<CancelablePromise<any> | null>(null);
  const simPendingRef = useRef<CancelablePromise<any> | null>(null);
  const debounceRef = useRef<number | null>(null);

  const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
  const safeParseNum = (v: any, fallback: number) => {
    if (v === "" || v === null || v === undefined) return fallback;
    const n = typeof v === "number" ? v : parseFloat(String(v));
    return Number.isFinite(n) ? n : fallback;
  };
  const handleNumberChange =
    (setter: (n: number) => void, min: number, max: number) => (e: any) => {
      const n = safeParseNum(e.target.value, min);
      setter(clamp(n, min, max));
    };

  const fmt = (n: number) => {
    if (!Number.isFinite(n)) return String(n);
    return n.toFixed(4).replace(/\.?0+$/, "");
  };

  useEffect(() => {
    setLoadingConfig(true);
    setConfigError(null);
    configPendingRef.current?.cancel();
    const p = BonusService.bonusConfigControllerRead();
    configPendingRef.current = p;
    p.then((res: any) => {
      const data: BonusConfigDto = (res as any)?.data ?? (res as any);
      if (data) {
        setVolRate(clamp(safeParseNum(data.storageVolumeCoefficient, volRate), 0, 5));
        setSlotMax(clamp(safeParseNum(data.storageSlotReward, slotMax), 0, 50));
        setSigmoidC(clamp(safeParseNum(data.storageEfficiencyCurve, sigmoidC), 1, 100));
        setBasePrice(clamp(safeParseNum(data.tradingBasePrice, basePrice), 1, 100));
        setKt(clamp(safeParseNum(data.tradingDormantCoefficient, kt), 0, 0.5));
        setKn(clamp(safeParseNum(data.tradingScarcityCoefficient, kn), 0, 2.0));
        setPMinRatio(clamp(safeParseNum(data.tradingMinPriceRatio, pMinRatio), 0, 1.0));
        setKAge(clamp(safeParseNum(data.tradingAgeCoefficient, kAge), 0, 999999));
        setCostCurveC(clamp(safeParseNum(data.tradingCostAgeCurve, costCurveC), 0.1, 100));
        setBaseline({
          storageVolumeCoefficient: clamp(
            safeParseNum(data.storageVolumeCoefficient, volRate),
            0,
            5,
          ),
          storageSlotReward: clamp(safeParseNum(data.storageSlotReward, slotMax), 0, 50),
          storageEfficiencyCurve: clamp(
            safeParseNum(data.storageEfficiencyCurve, sigmoidC),
            1,
            100,
          ),
          tradingBasePrice: clamp(safeParseNum(data.tradingBasePrice, basePrice), 1, 100),
          tradingDormantCoefficient: clamp(
            safeParseNum(data.tradingDormantCoefficient, kt),
            0,
            0.5,
          ),
          tradingScarcityCoefficient: clamp(
            safeParseNum(data.tradingScarcityCoefficient, kn),
            0,
            2.0,
          ),
          tradingMinPriceRatio: clamp(safeParseNum(data.tradingMinPriceRatio, pMinRatio), 0, 1.0),
          tradingAgeCoefficient: clamp(safeParseNum(data.tradingAgeCoefficient, kAge), 0, 999999),
          tradingCostAgeCurve: clamp(safeParseNum(data.tradingCostAgeCurve, costCurveC), 0.1, 100),
          tradingCostDiscount: 1,
          tradingRevenueBonus: 1,
        });
      }
    })
      .catch((e: any) => {
        if (e?.message?.includes("aborted") || e?.message?.includes("cancel")) {
          return;
        }
        setConfigError(e?.message ?? "加载配置失败");
      })
      .finally(() => {
        setLoadingConfig(false);
        if (configPendingRef.current === p) configPendingRef.current = null;
      });
    return () => {
      configPendingRef.current?.cancel();
      simPendingRef.current?.cancel();
    };
  }, []);

  const changes = useMemo(() => {
    if (!baseline)
      return {
        volRate: false,
        slotMax: false,
        sigmoidC: false,
        basePrice: false,
        kt: false,
        kn: false,
        pMinRatio: false,
        kAge: false,
        costCurveC: false,
      };
    return {
      volRate: volRate !== baseline.storageVolumeCoefficient,
      slotMax: slotMax !== baseline.storageSlotReward,
      sigmoidC: sigmoidC !== baseline.storageEfficiencyCurve,
      basePrice: basePrice !== baseline.tradingBasePrice,
      kt: kt !== baseline.tradingDormantCoefficient,
      kn: kn !== baseline.tradingScarcityCoefficient,
      pMinRatio: pMinRatio !== baseline.tradingMinPriceRatio,
      kAge: kAge !== baseline.tradingAgeCoefficient,
      costCurveC: costCurveC !== baseline.tradingCostAgeCurve,
    };
  }, [baseline, volRate, slotMax, sigmoidC, basePrice, kt, kn, pMinRatio, kAge, costCurveC]);

  const diffList = useMemo(() => {
    if (!baseline) return [];
    const list: Array<{
      key: string;
      name: string;
      before: number;
      after: number;
    }> = [];
    const configMap = {
      volRate: { name: "仓储体积系数(svc)", value: volRate },
      slotMax: { name: "仓储卡槽奖励(ssr)", value: slotMax },
      sigmoidC: { name: "仓储效率曲线常数(sec)", value: sigmoidC },
      basePrice: { name: "交易基础单价(tbp)", value: basePrice },
      kt: { name: "交易沉睡增值系数(tdc)", value: kt },
      kn: { name: "交易稀缺系数(tsc)", value: kn },
      pMinRatio: { name: "交易保底价格比例(tmpr)", value: pMinRatio },
      kAge: { name: "交易年龄增值系数(tac)", value: kAge },
      costCurveC: { name: "交易花费曲线常数(tcac)", value: costCurveC },
    } as const;
    const keyToApiField: Record<string, keyof BonusConfigDto> = {
      volRate: "storageVolumeCoefficient",
      slotMax: "storageSlotReward",
      sigmoidC: "storageEfficiencyCurve",
      basePrice: "tradingBasePrice",
      kt: "tradingDormantCoefficient",
      kn: "tradingScarcityCoefficient",
      pMinRatio: "tradingMinPriceRatio",
      kAge: "tradingAgeCoefficient",
      costCurveC: "tradingCostAgeCurve",
    };
    Object.entries(configMap).forEach(([key, { name, value }]) => {
      const apiField = keyToApiField[key];
      const baselineValue = apiField ? baseline[apiField] : undefined;
      if (value !== baselineValue) {
        list.push({ key, name, before: baselineValue as number, after: value });
      }
    });
    return list;
  }, [baseline, volRate, slotMax, sigmoidC, basePrice, kt, kn, pMinRatio, kAge, costCurveC]);

  // Just triggers the confirmation dialog
  const attemptSave = () => {
    if (saving || loadingConfig || diffList.length === 0) return;
    setSaveConfirmOpen(true);
  };

  // The actual save logic
  const executeSave = () => {
    const payload: BonusConfigDto = {
      storageVolumeCoefficient: volRate,
      storageSlotReward: slotMax,
      storageEfficiencyCurve: sigmoidC,
      tradingBasePrice: basePrice,
      tradingMinPriceRatio: pMinRatio,
      tradingAgeCoefficient: kAge,
      tradingDormantCoefficient: kt,
      tradingScarcityCoefficient: kn,
      tradingCostAgeCurve: costCurveC,
      tradingCostDiscount: baseline?.tradingCostDiscount ?? 1,
      tradingRevenueBonus: baseline?.tradingRevenueBonus ?? 1,
    };
    setSaving(true);
    setConfigError(null);
    setSaveConfirmOpen(false); // Close modal potentially or keep open? Usually close.

    const p = BonusService.bonusConfigControllerUpdate(payload as any);
    configPendingRef.current?.cancel();
    configPendingRef.current = p;
    return p
      .then(() => {
        const rp = BonusService.bonusConfigControllerRead();
        configPendingRef.current = rp;
        return rp.then((res: any) => {
          const data: BonusConfigDto = (res as any)?.data ?? (res as any);
          if (data) {
            setVolRate(clamp(safeParseNum(data.storageVolumeCoefficient, volRate), 0, 5));
            setSlotMax(clamp(safeParseNum(data.storageSlotReward, slotMax), 0, 50));
            setSigmoidC(clamp(safeParseNum(data.storageEfficiencyCurve, sigmoidC), 1, 100));
            setBasePrice(clamp(safeParseNum(data.tradingBasePrice, basePrice), 1, 100));
            setKt(clamp(safeParseNum(data.tradingDormantCoefficient, kt), 0, 0.5));
            setKn(clamp(safeParseNum(data.tradingScarcityCoefficient, kn), 0, 2.0));
            setPMinRatio(clamp(safeParseNum(data.tradingMinPriceRatio, pMinRatio), 0, 1.0));
            setKAge(clamp(safeParseNum(data.tradingAgeCoefficient, kAge), 0, 999999));
            setCostCurveC(clamp(safeParseNum(data.tradingCostAgeCurve, costCurveC), 0.1, 100));
            setBaseline({
              storageVolumeCoefficient: clamp(
                safeParseNum(data.storageVolumeCoefficient, volRate),
                0,
                5,
              ),
              storageSlotReward: clamp(safeParseNum(data.storageSlotReward, slotMax), 0, 50),
              storageEfficiencyCurve: clamp(
                safeParseNum(data.storageEfficiencyCurve, sigmoidC),
                1,
                100,
              ),
              tradingBasePrice: clamp(safeParseNum(data.tradingBasePrice, basePrice), 1, 100),
              tradingDormantCoefficient: clamp(
                safeParseNum(data.tradingDormantCoefficient, kt),
                0,
                0.5,
              ),
              tradingScarcityCoefficient: clamp(
                safeParseNum(data.tradingScarcityCoefficient, kn),
                0,
                2.0,
              ),
              tradingMinPriceRatio: clamp(
                safeParseNum(data.tradingMinPriceRatio, pMinRatio),
                0,
                1.0,
              ),
              tradingAgeCoefficient: clamp(
                safeParseNum(data.tradingAgeCoefficient, kAge),
                0,
                999999,
              ),
              tradingCostAgeCurve: clamp(
                safeParseNum(data.tradingCostAgeCurve, costCurveC),
                0.1,
                100,
              ),
              tradingCostDiscount: data.tradingCostDiscount ?? 1,
              tradingRevenueBonus: data.tradingRevenueBonus ?? 1,
            });
            toast.success("配置保存成功！");
          }
        });
      })
      .catch((e: any) => {
        setConfigError(e?.message ?? "保存配置失败");
        toast.error(`保存失败：${e?.message ?? "保存配置失败"}`);
      })
      .finally(() => {
        setSaving(false);
        configPendingRef.current = null;
      });
  };

  const handleSimulate = () => {
    if (loadingSim) return;
    const payload: SimulationRequestDto = {
      userDays,
      userCount,
      avgSize,
      dormantDays,
      peers: Math.max(1, peers),
      age,
      upload,
      download,
      configOverride: {
        storageVolumeCoefficient: volRate,
        storageSlotReward: slotMax,
        storageEfficiencyCurve: sigmoidC,
        tradingBasePrice: basePrice,
        tradingDormantCoefficient: kt,
        tradingScarcityCoefficient: kn,
        tradingMinPriceRatio: pMinRatio,
        tradingAgeCoefficient: kAge,
        tradingCostAgeCurve: costCurveC,
        tradingCostDiscount: baseline?.tradingCostDiscount ?? 1,
        tradingRevenueBonus: baseline?.tradingRevenueBonus ?? 1,
      },
    } as any;
    setLoadingSim(true);
    setSimError(null);
    simPendingRef.current?.cancel();
    const p = BonusService.bonusSimulatorControllerSimulate(payload as any);
    simPendingRef.current = p;
    p.then((res: any) => {
      const data: SimulationResultDto = (res as any)?.data ?? (res as any);
      setSimResult(data ?? null);
    })
      .catch((e: any) => {
        if (e?.message?.includes("aborted") || e?.message?.includes("cancel")) {
          return;
        }
        setSimError(e?.message ?? "计算失败，已使用本地公式");
        setSimResult(null);
      })
      .finally(() => {
        setLoadingSim(false);
        if (simPendingRef.current === p) simPendingRef.current = null;
      });
  };

  const handleReset = () => {
    if (!baseline) return;
    setVolRate(baseline.storageVolumeCoefficient);
    setSlotMax(baseline.storageSlotReward);
    setSigmoidC(baseline.storageEfficiencyCurve);
    setBasePrice(baseline.tradingBasePrice);
    setKt(baseline.tradingDormantCoefficient);
    setKn(baseline.tradingScarcityCoefficient);
    setPMinRatio(baseline.tradingMinPriceRatio);
    setKAge(baseline.tradingAgeCoefficient);
    setCostCurveC(baseline.tradingCostAgeCurve);
  };

  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      handleSimulate();
    }, 300);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [
    userDays,
    userCount,
    avgSize,
    dormantDays,
    peers,
    age,
    upload,
    download,
    volRate,
    slotMax,
    sigmoidC,
    basePrice,
    kt,
    kn,
    pMinRatio,
    kAge,
    costCurveC,
  ]);

  const efficiencyCurve = (size: number, c: number) => {
    return (size * size) / (size * size + c);
  };

  const results = useMemo(() => {
    const totalVolGB = userCount * avgSize;
    const totalVolTB = totalVolGB / 1024;
    const rentVol = totalVolTB * volRate;
    const efficiency = efficiencyCurve(avgSize, sigmoidC);
    const rentSlotTotal = slotMax * efficiency * userCount;
    const hourlyRent = rentVol + rentSlotTotal;
    const totalPeriodRent = hourlyRent * (userDays * 24);
    const factorNumerator = 1 + kt * dormantDays + kAge * age;
    const peersClamped = Math.max(1, peers);
    const scarcityFactor = 1 / (1 + kn * Math.log(peersClamped));
    const rawPrice = basePrice * factorNumerator * scarcityFactor;
    const minPrice = basePrice * pMinRatio;
    const unitPrice = Math.max(minPrice, rawPrice);
    const totalSales = unitPrice * upload;
    // 计算交易收益分解
    const baseRevenue = basePrice * scarcityFactor * upload;
    const ageRevenue = basePrice * kAge * age * scarcityFactor * upload;
    const dormantRevenue = basePrice * kt * dormantDays * scarcityFactor * upload;
    return {
      totalVolTB,
      efficiency,
      rentVol,
      rentSlotTotal,
      hourlyRent,
      totalPeriodRent,
      timeFactor: 1 + kt * dormantDays,
      ageFactor: kAge * age,
      scarcityFactor,
      rawPrice,
      minPrice,
      unitPrice,
      totalSales,
      baseRevenue,
      ageRevenue,
      dormantRevenue,
      tradingCost: 0,
      grandTotal: totalPeriodRent + totalSales,
      totalHours: userDays * 24,
    };
  }, [
    volRate,
    slotMax,
    sigmoidC,
    basePrice,
    kt,
    kn,
    pMinRatio,
    kAge,
    userDays,
    userCount,
    avgSize,
    dormantDays,
    peers,
    upload,
  ]);

  const view = simResult ?? results;

  return {
    fmt,
    baseline,
    changes,
    diffList,
    loadingConfig,
    configError,
    saving,
    volRate,
    slotMax,
    sigmoidC,
    basePrice,
    kt,
    kn,
    pMinRatio,
    kAge,
    costCurveC,
    setVolRate,
    setSlotMax,
    setSigmoidC,
    setBasePrice,
    setKt,
    setKn,
    setPMinRatio,
    setKAge,
    setCostCurveC,
    handleNumberChange,

    // Actions
    handleSaveConfig: attemptSave, // Rename logic
    executeSave, // Expose for UI
    saveConfirmOpen, // Expose State
    setSaveConfirmOpen,

    handleReset,
    userDays,
    userCount,
    avgSize,
    dormantDays,
    peers,
    age,
    upload,
    download,
    setUserDays,
    setUserCount,
    setAvgSize,
    setDormantDays,
    setPeers,
    setAge,
    setUpload,
    setDownload,
    loadingSim,
    simError,
    view,
  };
}
