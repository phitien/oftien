import React from "react";
import classnames from "classnames";

import Component from "./Component";

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
  get layout() {
    const match = global.location.hash.match(/layout=([a-zA-Z_]+)/);
    const layout = match ? match[1] : this.constructor.layout;
    const layouts = this.constructor.layouts;
    return layouts.includes(layout) ? layout : "Main";
  }
  get className() {
    return classnames("page", this.props.className, this.state.className);
  }
  componentDidMount() {
    global.jQuery("body").addClass(this.constructor.className || "");
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
  renderComponent() {
    const fnName = `render${this.layout}`;
    return (
      <div key="page" className={this.className}>
        {this[fnName] ? this[fnName]() : this.renderMain()}
        {this.renderExtra()}
      </div>
    );
  }
}
export default Page;
