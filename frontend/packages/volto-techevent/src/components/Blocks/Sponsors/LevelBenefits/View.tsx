import React from 'react';
import cx from 'classnames';
import { Container } from '@plone/components';
import { useEventSettings } from '@plone-collective/volto-techevent/hooks/useEventSettings';
import { useSponsors } from '@plone-collective/volto-techevent/hooks/useSponsors';
import type { BlockViewProps } from '@plone/types';
import type { SponsorBenefit } from '@plone-collective/volto-techevent/types/sponsors';
import type { LevelBenefitsBlockData } from '@plone-collective/volto-techevent/components/Sponsors/types';

/** A benefit as the page stores it: a reference to a benefit and its value. */
type LocalBenefit = { code: { token: string }; value?: string };

const BenefitItem = ({
  benefit,
  value,
}: {
  benefit: SponsorBenefit;
  value?: string;
}) => {
  const displayValue = value === undefined ? '' : value || '✅';
  return (
    <>
      <span className={'title'}>{benefit.title}</span>
      <span className={'value'}>{displayValue}</span>
    </>
  );
};

const View: React.FC<BlockViewProps> = ({
  data,
  className,
  style,
  content,
  properties,
}) => {
  const { title } = data as LevelBenefitsBlockData;
  const localBenefits: LocalBenefit[] =
    (content as { benefits?: LocalBenefit[] }).benefits ||
    (properties as { benefits?: LocalBenefit[] }).benefits ||
    [];
  // Use hook only if eventRoot exists
  const eventRoot = useEventSettings()?.eventRoot;
  const { benefits } = useSponsors(eventRoot ?? '');
  const allBenefits =
    benefits &&
    benefits.reduce<Record<string, SponsorBenefit>>((obj, benefit) => {
      obj[benefit.id] = benefit;
      return obj;
    }, {});
  const localBenefitsMap =
    localBenefits &&
    localBenefits.reduce<Record<string, LocalBenefit>>((obj, benefit) => {
      obj[benefit.code.token] = benefit;
      return obj;
    }, {});
  const benefitsIds = localBenefits
    ? localBenefits.map((benefit) => benefit.code?.token)
    : [];
  const displayList = benefitsIds && benefitsIds.length > 0;
  return (
    <Container className={cx('block benefits', className)} style={style}>
      {title && <Container className="benefits title">{title}</Container>}
      {displayList && (
        <Container className="benefits wrapper">
          <ul className={'list'}>
            {benefitsIds.map((benefitId, idy) => {
              const benefit = allBenefits[benefitId];
              const value = localBenefitsMap[benefitId]?.value;
              return (
                benefit && (
                  <li className={'benefit item'}>
                    <BenefitItem key={idy} benefit={benefit} value={value} />
                  </li>
                )
              );
            })}
          </ul>
        </Container>
      )}
    </Container>
  );
};

export default View;
