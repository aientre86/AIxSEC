#!/usr/bin/env python3
"""
AI & AI Security Knowledge Hub - Programmatic Article Ingestion Script
=====================================================================
Automates article creation adhering to strict Zod content collection schemas
and routes content into corresponding 5-pillar directory structures.
"""

import argparse
import datetime
import os
import re
import sys
from pathlib import Path

# Pillar taxonomy mapping code to target folder
PILLAR_MAP = {
    "OG": "01-og",  # Oversight & Governance
    "DD": "02-dd",  # Design & Development
    "IO": "03-io",  # Implementation & Operation
    "PD": "04-pd",  # Protection & Defense
    "IN": "05-in",  # Investigation
}

VALID_PILLARS = list(PILLAR_MAP.keys())
VALID_THREAT_LEVELS = ["Low", "Medium", "High", "Critical"]


def slugify(text: str) -> str:
    """Convert arbitrary title text into a URL-friendly slug."""
    text = text.strip().lower()
    # Replace non-alphanumeric characters with dashes
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    text = re.sub(r"^-+|-+$", "", text)
    return text or "article"


def parse_tags(tags_input: str) -> list[str]:
    """Parse comma-separated or space-separated tags."""
    if not tags_input:
        return []
    tags = [t.strip() for t in tags_input.replace(";", ",").split(",") if t.strip()]
    return tags


def create_frontmatter(
    title: str,
    description: str,
    pillar: str,
    tags: list[str],
    date_str: str,
    threat_level: str | None = None,
    draft: bool = False,
) -> str:
    """Generate YAML frontmatter strictly compatible with Zod collection schema."""
    lines = [
        "---",
        f'title: "{title}"',
        f'description: "{description}"',
        f'pillar: "{pillar}"',
        "tags:",
    ]
    for tag in tags:
        lines.append(f'  - "{tag}"')
    if threat_level:
        lines.append(f'threat_level: "{threat_level}"')
    lines.append(f"date: {date_str}")
    lines.append(f"draft: {'true' if draft else 'false'}")
    lines.append("---")
    return "\n".join(lines)


def get_default_body(title: str, pillar: str) -> str:
    """Generate standard starter markdown body."""
    return f"""

## Executive Summary

Brief context and background regarding `{title}` in the context of the **{pillar}** pillar.

---

## Technical Analysis

Detail the architectural components, attack surfaces, and defensive considerations:

- Key threat vectors and risk surfaces
- Operational or architectural mitigation patterns
- Verification criteria and testing guidelines

---

## Action Items & Recommendations

1. Review configuration parameters and baseline telemetry.
2. Conduct adversarial regression tests against target components.
3. Update security runbooks and team documentation.
"""


def main():
    parser = argparse.ArgumentParser(
        description="Programmatically scaffold and ingest new articles into the AI Security Knowledge Hub."
    )
    parser.add_argument(
        "--pillar",
        required=True,
        help=f"Target pillar code ({', '.join(VALID_PILLARS)})",
    )
    parser.add_argument(
        "--title",
        required=True,
        help="Article title",
    )
    parser.add_argument(
        "--tags",
        required=True,
        help="Comma-separated list of tags (e.g. 'prompt-injection,llm,guardrails')",
    )
    parser.add_argument(
        "--description",
        default=None,
        help="Article description (defaults to generated summary)",
    )
    parser.add_argument(
        "--threat-level",
        choices=VALID_THREAT_LEVELS,
        default=None,
        help="Threat level classification (Low, Medium, High, Critical)",
    )
    parser.add_argument(
        "--content",
        default=None,
        help="Markdown content string, path to a markdown file, or '-' to read from stdin",
    )
    parser.add_argument(
        "--date",
        default=None,
        help="Article publication date in YYYY-MM-DD format (defaults to today)",
    )
    parser.add_argument(
        "--draft",
        action="store_true",
        help="Mark article as draft (default: false)",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Overwrite existing file if present",
    )

    args = parser.parse_args()

    # 1. Validate pillar
    pillar_code = args.pillar.strip().upper()
    if pillar_code not in PILLAR_MAP:
        print(
            f"Error: Invalid pillar '{args.pillar}'. Must be one of: {', '.join(VALID_PILLARS)}",
            file=sys.stderr,
        )
        sys.exit(1)

    pillar_folder = PILLAR_MAP[pillar_code]

    # 2. Parse title and slug
    title = args.title.strip()
    slug = slugify(title)
    filename = f"{slug}.md"

    # 3. Parse tags
    tags = parse_tags(args.tags)
    if not tags:
        tags = [pillar_code.lower()]

    # 4. Parse description
    description = (
        args.description.strip()
        if args.description
        else f"Comprehensive security guidance and analysis for {title}."
    )

    # 5. Parse date
    if args.date:
        date_str = args.date.strip()
    else:
        date_str = datetime.date.today().isoformat()

    # 6. Read content
    if args.content == "-":
        body_content = sys.stdin.read()
    elif args.content and os.path.isfile(args.content):
        with open(args.content, "r", encoding="utf-8") as f:
            body_content = f.read()
    elif args.content:
        body_content = "\n\n" + args.content.strip() + "\n"
    else:
        body_content = get_default_body(title, pillar_code)

    # 7. Construct target path
    project_root = Path(__file__).resolve().parent.parent
    target_dir = project_root / "src" / "content" / "docs" / pillar_folder
    target_dir.mkdir(parents=True, exist_ok=True)
    target_path = target_dir / filename

    if target_path.exists() and not args.force:
        print(
            f"Error: Target file '{target_path}' already exists. Use --force to overwrite.",
            file=sys.stderr,
        )
        sys.exit(1)

    # 8. Assemble full file
    frontmatter = create_frontmatter(
        title=title,
        description=description,
        pillar=pillar_code,
        tags=tags,
        date_str=date_str,
        threat_level=args.threat_level,
        draft=args.draft,
    )
    full_document = f"{frontmatter}\n{body_content}"

    with open(target_path, "w", encoding="utf-8") as f:
        f.write(full_document)

    print(f"Successfully created article:")
    print(f"  Pillar:   {pillar_code} ({pillar_folder})")
    print(f"  Title:    {title}")
    print(f"  Path:     {target_path}")
    print(f"  Slug:     {slug}")


if __name__ == "__main__":
    main()
