import React from "react";
import { Menu, Icon } from "antd";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { ClickParam } from "antd/lib/menu";
import { _Map, _List } from "../Routes";
import {_Green} from '../Common/Colors';

type Props = RouteComponentProps<any>;

const NavBar = ({ history, location }: Props) => (
  <Menu
    onClick={(e: ClickParam) => {
      if (location.pathname !== e.key && e.key.startsWith("/"))
        history.push(e.key);
    }}
    selectedKeys={[location.pathname]}
    mode="horizontal"
    theme='dark'
    style={{
      backgroundColor: _Green,
      fontSize: 20
    }}
  >
    <Menu.Item key={_Map}>
      <Icon type="global" />
      Mapa dřevin
    </Menu.Item>

    <Menu.Item key={_List}>
      <Icon type="ordered-list" />
      Seznam dřevin
    </Menu.Item>

    <Menu.Item style={{ float: "right" }}>
      <a href="https://github.com/prixladi/treeloc">
        <Icon type="github" />
        Github repozitář
      </a>
    </Menu.Item>
  </Menu>
);

const navBartWithRouter = withRouter(NavBar);

export { navBartWithRouter as NavBar };
