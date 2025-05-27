import React from 'react';
import { Tabs } from '@plone/components';
import { Tab, TabList, TabPanel } from 'react-aria-components';
import SessionTile from '@plone-collective/volto-techevent/components/Schedule/SessionTile';

const PresenterActivityGroup = ({ activityGroup }) => {
  return (
    <TabPanel id={activityGroup['@id']} className={'activityGroup'}>
      {activityGroup.items.map((item, i) => (
        <SessionTile
          key={i}
          item={item}
          showDescription
          showAudience
          showLevel
        />
      ))}
    </TabPanel>
  );
};

const PresenterActivities = ({ activities }) => {
  return (
    activities &&
    activities.length > 0 && (
      <Tabs className={'react-aria-Tabs tabs'}>
        <TabList
          aria-label="Presenter Activities"
          className={'react-aria-TabList tabList'}
        >
          {activities.map((activityGroup, i) => (
            <Tab id={activityGroup['@id']} key={i}>
              {activityGroup.title}
            </Tab>
          ))}
        </TabList>
        {activities.map((activityGroup, i) => (
          <PresenterActivityGroup activityGroup={activityGroup} key={i} />
        ))}
      </Tabs>
    )
  );
};

export default PresenterActivities;
