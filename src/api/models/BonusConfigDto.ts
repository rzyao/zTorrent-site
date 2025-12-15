/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type BonusConfigDto = {
    /**
     * 仓储体积系数 - 每TB每小时产生的魔力值
     */
    storageVolumeCoefficient: number;
    /**
     * 仓储卡槽奖励 - 单个种子的最大卡槽收益
     */
    storageSlotReward: number;
    /**
     * 仓储效率曲线常数 - 用于计算不同体积种子的做种收益
     */
    storageEfficiencyCurve: number;
    /**
     * 交易基础单价 - 每GB的基准魔力值
     */
    tradingBasePrice: number;
    /**
     * 交易保底价格比例 - 最低价格占基础价格的比例
     */
    tradingMinPriceRatio: number;
    /**
     * 交易年龄增值系数 - 种子每年增值的比例
     */
    tradingAgeCoefficient: number;
    /**
     * 交易沉睡增值系数 - 种子每天沉睡增值的比例
     */
    tradingDormantCoefficient: number;
    /**
     * 交易稀缺系数 - 做种人数对价格的影响系数
     */
    tradingScarcityCoefficient: number;
    /**
     * 交易花费曲线常数 - 用于计算下载花费的年龄因子曲线
     */
    tradingCostAgeCurve: number;
    /**
     * 交易花费折扣系数 - 下载时的价格折扣倍数
     */
    tradingCostDiscount: number;
    /**
     * 交易收益奖励系数 - 上传时的收益奖励倍数
     */
    tradingRevenueBonus: number;
    /**
     * 锁定时长基准 (MB/s)
     */
    lockSpeedBenchmark?: number;
    /**
     * 最小锁定时长 (秒)
     */
    lockMinDuration?: number;
    /**
     * 最大锁定时长 (秒)
     */
    lockMaxDuration?: number;
};

