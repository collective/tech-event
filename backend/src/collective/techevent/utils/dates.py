from datetime import datetime
from datetime import timedelta


def get_iso_dates_between(start: datetime, end: datetime) -> list[str]:
    """
    Returns a list of ISO date strings (YYYY-MM-DD) for each day between start and end.

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
