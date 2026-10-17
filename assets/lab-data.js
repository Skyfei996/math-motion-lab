(function () {
  const languages = {
    "zh-CN": {
      common: {
        back: "\u8fd4\u56de\u76ee\u5f55",
        languageToggle: "EN",
        play: "\u6f14\u793a",
        pause: "\u6682\u505c",
        replay: "\u91cd\u64ad",
        reset: "\u590d\u539f",
        categoryAll: "\u5168\u90e8",
        observe: "\u89c2\u5bdf",
        conclusion: "\u7ed3\u8bba",
        controls: "\u5b9e\u9a8c\u63a7\u5236",
        parameters: "\u53c2\u6570",
        formula: "\u7b97\u5f0f",
        dragHint: "\u53ef\u4ee5\u62d6\u52a8\u753b\u9762\u91cc\u7684\u5bf9\u8c61\uff0c\u4e5f\u53ef\u4ee5\u8c03\u6574\u53f3\u4fa7\u53c2\u6570\u3002"
      },
      home: {
        catalogTitle: "\u5b9e\u9a8c\u76ee\u5f55",
        catalogEmpty: "\u5f53\u524d\u5206\u7c7b\u6ca1\u6709\u53ef\u663e\u793a\u7684\u8bfe\u7a0b\u3002"
      },
      categories: {
        geometry: "\u51e0\u4f55",
        quantity: "\u6570\u4e0e\u8fd0\u7b97",
        fractions: "\u5206\u6570\u4e0e\u5c0f\u6570",
        wordProblems: "\u5e94\u7528\u9898",
        probability: "\u6982\u7387"
      },
      lessons: {
        perimeterShape: {
          title: "几何画布：周长实验",
          summary: "自由添加线段与图形，拖动、旋转并改变边长；按网格比较形状和周长。",
          grade: "三至四年级",
          interaction: "添加线段 / 自由拖动"
        },
        parallel: {
          title: "\u5e73\u884c\u7ebf\u4e0e\u76f8\u4ea4\u7ebf",
          summary: "\u62d6\u52a8\u89d2\u5ea6\u548c\u95f4\u8ddd\uff0c\u89c2\u5bdf\u4e24\u6761\u76f4\u7ebf\u4f1a\u4e0d\u4f1a\u76f8\u4ea4\u3002",
          grade: "\u56db\u5e74\u7ea7",
          interaction: "\u62d6\u7ebf / \u8c03\u89d2\u5ea6"
        },
        squares: {
          title: "\u4e24\u4e2a\u6b63\u65b9\u5f62\u5408\u6210\u957f\u65b9\u5f62",
          summary: "\u62d6\u52a8\u6b63\u65b9\u5f62\u5408\u5e76\uff0c\u89c2\u5bdf\u4e3a\u4ec0\u4e48\u5468\u957f\u4f1a\u5c11\u4e24\u6761\u8fb9\u3002",
          grade: "\u56db\u5e74\u7ea7",
          interaction: "\u62d6\u65b9\u5757 / \u6539\u8fb9\u957f"
        },
        divisionFractions: {
          title: "\u5e73\u5747\u5206\u4e0e\u5206\u6570",
          summary: "\u628a\u6574\u4f53\u5e73\u5747\u5206\uff0c\u7406\u89e3\u9664\u6cd5\u548c\u5206\u6570\u6765\u81ea\u540c\u4e00\u4ef6\u4e8b\u3002",
          grade: "\u56db\u5e74\u7ea7",
          interaction: "\u5206\u7ec4 / \u5207\u5757"
        },
        vehicleRental: {
          title: "\u79df\u8f66\u600e\u6837\u6700\u7701\u94b1",
          summary: "\u628a\u8001\u5e08\u3001\u5b66\u751f\u3001\u8f66\u7684\u5ea7\u4f4d\u548c\u79df\u91d1\u90fd\u53d8\u6210\u53ef\u8c03\u53c2\u6570\uff0c\u6bd4\u8f83\u6bcf\u79cd\u79df\u8f66\u65b9\u6848\u3002",
          grade: "\u56db\u5e74\u7ea7",
          interaction: "\u6539\u53c2\u6570 / \u770b\u65b9\u6848"
        },
        notebookPromotion: {
          title: "\u4e705\u90011\u4e70\u7b14\u8bb0\u672c",
          summary: "\u628a\u201c\u4e705\u672c\u90011\u672c\u201d\u770b\u6210\u4e00\u7ec46\u672c\uff0c\u7528\u5206\u7ec4\u548c\u4f59\u6570\u7b97\u51fa\u6700\u5c11\u4ed8\u94b1\u7684\u672c\u6570\u4e0e\u603b\u4ef7\u3002",
          grade: "\u4e09\u5e74\u7ea7",
          interaction: "\u5206\u7ec4 / \u56de\u5934\u9a8c\u7b97"
        },
        chickenRabbit: {
          title: "\u9e21\u5154\u540c\u7b3c",
          summary: "\u5148\u628a\u6240\u6709\u52a8\u7269\u90fd\u5f53\u6210\u9e21\uff0c\u518d\u770b\u591a\u51fa\u7684\u817f\u4e3a\u4ec0\u4e48\u6bcf2\u6761\u5c31\u5bf9\u5e941\u53ea\u5154\u5b50\u3002",
          grade: "\u56db\u5e74\u7ea7",
          interaction: "\u4e0a\u4e00\u9875 / \u4e0b\u4e00\u9875"
        },
        chickenRabbitScene: {
          title: "鸡兔同笼·逐步讲解",
          summary: "用 10 头 26 腿建立直觉，再完整讲解 35 头 94 腿，并用一腿兽与四腿蛇迁移检验假设法。",
          grade: "四年级",
          interaction: "点击舞台 / 键盘推进"
        },
        piDiscovery: {
          title: "圆周率是怎么计算出来的",
          summary: "跟着一只车轮找圆、绕绳、摆小棒，在八个动态场景里发现圆周率，看看人们怎样改进计算。",
          grade: "亲子共读",
          interaction: "动态场景 / 分步共读"
        },
        penTransfer: {
          title: "\u94a2\u7b14\u642c\u5bb6\u500d\u6570\u95ee\u9898",
          summary: "\u7528\u603b\u6570\u4e0d\u53d8\u548c\u201c8\u4efd\uff0b1\u4efd\u201d\u7684\u753b\u9762\uff0c\u770b\u6e05\u5c0f\u9752\u5e94\u8be5\u7ed9\u5c0f\u5b81\u591a\u5c11\u652f\u94a2\u7b14\u3002",
          grade: "\u56db\u5e74\u7ea7",
          interaction: "\u5206\u4efd / \u642c\u94a2\u7b14"
        },
        bookshelfMultiple: {
          title: "两个书架原来各有多少本书",
          summary: "在左右两个真实书架上逐步取书、放书、分份与还原，用同一场景看清相差本数和份数差。",
          grade: "四年级",
          interaction: "点击舞台 / 键盘推进"
        },
        boxTransferDifference: {
          title: "甲乙两箱原来各有多少袋洗衣粉",
          summary: "在同一对箱子上移动4袋、去掉多出的6袋、平均分再倒推，看清总数不变的和差关系。",
          grade: "四年级",
          interaction: "移动 / 平分 / 倒推"
        },
        quotientRemainderSum: {
          title: "\u6570\u5b57\u6362\u5361\u7834\u6848",
          summary: "\u628a\u88ab\u9664\u6570\u6362\u6210\u201c\u5546\u4e2a\u9664\u6570\uff0b\u4f59\u6570\u201d\uff0c\u627e\u56de\u85cf\u5728\u56db\u6570\u603b\u548c\u91cc\u7684\u88ab\u9664\u6570\u548c\u9664\u6570\u3002",
          grade: "\u56db\u5e74\u7ea7",
          interaction: "\u6362\u5361 / \u5408\u5e76\u540c\u7c7b"
        },
        waterMeasure: {
          title: "\u91cf\u51fa1100\u6beb\u5347\u7684\u6c34",
          summary: "\u5148\u7528800\u6beb\u5347\u74f6\u548c500\u6beb\u5347\u74f6\u91cf\u51fa300\u6beb\u5347\uff0c\u518d\u8865\u4e00\u6ee1800\u6beb\u5347\u74f6\uff0c\u7528\u6c34\u4f4d\u53d8\u5316\u9a8c\u8bc1\u7ed3\u679c\u3002",
          grade: "\u56db\u5e74\u7ea7",
          interaction: "\u5012\u6c34 / \u770b\u6c34\u4f4d"
        },
        cupBottleWeight: {
          title: "一杯水和一个空瓶各重多少克",
          summary: "对齐两次称重，去掉相同的空瓶和水量，让多出的2杯水与多出的160克建立对应。",
          grade: "三年级",
          interaction: "对齐 / 消去 / 检验"
        },
        trailingZeros: {
          title: "\u4e58\u79ef\u672b\u5c3e\u76840",
          summary: "\u4ece\u4e585\u7684\u6b63\u53cd\u4f8b\u5f00\u59cb\uff0c\u53ea\u770b\u4e2a\u4f4d\uff0c\u9010\u4e2a\u9501\u5b9a\u4e58\u79ef\u672b\u5c3e\u76840\u3002",
          grade: "\u56db\u81f3\u4e94\u5e74\u7ea7",
          interaction: "\u9010\u4e2a\u88650 / \u4fee\u6539\u9898\u76ee"
        },
        rectangleSquare: {
          title: "\u957f\u65b9\u5f62\u53d8\u6210\u6b63\u65b9\u5f62",
          summary: "\u5728\u540c\u4e00\u4e2a\u957f\u65b9\u5f62\u4e0a\u8fde\u7eed\u770b\u89c1\u52065\u4efd\u3001\u75591\u4efd\u548c\u5bbd\u6269\u59275\u500d\uff0c\u7406\u89e3\u4e3a\u4ec0\u4e48\u6700\u540e\u521a\u597d\u6210\u4e3a\u6b63\u65b9\u5f62\u3002",
          grade: "\u56db\u5e74\u7ea7",
          interaction: "\u8fde\u7eed\u53d8\u5316 / \u4fee\u6539\u9898\u76ee"
        },
        trainBridge: {
          title: "\u706b\u8f66\u8fc7\u6865",
          summary: "\u5148\u7528\u5047\u60f3\u5c0f\u4eba\u770b\u61c2\u6bcf\u79d2\u8def\u7a0b\u548c\u65f6\u95f4\uff0c\u518d\u89c2\u5bdf\u706b\u8f66\u4e3a\u4ec0\u4e48\u8fd8\u8981\u591a\u8d70\u4e00\u4e2a\u8f66\u8eab\u957f\u3002",
          grade: "\u56db\u5e74\u7ea7",
          interaction: "\u6bcf\u79d2\u4e00\u683c / \u706b\u8f66\u79fb\u52a8"
        },
        magicSquareStaircase: {
          title: "奇数阶幻方的阶梯法",
          summary: "从顶部中间出发，沿右上阶梯填数，再验证每行、每列和两条对角线为什么一样。",
          grade: "五至六年级",
          interaction: "逐格填数 / 验证路线"
        },
        magicSquareDoublyEven: {
          title: "4的倍数阶幻方：X内外交换法",
          summary: "从顺序方阵出发，交换中心对称的搭档；看懂 X 内和 X 外两种对称答案。",
          grade: "五至六年级",
          interaction: "逐对交换 / 逐线验算"
        },
        magicSquareSinglyEven: {
          title: "6、10、14、18阶幻方：四块拼接与换位法",
          summary: "把一个小奇数阶幻方拼成四块，再用换位带和中心修正完成大幻方。",
          grade: "五至六年级",
          interaction: "四块拼接 / 换位带"
        }
      },
      parallel: {
        modeLabel: "\u76f4\u7ebf\u5173\u7cfb",
        angleLabel: "\u5939\u89d2",
        distanceLabel: "\u8ddd\u79bb",
        extendLabel: "\u663e\u793a\u5ef6\u957f\u7ebf",
        parallelMode: "\u5e73\u884c",
        intersectMode: "\u76f8\u4ea4",
        observationParallel: "\u4e24\u6761\u7ebf\u65b9\u5411\u76f8\u540c\uff0c\u8ddd\u79bb\u4fdd\u6301\u4e0d\u53d8\u3002",
        observationIntersect: "\u4e24\u6761\u7ebf\u65b9\u5411\u4e0d\u540c\uff0c\u5ef6\u957f\u540e\u4f1a\u51fa\u73b0\u4ea4\u70b9\u3002",
        conclusionParallel: "\u7ed3\u8bba\uff1a\u5e73\u884c\u7ebf\u4e0d\u4f1a\u76f8\u4ea4\u3002",
        conclusionIntersect: "\u7ed3\u8bba\uff1a\u4e0d\u5e73\u884c\u7684\u4e24\u6761\u76f4\u7ebf\u4f1a\u76f8\u4ea4\u3002"
      },
      squares: {
        sideLabel: "\u8fb9\u957f",
        unitLabel: "\u5355\u4f4d",
        gapLabel: "\u5408\u5e76\u8ddd\u79bb",
        showHiddenLabel: "\u663e\u793a\u9690\u85cf\u8fb9",
        observation: "\u4e24\u4e2a\u6b63\u65b9\u5f62\u8d34\u5408\u540e\uff0c\u4e2d\u95f4\u4e24\u6761\u8fb9\u53d8\u6210\u5185\u90e8\u8fb9\u3002",
        conclusion: "\u5468\u957f\u51cf\u5c11 2 \u6761\u8fb9\uff0c\u4e5f\u5c31\u662f {reduced} {unit}\u3002"
      },
      divisionFractions: {
        totalLabel: "\u603b\u6570",
        groupsLabel: "\u5206\u6210\u51e0\u7ec4",
        fractionPartsLabel: "\u6574\u4f53\u5206\u6210\u51e0\u4efd",
        selectedPartsLabel: "\u53d6\u5176\u4e2d\u51e0\u4efd",
        observationDivision: "{total} \u4e2a\u7269\u54c1\u5e73\u5747\u5206\u6210 {groups} \u7ec4\uff0c\u6bcf\u7ec4 {each} \u4e2a\u3002",
        observationFraction: "\u628a\u4e00\u4e2a\u6574\u4f53\u5e73\u5747\u5206\u6210 {denominator} \u4efd\uff0c\u53d6 {numerator} \u4efd\uff0c\u5c31\u662f {numerator}/{denominator}\u3002",
        conclusionDivision: "{total} \u00f7 {groups} = {each}",
        conclusionFraction: "{numerator}/{denominator} \u8868\u793a {denominator} \u4efd\u4e2d\u7684 {numerator} \u4efd\u3002"
      },
      units: {
        cm: "\u5398\u7c73",
        m: "\u7c73"
      }
    },
    "en-US": {
      common: {
        back: "Back to catalog",
        languageToggle: "\u4e2d\u6587",
        play: "Play",
        pause: "Pause",
        replay: "Replay",
        reset: "Reset",
        categoryAll: "All",
        observe: "Observe",
        conclusion: "Conclusion",
        controls: "Experiment controls",
        parameters: "Parameters",
        formula: "Formula",
        dragHint: "You can drag objects in the scene or adjust the parameters on the right."
      },
      home: {
        catalogTitle: "Experiment catalog",
        catalogEmpty: "No visible courses in this category."
      },
      categories: {
        geometry: "Geometry",
        quantity: "Numbers and operations",
        fractions: "Fractions and decimals",
        wordProblems: "Word problems",
        probability: "Probability"
      },
      lessons: {
        perimeterShape: {
          title: "Geometry Canvas: Perimeter Lab",
          summary: "Add segments and shapes freely, then move, turn, and resize sides on a grid to compare their perimeters.",
          grade: "Grades 3–4",
          interaction: "Add segments / free drag"
        },
        parallel: {
          title: "Parallel and Intersecting Lines",
          summary: "Drag the angle and spacing to see whether two lines will meet.",
          grade: "Grade 4",
          interaction: "Drag lines / adjust angle"
        },
        squares: {
          title: "Two Squares Make a Rectangle",
          summary: "Drag squares together and observe why the perimeter loses two sides.",
          grade: "Grade 4",
          interaction: "Drag blocks / change side length"
        },
        divisionFractions: {
          title: "Equal Sharing and Fractions",
          summary: "Split a whole into equal parts and see how division and fractions come from the same idea.",
          grade: "Grade 4",
          interaction: "Group / slice"
        },
        vehicleRental: {
          title: "Cheapest Vehicle Rental",
          summary: "Change teachers, students, seats, and prices to compare every rental plan.",
          grade: "Grade 4",
          interaction: "Change values / compare plans"
        },
        notebookPromotion: {
          title: "Buy 5, Get 1 Notebook Deal",
          summary: "Treat five paid notebooks plus one free notebook as a group of six, then use grouping and a remainder to find the least paid count and total cost.",
          grade: "Grade 3",
          interaction: "Group / verify"
        },
        chickenRabbit: {
          title: "Chickens and Rabbits",
          summary: "Assume every animal is a chicken, then see why every pair of extra legs identifies one rabbit.",
          grade: "Grade 4",
          interaction: "Previous / next"
        },
        chickenRabbitScene: {
          title: "Chickens and Rabbits · Scene Lesson",
          summary: "Teacher-paced reveals connect heads, base legs, extra pairs, and rabbits one visible change at a time.",
          grade: "Grade 4",
          interaction: "Click stage / keyboard"
        },
        piDiscovery: {
          title: "How Was Pi Calculated?",
          summary: "Follow a wheel through eight animated scenes: find circles, wrap string, compare diameter rods and discover better ways to calculate pi.",
          grade: "Read together",
          interaction: "Animated scenes / read together"
        },
        penTransfer: {
          title: "Moving Pens: A Multiples Problem",
          summary: "Keep the total fixed, build the final counts as equal parts, and find how many pens Qing gives Ning.",
          grade: "Grade 4",
          interaction: "Make parts / move pens"
        },
        bookshelfMultiple: {
          title: "How Many Books Did Each Shelf Start With?",
          summary: "Remove, add, partition, and restore books on two fixed bookcases so the numerical gap and the extra parts stay visibly connected.",
          grade: "Grade 4",
          interaction: "Click stage / keyboard"
        },
        boxTransferDifference: {
          title: "How Many Detergent Bags Were in Each Box?",
          summary: "Move bags between two fixed boxes, set aside the excess, share the remainder equally, then reverse the move.",
          grade: "Grade 4",
          interaction: "Move / share / work back"
        },
        quotientRemainderSum: {
          title: "The Number-Card Mystery",
          summary: "Replace the dividend with quotient-sized divisor cards and a remainder card, then recover both hidden numbers.",
          grade: "Grade 4",
          interaction: "Swap cards / group matches"
        },
        waterMeasure: {
          title: "Measure 1100 mL of Water",
          summary: "Use the difference between 800 mL and 500 mL to make 300 mL, then add one full 800 mL bottle and verify the water level.",
          grade: "Grade 4",
          interaction: "Pour water / watch levels"
        },
        cupBottleWeight: {
          title: "How Much Do One Cup of Water and the Empty Bottle Weigh?",
          summary: "Align two weighings and remove the matching bottle and water so the two extra cups line up with the extra 160 grams.",
          grade: "Grade 3",
          interaction: "Align / cancel / verify"
        },
        trailingZeros: {
          title: "Trailing Zeros in a Product",
          summary: "Use examples and counterexamples with multiplication by 5, focus on the ones digit, and lock trailing zeros one at a time.",
          grade: "Grades 4–5",
          interaction: "Build zeros / change values"
        },
        rectangleSquare: {
          title: "A Rectangle Becomes a Square",
          summary: "Follow one rectangle as its length is split, one part remains, and its width grows until the result is exactly square.",
          grade: "Grade 4",
          interaction: "Continuous change / change values"
        },
        trainBridge: {
          title: "A Train Crossing a Bridge",
          summary: "Use an imaginary walker to understand one-second distances, then see why a train must travel one extra train length.",
          grade: "Grade 4",
          interaction: "One-second blocks / move train"
        },
        magicSquareStaircase: {
          title: "Odd Magic Squares: Staircase Method",
          summary: "Start at the top middle, climb up-right, then verify why rows, columns, and diagonals have equal sums.",
          grade: "Grades 5–6",
          interaction: "Place numbers / trace checks"
        },
        magicSquareDoublyEven: {
          title: "Multiples-of-4 Magic Squares: Swap Inside or Outside X",
          summary: "Start with a sequential square, swap centre partners, and compare the two symmetric answers inside and outside X.",
          grade: "Grades 5–6",
          interaction: "Swap pairs / verify lines"
        },
        magicSquareSinglyEven: {
          title: "6-, 10-, 14-, and 18-Order Magic Squares: Four-Block Method",
          summary: "Build four blocks from a mini odd-order square, then use swap bands and centre corrections.",
          grade: "Grades 5–6",
          interaction: "Assemble blocks / swap bands"
        }
      },
      parallel: {
        modeLabel: "Line relationship",
        angleLabel: "Angle",
        distanceLabel: "Distance",
        extendLabel: "Show extensions",
        parallelMode: "Parallel",
        intersectMode: "Intersecting",
        observationParallel: "The two lines point in the same direction, so the distance stays the same.",
        observationIntersect: "The two lines point in different directions and will meet when extended.",
        conclusionParallel: "Conclusion: parallel lines do not intersect.",
        conclusionIntersect: "Conclusion: two non-parallel lines intersect."
      },
      squares: {
        sideLabel: "Side length",
        unitLabel: "Unit",
        gapLabel: "Merge distance",
        showHiddenLabel: "Show hidden sides",
        observation: "When two squares touch, the two middle sides become internal sides.",
        conclusion: "The perimeter is reduced by 2 sides, or {reduced} {unit}."
      },
      divisionFractions: {
        totalLabel: "Total",
        groupsLabel: "Number of groups",
        fractionPartsLabel: "Parts in the whole",
        selectedPartsLabel: "Parts selected",
        observationDivision: "{total} items split equally into {groups} groups gives {each} items in each group.",
        observationFraction: "Split one whole into {denominator} equal parts and take {numerator}; that is {numerator}/{denominator}.",
        conclusionDivision: "{total} \u00f7 {groups} = {each}",
        conclusionFraction: "{numerator}/{denominator} means {numerator} out of {denominator} equal parts."
      },
      units: {
        cm: "centimeters",
        m: "meters"
      }
    }
  };

  const catalog = [
    { id: "perimeterShape", href: "lessons/周长不变形状变/index.html", category: "geometry", accent: "teal", preview: "perimeter-canvas" },
    { id: "piDiscovery", href: "lessons/pi-discovery/index.html", category: "geometry", accent: "blue", preview: "pi-discovery" },
    { id: "parallel", href: "lessons/parallel-lines.html", category: "geometry", accent: "blue", preview: "parallel-lines" },
    { id: "squares", href: "lessons/squares-rectangle.html", category: "geometry", accent: "gold", preview: "squares" },
    { id: "divisionFractions", href: "lessons/division-fractions.html", category: "quantity", accent: "teal", preview: "equal-sharing" },
    { id: "vehicleRental", href: "lessons/租车怎样最省钱/index.html", category: "wordProblems", accent: "rose", preview: "vehicles" },
    { id: "notebookPromotion", href: "lessons/买5送1买笔记本/index.html", category: "wordProblems", accent: "gold", preview: "notebook-promotion" },
    { id: "chickenRabbit", href: "lessons/鸡兔同笼/index.html", category: "wordProblems", accent: "gold", preview: "creatures" },
    { id: "chickenRabbitScene", href: "lessons/鸡兔同笼-场景版/index.html", category: "wordProblems", accent: "gold", preview: "creatures-scene" },
    { id: "penTransfer", href: "lessons/钢笔搬家倍数问题/index.html", category: "wordProblems", accent: "teal", preview: "pen-transfer" },
    { id: "bookshelfMultiple", href: "lessons/两个书架原来各有多少本书/index.html", category: "wordProblems", accent: "gold", preview: "bookshelf-multiple" },
    { id: "boxTransferDifference", href: "lessons/甲乙两箱原来各有多少袋洗衣粉/index.html", category: "wordProblems", accent: "teal", preview: "detergent-transfer" },
    { id: "quotientRemainderSum", href: "lessons/数字换卡破案/index.html", category: "wordProblems", accent: "teal", preview: "number-card-case" },
    { id: "waterMeasure", href: "lessons/量出1100毫升的水/index.html", category: "wordProblems", accent: "teal", preview: "water-measure" },
    { id: "cupBottleWeight", href: "lessons/一杯水和一个空瓶各重多少克/index.html", category: "wordProblems", accent: "teal", preview: "water-weight" },
    { id: "trailingZeros", href: "lessons/乘积末尾的0/index.html", category: "quantity", accent: "teal", preview: "trailing-zeros" },
    { id: "rectangleSquare", href: "lessons/长方形连续变成正方形/index.html", category: "wordProblems", accent: "gold", preview: "rectangle-square" },
    { id: "trainBridge", href: "lessons/火车过桥/index.html", category: "wordProblems", accent: "teal", preview: "train-bridge" },
    { id: "magicSquareStaircase", href: "lessons/奇数阶幻方阶梯法/index.html", category: "quantity", accent: "gold", preview: "magic-square" },
    { id: "magicSquareDoublyEven", href: "lessons/4的倍数阶幻方X内外交换法/index.html", category: "quantity", accent: "gold", preview: "magic-square-4x" },
    { id: "magicSquareSinglyEven", href: "lessons/4k加2阶幻方四块拼接法/index.html", category: "quantity", accent: "teal", preview: "magic-square-6x" }
  ];

  const categories = ["geometry", "quantity", "fractions", "wordProblems", "probability"];

  window.MathLabData = { languages, catalog, categories, defaultLanguage: "zh-CN", storageKey: "math-lab-language" };
})();
