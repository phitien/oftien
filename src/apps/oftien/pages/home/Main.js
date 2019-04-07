import "./home.scss";

import React from "react";
import { Button, Logo, Page } from "../../../../core";

export default class Home extends Page {
  static isDefault = true;
  static path = "/";
  static layout = "Main_Right";
  static className = "route-home";

  renderSection(heading, children) {
    return (
      <div className="section">
        <h3>{heading}</h3>
        {children || null}
      </div>
    );
  }
  renderBlock(heading, children) {
    return (
      <div className="block">
        <h4>{heading}</h4>
        {children || null}
      </div>
    );
  }
  renderMain() {
    return (
      <div className="wrraper">
        <div className="horizontal middle">
          <div className="avatar" />
          <div className="info">
            <h2 className="name">Phi Tien</h2>
            <div className="occupation">Senior UI Developer (Web & Mobile)</div>
          </div>
        </div>
        {this.renderSection("Experience", [
          this.renderBlock("Amaris.AI | Frontend Lead"),
          this.renderBlock("PureCode | Former, CTO"),
          this.renderBlock("Standard Chartered Bank | Frontend Lead"),
          this.renderBlock("Golden Equator Consulting | Developer, DevOps"),
          this.renderBlock(
            "Bosch Software Innovations | Web & Mobile Developer"
          ),
          this.renderBlock("FPT Software | Web Developer"),
          this.renderBlock("ESNC | Web Developer")
        ])}
      </div>
    );
  }
  renderRight() {
    return (
      <div className="wrraper">
        <div className="info">
          <a className="website" target="_blank" href="http://info.oftien.com">
            http://info.oftien.com
          </a>
          <a
            className="github"
            target="_blank"
            href="https://github.com/phitien"
          >
            https://github.com/phitien
          </a>
          <a
            className="email"
            target="_blank"
            href="mailto://im.phitien@gmail.com"
          >
            im.phitien@gmail.com
          </a>
          <a className="skype" target="_blank" href="skype://im.phitien">
            skype: im.phitien
          </a>
          <div className="mobile">(+65)85986657, (+84)946847882</div>
          <div className="address">Vietnam, Singapore</div>
        </div>
        {this.renderSection("Skills", [
          this.renderBlock(
            "Domains",
            "Artificial Intelligence, Banking, Finance, Crowdfunding, ICO, Web Enterprise, Mobile, Website"
          ),
          this.renderBlock(
            "Abilities",
            "Web Enterprise app, Mobile app, Websites, Blog, DevOps, ICO"
          ),

          this.renderBlock(
            "OS",
            "Linux (Ubuntu, CentOS, Alpine, Fedora), MacOS, Windows"
          ),
          this.renderBlock(
            "Programming Langagues",
            "Node, JS, Html, CSS, Python, Java, C#, C++, Objective C, Bash, PowerShell"
          ),
          this.renderBlock("Clouds", ["AWS3", "GCP", "Firebase"]),
          this.renderBlock("Frameworks, Libraries", [
            "ReactJS, React Native, VueJS, AngularJS, SailsJS, jQuery, KnockoutJS, PubNub, Express, SocketIO.",
            <br />,
            "Django, Flask, Spring framework.",
            <br />,
            "Bootstrap, Material Design, FontAwesome.",
            <br />,
            "Zend framework, CakePHP, Phalcon."
          ]),
          this.renderBlock("Open sources", "Laravel", "Magento", "Joomla"),
          this.renderBlock("Big Data", "TagUI, UIPath, Automagica"),
          this.renderBlock("Visualisation", "Tableau, D3, GoJS, Echarts"),
          this.renderBlock("RPA (Automation)", "TagUI, UIPath, Automagica"),
          this.renderBlock("Langagues", "English, Vietnamese"),
          this.renderBlock(
            "Education",
            <div className="education">
              Hanoi Water Resources University (2002 - 2007),
              <br />
              Bachelor of Computer Science, <br />
              Information Technology
            </div>
          )
        ])}
      </div>
    );
  }
}
