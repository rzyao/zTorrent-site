/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SimulationResultDto = {
    /**
     * 总做种体积 (TB)
     */
    totalVolTB: number;
    /**
     * 效率因子
     */
    efficiency: number;
    /**
     * 体积收益 (每小时)
     */
    rentVol: number;
    /**
     * 卡槽收益 (每小时)
     */
    rentSlotTotal: number;
    /**
     * 每小时总仓储收益
     */
    hourlyRent: number;
    /**
     * 周期内总仓储收益
     */
    totalPeriodRent: number;
    /**
     * 沉睡因子 (唤醒)
     */
    timeFactor: number;
    /**
     * 年龄因子 (种龄)
     */
    ageFactor: number;
    /**
     * 稀缺因子
     */
    scarcityFactor: number;
    /**
     * 原始单价
     */
    rawPrice: number;
    /**
     * 保底单价
     */
    minPrice: number;
    /**
     * 最终单价
     */
    unitPrice: number;
    /**
     * 交易总收益 (上传)
     */
    totalSales: number;
    /**
     * 基础收益 (仅含稀缺因子)
     */
    baseRevenue: number;
    /**
     * 种龄收益 (年龄因子带来的额外收益)
     */
    ageRevenue: number;
    /**
     * 唤醒收益 (沉睡因子带来的额外收益)
     */
    dormantRevenue: number;
    /**
     * 魔力值总计 (仓储+交易)
     */
    grandTotal: number;
    /**
     * 总小时数
     */
    totalHours: number;
    /**
     * 交易花费 (下载)
     */
    tradingCost: number;
};

