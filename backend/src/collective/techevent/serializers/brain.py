from collective.techevent.interfaces import IBrowserLayer
from plone.restapi.interfaces import ISerializeToJsonSummary
from plone.restapi.serializer.summary import DefaultJSONSummarySerializer
from Products.ZCatalog.CatalogBrains import AbstractCatalogBrain
from Products.ZCatalog.interfaces import ICatalogBrain
from zope.component import adapter
from zope.component import getMultiAdapter
from zope.interface import implementer


@implementer(ISerializeToJsonSummary)
@adapter(ICatalogBrain, IBrowserLayer)
class JSONSummarySerializer(DefaultJSONSummarySerializer):
    context: AbstractCatalogBrain
    special_portal_types = ("Sponsor",)

    def __call__(self):
        context = self.context
        portal_type = context.portal_type
        summary = None
        if portal_type in self.special_portal_types:
            serializer = getMultiAdapter(
                (context, self.request),
                name=portal_type,
                interface=ISerializeToJsonSummary,
            )
            summary = serializer() if serializer else None
        if not summary:
            summary = super().__call__()
        return summary


@implementer(ISerializeToJsonSummary)
@adapter(ICatalogBrain, IBrowserLayer)
class BrainSponsorSerializer(DefaultJSONSummarySerializer):
    context: AbstractCatalogBrain

    @property
    def local_metadatata_fields(self) -> set[str]:
        return {
            "level",
            "image_field",
            "image_scales",
            "effective",
            "Subject",
            "social_links",
        }

    def metadata_fields(self):
        fields = super().metadata_fields()
        return fields | self.local_metadatata_fields
