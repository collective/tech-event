import React from 'react';
import { Container } from '@plone/components';
import { Embed } from 'semantic-ui-react';

interface VideoProps {
  url: string;
}

/**
 * Video component.
 * @function Video
 * @param url - Video URL
 * @returns Markup of the component.
 */
const Video: React.FC<VideoProps> = ({ url }) => {
  // Only support YouTube links for now
  const videoSource = 'youtube';
  const videoId = url.match(/.be\//)
    ? url.match(/^.*\.be\/(.*)/)[1]
    : url.match(/^.*\?v=(.*)$/)[1];
  return (
    <Container className="video embed">
      <Embed
        id={videoId}
        source={videoSource}
        icon="play"
        defaultActive
        autoplay={false}
      />
    </Container>
  );
};

export default Video;
