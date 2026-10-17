# 规则失灵了！

一个与 Math Motion Lab 并行的儿童数学叙事解谜游戏。当前版本只制作“夜影农场”纵向切片，用鸡兔同笼验证核心玩法：玩家直接操作世界、从错误实验中获得信息，并把可靠方法教给机器人“小错”。

## 当前范围

- 目标年龄：8–11 岁
- 目标设备：平板横屏优先，桌面浏览器兼容
- 单次体验：3–5 分钟
- 技术：原生 HTML、CSS、SVG、JavaScript ES modules
- 外部依赖：无

## 本地预览

在仓库根目录运行：

```powershell
node games/rule-repair/scripts/serve.mjs
```

打开：

```text
http://127.0.0.1:4173/
```

## 验证

```powershell
node games/rule-repair/tests/farm-model.test.mjs
node games/rule-repair/tests/game-state.test.mjs
git diff --check -- games/rule-repair
```

## 文档

- `CLAUDE.md`：产品与工程约束
- `DESIGN.md`：游戏视觉和动效合同
- `docs/game-vision.md`：产品愿景与核心循环
- `docs/art-direction.md`：纸艺美术方向与资产策略
- `docs/vertical-slice.md`：夜影农场关卡流程和验收标准
