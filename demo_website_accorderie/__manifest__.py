{
    "name": "Demo website Accorderie",
    "version": "12.0.1.0",
    "author": "TechnoLibre",
    "license": "AGPL-3",
    "website": "https://technolibre.ca",
    "depends": ["website_accorderie", "demo_website_leaflet"],
    "data": [
        "data/leaflet_map_feature.xml",
        "data/leaflet_map.xml",
    ],
    "installable": True,
    "post_init_hook": "post_init_hook",
}
