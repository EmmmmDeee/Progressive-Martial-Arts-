# Production baseline summary — 2026-08-22T04:45:40Z

Site: https://progressivemartialarts.com.au/ (WordPress + WooCommerce + Yoast)

## URL universe
- Inventoried URLs: 497
  - product-sitemap.xml: 238
  - product_tag-sitemap.xml: 171
  - page-sitemap.xml: 27
  - product_cat-sitemap.xml: 24
  - product_brand-sitemap.xml: 9
  - manual-critical: 8
  - post-sitemap.xml: 6
  - post_tag-sitemap.xml: 4
  - courses-sitemap.xml: 4
  - category-sitemap.xml: 3
  - author-sitemap.xml: 2
  - crawl-discovered: 1

## HTTP status (must not regress without an explicit redirect decision)
- 200: 488
- 404: 4

### Non-200 surfaces (pre-existing; recorded so the migration is never blamed)
- 404 https://progressivemartialarts.com.au/cart/
- 404 https://progressivemartialarts.com.au/my-account/
- 404 https://progressivemartialarts.com.au/product/jean-jacques-machado-seminar-brisbane-april-23-26-2026/
- 404 https://progressivemartialarts.com.au/this-url-must-404-24826

### Redirects observed
- 302: https://progressivemartialarts.com.au/checkout/ -> https://progressivemartialarts.com.au/shopping-bag/

### Noindex surfaces
- https://progressivemartialarts.com.au/?s=test
- https://progressivemartialarts.com.au/checkout/
- https://progressivemartialarts.com.au/shopping-bag/

### Canonical mismatches (canonical differs from served URL)
- https://progressivemartialarts.com.au/checkout/ -> https://progressivemartialarts.com.au/shopping-bag/

## Duplicate content (identical body hash on 2+ URLs)
- group f3a6006dbacc1e49:
  - https://progressivemartialarts.com.au/checkout/
  - https://progressivemartialarts.com.au/shopping-bag/

## Tracking / integrations shipped by the live site
- gmaps-embed: maps.google.com/maps (on 2 pages)
- cf7-form: wpcf7 (on 665 pages)

## Performance / render baseline (desktop + mobile)
```
page          viewport  url                                       status    ttfb_ms   domContentLoaded_msload_ms   lcp_ms    cls       transfer_kbrequests  img_missing_alth1_count  
home          desktop   /                                         200       2952      6554      7014      7044      0.010     1349      84        0         1         
home          mobile    /                                         200       2945      5866      6281      4636      0.024     1159      82        0         1         
program-bjj   desktop   /grappling-bjj/                           200       2644      5300      9337      7152      0.170     3252      71        0         2         
program-bjj   mobile    /grappling-bjj/                           200       2862      5527      5529      4196      0.854     3138      69        0         2         
program-kali  desktop   /kali/                                    200       2653      5206      5548      5568      0.165     900       75        0         2         
program-kali  mobile    /kali/                                    200       2626      5333      5360      3940      0.853     687       72        0         2         
timetable     desktop   /timetable/                               200       2586      5222      5259      3908      0.013     872       71        0         1         
timetable     mobile    /timetable/                               200       2633      5135      5137      3964      0.115     549       69        0         1         
kids          desktop   /mini-muscles/                            200       2829      5650      5689      3872      0.282     1329      72        0         2         
kids          mobile    /mini-muscles/                            200       2610      5163      5188      3740      0.787     708       70        0         2         
instructors   desktop   /pmaai-instructors-and-support-crew/      200       2794      5351      6183      3936      0.631     830       84        0         2         
instructors   mobile    /pmaai-instructors-and-support-crew/      200       2656      4963      5296      3780      0.793     575       69        0         2         
history       desktop   /pmaai-history/                           200       2551      5069      5580      3904      0.008     948       75        0         2         
history       mobile    /pmaai-history/                           200       2607      5115      5140      3716      0.030     657       68        0         2         
contact       desktop   /contact/                                 200       2626      6078      6455      3764      0.007     1348      142       0         1         
contact       mobile    /contact/                                 200       2618      5905      6271      3740      0.001     1044      112       0         1         
blog-archive  desktop   /blog/                                    200       2509      4967      5487      3624      0.009     553       55        0         0         
blog-archive  mobile    /blog/                                    200       2812      6175      6176      4384      0.074     439       53        0         0         
gallery       desktop   /student-photos/                          200       2686      5833      6176      6808      0.150     791       68        0         2         
gallery       mobile    /student-photos/                          200       2607      5662      5664      3936      0.208     643       66        0         2         
shop          desktop   /shop/                                    200       2678      5131      5701      3956      0.017     1455      70        0         1         
shop          mobile    /shop/                                    200       2669      5122      5150      3764      0.002     947       59        0         1         
product-cat   desktop   /product-category/gis/                    200       2494      4931      5259      3748      0.032     772       59        0         1         
product-cat   mobile    /product-category/gis/                    200       2576      5064      5090      3848      0.000     657       57        0         1         
product       desktop   /product/focus-mitts-punch-brand-thumpas/ 200       2611      6521      7905      7512      0.009     1341      75        0         1         
product       mobile    /product/focus-mitts-punch-brand-thumpas/ 200       2638      5250      5972      3736      0.412     1189      72        0         1         
checkout      desktop   /shopping-bag/                            200       2556      4786      5258      3652      0.007     609       62        0         1         
checkout      mobile    /shopping-bag/                            200       2504      5267      5710      3604      0.001     495       60        0         1         
```
