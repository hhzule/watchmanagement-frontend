import React from "react";
import { Dropdown, Avatar } from "antd";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  EditOutlined,
  SettingOutlined,
  ShopOutlined,
  UserOutlined,
  QuestionCircleOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import NavItem from "./NavItem";
import Flex from "components/shared-components/Flex";
import { signOut } from "store/slices/authSlice";
import styled from "@emotion/styled";
import {
  FONT_WEIGHT,
  MEDIA_QUERIES,
  SPACER,
  FONT_SIZES,
} from "constants/ThemeConstant";
import { EMILUS_USER } from "constants/AuthConstant";
const Icon = styled.div(() => ({
  fontSize: FONT_SIZES.LG,
}));

const Profile = styled.div(() => ({
  display: "flex",
  alignItems: "center",
}));

const UserInfo = styled("div")`
  padding-left: ${SPACER[2]};

  @media ${MEDIA_QUERIES.MOBILE} {
    display: none;
  }
`;

const Name = styled.div(() => ({
  fontWeight: FONT_WEIGHT.SEMIBOLD,
}));

const Title = styled.span(() => ({
  opacity: 0.8,
}));

const MenuItem = (props) => (
  <Flex as="a" href={props.path} alignItems="center" gap={SPACER[2]}>
    <Icon>{props.icon}</Icon>
    <span>{props.label}</span>
  </Flex>
);

const MenuItemSignOut = (props) => {
  const dispatch = useDispatch();

  const handleSignOut = () => {
    dispatch(signOut());
  };

  return (
    <div onClick={handleSignOut}>
      <Flex alignItems="center" gap={SPACER[2]}>
        <Icon>
          <LogoutOutlined />
        </Icon>
        <span>{props.label}</span>
      </Flex>
    </div>
  );
};

const items = [
  // {
  // 	key: 'Edit Profile',
  // 	label: <MenuItem path="/" label="Edit Profile" icon={<EditOutlined />} />,
  // },
  // {
  // 	key: 'Account Setting',
  // 	label: <MenuItem path="/" label="Account Setting" icon={<SettingOutlined />} />,
  // },
  // {
  // 	key: 'Account Billing',
  // 	label: <MenuItem path="/" label="Account Billing" icon={<ShopOutlined />} />,
  // },
  {
    key: "Profile",
    label: (
      <MenuItem path="/app/profile" label="Profile" icon={<UserOutlined />} />
    ),
  },
  {
    key: "Sign Out",
    label: <MenuItemSignOut label="Sign Out" />,
  },
];

export const NavProfile = ({ mode }) => {
  const user = localStorage.getItem(EMILUS_USER);
  return (
    <>
      <Dropdown placement="bottomRight" menu={{ items }} trigger={["click"]}>
        <NavItem mode={mode}>
          <Profile>
            <Avatar src="/img/avatars/thumb-1.jpg" />

            <UserInfo className="profile-text">
              {user ? (
                <>
                  {" "}
                  <Name>{user}</Name>
                </>
              ) : null}
              {/* <Name>Charlie Howard</Name> */}
            </UserInfo>
          </Profile>
        </NavItem>
      </Dropdown>
    </>
  );
};

export default NavProfile;
