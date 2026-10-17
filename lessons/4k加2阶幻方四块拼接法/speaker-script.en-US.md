# 6-, 10-, 14-, and 18-Order Magic Squares: Four-Block Method

- Grade: Grades 5–6
- Lesson path: `lessons/4k加2阶幻方四块拼接法/index.html`
- Suggested duration: 30–40 minutes
- Default parameter: `6 × 6`; switchable to `10 × 10`, `14 × 14`, and `18 × 18`
- Teacher cue: On action stops, ask and pause before selecting the button. Read only the branch for the current order.

## Parameter reference

| Order | Mini square | Total | Magic sum | A / B / C / D ranges | Upper / lower row | Left / right swaps |
|---|---:|---:|---:|---|---:|---:|
| 6 | 3 × 3 | 666 | 111 | 1–9 / 19–27 / 28–36 / 10–18 | 84 / 138 | 1 / 0 |
| 10 | 5 × 5 | 5050 | 505 | 1–25 / 51–75 / 76–100 / 26–50 | 380 / 630 | 2 / 1 |
| 14 | 7 × 7 | 19306 | 1379 | 1–49 / 99–147 / 148–196 / 50–98 | 1036 / 1722 | 3 / 2 |
| 18 | 9 × 9 | 52650 | 2925 | 1–81 / 163–243 / 244–324 / 82–162 | 2196 / 3654 | 4 / 3 |

## Stop 1: Read the task

**Action**

Open the lesson. To change the order, select **Choose order**, then **Apply**. The lesson returns to Stop 1.

**Ask**

Which numbers go into what size square? Which lines must have equal totals?

**Pause**

Let students restate the complete task.

**Say**

For the selected order, place 1 through 36, 100, 196, or 324 into a 6 by 6, 10 by 10, 14 by 14, or 18 by 18 square. Every row, column, and both diagonals must have the same total. For now, read only the task. Do not reveal the blocks or answer.

**Screen check**

The stage contains the full problem and an empty square. No numbers, dividers, or A/B/C/D labels are visible.

## Stop 2: Find the magic sum

**Action**

Select **Next**.

**Ask**

If the total of all numbers is shared equally among the rows, what must one row total?

**Pause**

Wait for “find the total, then divide by the number of rows.”

**Say**

- Order 6: The total from 1 through 36 is 666, and `666 ÷ 6 = 111`.
- Order 10: The total from 1 through 100 is 5050, and `5050 ÷ 10 = 505`.
- Order 14: The total from 1 through 196 is 19306, and `19306 ÷ 14 = 1379`.
- Order 18: The total from 1 through 324 is 52650, and `52650 ÷ 18 = 2925`.

Read only the matching line. The quotient is the magic sum.

**Screen check**

The number total appears before “total divided by order equals magic sum.”

## Stop 3: Divide the large square into four blocks

**Action**

Select **Next**.

**Ask**

What is half the current side length? Is it odd or even?

**Pause**

Wait for 3, 5, 7, or 9 and the word “odd.”

**Say**

- Order 6: `6 = 2 × 3`.
- Order 10: `10 = 2 × 5`.
- Order 14: `14 = 2 × 7`.
- Order 18: `18 = 2 × 9`.

Half the side length is odd. We can build a mini odd-order magic square in block A, then carry its arrangement into blocks B, C, and D.

**Screen check**

The empty board gains its divider and A/B/C/D labels without changing size.

## Stop 4: Build the mini odd square in block A

**Action**

Select **Place next group** repeatedly: 3 times for order 6, 5 times for order 10, 7 times for order 14, or 9 times for order 18.

**Ask**

Why does each group of consecutive numbers follow the same up-right staircase?

**Pause**

After the first group appears, pause and recall the odd-order staircase method.

**Say**

This lesson reuses the odd-order rule without dropping in the finished square all at once. Each click places one group whose size equals the mini-square side length. Numbers move up-right within a group and change track when the target is occupied. Block A finishes as a mini magic square.

**Screen check**

Only one new group appears per click; existing numbers do not flash. The mini-square magic sum appears when A is complete.

## Stop 5: Assemble four matching blocks

**Action**

Select **Add next block** three times to add B, C, and D.

**Ask**

What stays the same in all four blocks? What changes?

**Pause**

After each block appears, ask students to match one position with block A.

**Say**

Every block keeps the same arrangement. Only its number range changes. Read the A/B/C/D ranges for the current order from the parameter table. The assembled square is not finished: its first row totals 84, 380, 1036, or 2196 instead of 111, 505, 1379, or 2925.

**Screen check**

Blocks B, C, and D appear one at a time. The final board shows that its first row is not yet the magic sum.

## Stop 6: Notice what already balances

**Action**

Select **Next**.

**Ask**

Why do columns already reach the magic sum while upper and lower rows are too small and too large?

**Pause**

Compare the highlighted upper-lower row pair, then inspect one column.

**Say**

- Order 6: Upper rows total 84, lower rows 138, and the target is 111.
- Order 10: Upper rows total 380, lower rows 630, and the target is 505.
- Order 14: Upper rows total 1036, lower rows 1722, and the target is 1379.
- Order 18: Upper rows total 2196, lower rows 3654, and the target is 2925.

Swapping two numbers vertically changes their positions but not the total of their column. We can therefore repair row pairs without damaging columns.

**Screen check**

One upper-lower row pair is outlined in gold. The evidence area shows the upper total, target, and lower total.

## Stop 7: Derive the swap widths from the row deficit

**Action**

Select **Next**.

**Ask**

How much does one left swap add? How much does one right swap remove? Which combination reaches the target?

**Pause**

Let students calculate the first change before revealing the whole expression.

**Say**

- Order 6: `84 + 27 = 111`, so swap 1 left cell and 0 right cells.
- Order 10: `380 + 75 + 75 − 25 = 505`, so swap 2 left cells and 1 right cell.
- Order 14: `1036 + 147 + 147 + 147 − 49 − 49 = 1379`, so swap 3 left cells and 2 right cells.
- Order 18: `2196 + 243 + 243 + 243 + 243 − 81 − 81 − 81 = 2925`, so swap 4 left cells and 3 right cells.

These widths are not facts to memorize. They come directly from the amount missing in an upper row.

**Screen check**

The current order’s complete adjustment expression and left/right swap counts are visible.

## Stop 8: Compare the shared pattern

**Action**

Select **Next**.

**Ask**

As the mini square grows from order 3 to 5 to 7 to 9, what happens to the left and right swap counts?

**Pause**

Ask students to read `1/0 → 2/1 → 3/2 → 4/3`.

**Say**

Whenever the mini-square side grows by 2, both swap counts grow by 1. The right side always uses one fewer position than the left. This is one shared pattern, not four unrelated recipes.

**Screen check**

Orders 6, 10, 14, and 18 are compared in one compact list. The current order is highlighted.

## Stop 9: Swap ordinary row pairs

**Action**

Select **Swap next row pair** repeatedly: 2 times for order 6, 4 times for order 10, 6 times for order 14, or 8 times for order 18.

**Ask**

Which two rows are active now? In what direction will their selected numbers move?

**Pause**

Before each click, let students point to the selected cells. Read the new row totals only after the movement finishes.

**Say**

Each click handles one upper-lower row pair. The two numbers in each selected column travel from each other’s positions. Unchanged numbers stay still. The column totals remain fixed while both active rows reach the magic sum.

**Screen check**

Only the current row pair is highlighted and moves. The evidence area shows a completed-row count instead of a long swap list.

## Stop 10: Handle the special middle row pair

**Action**

Inspect the highlighted positions, then select **Swap the middle row pair**.

**Ask**

Why does this pair keep the first left cell and swap the mini-square centre instead?

**Pause**

Ask students to identify “keep the first cell” and “swap the centre cell.”

**Say**

The middle rows do not make an ordinary swap and then undo it. They use one complete special rule from the start: keep the first left cell, swap the mini-square centre instead, and use the usual right-side positions. This balances the middle rows and aligns both diagonals.

The active rows are 2 and 5 at order 6, 3 and 8 at order 10, 4 and 11 at order 14, and 5 and 14 at order 18.

**Screen check**

The selected numbers move vertically to each other. The page reports that the middle rows are in place but saves the full conclusion for the next stop.

## Stop 11: Explain the fixed change from each swap

**Action**

Select **Next**. The board rewinds to the four assembled blocks and highlights one matching A/C pair and one matching B/D pair.

**Ask**

Why does every left swap add the same amount? Why does every right swap remove the same amount?

**Pause**

Have students read the two actual number pairs and subtract before giving the general rule.

**Say**

Let each mini square contain `q` cells. All four blocks use the same base arrangement, so matching positions differ only by whole number-range offsets. A to C spans three ranges, so one left swap always adds `3q` to the upper row. Replacing B with D moves back one range, so one right swap always removes `q`.

- Order 6: `q = 9`; left `+27`, right `−9`.
- Order 10: `q = 25`; left `+75`, right `−25`.
- Order 14: `q = 49`; left `+147`, right `−49`.
- Order 18: `q = 81`; left `+243`, right `−81`.

The change therefore depends on whether a cell is in the left or right half, not on its particular value.

**Screen check**

Blue marks one A/C pair and gold marks one B/D pair. Their actual values and fixed changes appear beside the board.

## Stop 12: Derive the number of swapped columns from the row deficit

**Action**

Select **Next**.

**Ask**

How far is the upper row below the magic sum? Which combination of left additions and right reductions fills that deficit exactly?

**Pause**

Ask students to match the deficit with the blue and gold one-swap changes in one equation.

**Say**

- Order 6: `111 − 84 = 27`, and `27 × 1 − 9 × 0 = 27`.
- Order 10: `505 − 380 = 125`, and `75 × 2 − 25 × 1 = 125`.
- Order 14: `1379 − 1036 = 343`, and `147 × 3 − 49 × 2 = 343`.
- Order 18: `2925 − 2196 = 729`, and `243 × 4 − 81 × 3 = 729`.

This is why the rule uses 1, 2, 3, or 4 left columns and 0, 1, 2, or 3 right columns: those counts fill the upper-row deficit exactly. Each exchange stays within one column, so the two values merely reverse order—for example, `47 + 290 = 290 + 47`. The column total cannot change, and the lower row loses exactly what the upper row gains, so both rows reach the target together.

**Screen check**

Only cells that participate in the ordinary swap are coloured. The row-deficit equation and unchanged-column equation are both visible.

## Stop 13: Explain why the middle row must use the centre cell

**Action**

Select **Next**.

**Ask**

After keeping the first cell and including the centre, has the number of left swaps changed? Which important lines pass through the centre?

**Pause**

Have students count the coloured cells, then trace the green and blue diagonal paths.

**Say**

Ordinary rows swap left positions 1 through `k`. The middle row instead swaps positions 2 through `k+1`. Removing the first position and adding the centre keeps exactly `k` swaps, so the row adjustment is unchanged and the row and column totals stay correct.

- Order 6: ordinary position 1; middle position 2.
- Order 10: ordinary positions 1–2; middle positions 2–3.
- Order 14: ordinary positions 1–3; middle positions 2–4.
- Order 18: ordinary positions 1–4; middle positions 2–5.

The mini-square centre in the middle row lies on the critical paths of both diagonals in the full square. Keeping the ordinary first-cell swap would repair the row totals but not both diagonals. Replacing that first cell with the centre preserves the swap count while satisfying the diagonal condition. That is the sole reason the middle row is special.

**Screen check**

The first cell is marked in red as kept, the centre is marked in green as included, and the two diagonals use green and blue outlines. The formula still shows the unchanged left-swap count.

## Stop 14: Verify and conclude

**Action**

Select **Next**, then use **Check next line** repeatedly.

**Ask**

Is the highlighted line a row, column, or diagonal? Does it reach the magic sum?

**Pause**

Let students estimate or group the addends before reading the displayed result.

**Say**

Every line totals 111 at order 6, 505 at order 10, 1379 at order 14, or 2925 at order 18. Rows, columns, and both diagonals pass, so the construction is complete.

**Screen check**

Only one line is highlighted at a time. Orders 10, 14, and 18 use the compact statement “Highlighted line total = magic sum.” The complete conclusion appears only here.
