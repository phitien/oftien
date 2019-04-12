const pink = require("@material-ui/core/colors/pink").default;
const theme = {
  typography: { useNextVariants: true },
  palette: {
    type: "light",
    background: {
      default: "#f0f0f0"
    },
    primary: pink,
    secondary: {
      main: "#b2b2b2"
    }
  }
};
module.exports = theme;
