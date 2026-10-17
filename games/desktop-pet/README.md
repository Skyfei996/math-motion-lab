# Desktop Pet Learning Companion

当前纵向切片验证五件事：

1. 格格作为64、96、128 px桌面宠物时，轮廓和动作是否可读。
2. “12颗果子平均分给3位朋友”能否完成“宠物先犯错—孩子帮助—做成果盘—亲手投喂—宠物分享—留下日记”的学习与照顾循环。
3. 同一套 Web 任务能否同时服务浏览器模拟器和 Tauri 2 的独立宠物、任务双窗口。
4. 孩子能否从可编辑的本地任务池随机抽取一个线上或线下小任务。
5. 用户能否用自然语言创建一次性本地提醒，并由格格在到点时提醒。

完成 `4 / 4 / 4` 后，孩子可以把野餐果盘拖给格格，也可以直接点“递给格格”。格格会接住、品尝并与朋友分享，随后解锁野餐帽和第一篇成长日记；关闭页面后，奖励与日记仍可恢复。

快速卡提供三个桌面小工具：

- “抽一个任务”：按任意、室内、户外、需要家人或需要联网筛选；近期抽过的任务会尽量避开。
- “管理任务池”：新增、修改、启用、停用或删除本机任务。修改现有任务后点“存”。
- “添加提醒”：首版支持“明天上午10点有会议”和“20分钟后提醒我喝水”这两类说法，识别后必须确认才会保存。

提醒是一次性的，仅保存在本机。应用需要保持运行；到点后桌宠会做提醒动作并显示提示气泡，提醒工具里会出现“10分钟后”和“完成”，Windows 安装版同时发送系统通知。首版不包含开机自启、云同步、语音录入或外部日历同步。格格在没有拖拽、任务结果或到点提醒时，会每隔约20–50秒随机做一次轻量自主动作。

双击 Windows EXE 后不会出现 CMD 窗口；格格会恢复在上次坐标所在的当前屏幕。任务窗口默认隐藏，点击格格后才打开。

## Web 运行

在本目录安装依赖并启动 Vite：

```powershell
npm install
npm run dev:web
```

可用入口：

```text
http://127.0.0.1:4173/                 默认儿童模拟器
http://127.0.0.1:4173/?debug=1         开发检查界面
http://127.0.0.1:4173/?surface=task    独立任务窗口 surface
http://127.0.0.1:4173/pet.html         112×128 独立桌宠 surface
```

## 架构

- `index.html`：唯一任务 DOM；通过查询参数切换模拟器与 task surface。
- `pet.html`：112×128 逻辑窗口，挂载 96 px 格格。
- `src/state-storage.js`：浏览器 `localStorage` 与 Tauri Store 的版本化适配。
- `src/task-pool.js`：任务池默认数据、规范化、条件过滤与防连续重复抽取。
- `src/reminder-model.js`：提醒文本识别、状态流转、稍后提醒与时间格式化。
- `src/companion-tools.js`：随机任务、提醒确认和任务池管理界面。
- `src/native-runtime.js`：浏览器回退、Tauri Window API、提醒同步与提醒事件适配。
- `src/window-placement.js`：宠物位置恢复、任务靠近宠物显示、主副屏选择和越界钳制纯函数。
- `src-tauri/`：Tauri 2 双窗口、托盘、置顶切换、单实例、关闭隐藏、能力、CSP、本地提醒调度与 Windows 通知。

业务状态仍然先幂等提交并持久化，再播放奖励动画；任务状态不从 DOM 反推。原生任务窗首次打开先显示快速卡，再由孩子选择开始、继续或回看日记。

## 验证

```powershell
npm test
npm run build:web
cargo test --manifest-path src-tauri/Cargo.toml
```

原生 Windows 构建需要 Rust stable-msvc、Visual Studio Build Tools 的“使用 C++ 的桌面开发”工作负载和 Windows SDK。安装完成后运行：

```powershell
npm run tauri -- build --debug --no-bundle
```

成功后可执行文件位于：

```text
src-tauri/target/debug/desktop-pet-learning-companion.exe
```

不要把未启用 `custom-protocol` 的普通 `cargo build` 产物作为独立程序运行，否则它会尝试使用开发地址并显示404。无法通过 Tauri CLI 构建时，先运行 `npm run build:web`，再运行：

```powershell
cargo build --manifest-path src-tauri/Cargo.toml --features custom-protocol
```
