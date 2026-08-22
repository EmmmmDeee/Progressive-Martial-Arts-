#!/usr/bin/env python3
"""Structural engine step 1+3: the authoritative URL graph and deterministic
migration map.

Joins baseline/http-baseline.tsv (verified live state) with the discovery link
graph, assigns every URL a PURPOSE / ENTITY / DISPOSITION / TARGET STATE by
family rules, and emits:
  graph/url-graph.tsv        one row per URL — the full record
  graph/migration-map.tsv    OLD URL -> DISPOSITION -> NEW URL -> CODE -> CANONICAL
Rules are code, not prose, so a recrawl regenerates both deterministically.
"""
import collections, csv, os, re, sys

SITE = os.environ.get("SITE", "https://progressivemartialarts.com.au")
G = lambda p: os.path.join("graph", p)

def path_of(u): return re.sub(r"^https?://[^/]*", "", u) or "/"

# inbound/outbound counts from the discovery link graph
inbound, outbound = collections.Counter(), collections.Counter()
with open("discovery/link-graph.tsv") as f:
    next(f)
    for line in f:
        src, tgt, _ = line.rstrip("\n").split("\t")
        if tgt.startswith(SITE):
            inbound[path_of(tgt).split("?")[0]] += 1
        outbound[path_of(src).split("?")[0]] += 1

PROGRAMS = {"/kali/", "/jeet-kune-do-concepts/", "/lee-jun-fan-gung-fu/",
            "/silat/", "/grappling-bjj/", "/muay-thai/"}
GALLERIES = {"/pictures-master-jean-jacques-machado-seminar-2023/",
             "/guro-dan-and-sifu-francis-2022-seminar-photos/",
             "/pictures-from-earlier-seminars/",
             "/photos-of-cookie-with-other-instructors/",
             "/historical-pictures-from-various-classes/",
             "/student-photos/"}
DEMO = {"/home-1-boxer/", "/shop-2/"}
# Yoast-verified duplicate commerce tags: alias -> canonical
TAG_ALIASES = {
    "/product-tag/muay-thai-thai-boxing/": "/product-tag/muay-thai/",
    "/product-tag/jun-fan-gung-fu-jkd/":   "/product-tag/jun-fan-gung-fu/",
    "/product-tag/jeet-kune-do/":          "/product-tag/jun-fan-gung-fu/",
    "/product-tag/pentjak-silat/":         "/product-tag/pencak-silat/",
}

def classify(p, status, robots):
    """-> (purpose, entity, disposition, target_path, redirect_code, note)"""
    # --- audit-verified specific-URL overrides (must precede set/prefix rules) ---
    if p == "/professor-jean-jacques-seminar/":
        return ("completed-event recap post", "EVENT", "MODERNISE", p, "",
                "VERIFIED: promotes the COMPLETED Apr 2026 Machado seminar and links a 404 product; mark completed, swap dead link to /pictures-master-jean-jacques-machado-seminar-2023/, keep as recap")
    if "jean-jacques-machado-seminar-brisbane-april-23-26-2026" in p:
        return ("expired seminar product (404)", "EVENT", "REDIRECT", "/product-category/seminar/", "301",
                "VERIFIED 404 while still linked from /professor-jean-jacques-seminar/")
    if p == "/pictures-master-jean-jacques-machado-seminar-2023/":
        return ("empty gallery", "MEDIA", "REDIRECT", "/pictures-from-earlier-seminars/", "301",
                "VERIFIED empty Elementor gallery, first item in the Pictures menu; fix-or-301")
    if p == "/historical-pictures-from-various-classes/":
        return ("thin gallery -> history", "MEDIA", "CONSOLIDATE", "/pmaai-history/", "301",
                "5 images/0 text; MERGE into the history timeline then 301")
    if p == "/student-photos/":
        return ("thin gallery -> seminar hub", "MEDIA", "CONSOLIDATE", "/pictures-from-earlier-seminars/", "301",
                "2 images + 1 empty widget; MERGE then 301")
    if p == "/jeet-kune-do-concepts/":
        return ("JKD concepts page (thin, collides)", "PROGRAM", "MODERNISE", p, "",
                "COLLISION with /lee-jun-fan-gung-fu/ for 'jeet kune do brisbane'; ~300-word dead end, no CTA. MERGE+301 into /lee-jun-fan-gung-fu/ IFF no separate Concepts class exists on the schedule (UNKNOWN — timetable is an image); else DIFFERENTIATE + add CTA block")
    if p in PROGRAMS:
        return ("program page", "PROGRAM", "MODERNISE", p, "",
                "URL kept (search equity); template/content modernised; joins /training/ hub")
    if p == "/ranges/":
        return ("reference article", "HISTORICAL RECORD", "MODERNISE", p, "",
                "not a program — remove from Arts We Teach nav; file under About/reference")
    if p == "/mini-muscles/":
        return ("kids program", "PROGRAM", "MODERNISE", p, "", "canonical kids URL; nav label 'Kids'")
    if p == "/timetable/":
        return ("timetable", "TIMETABLE ENTRY", "MODERNISE", p, "", "becomes structured-data view")
    if p in ("/pmaai-instructors-and-support-crew/",):
        return ("people directory", "INSTRUCTOR", "MODERNISE", p, "", "canonical people directory")
    if p == "/certified-instructors-under-guro-daniel-inosanto/":
        return ("certification record", "INSTRUCTOR", "MODERNISE", p, "",
                "distinct from current-instructor roster: certification relationship page")
    if p in ("/guro-dan/", "/sifu-francis/"):
        return ("person profile (blog post)", "INSTRUCTOR", "MODERNISE", p, "",
                "person profile lives on a post; re-home under people model, keep URL")
    if p == "/pmaai-history/":
        return ("history/about", "HISTORICAL RECORD", "MODERNISE", p, "", "doubles as About; canonical")
    if p in GALLERIES:
        return ("event/media gallery", "MEDIA", "CONSOLIDATE", p, "",
                "keep URL; leave primary nav; index from a single archive hub")
    if p in DEMO:
        return ("theme demo remnant", "-", "REMOVE", "", "410", "never legitimate content")
    if p.startswith("/courses/") or p == "/courses/":
        return ("theme demo remnant (courses CPT)", "-", "REMOVE", "", "410",
                "hair/nail/makeup demo data; unregister CPT")
    if re.match(r"^/author/[0-9a-f]{16}/$", p):
        return ("hashed author archive", "-", "REMOVE", "", "410",
                "orphaned; disable author archives (Yoast)")
    if p == "/cart/":
        return ("commerce alias", "PRODUCT", "REDIRECT", "/shopping-bag/", "301",
                "P0: currently 404; standard slug must resolve to the cart")
    if p == "/my-account/":
        return ("commerce account", "PRODUCT", "VERIFY", p, "",
                "P0: 404 — recreate WooCommerce My Account page (work order)")
    if p == "/checkout/":
        return ("commerce alias", "PRODUCT", "REDIRECT", "/shopping-bag/", "301",
                "already redirects 302; make permanent")
    if p == "/shopping-bag/":
        return ("cart/checkout", "PRODUCT", "KEEP", p, "", "canonical cart URL (noindex)")
    if p in TAG_ALIASES:
        return ("duplicate commerce tag", "CATEGORY", "CONSOLIDATE", TAG_ALIASES[p], "301",
                "merge tag terms in WooCommerce, then 301")
    if p.startswith("/product/"):
        return ("product", "PRODUCT", "KEEP", p, "",
                "archive-vs-active split needs order data (phase: commerce)")
    if p.startswith("/product-category/"):
        return ("product category archive", "CATEGORY", "KEEP", p, "")[:5] + ("",)
    if p.startswith("/product-tag/"):
        return ("product tag archive", "CATEGORY", "VERIFY", p, "",
                "171 tags for 237 products — fragmentation review with sales data")
    if p.startswith("/brand/"):
        return ("brand archive", "CATEGORY", "KEEP", p, "", "")
    if p == "/shop/":
        return ("shop root", "PRODUCT", "MODERNISE", p, "", "")
    if p == "/contact/":
        return ("contact/conversion", "ENQUIRY", "MODERNISE", p, "",
                "general contact; acquisition splits to /start-training/ (new)")
    if p == "/visiting-student-information/":
        return ("visitor info", "ACADEMY", "KEEP", p, "", "")
    if p == "/links/":
        return ("external links", "ACADEMY", "CONSOLIDATE", p, "", "merge affiliate-clubs content here or give both permalinks")
    if p == "/blog/" or p.startswith("/category/") or p.startswith("/tag/"):
        return ("blog archive", "HISTORICAL RECORD", "KEEP", p, "", "")
    if p == "/thai-boxing/":
        return ("duplicate program page", "PROGRAM", "CONSOLIDATE", "/muay-thai/", "301",
                "legacy duplicate of Muay Thai (verified same discipline; no nav inbound)")
    if p == "/latest-news/":
        return ("news page", "HISTORICAL RECORD", "CONSOLIDATE", "/blog/", "301",
                "duplicate news surface; /blog/ is the canonical archive")
    if p == "/":
        return ("homepage", "ACADEMY", "MODERNISE", p, "", "")
    if p.startswith("/?s=") or p.startswith("/search"):
        return ("search", "-", "KEEP", p, "", "")
    if "this-url-must-404" in p:
        return ("404 probe", "-", "VERIFY", "", "", "control: hard 404 confirmed" if status == "404" else "SOFT 404")
    if p.startswith("/?page_id="):
        return ("raw-ID route", "ACADEMY", "REDIRECT", "/links/", "301",
                "Affiliate Clubs nav item uses ?page_id=14587; assign permalink + fix menu")
    return ("page", "ACADEMY", "VERIFY", p, "", "unclassified — inspect")

rows, migrations = [], []
with open("baseline/http-baseline.tsv") as f:
    r = csv.DictReader(f, delimiter="\t")
    for rec in r:
        url = rec["url"]; p = path_of(url).split("?")[0] if "page_id" not in url and "?s=" not in url else path_of(url)
        purpose, entity, dispo, target, code, note = classify(p, rec["status"], rec["meta_robots"])
        indexable = "noindex" if "noindex" in (rec["meta_robots"] or "") else \
                    ("indexable" if rec["status"] == "200" else "n/a")
        rows.append([url, rec["status"], purpose, entity, dispo,
                     rec["canonical"], indexable, inbound.get(p, 0), outbound.get(p, 0),
                     (SITE + target) if target else "", code, note])
        if dispo in ("REDIRECT", "REMOVE", "CONSOLIDATE") and code:
            migrations.append([url, dispo, (SITE + target) if target else "(gone)",
                               code, (SITE + target) if target else "", note])

os.makedirs("graph", exist_ok=True)
with open(G("url-graph.tsv"), "w") as f:
    f.write("url\tstatus\tpurpose\tentity\tdisposition\tcanonical\tindexability\tinbound\toutbound\ttarget_state\tredirect_code\tnote\n")
    for row in sorted(rows):
        f.write("\t".join(map(str, row)) + "\n")
with open(G("migration-map.tsv"), "w") as f:
    f.write("old_url\tdisposition\tnew_url\tredirect_code\tcanonical\tnote\n")
    for m in sorted(migrations):
        f.write("\t".join(m) + "\n")

c = collections.Counter(r[4] for r in rows)
print("url-graph:", len(rows), "URLs;", dict(c))
print("migration-map:", len(migrations), "rows")
