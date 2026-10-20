# Change log

<!-- You should *NOT* be adding new change log entries to this file.
     You should create a file in the news directory instead.
     For helpful instructions, please see:
     https://6.docs.plone.org/contributing/index.html#contributing-change-log-label
-->

<!-- towncrier release notes start -->
## 1.0.0b4 (2026-10-20)

### Backend


#### Bug fixes:

- Fix the `@schedule` endpoint on sites with multiple tech events. It now lists only the slots inside the event it is called on, instead of every slot in the site, and no longer fails when slots exist outside any event. @ericof [#36](https://github.com/collective/tech-event/issues/36)



### Frontend

No significant changes.




### Project

No significant changes.




## 1.0.0b3 (2026-10-14)

### Backend


#### Bug fixes:

- Fix the Keynote duration field, which was declared on the class instead of the IKeynote schema. A Keynote without a duration no longer breaks catalog indexing on sites with a duration index, and its duration now shows in forms and the REST API. @ericof [#34](https://github.com/collective/tech-event/issues/34)



### Frontend

No significant changes.




### Project

No significant changes.




## 1.0.0b2 (2026-10-13)

### Backend


#### Breaking changes:

- Drop support for Plone 6.0 and Python 3.10, and add support for Plone 6.2 and Python 3.14. Require plonegovbr.socialmedia 3.0 or later and pytest-plone 1.1 or later. @ericof [#32](https://github.com/collective/tech-event/issues/32)


#### New features:

- Add an upgrade step that creates the social_links catalog column of plonegovbr.socialmedia 3.0, and drop the indexer it now provides. @ericof [#32](https://github.com/collective/tech-event/issues/32)


#### Bug fixes:

- Apply the Tech Event setting as soon as it is saved in the control panel, so the Tech Event content type becomes addable, or stops being addable, without reinstalling the add-on. @ericof [#32](https://github.com/collective/tech-event/issues/32)


#### Internal:

- Add type hints and reStructuredText docstrings across the backend code. @ericof [#32](https://github.com/collective/tech-event/issues/32)
- Update the translation catalogs, and complete the Brazilian Portuguese translation. @ericof [#32](https://github.com/collective/tech-event/issues/32)
- Use a native namespace package for collective.techevent. @ericof [#32](https://github.com/collective/tech-event/issues/32)
- Align the backend tooling with the cookieplone monorepo add-on template, and check types with mypy and plone-stubs. @ericof [#32](https://github.com/collective/tech-event/issues/32)


#### Documentation:

- Rewrite the README as a self-contained package description, with installation steps, features and a link to the documentation. @ericof [#32](https://github.com/collective/tech-event/issues/32)


#### Tests

- Test every content type, the services, serializers, vocabularies, upgrade steps and attendee support, raising the coverage to 95%. @ericof [#32](https://github.com/collective/tech-event/issues/32)



### Frontend


#### Breaking

- Require Volto 19.5 or later, and stop depending on @kitconcept/volto-light-theme: projects that use it register the theme in their own volto.config.js. Use @plonegovbr/volto-social-media 3.0.0. @ericof [#32](https://github.com/collective/tech-event/issues/32)


#### Feature

- Add Storybook stories for every component, published with the documentation. @ericof [#32](https://github.com/collective/tech-event/issues/32)


#### Bugfix

- Fix crashes in the sponsor level comparison and the presenter category, show edit mode in the schedule block, show the configured label on the attendee login button, and return an empty map for an unknown vocabulary in useVocabularyColors. @ericof [#32](https://github.com/collective/tech-event/issues/32)


#### Internal

- Update the translation catalogs. @ericof [#32](https://github.com/collective/tech-event/issues/32)
- Align the frontend with the cookieplone monorepo add-on template: pnpm 10, Vitest, the typecheck, i18n and storybook-build targets, and a shipped tsconfig.json that maps only the add-on itself. @ericof [#32](https://github.com/collective/tech-event/issues/32)
- Add TypeScript types to the components, hooks and configuration, so the add-on passes make typecheck. @ericof [#32](https://github.com/collective/tech-event/issues/32)


#### Documentation

- Rewrite the README published on npm, with installation, the theme note, the blocks and views, and the development commands. @ericof [#32](https://github.com/collective/tech-event/issues/32)


#### Tests

- Test every component, hook, helper, reducer, action and configuration step with Vitest, and fail the suite when a component lacks a test or a story. @ericof [#32](https://github.com/collective/tech-event/issues/32)



### Project


#### Internal

- Build the documentation with the same toolchain as the other collective monorepo add-ons, installing collective.techevent from the local backend. @ericof [#32](https://github.com/collective/tech-event/issues/32)
- Update the GitHub Actions workflows to the latest cookieplone-templates: test the backend on Plone 6.1 and 6.2, check backend types, publish the documentation and Storybook on GitHub Pages, and configure Dependabot. @ericof [#32](https://github.com/collective/tech-event/issues/32)
- Align the repository configuration with the cookieplone monorepo add-on template. @ericof [#32](https://github.com/collective/tech-event/issues/32)


#### Documentation

- Document the concepts, a first-event tutorial, how-to guides and the reference of Tech Event Support for Plone. @ericof [#32](https://github.com/collective/tech-event/issues/32)
- Update the README with the supported versions, the badges and the development commands. @ericof [#32](https://github.com/collective/tech-event/issues/32)
- Document an example content structure.  @mauritsvanrees 



## 1.0.0b1 (2025-10-16)

### Backend


#### Internal:

- Update package metadata. @ericof 


#### Documentation:

- Update README file. @ericof 



### Frontend

#### Internal

- Update package metadata. @ericof 

#### Documentation

- Update README file. @ericof 



### Project


#### Documentation

- Update README file. @ericof 



## 1.0.0a23 (2025-10-08)

### Backend


#### Internal:

- Use Products.CMFPlone 6.1.3 by default. @ericof [#24](https://github.com/collective/tech-event/issues/24)
- Remove duplicated license information from trove classifiers. @ericof 



### Frontend

No significant changes.


### Project


#### Internal

- GHA: Small fixes to when workflows run. @ericof 



## 1.0.0a22 (2025-09-20)

### Backend

No significant changes.




### Frontend

#### Bugfix

- Add time indication for all slots in a Schedule block. @ericof [#22](https://github.com/collective/tech-event/issue/22)



### Project

No significant changes.




## 1.0.0a21 (2025-09-16)

### Backend

No significant changes.




### Frontend

#### Feature

- Change to show rooms on every schedule slot @datakurre [#21](https://github.com/collective/tech-event/issue/21)

#### Bugfix

- Fix to not hide Keynote presenters on schedule. @datakurre [#20](https://github.com/collective/tech-event/issue/20)



### Project


#### Internal

- Update VSCode settings and recommended extensions. @ericof 



## 1.0.0a20 (2025-09-15)

### Backend

No significant changes.




### Frontend

#### Bugfix

- Fix issue where search facet dropdown opens behind SessionTile @datakurre [#17](https://github.com/collective/tech-event/issue/17)
- Fix issue where schedule row icons were rendered outside the viewport @datakurre [#18](https://github.com/collective/tech-event/issue/18)
- Restore gaps between slots on Schedule after CSS grid refactoring @datakurre [#19](https://github.com/collective/tech-event/issue/19)



### Project

No significant changes.




## 1.0.0a19 (2025-09-09)

### Backend


#### New features:

- Refactor schedule to use CSS grid layout @datakurre [#14](https://github.com/collective/tech-event/issues/14)



### Frontend

#### Feature

- Refactor schedule to use CSS grid layout @datakurre [#14](https://github.com/collective/tech-event/issue/14)
- Register session view for open space content @datakurre [#16](https://github.com/collective/tech-event/issue/16)

#### Bugfix

- Fix SessionTrack component to display all selected tracks @datakurre [#15](https://github.com/collective/tech-event/issue/15)



### Project

No significant changes.




## 1.0.0a18 (2025-08-27)

### Backend


#### New features:

- Change rooms vocabulary to return rooms in their indexed parent container order and schedule API to return rooms in the order of the vocabulary @datakurre [#13](https://github.com/collective/tech-event/issues/13)


#### Internal:

- Require plone.restapi version 9.15.2 or superior. @ericof 
- Start and End on Session items does not have a default value. @ericof 



### Frontend

#### Feature

- Style fixes for mobile. @ericof 

#### Bugfix

- Do not display slot date if start or end date are null. @ericof 



### Project

No significant changes.




## 1.0.0a17 (2025-08-21)

### Backend


#### New features:

- Adds new indexes slot_room, session_level, session_track, session_audience, session_language, presenter_categories to the catalog. @ericof 
- Adds new querystring filters. @ericof 


#### Bug fixes:

- Fix start and end datetime not being timezone aware in IScheduleSlot and IEventRoot. @ericof [#11](https://github.com/collective/tech-event/issues/11)



### Frontend

No significant changes.


### Project

No significant changes.




## 1.0.0a16 (2025-08-19)

### Backend


#### New features:

- Add initial Membrane based Attendee user support as additionally installable profile and TOTP based login. @datakurre [#7](https://github.com/collective/tech-event/issues/7)


#### Bug fixes:

- Restrict adding schedule content types to the subtree under a Schedule. @ericof [#5](https://github.com/collective/tech-event/issues/5)


#### Internal:

- Upgrade pytest to version 8.4.1. @ericof 
- Upgrade pytest-plone to version 1.0.0a2. @ericof 



### Frontend

#### Feature

- Add /attendee-login to allow Attendees to request to mail them their current TOTP for login. @datakurre [#7](https://github.com/collective/tech-event/issue/7)



### Project

No significant changes.




## 1.0.0a15 (2025-08-15)

### Backend


#### Bug fixes:

- Restrict adding schedule content types to the subtree under a Schedule. @ericof [#5](https://github.com/collective/tech-event/issues/5)



### Frontend

No significant changes.


### Project

No significant changes.




## 1.0.0a14 (2025-08-14)

### Backend


#### New features:

- Add setting for including other than 'published' states in schedule. @datakurre [#4](https://github.com/collective/tech-event/issues/4)
- Add optional presenter roles behavior to let sessions inherit local roles from their connected presenters @datakurre [#6](https://github.com/collective/tech-event/issues/6)



### Frontend

#### Feature

- Add state-{review_state} class name into sessionTile. @datakurre [#4](https://github.com/collective/tech-event/issue/4)



### Project

No significant changes.




## 1.0.0a13 (2025-08-08)

### Backend


#### New features:

- Add list of presentations and video to the LightningTalks content type. @ericof 



### Frontend

#### Feature

- Display list of presentations and video to the LightningTalks content type. @ericof 

#### Bugfix

- Fix Schedule block when used with more than 1 room. @ericof 



### Project

No significant changes.




## 1.0.0a12 (2025-08-05)

### Backend


#### Bug fixes:

- Fix order of Session fields: Description should be the second field in the default fieldset. @ericof 
- Fix presenter serialization when an activity has no workflow state. @ericof 



### Frontend

#### Bugfix

- Check if `text` is set before trying to display it. @ericof 
- Fix SponsorTile styles to always keep the 4:3 ratio and display the whole logo. @ericof 



### Project

No significant changes.




## 1.0.0a11 (2025-08-01)

### Backend


#### New features:

- Add video field to IEventSession behavior. @ericof 
- Allow adding a link object to Session objects. @ericof 



### Frontend

#### Feature

- Display video in Session types if available. @ericof 
- List Files, Images and Links inside a Session. @ericof 
- Style fixes to Sponsor Tile. @ericof 



### Project

No significant changes.




## 1.0.0a10 (2025-07-31)

### Backend

No significant changes.




### Frontend

#### Bugfix

- Fix a bug in SessionPresenters component where links were not working. @ericof 



### Project

No significant changes.




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




