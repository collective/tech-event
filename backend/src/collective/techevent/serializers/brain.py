from collective.techevent.interfaces import IBrowserLayer
from collective.techevent.utils.vocabularies import get_vocabulary_for_attr
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
    special_portal_types = (
        "Sponsor",
        "Presenter",
        "Keynote",
        "Talk",
        "Training",
    )

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
            "social_links",
        }

    def metadata_fields(self):
        fields = super().metadata_fields()
        return fields | self.local_metadatata_fields


@implementer(ISerializeToJsonSummary)
@adapter(ICatalogBrain, IBrowserLayer)
class BrainPresenterSerializer(DefaultJSONSummarySerializer):
    context: AbstractCatalogBrain

    @property
    def local_metadatata_fields(self) -> set[str]:
        return {
            "image_field",
            "image_scales",
            "social_links",
        }

    def metadata_fields(self):
        fields = super().metadata_fields()
        return fields | self.local_metadatata_fields


@implementer(ISerializeToJsonSummary)
@adapter(ICatalogBrain, IBrowserLayer)
class BrainSessionSerializer(DefaultJSONSummarySerializer):
    context: AbstractCatalogBrain

    @property
    def local_metadatata_fields(self) -> set[str]:
        return {
            "image_field",
            "image_scales",
            "description",
            "presenters",
        }

    def metadata_fields(self):
        fields = super().metadata_fields()
        return fields | self.local_metadatata_fields

    def __call__(self):
        result = super().__call__()
        for field_id in (
            "room",
            "session_track",
            "session_level",
            "session_audience",
            "session_language",
        ):
            context = self.context.getObject()
            vocabulary = get_vocabulary_for_attr(field_id, context)
            value = getattr(context, field_id)
            value = {value} if isinstance(value, str) else value
            response = []
            if not value:
                continue
            for item in value:
                term = vocabulary.getTerm(item)
                response.append({
                    "title": term.title,
                    "token": term.token,
                })
            result[field_id] = response

        return result
