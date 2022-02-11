import React from 'react';
import { StylingWrapper } from '@spotim/ui-components';
import { addDecorator } from '@storybook/react';
import "@fontsource/open-sans";
import '@spotim/ui-components/dist/main.css';

export const parameters = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

const StyleWrapper = (storyFn) => {
  return (
    <StylingWrapper isLtr>{storyFn()}</StylingWrapper>
  );
};

addDecorator(StyleWrapper);
