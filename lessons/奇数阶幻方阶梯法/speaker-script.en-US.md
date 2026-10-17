# Odd Magic Squares: Staircase Method — Speaker Script

- Grade: Grades 5–6
- Lesson path: `lessons/奇数阶幻方阶梯法/index.html`
- Suggested duration: 18–22 minutes
- Default parameters: 3 × 3; switchable to 5 × 5, 7 × 7, 9 × 9, 11 × 11, 13 × 13, 15 × 15, or 17 × 17
- Teacher cue: Use **Next** or the right arrow to advance. At Stop 4, use **Place the next number** once per move. At Stop 5, use **Check the next line** to rotate through checks.

## Stop 1: Read the problem

**Action**

Open the lesson and remain on page 1.

**Ask**

What numbers are given, and what must be made equal?

**Pause**

Let students restate the task in their own words.

**Say**

We will place the numbers 1 through 9 into a 3 by 3 square. Every row, every column, and both diagonals must have the same sum. First, understand the task; we are not using the method yet.

**Screen check**

The empty 3 × 3 square and the complete problem are visible. No completed answer is shown.

## Stop 2: Find the magic sum

**Action**

Select **Next**.

**Ask**

What is the total of 1 through 9? If three rows have equal totals, what should each row total?

**Pause**

Wait for 45 and then 15.

**Say**

The total is 45. If the three row totals are equal, each must be 15. We call 15 the magic sum. For an n by n square, the magic sum is n times n squared plus 1, divided by 2.

**Screen check**

`1 + 2 + … + 9 = 45` and `45 ÷ 3 = 15` are visible.

## Stop 3: Learn the three rules

**Action**

Select **Next**.

**Ask**

After placing a number, which direction does the next number try first?

**Pause**

Invite students to read the three rules.

**Say**

Put 1 in the middle of the top row. Each next number moves one square up-right, wrapping around an edge. If the target square is already filled, move down one square from the current number instead.

**Screen check**

The number 1 and all three rules are visible.

## Stop 4: Climb the staircase one number at a time

**Action**

Select **Place the next number** repeatedly. Use **Restart at 1** if needed. Ask students to follow the arrow drawn directly on the square before each move.

**Ask**

Do we move up-right this time, wrap around an edge, or move down because the target is filled?

**Pause**

Pause at each wraparound and each occupied-square move.

**Say**

Do not memorize the finished square. Follow one consistent rule. A blue solid arrow means the up-right square is open; a gold dashed arrow always climbs at a 45-degree up-right angle before wrapping around an edge; a red arrow means the target square is filled, so move down from the current number. The top-right corner has a special case: first wrap over the top-right corner to the bottom-left square; only if that returned square is filled do we move down from the current number. After 3 is placed, the up-right target is already 1, so 4 moves down from 3.

**Screen check**

Each press adds one number only. The newest number is blue, and the relevant blue, gold, or red path arrow appears directly on the square. After 9 the square is full.

## Stop 5: Check every kind of line

**Action**

Select **Next**, then select **Check the next line** repeatedly.

**Ask**

What does this highlighted line total? Will the next line also total 15?

**Pause**

Let students add each highlighted line before reading the equation.

**Say**

We check more than one row. We check every row, every column, the main diagonal, and the other diagonal. They all total 15, so the square meets the requirement.

**Screen check**

The selected line is green and its equation ends with `= 15`.

## Stop 6: Why does the path change track after each group?

**Action**

Select **Next** and first look only at the two number strips on the left.

**Ask**

After 1, 2, and 3, why does 4 move down from 3 instead of continuing up-right?

**Pause**

Let students point out that the up-right target returns to 1, which is already filled.

**Say**

Split consecutive numbers into groups of three: 1, 2, 3 are Group 0, and 4, 5, 6 are Group 1. Within a group, the path always moves up-right. After 3, 6, 9, and so on, the up-right target meets an earlier number, so the rule drops one square from the current number and starts the next group. The downward move is therefore a regular track change, not an emergency turn. In a 5-, 7-, 9-, 11-, 13-, or 17-order square, it likewise changes track after every n numbers.

**Screen check**

A red note between the number strips says that a filled target starts a new track below.

## Stop 7: See why rows balance first

**Action**

Select **Next**. Use **Check another of this kind** to inspect every row.

**Ask**

What are the group-label total and the within-group-position total in this row? What is the original-number total after rebuilding it?

**Pause**

Let students read the cell labels first, then the three equations.

**Say**

Every number can be written as 3 times its group label, plus its within-group position, plus 1. For example, 8 has group label 2 and position 1, so 8 equals 3 times 2, plus 1, plus 1. In every row, the group labels total 3 and the position labels total 3. Therefore the original-number total is 3 times 3, plus 3, plus 3: 15. Label order changes in another row, but these two totals do not.

**Screen check**

One row is highlighted; the right side shows the group total, the position total, and the original-number total together.

## Stop 8: See why columns balance too

**Action**

Select **Next**. Use **Check another of this kind** to inspect every column.

**Ask**

Column labels are ordered differently from row labels. Will their two totals still be 3?

**Pause**

Ask for a prediction, then verify it with the equations on screen.

**Say**

Yes. Up-right moves carry numbers into the next column, and an edge wraparound continues the same motion from the other side. That gives every column a group-label total of 3 and a position total of 3. The columns do not look identical; their two label totals are what stay balanced.

**Screen check**

One column is highlighted. Each column can be checked and shows both label totals and the original-number total.

## Stop 9: Finish with the two diagonals

**Action**

Select **Next**. Use **Check another of this kind** to view both diagonals.

**Ask**

Some labels repeat on a diagonal. Why can its numbers still total 15?

**Pause**

Let students compare the labels and equations on both diagonals.

**Say**

This is the easy point to misread: labels do not need to all be different on a line. A diagonal can have two equal group labels. What matters is that the group-label sum and the within-group-position sum are both still 3. Once those two totals are fixed, the original-number total is fixed too.

**Screen check**

The two diagonals highlight in turn; the right side notes that repeated labels are allowed and totals are what matter.

## Stop 10: Combine the observations into the reason

**Action**

Select **Next**.

**Ask**

How can we connect “climbing the staircase” to “equal row, column, and diagonal sums” in one complete reason?

**Pause**

Ask students to restate: up-right within groups, down to change tracks between groups, and fixed totals for both labels.

**Say**

The staircase changes track regularly after each group of n numbers. We checked rows, columns, and diagonals separately: both their group-label totals and position-label totals are n times n minus 1, divided by 2. Since every number equals n times its group label, plus its position, plus 1, every line totals n times n times n minus 1 divided by 2, plus n times n minus 1 divided by 2, plus n. That simplifies to n times n squared plus 1, divided by 2. So equal row, column, and diagonal sums are built into the method, not a coincidence.

**Screen check**

The completed square shows G and P labels, and the final formula equals this square's magic sum.
