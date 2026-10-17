(function (root, factory) {
  const content = factory();
  if (typeof module === "object" && module.exports) module.exports = content;
  if (root) root.ChickenRabbitLessonContent = content;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const problems = Object.freeze({
    small: Object.freeze({
      heads: 10,
      legs: 26,
      lowLegs: 2,
      highLegs: 4,
      lowName: { zh: "鸡", en: "chicken" },
      highName: { zh: "兔", en: "rabbit" }
    }),
    formal: Object.freeze({
      heads: 35,
      legs: 94,
      lowLegs: 2,
      highLegs: 4,
      lowName: { zh: "鸡", en: "chicken" },
      highName: { zh: "兔", en: "rabbit" }
    }),
    transfer: Object.freeze({
      heads: 30,
      legs: 90,
      lowLegs: 1,
      highLegs: 4,
      lowName: { zh: "一腿兽", en: "one-legged creature" },
      highName: { zh: "四腿蛇", en: "four-legged snake" }
    })
  });

  function solve(problem) {
    const baseline = problem.heads * problem.lowLegs;
    const difference = problem.legs - baseline;
    const change = problem.highLegs - problem.lowLegs;
    const highCount = difference / change;
    const lowCount = problem.heads - highCount;
    const checkedHeads = highCount + lowCount;
    const checkedLegs = highCount * problem.highLegs + lowCount * problem.lowLegs;
    return Object.freeze({
      ...problem,
      baseline,
      difference,
      change,
      highCount,
      lowCount,
      checkedHeads,
      checkedLegs
    });
  }

  const solved = Object.freeze({
    small: solve(problems.small),
    formal: solve(problems.formal),
    transfer: solve(problems.transfer)
  });

  function bilingual(zh, en) {
    return Object.freeze({ zh, en });
  }

  function step(key, phase, scene, chapter, title, ask, say, screen, action) {
    return Object.freeze({
      key,
      phase,
      scene,
      chapter: bilingual(chapter[0], chapter[1]),
      title: bilingual(title[0], title[1]),
      ask: bilingual(ask[0], ask[1]),
      say: bilingual(say[0], say[1]),
      screen: bilingual(screen[0], screen[1]),
      action: bilingual(
        action?.[0] || "点击舞台空白处或“下一步”。",
        action?.[1] || 'Click the blank stage or "Next".'
      )
    });
  }

  const steps = [
    step(
      "small-intro",
      "small",
      0,
      ["小例题", "Small example"],
      ["先完整读题", "Read the whole problem"],
      ["笼子里一共有多少只动物、多少条腿？要找什么？", "How many animals and legs are there, and what must we find?"],
      ["笼子里有鸡和兔，一共 10 只、26 条腿。我们要找鸡和兔各有多少只。先不急着算，把已知和所求说完整。", "There are chickens and rabbits in one cage: 10 animals and 26 legs. We need the number of each. First, restate what is known and what we must find."],
      ["鸡、兔；10 只；26 条腿；鸡和兔各有多少只。", "Chickens and rabbits; 10 animals; 26 legs; find each count."],
      ["打开课件，停在第 1 步，不点击。", "Open the lesson and remain on Step 1."]
    ),
    step(
      "small-heads-focus",
      "small",
      1,
      ["小例题", "Small example"],
      ["先看 10 只", "Focus on the 10 animals"],
      ["鸡和兔有什么共同点，可以先表示“10 只”？", "What do chickens and rabbits share that can represent all 10 animals?"],
      ["无论是鸡还是兔，每只都有一个头，所以 10 只就对应 10 个头。", "Every chicken and every rabbit has one head, so 10 animals correspond to 10 heads."],
      ["“10 只”被红圈强调。", "The “10 animals” total is circled in red."]
    ),
    step(
      "small-heads-draw",
      "small",
      2,
      ["小例题", "Small example"],
      ["把 10 只画成 10 个头", "Draw 10 heads"],
      ["一个圆代表什么？一共要画几个圆？", "What does one circle represent, and how many circles do we need?"],
      ["一个圆代表一个头，也就是一只动物。现在画出 10 个圆。", "One circle represents one head, or one animal. Now draw 10 circles."],
      ["右侧出现 10 个等距空心圆。", "Ten evenly spaced open circles appear."]
    ),
    step(
      "small-chicken-question",
      "small",
      3,
      ["小例题", "Small example"],
      ["单独看一只鸡", "Inspect one chicken"],
      ["一只鸡应该在圆下面画几条腿？", "How many legs should we draw under one chicken head?"],
      ["先只研究一只鸡。圆下面的问号提醒我们：还没有把腿画出来。", "Look at one chicken first. The question mark under the circle shows that its legs are not drawn yet."],
      ["左侧保留题目；右侧出现一个圆和青绿色问号。", "The givens remain on the left; one circle and a teal question mark appear on the right."]
    ),
    step(
      "small-chicken-legs",
      "small",
      4,
      ["小例题", "Small example"],
      ["鸡有 2 条腿", "A chicken has 2 legs"],
      ["刚才的问号应该换成几条腿？", "How many legs replace the question mark?"],
      ["一只鸡有 2 条腿，用两条蓝色腿线表示。蓝色以后一直表示少腿类型，也就是鸡。", "A chicken has 2 legs, shown as two blue lines. Blue will continue to mark the lower-leg type: the chicken."],
      ["一个圆下面出现 2 条蓝色腿线和“鸡：2 条腿”。", "Two blue leg lines and “Chicken: 2 legs” appear."]
    ),
    step(
      "small-rabbit-question",
      "small",
      5,
      ["小例题", "Small example"],
      ["再单独看一只兔", "Inspect one rabbit"],
      ["一只兔应该画几条腿？", "How many legs should one rabbit have?"],
      ["再看一只兔。先保留圆，只把腿留成问号，观察它和鸡的区别。", "Now look at one rabbit. Keep the same circle and leave the legs as a question mark so we can compare it with the chicken."],
      ["鸡的 2 条腿保留；旁边出现第二个圆和问号。", "The chicken’s two legs remain; a second circle and question mark appear."]
    ),
    step(
      "small-rabbit-legs",
      "small",
      6,
      ["小例题", "Small example"],
      ["兔有 4 条腿", "A rabbit has 4 legs"],
      ["鸡和兔每只相差几条腿？", "How many more legs does one rabbit have than one chicken?"],
      ["兔有 4 条腿。两条基础腿仍是蓝色，多出来的两条用紫色表示。兔比鸡多 2 条腿。", "A rabbit has 4 legs. Its two base legs stay blue, and the two extra legs are purple. A rabbit has 2 more legs than a chicken."],
      ["并列出现“鸡：2 条腿”和“兔：4 条腿”。", "“Chicken: 2 legs” and “Rabbit: 4 legs” appear side by side."]
    ),
    step(
      "small-assume-prompt",
      "small",
      7,
      ["小例题", "Small example"],
      ["先做一个统一假设", "Make one common assumption"],
      ["如果 10 只全是鸡，画腿会变得怎样？", "What happens if we pretend all 10 animals are chickens?"],
      ["先把每一个头都按鸡来处理。这样每个头下面都只需要先画两条基础腿。", "Pretend every head belongs to a chicken. Then each head begins with two base legs."],
      ["10 个头重新排好，出现“假设：全是鸡”。", "The 10 heads return in one row with “Assume: all chickens.”"]
    ),
    step(
      "small-all-chicken",
      "small",
      8,
      ["小例题", "Small example"],
      ["给每个头配 2 条腿", "Give every head 2 legs"],
      ["10 个头全部按鸡来画，画面一共有多少条腿？", "If all 10 heads are chickens, how many legs are shown?"],
      ["现在给 10 个头都画上两条蓝色腿。先看完整的全鸡假设，不急着写算式。", "Now draw two blue legs under each of the 10 heads. Look at the complete all-chicken assumption before writing the equation."],
      ["10 个圆下方各出现 2 条蓝色腿。", "Two blue legs appear under every circle."]
    ),
    step(
      "small-baseline-formula",
      "small",
      9,
      ["小例题", "Small example"],
      ["算出假设腿数", "Calculate the assumed legs"],
      ["10 只都按 2 条腿计算，是多少条？", "How many legs are there when all 10 are counted with 2 legs?"],
      ["10 乘 2 等于 20。全当成鸡时，画面里有 20 条腿。", "Ten times two equals 20. The all-chicken picture has 20 legs."],
      ["出现蓝色算式 `10×2=20条`。", "The blue equation `10×2=20 legs` appears."]
    ),
    step(
      "small-actual-focus",
      "small",
      10,
      ["小例题", "Small example"],
      ["把假设和实际相比", "Compare the assumption with reality"],
      ["实际有 26 条腿，假设只有 20 条，少了多少条？", "The actual total is 26 legs, while the assumption has 20. How many are missing?"],
      ["注意左侧的实际腿数 26 条，再看右侧假设的 20 条。需要把少掉的腿补回来。", "Look at the actual 26 legs on the left and the assumed 20 on the right. We must add the missing legs."],
      ["26 和 20 被红色短暂强调。", "The numbers 26 and 20 are briefly emphasized in red."]
    ),
    step(
      "small-difference-formula",
      "small",
      11,
      ["小例题", "Small example"],
      ["找出总差", "Find the total difference"],
      ["26 比 20 多几条腿？", "How many more legs is 26 than 20?"],
      ["26 减 20 等于 6，所以一共还要补 6 条腿。", "Twenty-six minus twenty equals 6, so 6 legs still need to be added."],
      ["出现 `比较：26−20=6条`。", "The equation `Compare: 26−20=6 legs` appears."]
    ),
    step(
      "small-adjust-prompt",
      "small",
      12,
      ["小例题", "Small example"],
      ["6 条腿怎样补回去", "How can we add the 6 legs?"],
      ["不能增加头，只能改变什么？", "We cannot add heads, so what can we change?"],
      ["总共还是 10 只，所以头数不能变。只能把某些鸡调整成兔，在原来的两条腿上继续补腿。", "There must still be 10 animals, so the number of heads cannot change. We can only turn some chickens into rabbits by adding legs to the existing two."],
      ["全鸡模型保留，标题转为“调整”。", "The all-chicken model remains and the label changes to “Adjust.”"]
    ),
    step(
      "small-transform-demo",
      "small",
      13,
      ["小例题", "Small example"],
      ["先看一次调整", "Look at one adjustment"],
      ["把一只鸡改成一只兔，腿数增加几条？", "How many legs are added when one chicken becomes one rabbit?"],
      ["抽出一个单位：两条蓝腿变成四条腿，只需要补两条紫腿。一次调整就是加 2 条腿。", "Take out one unit: two blue legs become four legs by adding two purple legs. One adjustment adds 2 legs."],
      ["画面中央出现 `2 条腿 → 4 条腿` 和红色 `+2`。", "`2 legs → 4 legs` and a red `+2` appear in the center."]
    ),
    step(
      "small-adjust-one",
      "small",
      14,
      ["小例题", "Small example"],
      ["补第一次", "Make the first adjustment"],
      ["补 2 条以后，还差几条？", "After adding 2 legs, how many are still missing?"],
      ["先把第一个鸡单位改成兔，补上两条紫腿。6 条的差还剩 4 条。", "Turn the first chicken unit into a rabbit by adding two purple legs. Four of the 6 missing legs remain."],
      ["第 1 个头下增加 2 条紫腿，并出现一条向下箭头。", "Two purple legs and a downward arrow appear under the first head."]
    ),
    step(
      "small-adjust-two",
      "small",
      15,
      ["小例题", "Small example"],
      ["补第二次", "Make the second adjustment"],
      ["再补 2 条以后，还差几条？", "After adding another 2 legs, how many are still missing?"],
      ["第二个鸡单位也改成兔，再补两条。现在只差 2 条。", "Turn the second chicken unit into a rabbit and add two more legs. Only 2 legs are still missing."],
      ["第 2 个头下增加 2 条紫腿，第二条箭头出现。", "Two purple legs and a second arrow appear under the second head."]
    ),
    step(
      "small-adjust-three",
      "small",
      16,
      ["小例题", "Small example"],
      ["补第三次", "Make the third adjustment"],
      ["第三次补 2 条后，总腿数达到多少？", "What is the total after adding the third pair of legs?"],
      ["第三个鸡单位改成兔，再补两条。三次一共补 6 条，腿数从 20 变成 26。", "Turn the third chicken unit into a rabbit. Three adjustments add 6 legs altogether, changing 20 legs into 26."],
      ["前三个头各有 4 条腿，红色差值归零。", "The first three heads now have 4 legs each, and the red difference reaches zero."]
    ),
    step(
      "small-rabbit-count",
      "small",
      17,
      ["小例题", "Small example"],
      ["三次调整就是 3 只兔", "Three adjustments mean 3 rabbits"],
      ["为什么调整 3 次，就说明有 3 只兔？", "Why do three adjustments mean there are three rabbits?"],
      ["每一次调整都把一只鸡改成一只兔。调整 3 次，就得到 3 只兔。", "Each adjustment changes one chicken into one rabbit. Three adjustments produce 3 rabbits."],
      ["前三个单位被括号归为“3 只兔”。", "A brace groups the first three units as “3 rabbits.”"]
    ),
    step(
      "small-chicken-formula",
      "small",
      18,
      ["小例题", "Small example"],
      ["用总数求鸡", "Use the total to find chickens"],
      ["10 只里有 3 只兔，还剩多少只鸡？", "If 3 of the 10 animals are rabbits, how many chickens remain?"],
      ["总数 10 减去 3 只兔，得到 7 只鸡。", "Subtract the 3 rabbits from the total of 10 to get 7 chickens."],
      ["出现 `10−3=7只鸡`，后七个单位被括号归组。", "`10−3=7 chickens` appears, and the last seven units are grouped."]
    ),
    step(
      "small-verify-prompt",
      "small",
      19,
      ["小例题", "Small example"],
      ["答案还要回到原条件", "Return to the original conditions"],
      ["3 只兔、7 只鸡一共有多少条腿？", "How many legs do 3 rabbits and 7 chickens have?"],
      ["先不要只看分组结果。用兔的 4 条腿和鸡的 2 条腿重新计算总腿数。", "Do not stop at the group counts. Recalculate the total using 4 legs per rabbit and 2 per chicken."],
      ["底部出现“检验：3×4＋7×2”。", "The partial check `3×4 + 7×2` appears."]
    ),
    step(
      "small-verify-formula",
      "small",
      20,
      ["小例题", "Small example"],
      ["腿数检验为 26", "The leg check gives 26"],
      ["这个算式等于题目的 26 条腿吗？", "Does this expression equal the given 26 legs?"],
      ["3 乘 4 加 7 乘 2 等于 26，腿数和原题完全一致。头数 3 加 7 也等于 10。", "Three times four plus seven times two equals 26, exactly matching the problem. The heads also add to 10."],
      ["算式补全为 `3×4＋7×2=26条`，出现检验勾。", "The equation becomes `3×4 + 7×2 = 26 legs` with a check mark."]
    ),
    step(
      "small-answer",
      "small",
      21,
      ["小例题", "Small example"],
      ["写出小例题答案", "State the small-example answer"],
      ["头数和腿数都符合，鸡兔各有多少只？", "Both totals match. How many chickens and rabbits are there?"],
      ["所以这个小例题中，鸡有 7 只，兔有 3 只。", "So in this small example, there are 7 chickens and 3 rabbits."],
      ["出现“鸡 7 只，兔 3 只”。", "“7 chickens, 3 rabbits” appears."]
    ),
    step(
      "small-rewind-start",
      "small",
      22,
      ["回看", "Rewind"],
      ["把结果暂时擦掉", "Clear the result for a moment"],
      ["刚才真正关键的是答案，还是从 20 变成 26 的过程？", "Was the key idea the answer, or the change from 20 to 26?"],
      ["先把答案、分组和检验擦掉，回到调整过程本身。", "Clear the answer, grouping, and check so we can look again at the adjustment itself."],
      ["答案和算式淡去，只保留头和腿模型。", "The answer and equations disappear, leaving the head-and-leg model."]
    ),
    step(
      "small-rewind-reset",
      "small",
      23,
      ["回看", "Rewind"],
      ["回到全是鸡的起点", "Return to the all-chicken start"],
      ["调整之前，每个头下面有几条腿？", "Before any adjustment, how many legs were under each head?"],
      ["回到 10 只全当鸡的状态：每个头下面只有两条蓝腿。", "Return to the all-chicken state: each head has only two blue legs."],
      ["10 个单位恢复为全鸡模型。", "All 10 units return to the all-chicken model."]
    ),
    step(
      "small-rewind-arrow-one",
      "small",
      24,
      ["回看", "Rewind"],
      ["第一次调整", "First adjustment"],
      ["第一只怎样从鸡变成兔？", "How does the first chicken become a rabbit?"],
      ["第一只向下调整，在原来的两条腿上补两条。", "The first unit adjusts downward by adding two legs to the original two."],
      ["第 1 个单位出现向下箭头和 4 条腿终态。", "A downward arrow and a 4-leg end state appear for Unit 1."]
    ),
    step(
      "small-rewind-arrow-two",
      "small",
      25,
      ["回看", "Rewind"],
      ["第二次调整", "Second adjustment"],
      ["同样的动作再做一次，会怎样？", "What happens when we repeat the same action?"],
      ["第二只也补两条腿。每一条箭头都代表一次相同的调整。", "The second unit also gains two legs. Each arrow represents the same adjustment."],
      ["第 2 个单位出现第二条向下箭头。", "A second downward arrow appears for Unit 2."]
    ),
    step(
      "small-rewind-arrow-three",
      "small",
      26,
      ["回看", "Rewind"],
      ["第三次调整", "Third adjustment"],
      ["三条箭头一共补了多少条腿？", "How many legs do the three arrows add altogether?"],
      ["第三只再补两条。三次调整，每次加 2 条，一共加 6 条。", "Add two legs to the third unit. Three adjustments at 2 legs each add 6 legs in all."],
      ["三条向下箭头并列，前三个单位都变为 4 条腿。", "Three downward arrows appear, and the first three units each have 4 legs."]
    ),
    step(
      "small-core-box",
      "small",
      27,
      ["回看", "Rewind"],
      ["把核心动作框出来", "Frame the core action"],
      ["这个方法最重要的可重复动作是什么？", "What repeatable action is at the heart of this method?"],
      ["核心不是背“除以 2”，而是看懂：每把一只鸡调整成一只兔，就增加 2 条腿。", "The key is not memorizing “divide by 2.” It is seeing that every chicken-to-rabbit adjustment adds 2 legs."],
      ["红框圈住三次 `2 条腿 → 4 条腿` 的调整。", "A red frame encloses the three `2 legs → 4 legs` adjustments."]
    ),
    step(
      "formal-intro",
      "formal",
      0,
      ["正式题", "Formal problem"],
      ["把方法带到 35 头 94 腿", "Move to 35 heads and 94 legs"],
      ["鸡兔共有 35 只、94 条腿，要找什么？", "There are 35 chickens and rabbits with 94 legs. What must we find?"],
      ["现在看正式题：鸡兔共有 35 只，94 条腿，求鸡和兔各有多少只。完整读题以后，再沿用刚才的动作。", "Now consider the formal problem: 35 chickens and rabbits have 94 legs. Find the number of each. Read the whole problem before reusing the same actions."],
      ["舞台完整出现鸡、兔、35 只、94 条腿和所求问题。", "The full problem appears with 35 animals, 94 legs, and the task."]
    ),
    step(
      "formal-heads",
      "formal",
      1,
      ["正式题", "Formal problem"],
      ["先画头的模型", "Build the head model"],
      ["35 个头很多，怎样既表示完整数量又不挤满画面？", "How can we represent 35 heads without filling the whole screen?"],
      ["仍然用圆表示头，但中间用省略号压缩。画面不是只有几个头，括号会说明整排代表 35 个。", "Circles still represent heads, but an ellipsis compresses the middle. The brace will show that the row stands for all 35 heads."],
      ["出现圆头、省略号、圆头的压缩长排。", "A compressed row of circles, an ellipsis, and more circles appears."]
    ),
    step(
      "formal-head-brace",
      "formal",
      2,
      ["正式题", "Formal problem"],
      ["标出 35 个头", "Label the 35 heads"],
      ["这整排圆一共代表多少只？", "How many animals does the whole row represent?"],
      ["上方括号把整排统一起来，标出 35 只。", "A top brace groups the whole row and labels it as 35 animals."],
      ["上方画出括号和“35 只”。", "A top brace and “35 animals” appear."]
    ),
    step(
      "formal-leg-brace",
      "formal",
      3,
      ["正式题", "Formal problem"],
      ["再标出实际 94 条腿", "Label the actual 94 legs"],
      ["题目给出的腿数总和是多少？", "What total number of legs does the problem give?"],
      ["下方括号标出实际一共有 94 条腿。这个实际总量会一直留着，和假设结果比较。", "A lower brace labels the actual total as 94 legs. This total stays visible so we can compare it with the assumption."],
      ["下方画出括号和“94 条腿”。", "A lower brace and “94 legs” appear."]
    ),
    step(
      "formal-all-chicken",
      "formal",
      4,
      ["正式题", "Formal problem"],
      ["假设 35 只全是鸡", "Assume all 35 are chickens"],
      ["全部按鸡来算，每个头先配几条腿？", "If all are treated as chickens, how many legs go under each head?"],
      ["和小例题一样，先给每个头配两条蓝腿。省略号表示中间的单位也全部这样处理。", "As in the small example, give every head two blue legs. The ellipsis means all hidden units are treated the same way."],
      ["压缩长排全部变为两腿单位，并出现“假设：全是鸡”。", "The compressed row becomes all two-leg units with “Assume: all chickens.”"]
    ),
    step(
      "formal-baseline",
      "formal",
      5,
      ["正式题", "Formal problem"],
      ["算出假设的 70 条腿", "Calculate the assumed 70 legs"],
      ["35 只每只 2 条腿，共多少条？", "How many legs do 35 animals have at 2 legs each?"],
      ["35 乘 2 等于 70。全当鸡时，假设腿数是 70 条。", "Thirty-five times two equals 70. The all-chicken assumption gives 70 legs."],
      ["出现蓝色 `35×2=70条`。", "The blue equation `35×2=70 legs` appears."]
    ),
    step(
      "formal-compare-focus",
      "formal",
      6,
      ["正式题", "Formal problem"],
      ["比较 94 和 70", "Compare 94 and 70"],
      ["实际 94 条，假设 70 条，差值从哪两个数来？", "The actual total is 94 and the assumption is 70. Which two numbers make the difference?"],
      ["把 94 和 70 同时拉到焦点。差值一定来自“实际减假设”。", "Bring 94 and 70 into focus together. The difference comes from actual minus assumed."],
      ["94 和 70 短暂放大，其他文字降为低强调。", "The numbers 94 and 70 enlarge briefly while other text recedes."]
    ),
    step(
      "formal-difference",
      "formal",
      7,
      ["正式题", "Formal problem"],
      ["求出总差 24 条", "Find the 24-leg difference"],
      ["一共需要补多少条腿？", "How many legs must be added altogether?"],
      ["94 减 70 等于 24。一共少了 24 条腿。", "Ninety-four minus seventy equals 24. The assumption is short by 24 legs."],
      ["出现 `比较：94−70=24条`。", "`Compare: 94−70=24 legs` appears."]
    ),
    step(
      "formal-adjust-label",
      "formal",
      8,
      ["正式题", "Formal problem"],
      ["从比较转向调整", "Move from comparing to adjusting"],
      ["24 条差怎样通过改变动物种类补出来？", "How can changing animal types make up the 24-leg difference?"],
      ["头数不能变，只能把一部分鸡调整成兔。接下来仍然只研究一次调整。", "The number of heads cannot change, so some chickens must become rabbits. We will again examine just one adjustment."],
      ["出现“调整：”并保留 24 条差值。", "“Adjust:” appears while the 24-leg difference remains."]
    ),
    step(
      "formal-extract",
      "formal",
      9,
      ["正式题", "Formal problem"],
      ["从长排抽出一个单位", "Extract one unit from the row"],
      ["为什么只抽一个单位就够了？", "Why is it enough to extract just one unit?"],
      ["每次调整完全相同，所以只要把一个两腿单位抽出来研究清楚，就能知道每次变化多少。", "Every adjustment is identical, so studying one two-leg unit tells us the change each time."],
      ["一个两腿单位从整排下移到工作区。", "One two-leg unit moves down from the row to the work area."]
    ),
    step(
      "formal-transform",
      "formal",
      10,
      ["正式题", "Formal problem"],
      ["把两腿单位变成四腿单位", "Turn a 2-leg unit into a 4-leg unit"],
      ["头不变，从鸡变兔要补哪两条腿？", "With the head unchanged, which legs are added to turn a chicken into a rabbit?"],
      ["保留两条蓝腿，再补两条紫腿。这个单位就从鸡变成了兔。", "Keep the two blue legs and add two purple legs. The unit changes from a chicken into a rabbit."],
      ["工作区出现 `2 条腿 → 4 条腿`。", "The work area shows `2 legs → 4 legs`."]
    ),
    step(
      "formal-plus",
      "formal",
      11,
      ["正式题", "Formal problem"],
      ["标出每次 +2", "Label each adjustment as +2"],
      ["一次调整会让总腿数增加多少？", "How much does one adjustment add to the total?"],
      ["四条腿比两条腿多 2 条，所以每调整一次，总腿数就增加 2 条。", "Four legs are 2 more than two legs, so each adjustment adds 2 legs to the total."],
      ["箭头上方出现红色 `+2`。", "A red `+2` appears above the arrow."]
    ),
    step(
      "formal-divide-skeleton",
      "formal",
      12,
      ["正式题", "Formal problem"],
      ["把总差分成每次 2 条", "Split the total difference into 2-leg changes"],
      ["总共差 24 条，每次补 2 条，需要调整几次？", "The total difference is 24 legs and each adjustment adds 2. How many adjustments are needed?"],
      ["用总差除以每次变化量，先写 24 除以 2。", "Divide the total difference by the change per adjustment. First write 24 divided by 2."],
      ["出现 `调整：24÷2`，暂不显示商。", "`Adjust: 24÷2` appears without the quotient."]
    ),
    step(
      "formal-rabbits",
      "formal",
      13,
      ["正式题", "Formal problem"],
      ["得到 12 只兔", "Find 12 rabbits"],
      ["商 12 表示 12 个什么？", "What do the 12 equal adjustments represent?"],
      ["24 除以 2 等于 12。每一次调整都得到一只兔，所以 12 表示 12 只兔。", "Twenty-four divided by two equals 12. Each adjustment creates one rabbit, so 12 means 12 rabbits."],
      ["算式补全为 `24÷2=12只兔`，工作区贴上“12 只”。", "The equation becomes `24÷2=12 rabbits`, with a “12” label in the work area."]
    ),
    step(
      "formal-chickens",
      "formal",
      14,
      ["正式题", "Formal problem"],
      ["求出 23 只鸡", "Find 23 chickens"],
      ["35 只中去掉 12 只兔，还剩多少只鸡？", "After removing 12 rabbits from the 35 animals, how many chickens remain?"],
      ["35 减 12 等于 23，所以有 23 只鸡。", "Thirty-five minus twelve equals 23, so there are 23 chickens."],
      ["出现 `35−12=23只鸡`。", "`35−12=23 chickens` appears."]
    ),
    step(
      "formal-verify-skeleton",
      "formal",
      15,
      ["正式题", "Formal problem"],
      ["先写检验骨架", "Write the check"],
      ["12 只兔和 23 只鸡的腿数怎样计算？", "How do we calculate the legs of 12 rabbits and 23 chickens?"],
      ["兔按每只 4 条腿，鸡按每只 2 条腿，写成 12 乘 4 加 23 乘 2。", "Use 4 legs per rabbit and 2 per chicken: 12 times 4 plus 23 times 2."],
      ["出现 `检验：12×4＋23×2`。", "`Check: 12×4 + 23×2` appears."]
    ),
    step(
      "formal-verify",
      "formal",
      16,
      ["正式题", "Formal problem"],
      ["检验等于 94 条", "Verify the 94 legs"],
      ["算出的腿数和原题一致吗？", "Does the calculated total match the problem?"],
      ["12 乘 4 加 23 乘 2等于 94，和题目给出的腿数一致；12 加 23 也等于 35。", "Twelve times four plus twenty-three times two equals 94, matching the problem. Twelve plus twenty-three also equals 35."],
      ["检验式补全为 `=94条`，头数与腿数都出现勾。", "The check is completed with `=94 legs`, and both totals receive check marks."]
    ),
    step(
      "formal-box-assume",
      "formal",
      17,
      ["方法结构", "Method structure"],
      ["第一步：假设", "Step 1: Assume"],
      ["完整过程的第一块是什么？", "What is the first part of the complete process?"],
      ["第一步是把所有对象统一按少腿类型计算，也就是假设全部是鸡。", "First, treat every object as the lower-leg type: assume all are chickens."],
      ["第一个红框圈住全鸡模型和 `35×2=70`。", "The first red frame encloses the all-chicken model and `35×2=70`."]
    ),
    step(
      "formal-box-compare",
      "formal",
      18,
      ["方法结构", "Method structure"],
      ["第二步：比较", "Step 2: Compare"],
      ["假设以后为什么要和实际比较？", "Why do we compare the assumption with reality?"],
      ["比较实际 94 条和假设 70 条，才能知道一共需要补 24 条。", "Comparing the actual 94 legs with the assumed 70 tells us that 24 legs must be added."],
      ["第二个红框圈住 `94−70=24`。", "The second red frame encloses `94−70=24`."]
    ),
    step(
      "formal-box-adjust",
      "formal",
      19,
      ["方法结构", "Method structure"],
      ["第三步：调整", "Step 3: Adjust"],
      ["24 除以 2 的两个数分别表示什么？", "What do the 24 and 2 mean in 24÷2?"],
      ["24 是总差，2 是每次把鸡改成兔增加的腿数。总差除以单次变化，得到调整次数，也就是兔数。", "Twenty-four is the total difference, and 2 is the change when one chicken becomes one rabbit. Their quotient is the number of adjustments, or rabbits."],
      ["第三个红框圈住一次 `+2`、兔数和鸡数算式。", "The third red frame encloses the `+2` change and both count equations."]
    ),
    step(
      "formal-box-verify",
      "formal",
      20,
      ["方法结构", "Method structure"],
      ["第四步：检验", "Step 4: Check"],
      ["为什么不能算出 12 和 23 就停下？", "Why should we not stop after finding 12 and 23?"],
      ["还要把结果代回头数和腿数，确认两个原条件都符合。", "We must substitute the counts back into both original totals: heads and legs."],
      ["第四个红框圈住完整检验式。", "The fourth red frame encloses the complete check."]
    ),
    step(
      "formal-method-name",
      "formal",
      21,
      ["方法结构", "Method structure"],
      ["现在给方法命名", "Now name the method"],
      ["这套“先统一假设，再比较调整”的方法叫什么？", "What do we call this process of assuming, comparing, and adjusting?"],
      ["先看懂了动作，再给它命名：这就是假设法。", "Now that the actions are clear, we can name the method: the assumption method."],
      ["舞台上方出现“假设法”，四个结构框保留。", "“Assumption Method” appears while all four structure frames remain."]
    ),
    step(
      "transfer-intro",
      "transfer",
      0,
      ["迁移题", "Transfer"],
      ["换一种动物，完整读题", "Change the animals and read the whole problem"],
      ["一腿兽和四腿蛇共有 30 只、90 条腿，要找什么？", "There are 30 one-legged creatures and four-legged snakes with 90 legs. What must we find?"],
      ["现在换成一腿兽和四腿蛇。它们共有 30 只、90 条腿，求两种动物各有多少只。动物名字变了，先判断数学结构是否相同。", "Now use one-legged creatures and four-legged snakes. There are 30 animals and 90 legs. Find the number of each. The names changed; decide whether the mathematical structure stayed the same."],
      ["完整出现两种新对象、30 只、90 条腿和所求问题。", "The new animals, 30 animals, 90 legs, and the task all appear."]
    ),
    step(
      "transfer-heads",
      "transfer",
      1,
      ["迁移题", "Transfer"],
      ["仍然先画头", "Begin with heads again"],
      ["动物名字变了，一个圆还可以代表什么？", "The animal names changed. What can one circle still represent?"],
      ["每只动物仍然只有一个头，所以圆头模型不需要改变。省略号整排代表 30 只。", "Each animal still has one head, so the circle model does not change. The compressed row represents all 30 animals."],
      ["右侧出现带省略号的圆头长排和“30 只”括号。", "A compressed row of heads and a “30 animals” brace appear."]
    ),
    step(
      "transfer-assume",
      "transfer",
      2,
      ["迁移题", "Transfer"],
      ["假设全是一腿兽", "Assume all are one-legged creatures"],
      ["少腿类型现在每只有几条腿？", "How many legs does the lower-leg type have now?"],
      ["这次少腿类型是一腿兽，所以给每个头先配 1 条蓝腿。", "This time the lower-leg type has one leg, so give each head one blue leg."],
      ["整排变成一腿单位，出现“假设：全是一腿兽”。", "The row becomes one-leg units with “Assume: all one-legged creatures.”"]
    ),
    step(
      "transfer-baseline",
      "transfer",
      3,
      ["迁移题", "Transfer"],
      ["算出假设的 30 条腿", "Calculate the assumed 30 legs"],
      ["30 只每只 1 条腿，共多少条？", "How many legs do 30 animals have at 1 leg each?"],
      ["30 乘 1 等于 30。假设全是一腿兽时只有 30 条腿。", "Thirty times one equals 30. The all-one-legged assumption has only 30 legs."],
      ["出现蓝色 `30×1=30条`。", "The blue equation `30×1=30 legs` appears."]
    ),
    step(
      "transfer-difference",
      "transfer",
      4,
      ["迁移题", "Transfer"],
      ["实际比假设多 60 条", "Reality has 60 more legs"],
      ["实际 90 条，假设 30 条，总差是多少？", "The actual total is 90 and the assumption is 30. What is the difference?"],
      ["90 减 30 等于 60，一共需要补 60 条腿。", "Ninety minus thirty equals 60, so 60 legs must be added."],
      ["出现 `比较：90−30=60条`，60 被红色强调。", "`Compare: 90−30=60 legs` appears, with 60 emphasized in red."]
    ),
    step(
      "transfer-extract",
      "transfer",
      5,
      ["迁移题", "Transfer"],
      ["再抽出一个单位", "Extract one unit again"],
      ["把一腿兽改成四腿蛇，一次变化要看什么？", "What must we inspect when one one-legged creature becomes a four-legged snake?"],
      ["仍然只抽出一个单位。头不变，比较调整前后的腿数。", "Again, extract one unit. Keep the head fixed and compare the legs before and after."],
      ["一个一腿单位从整排下移到工作区。", "One one-leg unit moves down into the work area."]
    ),
    step(
      "transfer-plus",
      "transfer",
      6,
      ["迁移题", "Transfer"],
      ["一次调整变成 +3", "One adjustment now adds 3"],
      ["从 1 条腿变成 4 条腿，每次增加多少条？", "How many legs are added when 1 leg becomes 4?"],
      ["四条腿比一条腿多 3 条，所以这次每调整一次是加 3，而不是加 2。", "Four legs are 3 more than one, so each adjustment now adds 3, not 2."],
      ["出现 `1 条腿 → 4 条腿` 和红色 `+3`。", "`1 leg → 4 legs` and a red `+3` appear."]
    ),
    step(
      "transfer-high-count",
      "transfer",
      7,
      ["迁移题", "Transfer"],
      ["求出 20 只四腿蛇", "Find 20 four-legged snakes"],
      ["总差 60，每次补 3，需要调整几次？", "The total difference is 60 and each adjustment adds 3. How many adjustments are needed?"],
      ["60 除以 3 等于 20。调整 20 次，就有 20 只四腿蛇。", "Sixty divided by three equals 20. Twenty adjustments mean 20 four-legged snakes."],
      ["出现 `60÷3=20只四腿蛇`。", "`60÷3=20 four-legged snakes` appears."]
    ),
    step(
      "transfer-low-count",
      "transfer",
      8,
      ["迁移题", "Transfer"],
      ["求出 10 只一腿兽", "Find 10 one-legged creatures"],
      ["30 只中有 20 只四腿蛇，还剩多少只一腿兽？", "If 20 of the 30 animals are four-legged snakes, how many one-legged creatures remain?"],
      ["30 减 20 等于 10，所以有 10 只一腿兽。", "Thirty minus twenty equals 10, so there are 10 one-legged creatures."],
      ["出现 `30−20=10只一腿兽`。", "`30−20=10 one-legged creatures` appears."]
    ),
    step(
      "transfer-verify-skeleton",
      "transfer",
      9,
      ["迁移题", "Transfer"],
      ["写出迁移题检验", "Write the transfer check"],
      ["20 只四腿蛇和 10 只一腿兽怎样检验腿数？", "How can we check the legs of 20 four-legged snakes and 10 one-legged creatures?"],
      ["四腿蛇按每只 4 条，一腿兽按每只 1 条，写成 20 乘 4 加 10 乘 1。", "Use 4 legs per snake and 1 per one-legged creature: 20 times 4 plus 10 times 1."],
      ["出现 `检验：20×4＋10×1`。", "`Check: 20×4 + 10×1` appears."]
    ),
    step(
      "transfer-verify",
      "transfer",
      10,
      ["迁移题", "Transfer"],
      ["检验等于 90 条", "Verify the 90 legs"],
      ["计算结果和原题 90 条一致吗？", "Does the result match the original 90 legs?"],
      ["20 乘 4 加 10 乘 1 等于 90，腿数正确；20 加 10 也等于 30，头数正确。", "Twenty times four plus ten times one equals 90, and twenty plus ten equals 30. Both totals match."],
      ["检验式补全为 `=90条`，头数和腿数出现勾。", "The check becomes `=90 legs`, with checks for heads and legs."]
    ),
    step(
      "transfer-feedback",
      "transfer",
      11,
      ["迁移题", "Transfer"],
      ["结构没有变", "The structure stayed the same"],
      ["对象和每只腿数都变了，为什么方法仍然成立？", "The objects and leg counts changed. Why does the method still work?"],
      ["因为方法依靠的不是动物名字，而是总只数、总腿数、少腿类型和每次调整的腿数差。", "The method does not depend on animal names. It depends on the total heads, total legs, the lower-leg type, and the change per adjustment."],
      ["左下短暂出现克制的笑脸，完整解答保持。", "A small, restrained smile appears briefly while the completed solution remains."]
    ),
    step(
      "summary-title",
      "summary",
      0,
      ["总结", "Summary"],
      ["从“假设法”扩展到题型", "Connect the method to the problem type"],
      ["刚才解决的两道题有什么共同结构？", "What structure did the two problems share?"],
      ["都知道总只数和总腿数，都有少腿类型和多腿类型，都能先统一假设再逐步调整。", "Both give total animals and total legs, and both have a lower-leg and higher-leg type. We can assume one type first and then adjust."],
      ["标题扩展为“假设法解鸡兔同笼”。", "The title expands to “Solving Chicken-and-Rabbit Problems by Assumption.”"]
    ),
    step(
      "summary-compare",
      "summary",
      1,
      ["总结", "Summary"],
      ["再看“比较”", "Look again at “Compare”"],
      ["比较这一步在找什么？", "What does the comparison step find?"],
      ["比较实际总腿数和假设总腿数，得到一共要补多少条腿。", "Compare the actual and assumed leg totals to find how many legs must be added altogether."],
      ["迁移题的 `90−30=60` 被红框和短暂放大强调。", "`90−30=60` receives a red frame and brief emphasis."]
    ),
    step(
      "summary-verify",
      "summary",
      2,
      ["总结", "Summary"],
      ["再看“检验”", "Look again at “Check”"],
      ["检验为什么是解题闭环的一部分？", "Why is checking part of the complete reasoning loop?"],
      ["因为结果必须同时回到总只数和总腿数，两个条件都符合才算完成。", "The result must return to both totals—animals and legs. The solution is complete only when both match."],
      ["迁移题检验式被红框和短暂放大强调。", "The transfer check is framed in red and briefly emphasized."]
    ),
    step(
      "summary-heads-circle",
      "summary",
      3,
      ["总结", "Summary"],
      ["圈出头和", "Circle the head total"],
      ["30 只在这类题里表示哪一种总量？", "What kind of total does 30 represent in this problem type?"],
      ["30 只就是 30 个头，也就是所有对象的头数总和，简称头和。", "Thirty animals means 30 heads—the sum of all heads, or the head total."],
      ["红色手绘圈只圈住“30 只”，旁边标“头和”。", "A red hand-drawn circle surrounds “30 animals,” labeled “head total.”"]
    ),
    step(
      "summary-legs-circle",
      "summary",
      4,
      ["总结", "Summary"],
      ["圈出腿和", "Circle the leg total"],
      ["90 条腿在这类题里表示哪一种总量？", "What kind of total does 90 represent?"],
      ["90 条是所有对象的腿数总和，简称腿和。题目不一定真的是鸡和兔，但结构相同。", "Ninety is the sum of all legs, or the leg total. The objects do not have to be chickens and rabbits when the structure is the same."],
      ["第二个红圈圈住“90 条腿”，旁边标“腿和”。", "A second red circle surrounds “90 legs,” labeled “leg total.”"]
    ),
    step(
      "summary-final",
      "summary",
      5,
      ["总结", "Summary"],
      ["落到一般结构", "Name the general structure"],
      ["以后看到头和、腿和以及两类不同腿数的对象，可以先想什么？", "When a problem gives a head total, leg total, and two leg types, what method can you try first?"],
      ["可以先假设全部是少腿类型，算出假设总量；再和实际比较，用总差除以每次调整的变化量，最后代回检验。", "Assume every object is the lower-leg type, calculate the assumed total, compare it with reality, divide the total difference by the change per adjustment, and finally check the result."],
      ["最终标题为“假设法解鸡兔同笼—头和与腿和”，两组总量红圈保留。", "The final title reads “Assumption Method for Head-and-Leg Totals,” with both totals circled."]
    )
  ];

  return Object.freeze({
    problems,
    solved,
    steps: Object.freeze(steps),
    meta: Object.freeze({
      grade: bilingual("四年级", "Grade 4"),
      duration: bilingual("约 18–25 分钟", "about 18–25 minutes"),
      lessonPath: "lessons/鸡兔同笼-场景版/index.html"
    })
  });
});
