# Rule Repair Game 开发规范

## 适用范围与优先级

- 本文件只适用于 `games/rule-repair/`。
- 本目录是与 Math Motion Lab 并行的新游戏产品，不是课程页、讲题页或现有页面的改版。
- 本目录内的产品定位、结构和视觉规则覆盖仓库根目录中面向 Math Motion Lab 的对应约定。
- 不导入、不复制、不改造根目录 `assets/`、`lessons/`、`DESIGN.md` 或既有课程页面。唯一允许继承的是题目本身及其经过验证的数学关系。

## 产品定位

- 面向 8–11 岁儿童的单人叙事解谜游戏，平板横屏优先，桌面浏览器兼容。
- 玩家通过直接操作世界、观察结果、推翻错误规律和迁移方法来解决问题。
- 数学关系必须成为游戏机制，禁止用“答题后开门”“选择题换皮”代替玩法。
- 机器人伙伴可以提出真实、合理的错误猜想；它不负责直接讲答案。
- 每章有明确结束点，不使用签到、连胜、排行榜、抽奖、无限关卡、倒计时压迫或损失厌恶机制。

## 当前纵向切片

- 名称：夜影农场。
- 数学内核：鸡兔同笼的统一假设、差量分组和迁移验证。
- 目标体验时长：3–5 分钟。
- 核心循环：观察异常 → 自由试验 → 全鸡假设 → 发现腿数差 → 两两分组 → 修正动物 → 识别机器人误判 → 完成变式挑战。
- 第一版只实现这一关，不提前搭建六个世界的通用内容平台。

## 美术方向

- 使用分层纸艺玩具剧场：可见纸张纤维、切边、折痕、纸偶转轴和有限景深。
- 色彩以夜蓝、苔藓绿、谷仓红、麦秆黄和暖灯光为主；数学状态使用高对比薄荷绿和珊瑚红。
- 场景氛围图和纹理由位图承担；所有需要计数、拖动、变色或状态切换的对象使用独立 SVG、HTML 或 Canvas 图形。
- 不使用 emoji、通用图标库、霓虹渐变、玻璃拟态、廉价手游描边或无意义粒子爆炸。
- 不把整张 AI 场景图直接当作互动界面；所有关键对象必须分层、可控制、可验收。

## 动画与反馈

- 动画遵守纸艺材质：纸偶绕连接点转动，纸片沿平面滑动，翻页和揭幕具有明确折叠方向。
- 每个主要动作必须产生可见的数学结果；禁止只为热闹而循环播放动画。
- 普通反馈控制在 160–500ms，重要变换可以延长至 900ms。
- 支持 `prefers-reduced-motion`，降级后仍能完整理解状态变化。
- 错误操作不显示红叉；世界直接呈现座位不足、腿数超出或规则失效等具体结果。

## 代码结构

```text
games/rule-repair/
  CLAUDE.md
  README.md
  DESIGN.md
  index.html
  assets/
    generated/       # 最终使用的生成位图
    textures/        # 可复用纸张与环境纹理
    svg/             # 纸偶、动物与互动道具
  docs/
    game-vision.md
    art-direction.md
    vertical-slice.md
  src/
    game-state.js
    farm-model.js
    farm-scene.js
    dialogue.js
    main.js
  scripts/
    serve.mjs
  styles/
    tokens.css
    game.css
  tests/
    farm-model.test.mjs
```

- 使用原生 HTML、CSS、SVG 和 JavaScript ES modules；当前纵向切片不安装依赖、不引入框架。
- `farm-model.js` 只处理数学与关卡判定，不访问 DOM。
- `game-state.js` 维护阶段、尝试记录、提示和迁移状态；禁止从 DOM 反推游戏状态。
- `farm-scene.js` 负责视觉渲染与动画，不复制数学判定。
- 不为未来六个世界提前抽象引擎；只有纵向切片出现第二个真实用例时才提取公共模块。

## 目录与资产纪律

- 新增文件前先确认它属于上面的哪个职责目录。
- 生成图像的最终选定版本必须复制到 `assets/generated/`，并在 `docs/art-direction.md` 记录用途和生成提示。
- 废弃草稿不进入产品目录；需要保留的比较稿放在 `docs/style-frames/` 并标明状态。
- 文件使用英文小写 kebab-case；版本变体使用 `-v2`、`-v3`，不覆盖未经明确授权替换的资产。

## 体验验收闸门

进入下一阶段前必须依次通过：

1. 静态关键帧：没有动画时也能看懂当前冲突和可操作对象。
2. 动作测试：全鸡假设、补腿分组和鸡变兔三段动作符合纸艺材质。
3. 玩法测试：玩家不读长说明也能完成第一次自由试验。
4. 思维测试：变式关中不能只靠记住上一题答案通关。
5. 完成度测试：录屏画面看起来像可交付游戏片段，不像线框或技术 Demo。

任一闸门失败时先修改视觉或玩法，不继续堆叠后续关卡。

## 验证

每次修改数学模型后运行：

```powershell
node games/rule-repair/tests/farm-model.test.mjs
node games/rule-repair/tests/game-state.test.mjs
```

每次修改界面或交互后，通过本地静态服务器在浏览器中检查：

- 1440×900 和 1024×768 下无遮挡、无溢出。
- 键盘与触控语义成立，主要操作有清晰焦点状态。
- 初始画面不直接泄露鸡兔数量。
- 任意尝试都不会产生与模型不一致的头数或腿数。
- 倒带、重试和变式挑战能回到确定状态。
- 控制台没有新增错误。
- `prefers-reduced-motion` 下可完成游戏。

完成前运行：

```powershell
node games/rule-repair/tests/farm-model.test.mjs
node games/rule-repair/tests/game-state.test.mjs
git diff --check -- games/rule-repair
```
