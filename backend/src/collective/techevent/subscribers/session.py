from collective.techevent.content.schedule.session import Session
from zope.lifecycleevent.interfaces import IObjectModifiedEvent


def modification_handler(obj: Session, _event: IObjectModifiedEvent) -> None:
    """After modifying a TechEvent Session, reindex the presenter.

    :param obj: The modified TechEvent Session.
    :param _event: The object modified event (unused).
    """
    if not obj.presenters:
        return
    rel_presenters = obj.presenters
    # Reindex labels attribute on presenters
    for relation in rel_presenters:
        presenter = relation.to_object
        presenter.reindexObject(idxs=["labels"])
