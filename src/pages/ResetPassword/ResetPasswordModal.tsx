import { Form, FormGroup, Modal } from 'react-bootstrap';
import * as React from 'react';
import styled from 'styled-components';
import { Formik } from 'formik';
import { toastr } from 'react-redux-toastr';
import CInput from '../../_Components/Fields/CInput';
import CButton from '../../_Components/Fields/CButton';
import { connect } from 'react-redux';
import { H1, H2 } from '../../_Components/Text/CHeadline';
import { withTranslation } from 'react-i18next';
import { resetPassword } from '../../_Resources/Auth/Actions/resetPassword';
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

const options = {
  initReset: ({ t, dispatchCloseDialog }) => {
    return (
      <Formik
        initialValues={{
          email: '',
          url: 'https://carly24.pl/',
        }}
        onSubmit={(values, { resetForm, setSubmitting }) => {
          fetch(process.env.API_AUTH_RESET_PASSWORD, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          })
            .then(results => results.json())
            .then(data => {
              if (data.ok) {
                dispatchCloseDialog();
                resetForm({});
                setSubmitting(false);
                toastr.success(
                  'Dziękujemy',
                  'Wysłaliśmy wiadomość na podany adres e-mail',
                );
              } else {
                toastr.error('Niewłaściwy adres e-mail!');
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
                value={props.values.email || ''}
                name="email"
              />
            </FormGroup>

            <CButton type="submit">{t('Send')}</CButton>
          </StyledForm>
        )}
      />
    );
  },
  typePassword: ({ t, dispatchCloseDialog, code }) => {
    return (
      <Formik
        initialValues={{
          password: '',
          passwordConfirmation: '',
          code,
        }}
        onSubmit={(values, { resetForm, setSubmitting }) => {
          fetch(process.env.API_AUTH_CONFIRM_RESET, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          })
            .then(results => results.json())
            .then(data => {
              if (data.jwt) {
                dispatchCloseDialog();
                resetForm({});
                setSubmitting(false);
                toastr.success(
                  'Dziękujemy',
                  'Hasło zostało zresetowanie poprawnie. Możesz się zalogować.',
                );
              } else {
                toastr.error('Wystąpił błąd! Sprawdź wprowadzone hasło');
              }
            });
        }}
        render={props => (
          <StyledForm onSubmit={props.handleSubmit}>
            <H2>{t('title')}</H2>
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
            <FormGroup>
              <CInput
                placeholder={t('Confirm password')}
                type="password"
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                value={props.values.passwordConfirmation || ''}
                name="passwordConfirmation"
              />
            </FormGroup>

            <CButton type="submit">{t('Send')}</CButton>
          </StyledForm>
        )}
      />
    );
  },
};

const ResetPasswordModal = ({
  resetPasswordDialogActive,
  dispatchResetPassword,
  dispatchCloseDialog,
  t,
}) => {
  let params;
  let code;
  if (typeof document !== 'undefined') {
    params = new URL(document.location).searchParams;
    code = params.get('code');
  }

  return (
    <StyledModal show={resetPasswordDialogActive} onHide={dispatchCloseDialog}>
      <Modal.Body>
        {!code
          ? options.initReset({ t, dispatchCloseDialog })
          : options.typePassword({ t, dispatchCloseDialog, code })}
      </Modal.Body>
    </StyledModal>
  );
};

const mapStateToProps = ({ auth: { resetPasswordDialogActive } }) => ({
  resetPasswordDialogActive,
});

const mapDispatchToProps = dispatch => ({
  dispatchResetPassword: args => {
    dispatch(resetPassword(args));
  },
  dispatchCloseDialog: () => {
    dispatch(setResetPasswordDialogActive({ isActive: false }));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation('resetPasswordModal')(ResetPasswordModal));
