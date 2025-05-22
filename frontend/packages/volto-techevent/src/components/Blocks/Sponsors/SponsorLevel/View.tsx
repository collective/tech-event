import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { useIntl } from 'react-intl';
import { Container } from '@plone/components';
import UniversalLink from '@plone/volto/components/manage/UniversalLink/UniversalLink';
import { useEventSettings } from '@plone-collective/volto-techevent/hooks/useEventSettings';
import SponsorList from '@plone-collective/volto-techevent/components/Sponsors/SponsorList';
import { useSponsors } from '@plone-collective/volto-techevent/hooks/useSponsors';
import type { BlockViewProps } from '@plone/types';
import messages from '@plone-collective/volto-techevent/messages';

const View: React.FC<BlockViewProps> = ({
  data,
  content,
  properties,
  className,
  style,
}) => {
  const { title, href, label, displayCTA, styles } = data;
  const intl = useIntl();
  const level_id = content.id || properties.id;
  const eventRoot = useEventSettings()?.eventRoot;
  const { levels, loading } = useSponsors(eventRoot ?? '');
  const [level, setLevel] = useState();

  useEffect(() => {
    if (levels) {
      const level = levels.filter((item) => item.id === level_id);
      if (level.length === 1) {
        setLevel(level[0]);
      }
    }
  }, [level_id, levels, setLevel]);
  const ctaAction = href?.[0]?.['@id'];
  const hasSponsors = level?.has_sponsors || false;

  return (
    <Container
      className={cx('block sponsorLevelBlock', className)}
      style={style}
    >
      {!loading && (
        <Container className={'level wrapper'}>
          {title && <Container className="title">{title}</Container>}
          {hasSponsors && (
            <SponsorList sponsors={level.items} styles={styles} />
          )}

          {displayCTA && ctaAction && (
            <Container className="sponsorCTA">
              <UniversalLink
                href={ctaAction}
                title={intl.formatMessage(messages.sponsor)}
                className={'cta'}
              >
                {label ? label : intl.formatMessage(messages.ctaLabelFallback)}
              </UniversalLink>
            </Container>
          )}
        </Container>
      )}
    </Container>
  );
};

export default View;
