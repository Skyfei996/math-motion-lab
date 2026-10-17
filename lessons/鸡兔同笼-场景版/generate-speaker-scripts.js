"use strict";

const fs = require("node:fs");
const path = require("node:path");
const content = require("./lesson-content.js");

function zhScript() {
  const lines = [
    "# 《鸡兔同笼·逐步讲解》中文演讲稿",
    "",
    "- 年级：四年级",
    `- 课程路径：\`${content.meta.lessonPath}\``,
    "- 建议时长：约 18–25 分钟",
    "- 默认题目：10 只 26 条腿的小例题；35 只 94 条腿的正式题；30 只 90 条腿的迁移题。",
    "- 教师提示：每一站先读“提问”并停顿，学生回答后再执行“操作”。页面动作完成即停住，不要连续点击。舞台空白处、“下一步”、右方向键、PageDown 和空格每次只推进一个教学动作。",
    ""
  ];

  content.steps.forEach((step, index) => {
    lines.push(
      `## 第${index + 1}站：${step.title.zh}`,
      "",
      "**操作**",
      "",
      step.action.zh,
      "",
      "**提问**",
      "",
      step.ask.zh,
      "",
      "**停顿**",
      "",
      "提出问题后停顿，等待学生观察并回答；确认学生已经说出当前关系，再执行下一次点击。",
      "",
      "**讲解**",
      "",
      step.say.zh,
      "",
      "**页面检查**",
      "",
      step.screen.zh,
      ""
    );
  });

  return lines.join("\n");
}

function enScript() {
  const lines = [
    "# Chickens and Rabbits — Step-by-Step Speaker Script",
    "",
    "- Grade: Grade 4",
    `- Lesson path: \`${content.meta.lessonPath}\``,
    "- Suggested duration: about 18–25 minutes",
    "- Default problems: a 10-animal, 26-leg small example; a 35-animal, 94-leg formal problem; and a 30-animal, 90-leg transfer problem.",
    "- Teacher cue: Read the “Ask” prompt and pause before using the “Action.” Let one visual change finish, then stop. The blank stage, “Next,” Right Arrow, PageDown, and Space each advance exactly one teaching action.",
    ""
  ];

  content.steps.forEach((step, index) => {
    lines.push(
      `## Stop ${index + 1}: ${step.title.en}`,
      "",
      "**Action**",
      "",
      step.action.en,
      "",
      "**Ask**",
      "",
      step.ask.en,
      "",
      "**Pause**",
      "",
      "Wait for students to inspect the screen and answer. Advance only after they have named the current relationship.",
      "",
      "**Say**",
      "",
      step.say.en,
      "",
      "**Screen check**",
      "",
      step.screen.en,
      ""
    );
  });

  return lines.join("\n");
}

fs.writeFileSync(path.join(__dirname, "speaker-script.zh-CN.md"), zhScript(), "utf8");
fs.writeFileSync(path.join(__dirname, "speaker-script.en-US.md"), enScript(), "utf8");

console.log(`Generated ${content.steps.length} synchronized stops in Chinese and English.`);
