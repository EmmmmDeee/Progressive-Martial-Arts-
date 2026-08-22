#!/usr/bin/env python3
"""Lexicography audit: find every title/meta defect against the canonical
lexicon (graph/lexicon.tsv). Deterministic — rerun after each change wave.
Emits graph/title-defects.tsv: url | defect | evidence | fix_layer
"""
import csv, re

BRAND = re.compile(r"\s*[-|–]\s*(Progressive Martial Arts( Academy| Australia)?|PMAAI?( Merchandise)?)\s*$")
defects = []
with open("baseline/http-baseline.tsv") as f:
    for r in csv.DictReader(f, delimiter="\t"):
        t, url = r["title"], r["url"]
        if r["status"] != "200" or not t:
            continue
        # strip one brand suffix; a second remaining = doubled brand
        core = BRAND.sub("", t)
        if BRAND.search(core):
            defects.append((url, "doubled-brand-suffix", t, "post_title (brand hand-typed into product name)"))
            core = BRAND.sub("", core)
        m = re.search(r"[-|–]\s*(PMA|PMAAI|Progressive Martial Arts (Academy|Australia))\s*$", t)
        if m and m.group(1) != "Progressive Martial Arts":
            defects.append((url, "off-brand-suffix", m.group(1), "Yoast title template / per-page SEO title"))
        # proper-noun exemptions: association names and official recording titles
        # (Inosanto seminar DVDs are titled "Thai Boxing" by their publisher)
        if (re.search(r"\bThai Boxing\b", core) and "Association" not in core
                and not core.startswith("Inosanto - ")):
            defects.append((url, "term-variant:muay-thai", core, "post_title"))
        if re.search(r"\bJiu Jitsu\b|\bJujitsu\b", core):
            defects.append((url, "term-variant:bjj-hyphen", core, "post_title"))
        if re.search(r"\bEscrima\b", core) and "Lameco" not in core:
            defects.append((url, "term-variant:eskrima", core, "post_title"))
        if re.search(r"\bGi's\b", core):
            defects.append((url, "apostrophe-plural", core, "post_title"))

with open("graph/title-defects.tsv", "w") as f:
    f.write("url\tdefect\tevidence\tfix_layer\n")
    for d in sorted(defects):
        f.write("\t".join(d) + "\n")

from collections import Counter
print("title-defects:", len(defects), dict(Counter(d[1] for d in defects)))
