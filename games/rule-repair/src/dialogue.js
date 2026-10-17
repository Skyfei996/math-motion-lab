import { completedPairs, currentLegComparison, currentRabbitCount, transferComplete } from "./game-state.js";

export function dialogueFor(state) {
  if (state.phase === "arrival") {
    return {
      mood: "thinking",
      text: "登记装置卡住了。八个脑袋，为什么会有二十二条腿？"
    };
  }

  if (state.phase === "explore") {
    const rabbits = currentRabbitCount(state);
    const comparison = currentLegComparison(state);

    if (state.attempts === 0) {
      return { mood: "thinking", text: "先动一只试试。每次变化，腿数会怎么变？" };
    }

    if (comparison.relation === "match") {
      return {
        mood: "happy",
        text: `对上二十二条腿了！你试了 ${state.attempts} 次。能不能不再逐只猜？`
      };
    }

    const direction = comparison.relation === "missing" ? `还差 ${comparison.amount} 条` : `多了 ${comparison.amount} 条`;
    return {
      mood: "thinking",
      text: `现在有 ${rabbits} 只兔，共 ${state.problem.heads - rabbits + rabbits} 个脑袋，${direction}。刚才一只动物变身时增加了几条腿？`
    };
  }

  if (state.phase === "baseline") {
    if (state.baselineApplied) {
      return {
        mood: "thinking",
        text: `全是鸡时只有 ${state.problem.baselineLegs} 条腿，比记录少 ${state.problem.extraLegs} 条。少的腿去哪儿找主人？`
      };
    }

    return {
      mood: "thinking",
      text: "一个一个猜有点慢。要是先把它们都暂时看成鸡呢？"
    };
  }

  if (state.phase === "pair") {
    const pairs = completedPairs(state);
    if (pairs === state.problem.pairCount) {
      return { mood: "happy", text: `六条腿正好变成 ${pairs} 组。每组可以把一只鸡修正成什么？` };
    }
    return { mood: "thinking", text: `兔比鸡多两条腿。把散落的腿两条一组，现在完成了 ${pairs} 组。` };
  }

  if (state.phase === "repair") {
    if (state.repairedAnimals.length === state.problem.rabbits) {
      return { mood: "happy", text: "腿数和脑袋数都对上了。现在我也来总结一条规则！" };
    }

    if (state.selectedPair !== null) {
      return { mood: "thinking", text: "这组两条腿已经拿好了。选一只鸡，把它修正成兔。" };
    }

    return { mood: "thinking", text: `还有 ${state.problem.rabbits - state.repairedAnimals.length} 组腿没有主人。先拿起一组。` };
  }

  if (state.phase === "misconception") {
    if (state.evidenceSolved) {
      return { mood: "thinking", text: "我明白了：不能把腿的条数直接当兔子的只数。要先两条一组。" };
    }
    return { mood: "wrong", text: "我总结好了：多出六条腿，所以有六只兔。肯定没错吧？" };
  }

  if (state.phase === "teach") {
    if (state.ruleTrack.length === 4) {
      return { mood: "happy", text: "规则轨道接通了。给我一组新数字，我来试试看！" };
    }
    return {
      mood: "thinking",
      text: state.notice || `我已经记住 ${state.ruleTrack.length} 步了。下一步应该接什么？`
    };
  }

  if (state.phase === "transfer") {
    if (!state.transferRun) {
      return { mood: "thinking", text: "新记录是十个脑袋、二十八条腿。启动刚才的规则，我不会再逐只猜。" };
    }
    if (transferComplete(state)) {
      return { mood: "happy", text: "两项检查都成立。这个方法换一组数字也能用！" };
    }
    return { mood: "thinking", text: "我算出了六只鸡、四只兔。请你替我检查脑袋和腿是不是都对。" };
  }

  return {
    mood: "happy",
    text: "登记装置恢复了。真正可靠的规则，换一组数字也不会失灵。"
  };
}

