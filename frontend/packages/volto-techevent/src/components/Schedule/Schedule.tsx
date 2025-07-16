import React from 'react';
import { Tab, Menu } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import FormattedDate from '@plone/volto/components/theme/FormattedDate/FormattedDate';
import DaySchedule from './DaySchedule';

const Schedule = (props) => {
  const { isEditMode, filterByDay, displayDayIndex, items } = props;
  const daysInfo =
    items &&
    items
      .map((day) => {
        const keyDay = day['id'];
        if (filterByDay?.length === 0) {
          return day;
        } else if (filterByDay) {
          if (filterByDay.includes(keyDay.slice(0, 10))) {
            return day;
          }
        }
        return null;
      })
      .filter((item) => item !== null);
  const panes =
    daysInfo &&
    daysInfo.map((day, dayIndex) => {
      const keyDay = day['id'];
      const date = new Date(`${keyDay}T12:00:00+00:00`);
      return {
        menuItem: (
          <Menu.Item key={`${keyDay}_menu`}>
            <div className={'day day-label'}>
              {displayDayIndex && (
                <div className={'heading'}>
                  <FormattedMessage id="Day" defaultMessage="Day" />{' '}
                  {dayIndex + 1}
                </div>
              )}
              <div className={'description'}>
                <FormattedDate
                  date={date}
                  includeTime={false}
                  format={{
                    month: 'short',
                    day: 'numeric',
                  }}
                />
              </div>
            </div>
          </Menu.Item>
        ),
        render: () => {
          return (
            <Tab.Pane className="tab-container" key={`${keyDay}_container`}>
              <DaySchedule day={day} />
            </Tab.Pane>
          );
        },
      };
    });

  return (
    <div className="schedule">
      {isEditMode && 'Schedule Edit Mode'}
      <Tab panes={panes} className="tab" />
    </div>
  );
};

export default Schedule;
