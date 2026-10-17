# Desktop Pet Learning Companion 开发规范

## 适用范围

- 本文件只适用于 `games/desktop-pet/`。
- 本目录是独立的儿童桌面电子宠物原型，不是 Math Motion Lab 课程页，也不是 `games/rule-repair/` 的改版。
- 不修改根目录课程文件和其他游戏；共享需求只引用文档，不复制现有产品代码。
- 产品与动画基线来自 `../../docs/桌面学习宠物动作设计规范.md`。动作 ID、任务检查点和事件名称变更时必须先改该文档，再改实现。

## 产品定位

- 面向 6～10 岁儿童，首版只验证 Windows 桌面形态和“格格分果子”学习循环。
- 核心循环：宠物先尝试 → 出现可见问题 → 孩子帮助 → 场景改变 → 获得具体物品 → 孩子亲手交给宠物 → 宠物表演 → 留下记忆。
- 第一版是浏览器中的桌面形态模拟器，不冒充已完成的原生 Windows 常驻程序。
- 不读取真实桌面文件、不监听全局键盘、不使用开放式 AI 对话。
- 不使用饥饿下降、宠物死亡、亲密度惩罚、连续签到、倒计时或责怪表达。

## 当前纵向切片

- 桌宠：只实现格格。
- 尺寸测试：64、96、128 px。
- 桌面状态：待机、观察、触摸回应、拖拽释放。
- 学习任务：12颗果子平均分给3位朋友。
- 检查点：`SHARE_INTRO`、`SHARE_HELP_READY`、`SHARE_BALANCED`、`SHARE_PLATTER_READY`、`SHARE_COMMITTED`。
- 养成反馈：只实现野餐果盘、野餐帽和一篇成长日记；不扩展成通用背包或完整收藏系统。
- 首版不实现其他三只宠物、纸桥实验、栖息站收藏系统或全部52组动画。
- 桌面工具扩展允许用户维护本地随机任务池，并创建一次性本地提醒；首版不接外部日历、云同步、语音输入和开机自启。

## 视觉与动效

- 延续“会活动的软质文具玩偶”：格格为湖蓝磨砂方糖机器人，柠檬黄点缀、深蓝屏幕脸、偏侧天线和磁吸脚。
- 角色、果子、盘子和数学分组对象使用可控的 HTML/CSS/SVG；不把生成概念图直接当作互动界面。
- 动作语义、关键帧和 reduced-motion 终态严格遵守 Motion Bible。
- 动画只服务于存在感、操作反馈和数学变化；不添加持续粒子、无意义漂浮或大面积庆祝。
- 错误先显示5、4、3的具体不平均结果，不显示红叉或“答错了”。

## 目录职责

```text
games/desktop-pet/
  CLAUDE.md
  README.md
  package.json
  vite.config.js
  index.html
  pet.html
  src/
    companion-tools.js
    main.js
    motion-controller.js
    native-runtime.js
    pet-window.js
    pet-state.js
    reminder-model.js
    reward-scene.js
    share-model.js
    share-scene.js
    state-storage.js
    task-pool.js
    window-placement.js
  styles/
    tokens.css
    app.css
    pet-window.css
  tests/
    share-model.test.mjs
    pet-state.test.mjs
    reminder-model.test.mjs
    state-storage.test.mjs
    task-pool.test.mjs
    window-placement.test.mjs
  src-tauri/
    capabilities/
      pet.json
      task.json
    icons/
      icon.ico
      icon.svg
    src/
      main.rs
    Cargo.lock
    Cargo.toml
    build.rs
    tauri.conf.json
```

- 使用 Vite 构建原生 HTML、CSS、SVG 和 JavaScript ES modules；只允许项目内依赖，不引入前端框架，不全量改写现有模块。
- `index.html` 是唯一任务实现：默认提供儿童浏览器模拟器，`?surface=task` 只切换布局并复用同一套任务 DOM 与状态逻辑，禁止复制任务页。
- `pet.html` 是 112×128 逻辑尺寸的独立桌宠窗口，只挂载 96 px 格格、点击/拖动入口和最小状态同步。
- `share-model.js` 只负责数量、拖放结果与检查点判定，不访问 DOM。
- `pet-state.js` 维护产品状态、任务阶段和幂等提交，不从 DOM 反推状态。
- `state-storage.js` 负责版本化状态读写、旧 checkpoint 迁移和坏数据回退；浏览器使用 `localStorage`，Tauri 使用 Store 插件，业务模块不得直接访问两者。
- `companion-tools.js` 只编排随机任务、任务池管理、提醒确认和日程列表界面；业务判定必须调用对应纯模型。
- `task-pool.js` 负责默认任务、字段归一化、启用条件和避免近期重复的随机抽取，不访问 DOM。
- `reminder-model.js` 负责一次性提醒的中文时间解析、确认数据、状态转换和过期判定，不访问 DOM 或系统通知。
- `native-runtime.js` 负责浏览器与 Tauri 的窗口能力适配；页面代码不得散落 Tauri API 判断。
- `window-placement.js` 只实现显示器选择与窗口位置钳制的纯函数，不访问 DOM 或原生 API。
- `pet-window.js` 只编排桌宠窗口的点击、超过 5 px 的拖动互斥、共享状态渲染和打开任务窗口。
- `motion-controller.js` 负责动作 ID、动画播放、等待点和 reduced-motion，不承担数学判定。
- `reward-scene.js` 负责野餐果盘的拖拽、键盘递交、取消与投喂目标命中，不决定奖励是否可提交。
- `share-scene.js` 只渲染与连接交互，不复制模型规则。
- `main.js` 负责组合模块和页面入口。
- `src-tauri/` 只保存 Tauri 2 双窗口、托盘、单实例、关闭隐藏、真正退出、应用图标、能力和 CSP 的源码配置；`gen/` 与 `target/` 是生成目录，不入库。
- Rust、Cargo、MSVC 等系统级依赖只有在用户明确批准后才能安装；未获批准时只做静态检查。
- 文件名使用英文小写 kebab-case；只创建当前切片确实需要的文件。

## Surface 与状态边界

- 默认儿童 surface 隐藏顶部开发栏、模拟任务栏、尺寸检查和重置入口；仅 `?debug=1` 显示这些开发控件。
- `?surface=task` 直接显示任务窗口，不渲染第二套任务实现；浏览器回退模式和 Tauri task 窗口必须完成同一条“分果子—果盘—投喂—野餐帽—成长日记”闭环。
- 共享状态以版本化数据对象为唯一事实来源，不从 DOM class、文字或元素位置反推。
- 版本化状态保存学习检查点、宠物位置、始终置顶设置、任务池、最近抽取记录和提醒；任务窗位置属于运行时结果，不持久化。
- 随机任务字段只允许 `id`、`title`、`category`、`durationMinutes`、`context`、`enabled`；任务标题1～40字、时长1～60分钟，最多200项。
- 提醒字段只允许 `id`、`title`、`dueAt`、`timeZone`、`advanceMinutes`、`status`、`createdAt`、`firedAt`、`snoozeCount`；提醒标题1～60字，最多200项。
- 提醒首版只实现一次性本地提醒；自然语言必须先解析成明确日期时间确认卡，确认后才保存。
- 原生提醒调度由 Rust 常驻进程执行，Web task 窗只负责编辑与确认；系统通知失败时仍必须保留格格气泡和待处理提醒。
- 提醒状态只允许 `scheduled`、`fired`、`done`；稍后提醒将原提醒恢复为 `scheduled` 并更新 `dueAt` 与 `snoozeCount`。
- 业务状态先完成幂等提交并请求持久化，再启动奖励动画；坏数据回退为空状态，旧 checkpoint 必须可恢复。
- `pet.html` 的按下位移不超过 5 px 视为点击；超过 5 px 只触发拖动，不得同时打开任务。
- 原生 CloseRequested 只隐藏窗口；应用只允许通过托盘“退出”执行真正退出。
- Windows EXE 必须使用 GUI 子系统启动，不得在用户双击时保留 CMD 控制台窗口。
- 恢复桌宠位置时，若已保存显示器 ID 与当前坐标所属显示器冲突，优先相信当前坐标所属显示器并重新钳制，避免显示器编号变化后把格格放到另一块屏。
- 自主待机只能在无拖拽、无任务反馈、无提醒动作时触发；20～50秒随机一次，文字邀请至少冷却5分钟。
- 到点提醒优先于自主待机但不得抢占直接输入和学习结果；只提醒一次，休眠恢复后最多补发一次。

## 交互约束

- 所有主要按钮和拖放目标不小于 44×44 px；支持鼠标和键盘。
- 拖拽必须处理 `pointerup`、`pointercancel`、`Esc` 和窗口失焦。
- 自动片段结束后停住等待孩子操作，不连续自动播放整段任务。
- 学习结果先改变三只盘子的场景，再出现算式和宠物复述。
- 达到4、4、4后先形成可见的野餐果盘；孩子必须拖给格格，或使用键盘递交，才进入最终记忆。
- 投喂数据在有效递交时立即写入 `SHARE_COMMITTED`，不能等待进食动画结束；中途退出后直接恢复野餐帽与成长日记终态。
- 达到完成检查点后重复触发不得重复提交、重复解锁野餐帽或重复写入成长日记。
- `prefers-reduced-motion` 下取消弹跳、抛物线和回弹，但保留数量、分组、算式和结果。

## 目标视口

- 主要验证 `1440×900` 和 `1024×768`，浏览器缩放 100%。
- 初始桌面、尺寸测试面板和任务窗口不得产生页面横向滚动。
- 任务窗口内主要操作、提示和底部按钮必须同时可见。
- 页面是原生桌面应用的交互原型，不要求手机布局。

## 验证

模型或状态修改后运行：

```powershell
cd games/desktop-pet
npm test
npm run build:web
```

界面或动效修改后还必须检查：

- 格格在64、96、128 px下轮廓和表情可辨。
- 点击、悬停、拖拽与释放不会卡在中间状态。
- 错误分配稳定呈现5、4、3；孩子可拖成4、4、4。
- 达到4、4、4后依次显示 `4 + 4 + 4 = 12` 和 `12 ÷ 3 = 4`。
- 平衡结果可以生成一次野餐果盘，支持指针拖给格格和键盘递交。
- 进食表演按“接住—取果—咀嚼—分享—拍肚子—戴帽—写日记”完成，并在 reduced-motion 下保留全部终态。
- 退出和恢复不会重复提交 `SHARE_BALANCED`、`SHARE_PLATTER_READY` 或 `SHARE_COMMITTED`。
- 完成后关闭任务并刷新，格格仍佩戴野餐帽；再次点击格格可以回看成长日记。
- 键盘可完成果子选择、目标盘选择和移动。
- reduced-motion 下可完成任务。
- `1440×900`、`1024×768` 无遮挡、裁切和横向溢出。
- 浏览器控制台无新增错误。
- 默认儿童 surface 不显示开发控件，`?debug=1` 才显示；`?surface=task` 和 `pet.html` 都能在浏览器回退模式独立打开。
- 快捷卡必须同时提供学习任务、随机任务、添加提醒和查看日程入口；随机任务始终允许“换一个”和返回出口。
- 任务池可以新增、编辑、启用/停用；删除用户数据必须由界面中的明确操作触发。
- “明天上午10点有会议”“20分钟后提醒我喝水”等受支持表达必须先显示可读确认时间，再允许保存。
- 到点后格格显示提醒气泡；原生安装版同时发送 Windows 通知，进入提醒工具后可完成或稍后10分钟。
- `pet.html` 的点击与超过 5 px 拖动互斥，桌宠视觉逻辑尺寸为 112×128、格格主体为 96 px。
- 主屏、负坐标副屏、保存显示器缺失和窗口越界位置均通过纯函数测试。
- 已保存显示器 ID 与坐标所属显示器冲突时，桌宠必须留在坐标当前所属的屏幕。
- 原生任务窗由宠物或托盘打开时先显示快速卡，并优先靠近宠物且完全钳制在当前显示器工作区。
- 托盘只提供显示/隐藏格格、打开/继续任务、始终置顶和退出；只有退出项真正结束进程。
- Tauri 配置、Cargo 清单、capabilities 与 CSP 只做静态检查；未实际运行 `tauri dev` 或 `tauri build` 时不得声称原生构建通过。

完成前运行：

```powershell
cd games/desktop-pet
npm test
npm run build:web
Get-ChildItem src -Filter *.js | ForEach-Object { node --check $_.FullName }
git diff --check -- .
```

本机具备 Rust stable-msvc、MSVC 与 Windows SDK 时，还要运行：

```powershell
npm run tauri -- build --debug --no-bundle
```

- 不得把未启用 `custom-protocol` 的普通 `cargo build` 产物交付给用户；它会按开发地址加载页面并在独立运行时出现404。
- 无法使用 Tauri CLI 时，必须先完成 `npm run build:web`，再使用 `cargo build --features custom-protocol`，并实际启动生成的 EXE 检查首页内容、桌宠可见性和控制台窗口，不得只检查进程存活。
