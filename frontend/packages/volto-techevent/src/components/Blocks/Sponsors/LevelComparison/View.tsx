import React from 'react';
import cx from 'classnames';
import { useIntl } from 'react-intl';
import { Container } from '@plone/components';
import Image from '@plone/volto/components/theme/Image/Image';
import { useEventSettings } from '@plone-collective/volto-techevent/hooks/useEventSettings';
import { useSponsors } from '@plone-collective/volto-techevent/hooks/useSponsors';
import type { BlockViewProps } from '@plone/types';
import messages from '@plone-collective/volto-techevent/messages';

const BenefitHeaderRow = ({ title, displayLevels }) => {
  return (
    <tr className={'benefitHead'}>
      <th className={'benefitCol cell'}>
        <span className={'header'}>{title}</span>
      </th>
      {displayLevels.map((level, idx) => (
        <th key={idx} className={'benefitPlanCol cell level'}>
          <div className={'wrapper'}>
            <div className={'header'}>
              <span>{level.title}</span>
            </div>
            <Image
              item={level}
              imageField={'preview_image_link'}
              responsive={true}
            />
          </div>
        </th>
      ))}
    </tr>
  );
};

const BenefitRow = ({ benefit, displayLevels }) => {
  return (
    <tr className={'benefitRow'}>
      <td className={'benefitTitle cell'}>
        <span className={'title'}>{benefit.title}</span>
        <br />
        <span className={'description'}>{benefit.description}</span>
      </td>
      {displayLevels.map((level, idx) => {
        const value = benefit.levels[level.id];
        const displayValue = value === undefined ? '' : value || '✅';
        return (
          <td key={idx} className={'benefitValue cell level'}>
            <span className={'value'}>{displayValue}</span>
          </td>
        );
      })}
    </tr>
  );
};

const View: React.FC<BlockViewProps> = ({
  data,
  className,
  style,
  content,
  properties,
}) => {
  const { title, tableTitle } = data;
  const intl = useIntl();

  // Use hook only if eventRoot exists
  const eventRoot = useEventSettings()?.eventRoot;
  const { benefits, levels } = useSponsors(eventRoot ?? '');
  const allBenefits =
    benefits &&
    benefits.reduce((obj, benefit) => {
      obj[benefit.id] = benefit;
      return obj;
    }, {});
  const displayLevels = levels
    ? levels.filter((level) => !level.exclude_from_nav)
    : [];
  const benefitsIds = benefits ? benefits.map((benefit) => benefit.id) : [];
  const displayTable = benefitsIds && benefitsIds.length > 0 && displayLevels;
  return (
    <Container className={cx('block levelComparison', className)} style={style}>
      {title && (
        <Container className="levelComparison title">{title}</Container>
      )}
      {displayTable && (
        <Container className="levelComparison tableContainer">
          <table className={'table'}>
            <thead className={'tableHeader'}>
              <BenefitHeaderRow
                title={tableTitle || intl.formatMessage(messages.benefit)}
                displayLevels={displayLevels}
              />
            </thead>
            <tbody>
              {benefitsIds.map((benefitId, idy) => {
                const benefit = allBenefits[benefitId];
                return (
                  benefit && (
                    <BenefitRow
                      key={idy}
                      benefit={benefit}
                      displayLevels={displayLevels}
                    />
                  )
                );
              })}
            </tbody>
          </table>
        </Container>
      )}
    </Container>
  );
};

export default View;
