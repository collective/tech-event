# Changelog

<!--
   You should *NOT* be adding new change log entries to this file.
   You should create a file in the news directory instead.
   For helpful instructions, please see:
   https://github.com/plone/plone.releaser/blob/master/ADD-A-NEWS-ITEM.rst
-->

<!-- towncrier release notes start -->

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
