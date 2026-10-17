#!/usr/bin/env python3
"""Validate a lesson folder and its printable bilingual speaker scripts."""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


REQUIRED_FILES = (
    "index.html",
    "speaker-script.zh-CN.md",
    "speaker-script.en-US.md",
)


def read_text(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except UnicodeDecodeError as exc:
        raise ValueError(f"{path} must be UTF-8: {exc}") from exc


def numbered_steps(text: str, pattern: str) -> list[int]:
    return [int(value) for value in re.findall(pattern, text, flags=re.MULTILINE)]


def expected_sequence(values: list[int]) -> list[int]:
    return list(range(1, len(values) + 1))


def validate(lesson_dir: Path) -> list[str]:
    errors: list[str] = []
    if not lesson_dir.is_dir():
        return [f"Lesson directory does not exist: {lesson_dir}"]

    missing = [name for name in REQUIRED_FILES if not (lesson_dir / name).is_file()]
    if missing:
        errors.append(f"Missing required files: {', '.join(missing)}")
        return errors

    try:
        html = read_text(lesson_dir / "index.html")
        zh_script = read_text(lesson_dir / "speaker-script.zh-CN.md")
        en_script = read_text(lesson_dir / "speaker-script.en-US.md")
    except ValueError as exc:
        return [str(exc)]

    zh_steps = numbered_steps(zh_script, r"^## 第(\d+)站[：:]")
    en_steps = numbered_steps(en_script, r"^## Stop (\d+):")

    if not zh_steps:
        errors.append("Chinese script has no headings like '## 第1站：步骤名称'.")
    elif zh_steps != expected_sequence(zh_steps):
        errors.append(f"Chinese step numbers must be continuous from 1: {zh_steps}")

    if not en_steps:
        errors.append("English script has no headings like '## Stop 1: Step name'.")
    elif en_steps != expected_sequence(en_steps):
        errors.append(f"English step numbers must be continuous from 1: {en_steps}")

    if zh_steps and en_steps and zh_steps != en_steps:
        errors.append(f"Chinese and English step numbers differ: {zh_steps} vs {en_steps}")

    for cue in ("**操作**", "**讲解"):
        if cue not in zh_script:
            errors.append(f"Chinese script is missing cue: {cue}")

    for cue in ("**Action**", "**Say"):
        if cue not in en_script:
            errors.append(f"English script is missing cue: {cue}")

    webpage_files = [lesson_dir / "index.html", lesson_dir / "lesson.js"]
    for path in webpage_files:
        if not path.is_file():
            continue
        try:
            content = read_text(path)
        except ValueError as exc:
            errors.append(str(exc))
            continue
        if re.search(r"speaker-script|\.md(?:[?#'\"]|$)", content, flags=re.IGNORECASE):
            errors.append(f"Webpage code must not load or reference speaker scripts: {path.name}")

    if "<html" not in html.lower() or "</html>" not in html.lower():
        errors.append("index.html does not appear to be a complete HTML document.")

    return errors


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("lesson_dir", type=Path, help="Path to one lesson folder")
    args = parser.parse_args()

    lesson_dir = args.lesson_dir.resolve()
    errors = validate(lesson_dir)
    if errors:
        print(f"FAIL: {lesson_dir}")
        for error in errors:
            print(f"- {error}")
        return 1

    zh_text = read_text(lesson_dir / "speaker-script.zh-CN.md")
    steps = numbered_steps(zh_text, r"^## 第(\d+)站[：:]")
    print(f"PASS: {lesson_dir}")
    print(f"- Required files: {len(REQUIRED_FILES)}")
    print(f"- Synchronized steps: {len(steps)}")
    print("- Speaker scripts are not referenced by webpage code")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
