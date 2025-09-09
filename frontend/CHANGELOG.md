# Changelog

<!-- You should *NOT* be adding new change log entries to this file.
     You should create a file in the news directory instead.
     For helpful instructions, please see:
     https://6.docs.plone.org/contributing/index.html#contributing-change-log-label
-->

<!-- towncrier release notes start -->

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
