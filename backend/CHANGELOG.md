# Changelog

<!--
   You should *NOT* be adding new change log entries to this file.
   You should create a file in the news directory instead.
   For helpful instructions, please see:
   https://github.com/plone/plone.releaser/blob/master/ADD-A-NEWS-ITEM.rst
-->

<!-- towncrier release notes start -->

## 1.0.0b3 (2026-10-14)


### Bug fixes:

- Fix the Keynote duration field, which was declared on the class instead of the IKeynote schema. A Keynote without a duration no longer breaks catalog indexing on sites with a duration index, and its duration now shows in forms and the REST API. @ericof [#34](https://github.com/collective/tech-event/issues/34)

## 1.0.0b2 (2026-10-13)


### Breaking changes:

- Drop support for Plone 6.0 and Python 3.10, and add support for Plone 6.2 and Python 3.14. Require plonegovbr.socialmedia 3.0 or later and pytest-plone 1.1 or later. @ericof [#32](https://github.com/collective/tech-event/issues/32)


### New features:

- Add an upgrade step that creates the social_links catalog column of plonegovbr.socialmedia 3.0, and drop the indexer it now provides. @ericof [#32](https://github.com/collective/tech-event/issues/32)


### Bug fixes:

- Apply the Tech Event setting as soon as it is saved in the control panel, so the Tech Event content type becomes addable, or stops being addable, without reinstalling the add-on. @ericof [#32](https://github.com/collective/tech-event/issues/32)


### Internal:

- Add type hints and reStructuredText docstrings across the backend code. @ericof [#32](https://github.com/collective/tech-event/issues/32)
- Update the translation catalogs, and complete the Brazilian Portuguese translation. @ericof [#32](https://github.com/collective/tech-event/issues/32)
- Use a native namespace package for collective.techevent. @ericof [#32](https://github.com/collective/tech-event/issues/32)
- Align the backend tooling with the cookieplone monorepo add-on template, and check types with mypy and plone-stubs. @ericof [#32](https://github.com/collective/tech-event/issues/32)


### Documentation:

- Rewrite the README as a self-contained package description, with installation steps, features and a link to the documentation. @ericof [#32](https://github.com/collective/tech-event/issues/32)


### Tests

- Test every content type, the services, serializers, vocabularies, upgrade steps and attendee support, raising the coverage to 95%. @ericof [#32](https://github.com/collective/tech-event/issues/32)

## 1.0.0b1 (2025-10-16)


### Internal:

- Update package metadata. @ericof 


### Documentation:

- Update README file. @ericof 

## 1.0.0a23 (2025-10-08)


### Internal:

- Use Products.CMFPlone 6.1.3 by default. @ericof [#24](https://github.com/collective/tech-event/issues/24)
- Remove duplicated license information from trove classifiers. @ericof 

## 1.0.0a22 (2025-09-20)

No significant changes.


## 1.0.0a21 (2025-09-16)

No significant changes.


## 1.0.0a20 (2025-09-15)

No significant changes.


## 1.0.0a19 (2025-09-09)


### New features:

- Refactor schedule to use CSS grid layout @datakurre [#14](https://github.com/collective/tech-event/issues/14)

## 1.0.0a18 (2025-08-27)


### New features:

- Change rooms vocabulary to return rooms in their indexed parent container order and schedule API to return rooms in the order of the vocabulary @datakurre [#13](https://github.com/collective/tech-event/issues/13)


### Internal:

- Require plone.restapi version 9.15.2 or superior. @ericof 
- Start and End on Session items does not have a default value. @ericof 

## 1.0.0a17 (2025-08-21)


### New features:

- Adds new indexes slot_room, session_level, session_track, session_audience, session_language, presenter_categories to the catalog. @ericof 
- Adds new querystring filters. @ericof 


### Bug fixes:

- Fix start and end datetime not being timezone aware in IScheduleSlot and IEventRoot. @ericof [#11](https://github.com/collective/tech-event/issues/11)

## 1.0.0a16 (2025-08-19)


### New features:

- Add initial Membrane based Attendee user support as additionally installable profile and TOTP based login. @datakurre [#7](https://github.com/collective/tech-event/issues/7)


### Bug fixes:

- Restrict adding schedule content types to the subtree under a Schedule. @ericof [#5](https://github.com/collective/tech-event/issues/5)


### Internal:

- Upgrade pytest to version 8.4.1. @ericof 
- Upgrade pytest-plone to version 1.0.0a2. @ericof 

## 1.0.0a15 (2025-08-15)


### Bug fixes:

- Restrict adding schedule content types to the subtree under a Schedule. @ericof [#5](https://github.com/collective/tech-event/issues/5)

## 1.0.0a14 (2025-08-14)


### New features:

- Add setting for including other than 'published' states in schedule. @datakurre [#4](https://github.com/collective/tech-event/issues/4)
- Add optional presenter roles behavior to let sessions inherit local roles from their connected presenters @datakurre [#6](https://github.com/collective/tech-event/issues/6)

## 1.0.0a13 (2025-08-08)


### New features:

- Add list of presentations and video to the LightningTalks content type. @ericof 

## 1.0.0a12 (2025-08-05)


### Bug fixes:

- Fix order of Session fields: Description should be the second field in the default fieldset. @ericof 
- Fix presenter serialization when an activity has no workflow state. @ericof 

## 1.0.0a11 (2025-08-01)


### New features:

- Add video field to IEventSession behavior. @ericof 
- Allow adding a link object to Session objects. @ericof 

## 1.0.0a10 (2025-07-31)

No significant changes.


## 1.0.0a9 (2025-07-16)


### Bug fixes:

- Fix typo in @sponsors service. @ericof 

## 1.0.0a8 (2025-07-16)


### Bug fixes:

- Always use json_compatible to avoid json encoder issues. @ericof 

## 1.0.0a7 (2025-07-16)


### New features:

- Add @schedule endpoint. @ericof 


### Bug fixes:

- Handle an issue during serialization of a None value. @ericof 

## 1.0.0a6 (2025-06-27)


### New features:

- Add new vocabularies to handle Session, Slot and Break categories. @ericof 
- Implement versioning support for collective.techevent content types. @ericof 
- Modify permission rules to support activities being added inside subfolders of the Schedule content type. @ericof 
- Update pt_BR translation. @ericof 


### Bug fixes:

- Display slot category on Slot and Break. @ericof 


### Internal:

- Do not enable barceloneta theme during installation. @ericof 

## 1.0.0a5 (2025-05-27)


### Bug fixes:

- Fix an issue with upgrade steps registration that prevented this package. @ericof 

## 1.0.0a4 (2025-05-27)


### New features:

- Adds Schedule and Venue to portal types displayed in navigation. @ericof 
- Fixes to vocabulary registration. @ericof 
- Improvements to serialization of types Presenter, Talk, Tutorial, Keynote. @ericof 


### Bug fixes:

- Fix issue with DataGrid serialization when an item does not have one of the values. @ericof 

## 1.0.0a3 (2025-05-25)


### New features:

- Added Brazilian Portuguese translation. @ericof 
- Added `volto.navtitle` behavior to the Room content type. @ericof 
- Added `volto.navtitle` behavior to the Venue content type. @ericof 


### Tests

- Increase test coverage for FTI. @ericof 

## 1.0.0a2 (2025-05-23)


### Tests

- Increase test coverage. @ericof 

## 1.0.0a1 (2025-05-23)


### New features:

- Implemented content types (Schedule, Slot, Talk, Keynote, Training, Lightning Talks, Meeting) to support schedule information for each event. @ericof 
- Implemented content types (SponsorDB, SponsorLevel, Sponsor) to support sponsoring information for each event. @ericof 
- Initial release. @ericof
