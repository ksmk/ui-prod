import { Form, FormGroup, Modal } from 'react-bootstrap';
import * as React from 'react';
import styled from 'styled-components';
import { Formik } from 'formik';
import { toastr } from 'react-redux-toastr';
import CInput from '../../_Components/Fields/CInput';
import CButton from '../../_Components/Fields/CButton';
import { connect } from 'react-redux';
import { login } from '../../_Resources/Auth/Actions/login';
import { setLoginDialogActive } from '../../_Resources/Auth/Actions/setLoginDialogActive';
import { H1, H2 } from '../../_Components/Text/CHeadline';
import { withTranslation } from 'react-i18next';
import { setResetPasswordDialogActive } from '../../_Resources/Auth/Actions/setResetPasswordDialogActive';

const StyledForm = styled(Form)`
  display: block;
  max-width: 450px;
  margin: 0 auto;
`;

const StyledModal = styled(Modal)`
  & > .modal-dialog {
    width: 600px;
    max-width: 100%;
    padding: 0.5rem;
  }
  & > .modal-dialog > .modal-content {
    background: rgba(255, 255, 255, 0.995);
    text-align: left;
    padding-top: 2rem !important;
    padding-bottom: 2rem !important;
  }
`;

const StyledCButton = styled(CButton)`
  background-color: #4267b2 !important;
`;

const closeModal = () => {};

const LoginModal = ({
  loginDialogActive,
  dispatchLogin,
  dispatchCloseDialog,
  dispatchOpenResetPassword,
  t,
}) => (
  <StyledModal show={loginDialogActive} onHide={dispatchCloseDialog}>
    <Modal.Body>
      <Formik
        initialValues={{
          identifier: '',
          password: '',
        }}
        onSubmit={(values, { resetForm, setSubmitting }) => {
          fetch(process.env.API_AUTH, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          })
            .then(results => results.json())
            .then(data => {
              if (data.jwt && data.user) {
                dispatchLogin(data.user);
                localStorage.setItem('token', data.jwt);
                resetForm({});
                setSubmitting(false);
                toastr.success('Dziękujemy', 'Zostałeś zalogowany poprawnie!');
              } else {
                toastr.error('Niepoprawny login lub hasło/konto nieaktywne!');
              }
            });
        }}
        render={props => (
          <StyledForm onSubmit={props.handleSubmit}>
            <H2>{t('title')}</H2>
            <FormGroup>
              <CInput
                placeholder={t('E-mail')}
                type="text"
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                value={props.values.identifier || ''}
                name="identifier"
              />
            </FormGroup>
            <FormGroup>
              <CInput
                placeholder={t('Password')}
                type="password"
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                value={props.values.password || ''}
                name="password"
              />
            </FormGroup>
            <CButton type="submit">{t('Send')}</CButton>
            <br />
            <br />
            <a
              href={`https://umawiajonline.pl/connect/facebook`}
              className="link"
            >
              <StyledCButton type="button" social="facebook">
                <i className={`fab fa-facebook`} />
                Zaloguj przez Facebooka
              </StyledCButton>
            </a>
            <br />
            <br />

            <a className="link" onClick={dispatchOpenResetPassword}>
              <CButton type="button">Zapomniałeś hasła?</CButton>
            </a>
          </StyledForm>
        )}
      />
    </Modal.Body>
  </StyledModal>
);

const mapStateToProps = ({ auth: { loginDialogActive } }) => ({
  loginDialogActive,
});

const mapDispatchToProps = dispatch => ({
  dispatchLogin: args => {
    dispatch(login(args));
  },
  dispatchCloseDialog: () => {
    dispatch(setLoginDialogActive({ isActive: false }));
  },
  dispatchOpenResetPassword: () => {
    dispatch(setLoginDialogActive({ isActive: false }));
    dispatch(setResetPasswordDialogActive({ isActive: true }));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation('loginModal')(LoginModal));
