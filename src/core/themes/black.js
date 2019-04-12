const theme = {
  typography: {
    useNextVariants: true
  },
  palette: {
    type: "dark",
    background: {
      default: "#121316"
    }
  },
  image: {
    icon: { width: 16 }
  },
  overrides: {
    MuiPaper: { root: { backgroundColor: "#2a2b30" } },
    MuiButton: {
      root: {
        backgroundColor: "#1c1f23",
        textTransform: "initial",
        padding: "3px 10px",
        display: "inline-flex",
        minWidth: "initial",
        lineHeight: "24px",
        "&.big": { height: 58, fontSize: 18 },
        "&:hover": {
          backgroundColor: "#00c7aa"
        },
        "&$outlined": {
          padding: "3px 10px"
        },
        "&$outlinedSecondary": {
          color: "#FFFFFF",
          backgroundColor: "#1B7EC7",
          borderColor: "transparent",
          "&:hover": {
            backgroundColor: "#125F96",
            borderColor: "#12629B"
          }
        }
      }
    }
  }
};
module.exports = theme;
