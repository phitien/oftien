import React from "react";
import classnames from "classnames";
import { Helmet } from "react-helmet";
import Component from "./Component";
import { Redirect, matchPath } from "react-router-dom";
const { connect } = require("../redux");

export class Page extends Component {
  static layouts = [].merge(
    ["Main"], //empty
    //cols layouts
    ["Left_TopMainBottom_Right"], //full 3cols
    ["Left_Main_Right", "Left_TopMain_Right", "Left_MainBottom_Right"], //left,right
    ["Left_Main", "Left_TopMain", "Left_MainBottom", "Left_TopMainBottom"], //left
    ["Main_Right", "TopMain_Right", "MainBottom_Right", "TopMainBottom_Right"], //right
    //rows layouts
    ["Top_LeftMainRight_Bottom"], //full 3rows
    ["Top_Main", "Top_Main_Bottom", "Main_Bottom"],
    ["Top_LeftMain", "Top_LeftMainRight", "Top_MainRight"],
    ["Top_LeftMain_Bottom", "Top_MainRight_Bottom"],
    ["LeftMain_Bottom", "LeftMainRight_Bottom", "MainRight_Bottom"]
  );
  static pkg = "";
  static get apis() {
    return null;
  }
  static get match() {
    return matchPath(
      this.storeState.Application.location.pathname,
      this.getRoute
    );
  }
  static get getRoute() {
    const { pkg, name } = this;
    const { path, isDefault } = this;
    const connectedCmp = connect({ component: this });
    const paths = [].merge(path);
    const routes = [];
    if (isDefault && path !== "/")
      return {
        class: this,
        path: "/",
        default: true,
        render: () => <Redirect to={path || `/${name.lcfirst()}`} />
      };
    return {
      class: this,
      path: path || `/${name.lcfirst()}`,
      render: props =>
        React.createElement(connectedCmp, {
          ...props,
          className: `page-${pkg ? `${pkg.lower()}-` : ""}${name.lower()}`
        })
    };
  }
  static get storeState() {
    return global.store.getState();
  }
  static get title() {
    return this.storeState.Application.name;
  }
  static get keywords() {
    return this.storeState.Application.keywords;
  }
  static get author() {
    return this.storeState.Application.author;
  }
  static get description() {
    return this.storeState.Application.description;
  }
  static get logo() {
    return this.storeState.Application.logo;
  }
  state = { layout: null };

  get inlineStyle() {
    return null;
  }
  get fontFamily() {
    return global.localStorage.getItem("fontFamily");
  }
  get fontWeight() {
    return global.localStorage.getItem("fontWeight");
  }
  get fontSize() {
    return global.localStorage.getItem("fontSize");
  }
  get primary() {
    return global.localStorage.getItem("primary");
  }
  get primary2() {
    return global.localStorage.getItem("primary2");
  }
  get secondary() {
    return global.localStorage.getItem("secondary");
  }
  get secondary2() {
    return global.localStorage.getItem("secondary2");
  }
  get color() {
    return global.localStorage.getItem("color");
  }
  get bgcolor() {
    return global.localStorage.getItem("bgcolor");
  }
  get layout() {
    const match = this.props.location.hash.match(/layout=([a-zA-Z_]+)/);
    const layout = match
      ? match[1]
      : global.localStorage.getItem("layout") || this.constructor.layout;
    const layouts = this.constructor.layouts;
    return layouts.includes(layout) ? layout : "__";
  }
  get className() {
    return classnames("page", this.props.className, this.state.className);
  }
  get jPageDom() {
    return global.jQuery(this.pageDom);
  }
  async componentDidMount() {
    //call apis
    const apis = this.constructor.apis;
    if (apis && apis.length) apis.map(async args => await global.api(...args));
    //set style variables
    const { fontFamily, fontWeight, fontSize } = this;
    const { color, bgcolor } = this;
    const { primary, primary2, secondary, secondary2 } = this;
    const styles = [];
    if (fontFamily) styles.push(`--font-family: ${fontFamily}`);
    if (fontWeight) styles.push(`--font-weight: ${fontWeight}`);
    if (fontSize) styles.push(`--font-size: ${fontSize}`);
    if (primary) styles.push(`--cl-primary: ${primary}`);
    if (primary2) styles.push(`--cl-primary2: ${primary2}`);
    if (secondary) styles.push(`--cl-secondary: ${secondary}`);
    if (secondary2) styles.push(`--cl-secondary2: ${secondary2}`);
    if (color) styles.push(`--cl-text: ${color}`);
    if (bgcolor) styles.push(`--bg-body: ${bgcolor}`);
    global
      .jQuery("body")
      .addClass(`route ${this.constructor.className || ""}`)
      .attr("style", styles.join(";"));
  }
  renderLeft_TopMainBottom_Right() {
    return (
      <div className="layout cols Left_TopMainBottom_Right">
        <div className="left">{this.renderLeft()}</div>
        <div className="content rows">
          <div className="top">{this.renderTop()}</div>
          <div className="main">{this.renderMain()}</div>
          <div className="bottom">{this.renderBottom()}</div>
        </div>
        <div className="right">{this.renderRight()}</div>
      </div>
    );
  }
  renderTop_LeftMainRight_Bottom() {
    return (
      <div className="layout rows Top_LeftMainRight_Bottom">
        <div className="top">{this.renderTop()}</div>
        <div className="content cols">
          <div className="left">{this.renderLeft()}</div>
          <div className="main">{this.renderMain()}</div>
          <div className="right">{this.renderRight()}</div>
        </div>
        <div className="bottom">{this.renderBottom()}</div>
      </div>
    );
  }
  renderMainRight_Bottom() {
    return (
      <div className="layout rows MainRight_Bottom">
        <div className="content cols">
          <div className="main">{this.renderMain()}</div>
          <div className="right">{this.renderRight()}</div>
        </div>
        <div className="bottom">{this.renderBottom()}</div>
      </div>
    );
  }
  renderLeftMainRight_Bottom() {
    return (
      <div className="layout rows LeftMainRight_Bottom">
        <div className="content cols">
          <div className="left">{this.renderLeft()}</div>
          <div className="main">{this.renderMain()}</div>
          <div className="right">{this.renderRight()}</div>
        </div>
        <div className="bottom">{this.renderBottom()}</div>
      </div>
    );
  }
  renderLeftMain_Bottom() {
    return (
      <div className="layout rows LeftMain_Bottom">
        <div className="content cols">
          <div className="left">{this.renderLeft()}</div>
          <div className="main">{this.renderMain()}</div>
        </div>
        <div className="bottom">{this.renderBottom()}</div>
      </div>
    );
  }
  renderTop_MainRight_Bottom() {
    return (
      <div className="layout rows Top_MainRight_Bottom">
        <div className="top">{this.renderTop()}</div>
        <div className="content cols">
          <div className="main">{this.renderMain()}</div>
          <div className="right">{this.renderRight()}</div>
        </div>
        <div className="bottom">{this.renderBottom()}</div>
      </div>
    );
  }
  renderTop_LeftMain_Bottom() {
    return (
      <div className="layout rows Top_LeftMain_Bottom">
        <div className="top">{this.renderTop()}</div>
        <div className="content cols">
          <div className="left">{this.renderLeft()}</div>
          <div className="main">{this.renderMain()}</div>
        </div>
        <div className="bottom">{this.renderBottom()}</div>
      </div>
    );
  }
  renderTop_MainRight() {
    return (
      <div className="layout rows Top_MainRight">
        <div className="top">{this.renderTop()}</div>
        <div className="content cols">
          <div className="main">{this.renderMain()}</div>
          <div className="right">{this.renderRight()}</div>
        </div>
      </div>
    );
  }
  renderTop_LeftMainRight() {
    return (
      <div className="layout rows Top_LeftMainRight">
        <div className="top">{this.renderTop()}</div>
        <div className="content cols">
          <div className="left">{this.renderLeft()}</div>
          <div className="main">{this.renderMain()}</div>
          <div className="right">{this.renderRight()}</div>
        </div>
      </div>
    );
  }
  renderTop_LeftMain() {
    return (
      <div className="layout rows Top_LeftMain">
        <div className="top">{this.renderTop()}</div>
        <div className="content cols">
          <div className="left">{this.renderLeft()}</div>
          <div className="main">{this.renderMain()}</div>
        </div>
      </div>
    );
  }
  renderMain_Bottom() {
    return (
      <div className="layout rows Main_Bottom">
        <div className="content cols">
          <div className="main">{this.renderMain()}</div>
        </div>
        <div className="bottom">{this.renderBottom()}</div>
      </div>
    );
  }
  renderTop_Main_Bottom() {
    return (
      <div className="layout rows Top_Main_Bottom">
        <div className="top">{this.renderTop()}</div>
        <div className="content cols">
          <div className="main">{this.renderMain()}</div>
        </div>
        <div className="bottom">{this.renderBottom()}</div>
      </div>
    );
  }
  renderTop_Main() {
    return (
      <div className="layout rows Top_Main">
        <div className="top">{this.renderTop()}</div>
        <div className="content cols">
          <div className="main">{this.renderMain()}</div>
        </div>
      </div>
    );
  }
  renderTopMainBottom_Right() {
    return (
      <div className="layout cols TopMainBottom_Right">
        <div className="content rows">
          <div className="top">{this.renderTop()}</div>
          <div className="main">{this.renderMain()}</div>
          <div className="bottom">{this.renderBottom()}</div>
        </div>
        <div className="right">{this.renderRight()}</div>
      </div>
    );
  }
  renderMainBottom_Right() {
    return (
      <div className="layout cols MainBottom_Right">
        <div className="content rows">
          <div className="main">{this.renderMain()}</div>
          <div className="bottom">{this.renderBottom()}</div>
        </div>
        <div className="right">{this.renderRight()}</div>
      </div>
    );
  }
  renderTopMain_Right() {
    return (
      <div className="layout cols TopMain_Right">
        <div className="content rows">
          <div className="top">{this.renderTop()}</div>
          <div className="main">{this.renderMain()}</div>
        </div>
        <div className="right">{this.renderRight()}</div>
      </div>
    );
  }
  renderMain_Right() {
    return (
      <div className="layout cols Main_Right">
        <div className="content rows">
          <div className="main">{this.renderMain()}</div>
        </div>
        <div className="right">{this.renderRight()}</div>
      </div>
    );
  }
  renderLeft_TopMainBottom() {
    return (
      <div className="layout cols Left_TopMainBottom">
        <div className="left">{this.renderLeft()}</div>
        <div className="content rows">
          <div className="top">{this.renderTop()}</div>
          <div className="main">{this.renderMain()}</div>
          <div className="bottom">{this.renderBottom()}</div>
        </div>
      </div>
    );
  }
  renderLeft_MainBottom() {
    return (
      <div className="layout cols Left_MainBottom">
        <div className="left">{this.renderLeft()}</div>
        <div className="content rows">
          <div className="main">{this.renderMain()}</div>
          <div className="bottom">{this.renderBottom()}</div>
        </div>
      </div>
    );
  }
  renderLeft_TopMain() {
    return (
      <div className="layout cols Left_TopMain">
        <div className="left">{this.renderLeft()}</div>
        <div className="content rows">
          <div className="top">{this.renderTop()}</div>
          <div className="main">{this.renderMain()}</div>
        </div>
      </div>
    );
  }
  renderLeft_Main() {
    return (
      <div className="layout cols Left_Main">
        <div className="left">{this.renderLeft()}</div>
        <div className="content rows">
          <div className="main">{this.renderMain()}</div>
        </div>
      </div>
    );
  }
  renderLeft_MainBottom_Right() {
    return (
      <div className="layout cols Left_MainBottom_Right">
        <div className="left">{this.renderLeft()}</div>
        <div className="content rows">
          <div className="main">{this.renderMain()}</div>
          <div className="bottom">{this.renderBottom()}</div>
        </div>
        <div className="right">{this.renderRight()}</div>
      </div>
    );
  }
  renderLeft_TopMain_Right() {
    return (
      <div className="layout cols Left_TopMain_Right">
        <div className="left">{this.renderLeft()}</div>
        <div className="content rows">
          <div className="top">{this.renderTop()}</div>
          <div className="main">{this.renderMain()}</div>
        </div>
        <div className="right">{this.renderRight()}</div>
      </div>
    );
  }
  renderLeft_Main_Right() {
    return (
      <div className="layout cols Left_Main_Right">
        <div className="left">{this.renderLeft()}</div>
        <div className="content rows">
          <div className="main">{this.renderMain()}</div>
        </div>
        <div className="right">{this.renderRight()}</div>
      </div>
    );
  }

  renderLeft() {
    throw new Error("Please implement renderLeft");
  }
  renderTop() {
    throw new Error("Please implement renderTop");
  }
  renderBottom() {
    throw new Error("Please implement renderBottom");
  }
  renderRight() {
    throw new Error("Please implement renderRight");
  }
  renderMain() {
    throw new Error("Please implement renderMain");
  }
  renderExtra() {
    return null;
  }
  renderHelmet() {
    return (
      <Helmet key="helmet">
        {!this.constructor.title ? null : (
          <title>{this.constructor.title}</title>
        )}
        {!this.constructor.keywords ? null : (
          <meta name="keywords" content={this.constructor.keywords} />
        )}
        {!this.constructor.author ? null : (
          <meta name="author" content={this.constructor.author} />
        )}
        {!this.constructor.description ? null : (
          <meta name="description" content={this.constructor.description} />
        )}
        {!this.inlineStyle ? null : <style>{this.inlineStyle}</style>}
      </Helmet>
    );
  }
  renderComponent() {
    const { layout } = this;
    const fnName = `render${layout}`;
    return [
      this.renderHelmet(),
      <div key="page" className={this.className} ref={e => (this.pageDom = e)}>
        {layout === "Main" ? (
          <div className="layout cols Main">{this.renderMain()}</div>
        ) : this[fnName] ? (
          this[fnName]()
        ) : (
          this.renderMain()
        )}
        {this.renderExtra()}
      </div>
    ];
  }
}
export default Page;
