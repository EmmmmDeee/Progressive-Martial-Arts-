#!/usr/bin/env python3
"""Phase 2 (DISCOVER + MAP): inventory every constituent of the archived site
and build the real technical/content dependency graph.

Reads:  baseline/html/*.html (raw archive from 02), baseline/http-baseline.tsv
Writes: discovery/*.tsv — one table per constituent kind, plus the link graph.
All outputs are TSV-with-header so tools/lib.sh helpers apply.
"""
import html as html_mod
import os, re, sys, collections, urllib.parse

SITE = os.environ.get("SITE", "https://progressivemartialarts.com.au")
ARCHIVE = os.environ.get("ARCHIVE_DIR", "baseline/html")
OUTDIR = os.environ.get("DISCOVERY_DIR", "discovery")
HTTP_TSV = os.environ.get("HTTP_TSV", "baseline/http-baseline.tsv")
os.makedirs(OUTDIR, exist_ok=True)

# slug -> canonical URL from the http baseline (same slug() rule as 02)
def slug(url: str) -> str:
    s = re.sub(r"^https?://[^/]*", "", url)
    s = re.sub(r"[^A-Za-z0-9._-]", "_", s).lstrip("_")[:120]
    return s or "index"

url_of = {}
with open(HTTP_TSV) as f:
    next(f)
    for line in f:
        cols = line.rstrip("\n").split("\t")
        if len(cols) > 4 and cols[1] == "200" and cols[4] == "text/html":
            url_of[slug(cols[0])] = cols[0]

RE = {
    "body_class": re.compile(r'<body[^>]*class="([^"]*)"', re.I),
    "plugin": re.compile(r"wp-content/plugins/([a-z0-9_.-]+)/", re.I),
    "theme": re.compile(r"wp-content/themes/([a-z0-9_.-]+)/", re.I),
    "shortcode": re.compile(r"\[(?!\s)([a-z0-9_-]{3,30})(?:\s[^\]]*)?\]"),
    "href": re.compile(r'<a\s[^>]*href="([^"#]+)"', re.I),
    "img": re.compile(r'<img\s[^>]*src="([^"]+)"', re.I),
    "form": re.compile(r'<form\s[^>]*action="([^"]*)"', re.I),
    "iframe": re.compile(r'<iframe\s[^>]*src="([^"]+)"', re.I),
    "pdf": re.compile(r'href="([^"]+\.pdf[^"]*)"', re.I),
    "ext_script": re.compile(r'<script\s[^>]*src="(https?://[^"]+)"', re.I),
    "elementor": re.compile(r'data-widget_type="([a-z0-9_.-]+)"', re.I),
    "nav_item": re.compile(r'<li[^>]*class="[^"]*menu-item[^"]*"[^>]*>\s*<a\s[^>]*href="([^"]+)"[^>]*>(.*?)</a>', re.I | re.S),
}

def norm(url: str, base: str) -> str:
    """Absolutise + normalise an in-page URL; '' for junk."""
    url = html_mod.unescape(url.strip())
    if url.startswith(("mailto:", "tel:", "javascript:", "data:")) or not url:
        return url if url.startswith(("mailto:", "tel:")) else ""
    u = urllib.parse.urljoin(base, url)
    u = urllib.parse.urldefrag(u)[0]
    return u

pages, edges, plugin_pages, short_pages = [], [], collections.defaultdict(set), collections.defaultdict(set)
widget_pages = collections.defaultdict(set)
media, forms, embeds, pdfs, ext_scripts = [], [], [], [], []
nav_counter = collections.Counter()

for fn in sorted(os.listdir(ARCHIVE)):
    if not fn.endswith(".html"):
        continue
    sl = fn[:-5]
    page = url_of.get(sl, SITE + "/" + sl)
    doc = open(os.path.join(ARCHIVE, fn), encoding="utf-8", errors="replace").read()

    bc = RE["body_class"].search(doc)
    classes = bc.group(1).split() if bc else []
    ptype = next((c.split("-template")[0] for c in classes if c in
                  ("home", "single-post", "single-product", "page", "archive", "search", "error404")), "")
    for c in classes:
        for pref in ("post-type-archive-", "single-", "tax-", "page-id-", "postid-"):
            if c.startswith(pref) and not ptype:
                ptype = c
    template = next((c for c in classes if c.startswith("page-template-")), "")
    pages.append((page, ptype or "page", template,
                  "elementor" if "elementor-page" in " ".join(classes) or 'data-elementor-type' in doc else "",
                  len(doc)))

    for m in RE["plugin"].finditer(doc): plugin_pages[m.group(1)].add(page)
    for m in RE["shortcode"].finditer(doc): short_pages[m.group(1)].add(page)
    for m in RE["elementor"].finditer(doc): widget_pages[m.group(1)].add(page)

    for m in RE["href"].finditer(doc):
        t = norm(m.group(1), page)
        if t: edges.append((page, t, "link"))
    for m in RE["img"].finditer(doc):
        t = norm(m.group(1), page)
        if t: media.append((page, t))
    for m in RE["form"].finditer(doc):
        forms.append((page, norm(m.group(1), page) or page))
    for m in RE["iframe"].finditer(doc):
        embeds.append((page, norm(m.group(1), page)))
    for m in RE["pdf"].finditer(doc):
        pdfs.append((page, norm(m.group(1), page)))
    for m in RE["ext_script"].finditer(doc):
        if urllib.parse.urlparse(m.group(1)).netloc != urllib.parse.urlparse(SITE).netloc:
            ext_scripts.append((page, m.group(1)))
    for m in RE["nav_item"].finditer(doc):
        label = re.sub(r"<[^>]+>", "", m.group(2)).strip()
        t = norm(m.group(1), page)
        if t and label: nav_counter[(t, label)] += 1

def w(name, header, rows):
    with open(os.path.join(OUTDIR, name), "w") as f:
        f.write("\t".join(header) + "\n")
        for r in rows:
            f.write("\t".join(str(c).replace("\t", " ") for c in r) + "\n")
    print(f"{name}: {len(rows)} rows")

w("page-map.tsv", ["url", "type", "template", "builder", "bytes"], pages)
w("plugin-usage.tsv", ["plugin", "pages"], sorted(((p, len(s)) for p, s in plugin_pages.items()), key=lambda r: -r[1]))
w("shortcode-usage.tsv", ["shortcode", "pages", "example_page"],
  sorted(((k, len(s), sorted(s)[0]) for k, s in short_pages.items()), key=lambda r: -r[1]))
w("elementor-widgets.tsv", ["widget", "pages"], sorted(((k, len(s)) for k, s in widget_pages.items()), key=lambda r: -r[1]))
w("link-graph.tsv", ["source", "target", "kind"], sorted(set(edges)))
w("media-usage.tsv", ["page", "asset"], sorted(set(media)))
w("form-actions.tsv", ["page", "action"], sorted(set(forms)))
w("embeds.tsv", ["page", "src"], sorted(set(embeds)))
w("pdf-links.tsv", ["page", "pdf"], sorted(set(pdfs)))
w("external-scripts.tsv", ["page", "script"], sorted(set(ext_scripts)))
w("nav-structure.tsv", ["target", "label", "occurrences"],
  sorted(((t, l, n) for (t, l), n in nav_counter.items()), key=lambda r: -r[2]))

# --- derived: internal URLs the crawl knows about vs the sitemap inventory ---
inventoried = set(url_of.values())
internal = {t for _, t, _ in edges
            if t.startswith(SITE) and not re.search(r"\.(jpg|jpeg|png|gif|webp|css|js|ico|svg)(\?|$)", t, re.I)}
def unparam(u): return u.split("?")[0].rstrip("/") + "/"
inv_norm = {unparam(u) for u in inventoried}
uncrawled = sorted(u for u in {unparam(u) for u in internal} - inv_norm
                   if "add-to-cart" not in u and "/wp-" not in u)
w("linked-but-uninventoried.tsv", ["url"], [(u,) for u in uncrawled])

# orphans: inventoried pages no other page links to
linked = {unparam(t) for _, t, _ in edges if t.startswith(SITE)}
orphans = sorted(u for u in inv_norm - linked)
w("orphan-pages.tsv", ["url"], [(u,) for u in orphans])
