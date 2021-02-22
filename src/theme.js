import React from 'react';
import { Box } from 'grommet';

export const theme = {
  global: {
    font: {
      family: 'Noto Sans SC',
    },
    colors:{
      brand: '#F18805',
      orange: '#F18805',
      orangeLight: '#FBAF00',
      blue: '#3993DD',
      red: '#F94144',
      text: '#353C43',
      textLight: '#8B8C8E',
      border: '#CFD7DF',
      background: '#F4F5F6',
      backgroundLight: '#FBFBFB',
      line: '#E1E1E1',
      lineLight: '#EFEFEF',
      placeholder: '#9E9E9E',
    },
    focus: {
      border: undefined,
      shadow: {
        color: 'border',
        size: '1px',
      },
    },
    edgeSize: {
      none: '0px',
      hair: '1px',
      xxxsmall: '2px',
      xxsmall: '4px',
      xsmall: '8px',
      small: '12px',
      medium: '24px',
      large: '32px',
      xlarge: '48px',
      xxlarge: '64px',
      responsiveBreakpoint: 'small',
    },
    breakpoints: {
      small: {
        value: 1024,
        edgeSize: {
          none: '0px',
          hair: '1px',
          xxxsmall: '2px',
          xxsmall: '4px',
          xsmall: '8px',
          small: '12px',
          medium: '24px',
          large: '32px',
          xlarge: '48px',
          xxlarge: '64px',
        },
      },
    },
    elevation: {
      light: {
        normal: '0px 0px 13px rgba(0, 0, 0, 0.05)',
        drag: '0px 0px 8px rgba(0, 0, 0, 0.3)',
      }
    },
    input: {
      padding: {
        horizontal: '8px',
        vertical: '6px'
      },
      font: {
        size: 'small',
        height: '20px',
        weight: '400'
      }
    },
  },
  text: {
    xxsmall: {
      size: '12px',
      height: '14px',
      maxWidth: '240px'
    },
  },
  textInput: {
    extend: 'background: #ECECEC;'
  },
  button: {
    color: 'white',
    size: {
      small: {
        border: {
          radius: '4px'
        },
        pad: {
          horizontal: '16px',
          vertical: '6px'
        }
      },
      medium: {
        border: {
          radius: '4px'
        },
        pad: {
          horizontal: '16px',
          vertical: '8px'
        }
      }
    },
    border: {
      width: '0px'
    },
    primary: {
      extend: `font-weight:700;`
    }
  },
  rangeSelector: {
    edge: {
      type: ( // Edge container size is 12*12px
        <Box
          width='8px' height='100%' overflow='visible'>
          <Box
            style={{position: 'relative', top:'-2px', boxShadow: '1px -1px 1px rgba(0, 0, 0, 0.1)'}}
            height='16px' background='orange' flex={false}>
          </Box>
        </Box>
      )
    }
  },
  grommet: {
    extend:'min-width:1024px;'
  }
};
