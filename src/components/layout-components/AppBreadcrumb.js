import React, { Component } from "react";
import { Link, useLocation } from "react-router-dom";
import { Breadcrumb } from "antd";
import navigationConfig from "configs/NavigationConfig";
import IntlMessage from "components/util-components/IntlMessage";
import { AUTH_ROLE } from "constants/AuthConstant";

let breadcrumbData = {
  "/app": <IntlMessage id="home" />,
};

let role = localStorage.getItem(AUTH_ROLE);
if (role == "customer") {
  navigationConfig.navigationConfigCustomer.forEach((elm, i) => {
    // console.log("obj.title", {
    // 	title:elm.title,
    // 	path: breadcrumbData[elm.path]
    // })
    const assignBreadcrumb = (obj) =>
      (breadcrumbData[obj.path] = <IntlMessage id={obj.title} />);
    assignBreadcrumb(elm);
    if (elm.submenu) {
      elm.submenu.forEach((elm) => {
        assignBreadcrumb(elm);
        if (elm.submenu) {
          elm.submenu.forEach((elm) => {
            assignBreadcrumb(elm);
          });
        }
      });
    }
  });
} else if (role == "dealer") {
  navigationConfig.navigationConfigDealer.forEach((elm, i) => {
    // console.log("obj.title", {
    // 	title:elm.title,
    // 	path: breadcrumbData[elm.path]
    // })
    const assignBreadcrumb = (obj) =>
      (breadcrumbData[obj.path] = <IntlMessage id={obj.title} />);
    assignBreadcrumb(elm);
    if (elm.submenu) {
      elm.submenu.forEach((elm) => {
        assignBreadcrumb(elm);
        if (elm.submenu) {
          elm.submenu.forEach((elm) => {
            assignBreadcrumb(elm);
          });
        }
      });
    }
  });
} else {
  navigationConfig.navigationConfigAdmin.forEach((elm, i) => {
    // console.log("obj.title", {
    // 	title:elm.title,
    // 	path: breadcrumbData[elm.path]
    // })
    const assignBreadcrumb = (obj) =>
      (breadcrumbData[obj.path] = <IntlMessage id={obj.title} />);
    assignBreadcrumb(elm);
    if (elm.submenu) {
      elm.submenu.forEach((elm) => {
        assignBreadcrumb(elm);
        if (elm.submenu) {
          elm.submenu.forEach((elm) => {
            assignBreadcrumb(elm);
          });
        }
      });
    }
  });
}

navigationConfig.navigationConfigCustomer.forEach((elm, i) => {
  // console.log("obj.title", {
  // 	title:elm.title,
  // 	path: breadcrumbData[elm.path]
  // })
  const assignBreadcrumb = (obj) =>
    (breadcrumbData[obj.path] = <IntlMessage id={obj.title} />);
  assignBreadcrumb(elm);
  if (elm.submenu) {
    elm.submenu.forEach((elm) => {
      assignBreadcrumb(elm);
      if (elm.submenu) {
        elm.submenu.forEach((elm) => {
          assignBreadcrumb(elm);
        });
      }
    });
  }
});

const BreadcrumbRoute = (props) => {
  const location = useLocation();
  console.log("first", location.pathname);
  const pathSnippets = location.pathname.split("/").filter((i) => i);
  const breadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
    return {
      title: <Link to={url}>{breadcrumbData[url]}</Link>,
    };
  });

  return <Breadcrumb items={breadcrumbItems} />;
};

export class AppBreadcrumb extends Component {
  render() {
    return <BreadcrumbRoute />;
  }
}

export default AppBreadcrumb;
