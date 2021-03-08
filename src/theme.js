export const theme = {
  global: {
    font: {
      family: 'Noto Sans SC',
    },
    // active: {
    //   background: {
    //     color: 'active',
    //     opacity: 'medium',
    //   },
    //   color: {
    //     dark: 'white',
    //     light: 'black',
    //   },
    // },
    // selected: {
    //   background: 'selected',
    //   color: 'white',
    // },
    hover: {
      color: 'black',
      background:'background',
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
      selectd: 'brand'
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
    extend: `
      background: #FBFBFB;
      padding: 5px 8px;
    `
  },
  button: {
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
      },
      large: {
        border: {
          radius: '4px'
        },
        pad: {
          horizontal: '48px',
          vertical: '16px'
        }
      }
    },
    default: {
      color: 'brand',
      border: { color: 'brand', width: '2px' },
      font: { weight: 700 },
    },
    primary: {
      color: 'white',
      background: { color: 'brand' },
      border: undefined,
      font: { weight: 700 },
    },
  },
  grommet: {
    extend:'min-width:1024px;'
  },
  select: {
    background:'backgroundLight',
    control: {
      extend: `
        border: 1px solid #E1E1E1;
      `
    },
    container: {
      extend: `background: #FBFBFB;`
    },
    options: {
      container: {
        pad: '6px'
      },
      text: {
        size: 'small',
      }
    },
    icons: {
      margin: {horizontal: 'xxsmall'},
      color: 'text'
    },
  },
  heading: {
    responsiveBreakpoint: undefined
  },
};
