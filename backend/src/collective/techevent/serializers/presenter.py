from collections import defaultdict
from collective.techevent.content.presenter import IPresenter
from collective.techevent.utils.vocabularies import get_vocabulary_for_attr
from plone.restapi.interfaces import ISerializeToJson
from plone.restapi.interfaces import ISerializeToJsonSummary
from plone.restapi.serializer.converters import json_compatible
from plone.restapi.serializer.dxcontent import SerializeToJson
from plone.restapi.serializer.summary import DefaultJSONSummarySerializer
from zope.component import adapter
from zope.component import getMultiAdapter
from zope.component import getUtility
from zope.interface import implementer
from zope.interface import Interface
from zope.schema.interfaces import IVocabularyFactory
from zope.schema.vocabulary import SimpleTerm
from zope.schema.vocabulary import SimpleVocabulary


@implementer(ISerializeToJsonSummary)
@adapter(IPresenter, Interface)
class PresenterJSONSummarySerializer(DefaultJSONSummarySerializer):
    """ISerializeToJsonSummary adapter for the Presenter."""

    def __call__(self):
        summary = super().__call__()
        summary["labels"] = self.context.labels
        summary["social_links"] = self.context.social_links
        return summary


@implementer(ISerializeToJson)
@adapter(IPresenter, Interface)
class PresenterJSONSerializer(SerializeToJson):
    def group_activities(self):
        vocabulary = get_vocabulary_for_attr("portal_type", self.context)
        activities = []
        raw_activities = defaultdict(list)
        for activity in self.context.activities:
            raw_activities[activity.portal_type].append(
                getMultiAdapter((activity, self.request), ISerializeToJsonSummary)()
            )

        # Review this
        for portal_type in ["Keynote", "Training", "Talk"]:
            if portal_type not in raw_activities:
                continue
            term = vocabulary.getTerm(portal_type)
            friendly_name = term.title if term else portal_type
            activities.append({
                "@id": portal_type,
                "@type": portal_type,
                "title": friendly_name,
                "items": raw_activities[portal_type],
            })
        return activities

    def serialize_term(self, term: SimpleTerm) -> dict:
        """Given a simple term, serialize the object."""
        return getMultiAdapter((term, self.request), ISerializeToJson)()

    def get_labels(self) -> list[dict]:
        raw_labels = self.context.labels
        labels = []
        vocab: SimpleVocabulary = getUtility(
            IVocabularyFactory, "collective.techevent.vocabularies.presenter_labels"
        )(self)
        for label in raw_labels:
            labels.append(self.serialize_term(vocab.by_token[label]))
        return labels

    def __call__(self, version=None, include_items=True):
        result = super().__call__(version, include_items)
        result.update(
            json_compatible({
                "activities": self.group_activities(),
                "labels": self.get_labels(),
            })
        )
        return result
