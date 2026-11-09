#!/usr/bin/env python3
"""
AI & AI Security Knowledge Hub - Programmatic Article Ingestion Script
=====================================================================
Automates article creation adhering to strict Zod content collection schemas
and routes content into corresponding nested subtheme directory structures.
"""

import argparse
import datetime
import os
import re
import sys
from pathlib import Path

VALID_THREAT_LEVELS = ["Low", "Medium", "High", "Critical"]


def slugify(text: str) -> str:
    """Convert arbitrary title text into a URL-friendly slug."""
    text = text.strip().lower()
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
    tags: list[str],
    date_str: str,
    threat_level: str | None = None,
    order: int | None = None,
    draft: bool = False,
) -> str:
    """Generate YAML frontmatter strictly compatible with Zod collection schema."""
    lines = [
        "---",
        f'title: "{title}"',
        f'description: "{description}"',
    ]
    if tags:
        lines.append("tags:")
        for tag in tags:
            lines.append(f'  - "{tag}"')
    if threat_level:
        lines.append(f'threat_level: "{threat_level}"')
    lines.append(f"date: {date_str}")
    lines.append(f"draft: {'true' if draft else 'false'}")
    if order is not None:
        lines.append("sidebar:")
        lines.append(f"  order: {order}")
    lines.append("---")
    return "\n".join(lines)


def get_default_body(title: str) -> str:
    """Generate standard starter markdown body."""
    return f"""

## Executive Summary

Brief context and background regarding `{title}`.

---

## Technical Analysis

Detail the architectural components, implementation patterns, and core considerations:

- Key vectors, capabilities, and system components
- Architectural mitigation patterns or operational workflows
- Verification criteria and testing guidelines

---

## Action Items & Next Steps

1. Review configuration parameters and baseline telemetry.
2. Conduct validation tests against target components.
3. Update operational runbooks and team documentation.
"""


def main():
    parser = argparse.ArgumentParser(
        description="Programmatically scaffold and ingest new articles into the AI & AI Security Knowledge Hub."
    )
    parser.add_argument(
        "--path",
        required=True,
        help="Target folder path relative to src/content/docs (e.g., 'ai-real-world/productivity-automation' or 'security-for-ai/threats-defenses')",
    )
    parser.add_argument(
        "--title",
        required=True,
        help="Article title",
    )
    parser.add_argument(
        "--tags",
        default="",
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
        help="Optional threat level classification (Low, Medium, High, Critical)",
    )
    parser.add_argument(
        "--order",
        type=int,
        default=None,
        help="Sidebar sort order priority (lower numbers appear first)",
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

    # 1. Parse target path and slug
    rel_path = args.path.strip("/\\")
    title = args.title.strip()
    slug = slugify(title)
    filename = f"{slug}.md"

    # 2. Parse tags
    tags = parse_tags(args.tags)

    # 3. Parse description
    description = (
        args.description.strip()
        if args.description
        else f"Comprehensive guidance and analysis for {title}."
    )

    # 4. Parse date
    date_str = args.date.strip() if args.date else datetime.date.today().isoformat()

    # 5. Read content
    if args.content == "-":
        body_content = sys.stdin.read()
    elif args.content and os.path.isfile(args.content):
        with open(args.content, "r", encoding="utf-8") as f:
            body_content = f.read()
    elif args.content:
        body_content = "\n\n" + args.content.strip() + "\n"
    else:
        body_content = get_default_body(title)

    # 6. Construct target path
    project_root = Path(__file__).resolve().parent.parent
    target_dir = project_root / "src" / "content" / "docs" / Path(rel_path)
    target_dir.mkdir(parents=True, exist_ok=True)
    target_path = target_dir / filename

    if target_path.exists() and not args.force:
        print(
            f"Error: Target file '{target_path}' already exists. Use --force to overwrite.",
            file=sys.stderr,
        )
        sys.exit(1)

    # 7. Assemble full file
    frontmatter = create_frontmatter(
        title=title,
        description=description,
        tags=tags,
        date_str=date_str,
        threat_level=args.threat_level,
        order=args.order,
        draft=args.draft,
    )
    full_document = f"{frontmatter}\n{body_content}"

    with open(target_path, "w", encoding="utf-8") as f:
        f.write(full_document)

    print(f"Successfully created article:")
    print(f"  Target Path: {target_path}")
    print(f"  Relative:    {rel_path}/{filename}")
    print(f"  Title:       {title}")
    print(f"  Slug:        {slug}")


if __name__ == "__main__":
    main()
