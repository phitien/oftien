import { connect } from "react-redux";
import { withRouter } from "react-router";
import { compose } from "redux";
import { withStyles } from "@material-ui/core";

export default function({ component, router, styles, theme }) {
  const { models, actions } = global;
  const args = [];

  if (router === true) args.push(withRouter);
  if (styles !== false)
    args.push(withStyles(styles || {}, { withTheme: theme }));
  return compose(
    ...args,
    connect(
      state =>
        Object.keys(models).reduce((rs, k) => {
          rs[k] = state.hasOwnProperty(k) ? state[k] : rs[k];
          return rs;
        }, {}),
      dispatch => actions
    )
  )(component);
}
