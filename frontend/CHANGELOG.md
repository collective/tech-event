# Changelog

<!-- You should *NOT* be adding new change log entries to this file.
     You should create a file in the news directory instead.
     For helpful instructions, please see:
     https://6.docs.plone.org/contributing/index.html#contributing-change-log-label
-->

<!-- towncrier release notes start -->

## 1.0.0-beta.3 (2026-10-14)

No significant changes.


## 1.0.0-beta.2 (2026-10-13)


### Breaking

- Require Volto 19.5 or later, and stop depending on @kitconcept/volto-light-theme: projects that use it register the theme in their own volto.config.js. Use @plonegovbr/volto-social-media 3.0.0. @ericof [#32](https://github.com/collective/tech-event/issues/32)


### Feature

- Add Storybook stories for every component, published with the documentation. @ericof [#32](https://github.com/collective/tech-event/issues/32)


### Bugfix

- Fix crashes in the sponsor level comparison and the presenter category, show edit mode in the schedule block, show the configured label on the attendee login button, and return an empty map for an unknown vocabulary in useVocabularyColors. @ericof [#32](https://github.com/collective/tech-event/issues/32)


### Internal

- Update the translation catalogs. @ericof [#32](https://github.com/collective/tech-event/issues/32)
- Align the frontend with the cookieplone monorepo add-on template: pnpm 10, Vitest, the typecheck, i18n and storybook-build targets, and a shipped tsconfig.json that maps only the add-on itself. @ericof [#32](https://github.com/collective/tech-event/issues/32)
- Add TypeScript types to the components, hooks and configuration, so the add-on passes make typecheck. @ericof [#32](https://github.com/collective/tech-event/issues/32)


### Documentation

- Rewrite the README published on npm, with installation, the theme note, the blocks and views, and the development commands. @ericof [#32](https://github.com/collective/tech-event/issues/32)


### Tests

- Test every component, hook, helper, reducer, action and configuration step with Vitest, and fail the suite when a component lacks a test or a story. @ericof [#32](https://github.com/collective/tech-event/issues/32)

## 1.0.0-beta.1 (2025-10-16)

### Internal

- Update package metadata. @ericof 

### Documentation

- Update README file. @ericof 

## 1.0.0-alpha.23 (2025-10-08)

## 1.0.0-alpha.22 (2025-09-20)

### Bugfix

- Add time indication for all slots in a Schedule block. @ericof [#22](https://github.com/collective/tech-event/issue/22)

## 1.0.0-alpha.21 (2025-09-16)

### Feature

- Change to show rooms on every schedule slot @datakurre [#21](https://github.com/collective/tech-event/issue/21)

### Bugfix

- Fix to not hide Keynote presenters on schedule. @datakurre [#20](https://github.com/collective/tech-event/issue/20)

## 1.0.0-alpha.20 (2025-09-15)

### Bugfix

- Fix issue where search facet dropdown opens behind SessionTile @datakurre [#17](https://github.com/collective/tech-event/issue/17)
- Fix issue where schedule row icons were rendered outside the viewport @datakurre [#18](https://github.com/collective/tech-event/issue/18)
- Restore gaps between slots on Schedule after CSS grid refactoring @datakurre [#19](https://github.com/collective/tech-event/issue/19)

## 1.0.0-alpha.19 (2025-09-09)

### Feature

- Refactor schedule to use CSS grid layout @datakurre [#14](https://github.com/collective/tech-event/issue/14)
- Register session view for open space content @datakurre [#16](https://github.com/collective/tech-event/issue/16)

### Bugfix

- Fix SessionTrack component to display all selected tracks @datakurre [#15](https://github.com/collective/tech-event/issue/15)

## 1.0.0-alpha.18 (2025-08-27)

### Feature

- Style fixes for mobile. @ericof 

### Bugfix

- Do not display slot date if start or end date are null. @ericof 

## 1.0.0-alpha.17 (2025-08-21)

## 1.0.0-alpha.16 (2025-08-19)

### Feature

- Add /attendee-login to allow Attendees to request to mail them their current TOTP for login. @datakurre [#7](https://github.com/collective/tech-event/issue/7)

## 1.0.0-alpha.15 (2025-08-15)

## 1.0.0-alpha.14 (2025-08-14)

### Feature

- Add state-{review_state} class name into sessionTile. @datakurre [#4](https://github.com/collective/tech-event/issue/4)

## 1.0.0-alpha.13 (2025-08-08)

### Feature

- Display list of presentations and video to the LightningTalks content type. @ericof 

### Bugfix

- Fix Schedule block when used with more than 1 room. @ericof 

## 1.0.0-alpha.12 (2025-08-05)

### Bugfix

- Check if `text` is set before trying to display it. @ericof 
- Fix SponsorTile styles to always keep the 4:3 ratio and display the whole logo. @ericof 

## 1.0.0-alpha.11 (2025-08-01)

### Feature

- Display video in Session types if available. @ericof 
- List Files, Images and Links inside a Session. @ericof 
- Style fixes to Sponsor Tile. @ericof 

## 1.0.0-alpha.10 (2025-07-31)

### Bugfix

- Fix a bug in SessionPresenters component where links were not working. @ericof 

## 1.0.0-alpha.9 (2025-07-16)

### Feature

- Schedule block now supports multiple rooms. @ericof 

## 1.0.0-alpha.8 (2025-07-16)

## 1.0.0-alpha.7 (2025-07-16)

### Bugfix

- Fix tutorial view. @ericof [#1](https://github.com/collective/tech-event/issue/1)
- Small style fixes. @ericof 

### Internal

- Upgrade @plonegovbr/volto-social-media to version 2.0.0-alpha.6. @ericof 

## 1.0.0-alpha.6 (2025-06-27)

### Feature

- Add styles to sponsor view. @ericof 
- Fix color for presenter tile title and social network. @ericof 
- Improve Sponsor blocks styles. @ericof 

## 1.0.0-alpha.5 (2025-05-27)

## 1.0.0-alpha.4 (2025-05-27)

### Feature

- Implements PresenterGridItem to be used with listing blocks when displaying Presenter information. @ericof 
- Implements SessionGridItem to be used with listing blocks when displaying Session (Keynote, Talk, Tutorial) content types. @ericof 
- Implements SessionTile component, used in listings of Session content types. @ericof 
- Implements view component (SessionView) used for Keynote, Talk and Training content types. @ericof 
- Improvements to PresenterView. @ericof 
- Support color labels for Audience, Level, Track information. @ericof 

## 1.0.0-alpha.3 (2025-05-25)

### Feature

- Added Brazilian Portuguese translation. @ericof 

## 1.0.0-alpha.2 (2025-05-23)

## 1.0.0-alpha.1 (2025-05-23)

### Feature

- Initial release. @ericof
