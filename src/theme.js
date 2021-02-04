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
      xxsmall: '4px',
      xsmall: '8px',
      small: '16px',
      medium: '20px',
      large: '32px',
      xlarge: '64px',
      responsiveBreakpoint: 'small',
    },
    elevation: {
      light: {
        normal: '0px 0px 13px rgba(0, 0, 0, 0.05)',
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
    }
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
      }
    },
    border: {
      width: '0px'
    },
    primary: {
      font: {
        weight: 700,
      },
    }
  }
};
