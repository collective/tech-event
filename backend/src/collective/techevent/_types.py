from typing import TypedDict


class APIImageScale(TypedDict):
    download: str
    height: int
    width: int


APIImageScales = TypedDict(
    "APIImageScale",
    {
        "content-type": str,
        "download": str,
        "filename": str,
        "height": int,
        "scales": dict[str, APIImageScale],
        "size": int,
        "width": int,
    },
)


APISponsorInfo = TypedDict(
    "APISponsorInfo",
    {
        "@id": str,
        "@type": str,
        "description": str,
        "head_title": str,
        "image_field": str,
        "image_scales": dict[str, APIImageScales] | None,
        "level": str,
        "nav_title": str,
        "review_state": str,
        "title": str,
    },
)

APISponsorLevel = TypedDict(
    "APISponsorLevel",
    {
        "@id": str,
        "id": str,
        "title": str,
        "items": list[APISponsorInfo],
        "has_sponsors": bool,
        "exclude_from_nav": bool,
        "image_scales": dict[str, APIImageScales] | None,
    },
)


class APISponsorBenefit(TypedDict):
    id: str
    title: str
    description: str
    levels: dict[str, str]


APISponsorsLevels = TypedDict(
    "APISponsorsLevels",
    {
        "@id": str,
        "items": list[APISponsorLevel],
        "benefits": list[APISponsorBenefit],
    },
)
