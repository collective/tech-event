# Change log

<!-- You should *NOT* be adding new change log entries to this file.
     You should create a file in the news directory instead.
     For helpful instructions, please see:
     https://6.docs.plone.org/contributing/index.html#contributing-change-log-label
-->

<!-- towncrier release notes start -->
## 1.0.0a9 (2025-07-16)

### Backend


#### Bug fixes:

- Fix typo in @sponsors service. @ericof 



### Frontend

#### Feature

- Schedule block now supports multiple rooms. @ericof 



### Project

No significant changes.




## 1.0.0a8 (2025-07-16)

### Backend


#### Bug fixes:

- Always use json_compatible to avoid json encoder issues. @ericof 



### Frontend

No significant changes.


### Project

No significant changes.




## 1.0.0a7 (2025-07-16)

### Backend


#### New features:

- Add @schedule endpoint. @ericof 


#### Bug fixes:

- Handle an issue during serialization of a None value. @ericof 



### Frontend

#### Bugfix

- Fix tutorial view. @ericof [#1](https://github.com/collective/tech-event/issue/1)
- Small style fixes. @ericof 

#### Internal

- Upgrade @plonegovbr/volto-social-media to version 2.0.0-alpha.6. @ericof 



### Project


#### Internal

- GHA: Fix changelog workflow. @ericof 



## 1.0.0a6 (2025-06-27)

### Backend


#### New features:

- Add new vocabularies to handle Session, Slot and Break categories. @ericof 
- Implement versioning support for collective.techevent content types. @ericof 
- Modify permission rules to support activities being added inside subfolders of the Schedule content type. @ericof 
- Update pt_BR translation. @ericof 


#### Bug fixes:

- Display slot category on Slot and Break. @ericof 


#### Internal:

- Do not enable barceloneta theme during installation. @ericof 



### Frontend

#### Feature

- Add styles to sponsor view. @ericof 
- Fix color for presenter tile title and social network. @ericof 
- Improve Sponsor blocks styles. @ericof 



### Project

No significant changes.




## 1.0.0a5 (2025-05-27)

### Backend


#### Bug fixes:

- Fix an issue with upgrade steps registration that prevented this package. @ericof 



### Frontend

No significant changes.


### Project

No significant changes.




## 1.0.0a4 (2025-05-27)

### Backend


#### New features:

- Adds Schedule and Venue to portal types displayed in navigation. @ericof 
- Fixes to vocabulary registration. @ericof 
- Improvements to serialization of types Presenter, Talk, Tutorial, Keynote. @ericof 


#### Bug fixes:

- Fix issue with DataGrid serialization when an item does not have one of the values. @ericof 



### Frontend

#### Feature

- Implements PresenterGridItem to be used with listing blocks when displaying Presenter information. @ericof 
- Implements SessionGridItem to be used with listing blocks when displaying Session (Keynote, Talk, Tutorial) content types. @ericof 
- Implements SessionTile component, used in listings of Session content types. @ericof 
- Implements view component (SessionView) used for Keynote, Talk and Training content types. @ericof 
- Improvements to PresenterView. @ericof 
- Support color labels for Audience, Level, Track information. @ericof 



### Project

No significant changes.




## 1.0.0a3 (2025-05-25)

### Backend


#### New features:

- Added Brazilian Portuguese translation. @ericof 
- Added `volto.navtitle` behavior to the Room content type. @ericof 
- Added `volto.navtitle` behavior to the Venue content type. @ericof 


#### Tests

- Increase test coverage for FTI. @ericof 



### Frontend

#### Feature

- Added Brazilian Portuguese translation. @ericof 



### Project

No significant changes.




## 1.0.0a2 (2025-05-23)

### Backend


#### Tests

- Increase test coverage. @ericof 



### Frontend

No significant changes.


### Project

No significant changes.




## 1.0.0a1 (2025-05-23)

### Backend


#### New features:

- Implemented content types (Schedule, Slot, Talk, Keynote, Training, Lightning Talks, Meeting) to support schedule information for each event. @ericof 
- Implemented content types (SponsorDB, SponsorLevel, Sponsor) to support sponsoring information for each event. @ericof 
- Initial release. @ericof 



### Frontend

#### Feature

- Initial release. @ericof 



### Project

No significant changes.




