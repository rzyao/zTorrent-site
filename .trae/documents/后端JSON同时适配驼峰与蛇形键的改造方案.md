## 目标
- 在前端整体层面兼容后端返回JSON的键名风格：既支持camelCase（如`registrationEnabled`），也支持snake_case（如`registration_enabled`）。
- 不中断现有业务调用，尽量将适配放在HTTP响应统一入口，减少页面/业务代码分散改动。

## 现状与影响面
- `/auth/registration-enabled`由`AuthService.authControllerRegistrationEnabled()`调用（`src/api/services/AuthService.ts`），`Register.tsx`直接读取`status?.data?.data?.registrationEnabled`。
- HTTP层使用`axios`并通过`request.ts`与`OpenAPI.ts`封装（`src/api/core`）。当前无全局键名转换逻辑，仅在`useApi.ts`对令牌字段做了个别兼容。
- `InvitePage.tsx`未涉及该接口，不受影响。

## 方案设计
- 在HTTP响应统一入口对JSON进行“键名到camelCase”的深度转换：当后端返回snake_case时，转换为camelCase；当返回camelCase时保持不变。
- 保持转换范围仅限`application/json`响应，跳过二进制/表单响应；对数组/嵌套对象递归处理。
- 页面与业务代码继续按camelCase读取，避免到处写兼容分支。

## 修改项
1. 新增工具模块：`src/utils/caseTransform.ts`
   - 提供`toCamelCase(value: unknown): unknown`，对对象键进行递归snake_case→camelCase转换；数组与原始值保持类型。
   - 转换规则：`a_b`→`aB`，`alreadyCamel`保持不变；不处理包含特殊字符的键（如`__meta__`）可按白名单/简单判断跳过。

2. 接入HTTP层（优先方案）
   - 在`src/api/core/request.ts`中，统一在获取到`response.data`后调用`toCamelCase`（可放入`axios`的`transformResponse`或`request(...)`的处理分支）。
   - 仅当`Content-Type`为`application/json`时转换；其余类型直接返回。
   - 这样所有通过`AuthService`生成代码的接口，返回体都会自动变为camelCase。

3. 响应拦截器（可选增强）
   - 若考虑统一集中，可在`src/api/axiosInterceptors.ts`的`response`拦截器中引入转换逻辑。与第2条择一，避免重复转换。

4. 业务代码最小改动
   - `src/pages/Register.tsx`：删除对`registration_enabled`的临时容错分支（如果存在），统一按`registrationEnabled`读取即可，因为HTTP层已转换。
   - 其余业务保持不变；如遇直接用`fetch`绕过封装的代码，可后续逐步迁移或局部引入转换。

5. 安全与回滚
   - 在`OpenAPI`配置中加入可选开关（例如`OpenAPI.KEY_TRANSFORM = 'camel' | 'none'`），便于定位问题时快速关闭转换。
   - 转换函数保持纯函数，无副作用，不记录敏感信息。

## 验证与测试
- 单元测试：新增`src/utils/caseTransform.test.ts`
  - 覆盖：纯camelCase、纯snake_case、混合嵌套对象、数组元素为对象、边界键（数字开头/包含特殊字符）。
- 集成测试/模拟：对`AuthService.authControllerRegistrationEnabled()`模拟返回`{ data: { registration_enabled: true } }`，验证页面读取`registrationEnabled`仍为`true`。
- 手动验证：运行站点，检查注册页面门禁逻辑正常，确保其他JSON接口未受负面影响。

## 变更影响评估
- 对现有类型定义（如`RegistrationStatusDto`）无须变更，因运行时转换后键名与类型匹配；编译期类型保持camelCase。
- 性能影响有限（响应体通常较小）；如大对象场景可按需优化（例如跳过深层大数组）。

## 实施顺序
1. 添加`caseTransform.ts`并编写单元测试。
2. 在`request.ts`引入并应用`toCamelCase`于JSON响应。
3. 清理`Register.tsx`的键名容错读取分支，统一使用camelCase。
4. 验证与回滚开关测试，确保可控。

## 交付结果
- 全局支持后端JSON键的camelCase与snake_case双风格，业务代码以camelCase单一风格读取，降低维护成本并提高健壮性。