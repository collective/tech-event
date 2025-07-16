from Acquisition import aq_base
from collective.techevent.content.schedule.session import ISession
from collective.techevent.content.schedule.slot import ISlot
from collective.techevent.utils.vocabularies import get_vocabulary_for_attr
from plone.restapi.interfaces import ISerializeToJsonSummary
from plone.restapi.serializer.summary import DefaultJSONSummarySerializer
from zope.component import adapter
from zope.interface import implementer
from zope.interface import Interface


@implementer(ISerializeToJsonSummary)
@adapter(ISession, Interface)
class SessionJSONSummarySerializer(DefaultJSONSummarySerializer):
    """ISerializeToJsonSummary adapter for Session types."""

    additional_methods: tuple[str, ...] = ("UID",)
    additional_fields: tuple[str, ...] = ("slot_category",)
    relation_fields: tuple[str, ...] = ("presenters",)
    vocabulary_fields: tuple[str, ...] = (
        "portal_type",
        "room",
        "session_audience",
        "session_level",
        "session_language",
        "session_track",
    )

    def format_vocabulary_values(self, field_id: str, value: set) -> list[dict]:
        """Get title and token for a value."""
        value = value or set()
        vocabulary = get_vocabulary_for_attr(field_id, self.context)
        response = []
        value = {value} if isinstance(value, str) else value
        for item in value:
            term = vocabulary.getTerm(item)
            response.append({
                "title": term.title,
                "token": term.token,
            })
        return response

    def format_relations(self, value: set) -> list[dict]:
        result = []
        context = self.context
        for rel_value in value:
            item = (
                rel_value.to_object
                if rel_value.from_object == context
                else rel_value.from_object
            )
            result.append({"@id": item.absolute_url(), "title": item.title})
        return result

    def __call__(self):
        summary = super().__call__()
        context = self.context
        for field_id in self.additional_methods:
            value = getattr(aq_base(context), field_id, None)
            summary[field_id] = value() if value else None
        for field_id in self.additional_fields:
            value = getattr(aq_base(context), field_id, None)
            summary[field_id] = value
        for field_id in self.relation_fields:
            if value := getattr(aq_base(context), field_id, None):
                value = self.format_relations(value)
            else:
                value = []
            summary[field_id] = value

        for field_id in self.vocabulary_fields:
            if value := getattr(aq_base(context), field_id, None):
                value = self.format_vocabulary_values(field_id, value)
            summary[field_id] = value
        return summary


@implementer(ISerializeToJsonSummary)
@adapter(ISlot, Interface)
class SlotJSONSummarySerializer(SessionJSONSummarySerializer):
    """ISerializeToJsonSummary adapter for Slot types."""

    relation_fields: tuple[str, ...] = ()
    vocabulary_fields: tuple[str, ...] = ()
