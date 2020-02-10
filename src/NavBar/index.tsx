import React, { useState } from "react";
import { Menu, Icon } from "antd";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { ClickParam } from "antd/lib/menu";
import { _Map, _List } from "../Routes";

type Props = RouteComponentProps<any>;

const NavBar = ({ history, location }: Props) => {
  const [key, setKey] = useState();

  return (
    <Menu
      onClick={(e: ClickParam) => {
        if (location.pathname !== e.key) history.push(e.key);
      }}
      selectedKeys={[location.pathname]}
      mode="horizontal"
      theme="dark"
    >
      <Menu.Item key={_Map}>
        <Icon type="map" />
        Mapa dřevin
      </Menu.Item>
      <Menu.Item key={_List}>
        <Icon type="home" />
        Seznam dřevin
      </Menu.Item>
    </Menu>
  );
};

const navBartWithRouter = withRouter(NavBar);

export { navBartWithRouter as NavBar };
