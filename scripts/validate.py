#!/usr/bin/env python3
"""Dependency-free checks for the static portfolio before it is published."""
from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import sys

ROOT = Path(__file__).resolve().parents[1]


class Document(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.ids: set[str] = set()
        self.links: list[dict[str, str]] = []
        self.images: list[dict[str, str]] = []
        self.headings: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = {name: value or "" for name, value in attrs}
        if values.get("id"):
            self.ids.add(values["id"])
        if tag == "a":
            self.links.append(values)
        elif tag == "img":
            self.images.append(values)
        elif tag == "h1":
            self.headings.append(tag)


def local_target(source: Path, href: str) -> Path | None:
    parts = urlsplit(href)
    if parts.scheme or parts.netloc or href.startswith(("mailto:", "tel:", "data:")):
        return None
    target = unquote(parts.path)
    if not target:
        return None
    if target.startswith("/"):
        path = ROOT / target.lstrip("/")
    else:
        path = source.parent / target
    if path.is_dir() or target.endswith("/"):
        path /= "index.html"
    return path


def validate_html(path: Path) -> list[str]:
    doc = Document()
    doc.feed(path.read_text(encoding="utf-8"))
    errors: list[str] = []
    if len(doc.headings) != 1:
        errors.append(f"{path.relative_to(ROOT)}: expected exactly one h1, found {len(doc.headings)}")
    for image in doc.images:
        if "alt" not in image:
            errors.append(f"{path.relative_to(ROOT)}: image missing an alt attribute: {image.get('src', '<unknown>')}")
    for link in doc.links:
        href = link.get("href", "")
        if href.startswith("#") and href != "#" and href[1:] not in doc.ids:
            errors.append(f"{path.relative_to(ROOT)}: unresolved same-page link: {href}")
        if link.get("target") == "_blank":
            rel = set(link.get("rel", "").split())
            if not {"noopener", "noreferrer"}.issubset(rel):
                errors.append(f"{path.relative_to(ROOT)}: _blank link needs rel=noopener noreferrer: {href}")
        target = local_target(path, href)
        if target and not target.exists():
            errors.append(f"{path.relative_to(ROOT)}: missing local target: {href}")
    return errors


def main() -> int:
    pages = sorted(ROOT.glob("*.html"))
    errors = [error for page in pages for error in validate_html(page)]
    if errors:
        print("Portfolio validation failed:\n- " + "\n- ".join(errors))
        return 1
    print(f"Portfolio validation passed for {len(pages)} HTML page(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
