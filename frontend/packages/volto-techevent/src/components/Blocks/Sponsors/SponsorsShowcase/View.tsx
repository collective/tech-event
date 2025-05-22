import React from 'react';
import cx from 'classnames';
import { Container } from '@plone/components';
import { useEventSettings } from '@plone-collective/volto-techevent/hooks/useEventSettings';
import SponsorLevel from '@plone-collective/volto-techevent/components/Sponsors/SponsorLevel';
import { useSponsors } from '@plone-collective/volto-techevent/hooks/useSponsors';
import type { SponsorLevel as SponsorLevelType } from '@plone-collective/volto-techevent/types/sponsors';
import type { BlockViewProps } from '@plone/types';

const View: React.FC<BlockViewProps> = ({ data, className, style }) => {
  const { title, styles } = data;
  const eventRoot = useEventSettings()?.eventRoot;

  // Use hook only if eventRoot exists
  const { levels, loading, error } = useSponsors(eventRoot ?? '');

  return (
    <Container className={cx('block sponsors', className)} style={style}>
      {title && <Container className="sponsors title">{title}</Container>}

      {loading && <p>Loading sponsors…</p>}
      {error && <p className="error">Error: {error}</p>}

      {levels && levels.length > 0 && (
        <div className="sponsor-levels">
          {levels.map(
            (level: SponsorLevelType) =>
              level.has_sponsors && (
                <SponsorLevel key={level.id} item={level} styles={styles} />
              ),
          )}
        </div>
      )}
    </Container>
  );
};

export default View;
