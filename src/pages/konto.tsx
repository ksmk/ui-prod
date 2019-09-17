import * as React from "react";
import UserLayout from "../_Components/Layout/UserLayout/UserLayout";
import CButton from "../_Components/Fields/CButton";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { getTokenId } from "../_Components/utils/getToken";
import { toastr } from "react-redux-toastr";
import { logout } from "../_Resources/Auth/Actions/logout";
import CTitle from "../_Components/Text/CTitle";
import styled from "styled-components";
import { navigate } from "@reach/router";

interface IProps {}

const DELETE_USER = gql`
  mutation($input: deleteUserInput) {
    deleteUser(input: $input) {
      user {
        id
        username
      }
    }
  }
`;

const Wrapper = styled.div`
  zoom: 0.8;
`;

class Konto extends React.Component<IProps> {
  closeAccount = () => {
    const { deleteUser, dispatchLogout } = this.props;
    deleteUser({
      variables: {
        input: { where: { id: getTokenId() } },
      },
    }).then(() => {
      localStorage.removeItem("token");
      dispatchLogout();
      toastr.success("Wylogowano poprawnie!");
      navigate("/");
    });
  }

  render() {
    return (
      <UserLayout>
        <Wrapper>
          <br />
          <CTitle>Użytkownik</CTitle>
          <br />
          <CButton onClick={this.closeAccount}>Usuń konto</CButton>
        </Wrapper>
      </UserLayout>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  dispatchLogout: args => {
    dispatch(logout());
  },
});

export default graphql(DELETE_USER, { name: "deleteUser" })(
  connect(
    null,
    mapDispatchToProps,
  )(withTranslation("headerMenu")(Konto)),
);
