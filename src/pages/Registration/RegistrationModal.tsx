import { Form, FormGroup, Modal } from 'react-bootstrap';
import * as React from 'react';
import styled from 'styled-components';
import { Field, Formik } from 'formik';
import { toastr } from 'react-redux-toastr';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import CInput from '../../_Components/Fields/CInput';
import CButton from '../../_Components/Fields/CButton';
import { connect } from 'react-redux';
import { login } from '../../_Resources/Auth/Actions/login';
import { setLoginDialogActive } from '../../_Resources/Auth/Actions/setLoginDialogActive';
import { H1, H2 } from '../../_Components/Text/CHeadline';
import { setRegistrationDialogActive } from '../../_Resources/Auth/Actions/setRegistrationDialogActive';
import { registration } from '../../_Resources/Auth/Actions/registration';
import { withTranslation } from 'react-i18next';
import CCheckbox from '../../_Components/Fields/CCheckbox';
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import Col from '../../_Components/Panel/CModal';

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

const SIGN_IN = gql`
  mutation($input: createUserInput) {
    createUser(input: $input) {
      user {
        id
        username
      }
    }
  }
`;

const Approval = styled.div`
  font-size: 0.8em;
`;

class RegistrationModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
    };
  }

  goToStep = (step: number, ev) => {
    if (ev) {
      ev.preventDefault();
    }
    this.setState({ step });
  };

  render() {
    const {
      registrationDialogActive,
      dispatchRegistration,
      dispatchCloseDialog,
      signIn,
      t,
    } = this.props;
    const { step } = this.state;
    return (
      <StyledModal show={registrationDialogActive} onHide={dispatchCloseDialog}>
        <Modal.Body>
          <Formik
            initialValues={{
              identifier: '',
              firstname: '',
              lastname: '',
              admin_layout: 'author',
              phone_number: '',
              registration_number: '',
              password: '',
              legalAll: false,
              legal1: false,
              legal2: false,
              legal3: false,
              legal4: false,
            }}
            onSubmit={(
              {
                identifier,
                firstname,
                lastname,
                admin_layout,
                phone_number,
                registration_number,
                password,
              },
              { resetForm, setSubmitting },
            ) => {
              const values = {
                username: identifier,
                email: identifier,
                admin_layout,
                firstname,
                lastname,
                registration_number,
                phone_number,
                password,
              };
              fetch(`${process.env.API_AUTH}/register`, {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
              })
                .then(results => results.json())
                .then(
                  ({ user }) => {
                    if (user && user.id) {
                      dispatchRegistration(user);
                      resetForm({});
                      setSubmitting(false);
                      toastr.success(
                        'Na Twoją skrzynkę przesłaliśmy link aktywacyjny.',
                      );
                    } else {
                      toastr.error('Błąd! E-mail jest już w bazie');
                    }
                  },
                  error =>
                    toastr.error(
                      'Błąd! E-mail mógł zostać już wykorzystany do rejestracji',
                    ),
                );
            }}
            render={props => (
              <StyledForm onSubmit={props.handleSubmit}>
                {step === 1 ? (
                  <React.Fragment>
                    <H2>{t('title')}</H2>
                    <br />
                    <FormGroup>
                      <FormControl component="fieldset">
                        <FormLabel component="legend">
                          {t('accountType')}
                        </FormLabel>
                        <RadioGroup
                          aria-label="admin-layout"
                          name="admin_layout"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          value={props.values.admin_layout}
                        >
                          <FormControlLabel
                            value="author"
                            control={<Radio color="primary" />}
                            label={t('b2c')}
                          />
                          <FormControlLabel
                            value="editor"
                            control={<Radio color="primary" />}
                            label={t('b2b')}
                          />
                        </RadioGroup>
                      </FormControl>
                    </FormGroup>
                    {props.values.admin_layout === 'editor' && (
                      <React.Fragment>
                        <a target="_blank" href="">
                          {t('Prices')}
                        </a>

                        <br />
                        <br />
                      </React.Fragment>
                    )}
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
                        placeholder={t('First name')}
                        type="text"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.firstname || ''}
                        name="firstname"
                      />
                    </FormGroup>
                    <FormGroup>
                      <CInput
                        placeholder={t('Last name')}
                        type="text"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.lastname || ''}
                        name="lastname"
                      />
                    </FormGroup>
                    <FormGroup>
                      <CInput
                        placeholder={t('Phone number')}
                        type="text"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.phone_number || ''}
                        name="phone_number"
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
                    <CButton onClick={ev => this.goToStep(2, ev)}>
                      Dalej
                    </CButton>
                    <br />
                    <br />

                    {props.values.admin_layout !== 'editor' && (
                      <a
                        href={`https://api.umawiajonline.pl/connect/facebook`}
                        className="link"
                      >
                        <StyledCButton type="button" social="facebook">
                          <i className={`fab fa-facebook`} />
                          Zarejestruj przez Facebooka
                        </StyledCButton>
                      </a>
                    )}
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <H2
                      style={{ cursor: 'pointer' }}
                      onClick={() => this.goToStep(1)}
                    >
                      &lt; Ustawienia prywatności
                    </H2>

                    <Field
                      name="legal"
                      value={props.values.legalAll}
                      render={({ field, form }) => (
                        <CCheckbox
                          id="legal"
                          type="checkbox"
                          onChange={e => {
                            props.handleChange(e);
                            form.setFieldValue('legal1', true);
                            form.setFieldValue('legal2', true);
                            form.setFieldValue('legal3', true);
                            form.setFieldValue('legal4', true);
                          }}
                          onBlur={props.handleBlur}
                          value={props.values.legalAll}
                          name="legalAll"
                        >
                          <strong>Zaznacz wszystkie</strong>
                          <br />
                          <br />
                        </CCheckbox>
                      )}
                    />
                    <CCheckbox
                      id="legal1"
                      type="checkbox"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.legal1}
                      name="legal1"
                      required
                    >
                      Zgoda na przesyłanie ofert
                      <br />
                      <br />
                    </CCheckbox>

                    <CCheckbox
                      id="legal2"
                      type="checkbox"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.legal2}
                      name="legal2"
                      required
                    >
                      Zgoda na komunikację elektroniczną
                      <br />
                      <br />
                    </CCheckbox>
                    <CCheckbox
                      id="legal3"
                      type="checkbox"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.legal3}
                      name="legal3"
                      required
                    >
                      Zgoda na profilowanie
                      <br />
                      <br />
                    </CCheckbox>
                    <CCheckbox
                      id="legal4"
                      type="checkbox"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.legal4}
                      name="legal4"
                      required
                    >
                      Potwierdzenie zapoznania się z obowiązkiem informacyjnym
                      <br />
                      <br />
                    </CCheckbox>

                    <Approval>
                      <p>
                        Informujemy Cię, że przetwarzamy Twoje dane osobowe -
                        <br />
                        szczegółowe informacje znajdziesz poniżej:
                      </p>

                      <p>
                        <strong>
                          Administratorzy danych osobowych
                          (współadministratorzy)
                        </strong>
                        <br />
                        Współadministratorami Twoich danych są wspólnie:
                        <br />
                        ***
                        <br />
                      </p>

                      <p>
                        <strong>
                          Dane kontaktowe umawiajonline - punkt kontaktowy dla
                          obu współadministratorów
                        </strong>
                        <br />
                        1. Telefonicznie: 654***654
                        <br />
                        2. Pod adresem e-mail: iod@umawiajonline.pl
                        <br />
                        3. Pisemnie, przesyłając korespondencję na adres: *****
                      </p>
                    </Approval>
                    <br />
                    <br />
                    <CButton type="submit">{t('Send')}</CButton>
                  </React.Fragment>
                )}
              </StyledForm>
            )}
          />
        </Modal.Body>
      </StyledModal>
    );
  }
}

const mapStateToProps = ({ auth: { registrationDialogActive } }) => ({
  registrationDialogActive,
});

const mapDispatchToProps = dispatch => ({
  dispatchRegistration: args => {
    dispatch(registration(args));
  },
  dispatchCloseDialog: () => {
    dispatch(setRegistrationDialogActive({ isActive: false }));
  },
});

export default graphql(SIGN_IN, { name: 'signIn' })(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(withTranslation('registrationModal')(RegistrationModal)),
);
