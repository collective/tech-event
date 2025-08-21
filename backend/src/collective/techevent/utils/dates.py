from datetime import datetime
from datetime import timedelta
from datetime import tzinfo
from plone import api
from plone.dexterity.content import DexterityContent
from zope.interface import provider
from zope.schema.interfaces import IContextAwareDefaultFactory

import pytz


def get_iso_dates_between(start: datetime, end: datetime) -> list[str]:
    """Return a list of ISO date (YYYY-MM-DD) for each day between
       start and end.

    :param start: Start datetime (inclusive)
    :param end: End datetime (inclusive)
    :return: List of ISO-formatted date strings
    """
    # Normalize to date only
    start_date = start.date()
    end_date = end.date()

    if start_date > end_date:
        raise ValueError("Start date must be before or equal to end date.")

    delta = (end_date - start_date).days
    return [(start_date + timedelta(days=i)).isoformat() for i in range(delta + 1)]


def portal_timezone() -> tzinfo:
    """Return the portal timezone for the given context."""
    tz = pytz.timezone(api.portal.get_registry_record("plone.portal_timezone"))
    return tz


def localized_now(context: DexterityContent | None = None) -> datetime:
    """Return the current datetime localized to the default timezone."""
    tz = portal_timezone()
    return datetime.now(tz).replace(microsecond=0)


def _default_start(context: DexterityContent | None = None) -> datetime:
    """Provide default start for the form."""
    return localized_now(context)


@provider(IContextAwareDefaultFactory)
def default_start(context: DexterityContent | None = None) -> datetime:
    """Provide default start for the form."""
    return _default_start(context)


@provider(IContextAwareDefaultFactory)
def default_end(context: DexterityContent | None = None) -> datetime:
    """Provide default end for the form."""
    return _default_start(context) + timedelta(hours=1)
