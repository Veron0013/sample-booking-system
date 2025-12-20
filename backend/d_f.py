import argparse
from pathlib import Path

DEFAULT_EXTS = {
    ".py", ".ts", ".tsx", ".js", ".jsx",
    ".json", ".md", ".txt",
    ".html", ".css", ".scss", ".sass",
    ".yml", ".yaml",
    ".env", ".env.example",
    ".tsconfig", ".eslintrc", ".prettierrc",
}

# Папки, які повністю пропускаємо
EXCLUDE_DIRS = {
    "node_modules",
    ".git",
    ".next",
    "dist",
    "build",
    "coverage",
    "android",
    "ios",
    "__pycache__",
    ".expo",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Збирає текстові файли з папки в один файл."
    )
    parser.add_argument("root", type=str, help="Коренева папка.")
    parser.add_argument("-o", "--output", type=str, default="project_dump.txt")
    parser.add_argument(
        "-e", "--ext", type=str, nargs="*", default=None,
        help="Розширення файлів, наприклад: -e .ts .tsx"
    )
    return parser.parse_args()


def collect_files(root: Path, allowed_exts: set[str]) -> list[Path]:
    files = []

    for path in root.rglob("*"):
        # Пропускаємо директорії за назвою
        if any(part in EXCLUDE_DIRS for part in path.parts):
            continue

        if not path.is_file():
            continue

        if allowed_exts:
            if path.suffix.lower() not in allowed_exts:
                continue

        files.append(path)

    files.sort(key=lambda p: str(p.relative_to(root)))
    return files


def read_file_safe(path: Path) -> str | None:
    for enc in ("utf-8", "utf-8-sig", "latin-1"):
        try:
            return path.read_text(encoding=enc)
        except UnicodeDecodeError:
            continue
        except OSError:
            return None
    return None


def main() -> None:
    args = parse_args()

    root = Path(args.root).resolve()
    output_path = Path(args.output).resolve()

    allowed_exts = (
        {e.lower() for e in args.ext}
        if args.ext is not None
        else {e.lower() for e in DEFAULT_EXTS}
    )

    print(f"Коренева папка: {root}")
    print(f"Вихідний файл: {output_path}")
    print(f"Пропускаємо папки: {', '.join(EXCLUDE_DIRS)}")

    files = collect_files(root, allowed_exts)
    print(f"Знайдено файлів: {len(files)}")

    skipped = []

    with output_path.open("w", encoding="utf-8") as out:
        out.write(f"# Project dump\n# Root: {root}\n\n")

        for fp in files:
            rel = fp.relative_to(root)
            content = read_file_safe(fp)

            if content is None:
                skipped.append(rel)
                continue

            out.write("\n" + "=" * 80 + "\n")
            out.write(f"===== FILE: {rel} =====\n")
            out.write("=" * 80 + "\n\n")
            out.write(content)

    print("Готово.")
    if skipped:
        print("Не вдалося прочитати:")
        for s in skipped:
            print("  -", s)


if __name__ == "__main__":
    main()
