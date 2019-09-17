import * as React from 'react';
import { Component } from 'react';
import styled from 'styled-components';
import CButton from '../../_Components/Fields/CButton';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import PhotoImg from './photo.png';
import CInput from '../../_Components/Fields/CInput';
import { Form, Formik } from 'formik';
import { toastr } from 'react-redux-toastr';
import { H2 } from '../../_Components/Text/CHeadline';
import { FormGroup } from 'react-bootstrap';
import { STEPS } from '../../pages/kroki';
import Dropzone from 'react-dropzone';

const Step2Body = styled.div`
  margin: 0 -50px;
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: 400;
  margin: 40px 50px;
`;

const Panel = styled.div`
  background-color: #e9e9e9;
  border: 2px solid #e9e9e9;
`;

const PanelHeader = styled.div`
  padding: 40px 48px;
  display: flex;
`;

const PanelHeaderDesc = styled.div`
  flex-grow: 1;
`;

const PanelHeaderTitle = styled.div`
  font-size: 22px;
  font-weight: 700;
`;

const PanelHeaderSubtitle = styled.div`
  font-size: 15px;
  color: #9d9d9d;
`;

const PanelBody = styled.div`
  background-color: #fff;
  border-radius: 10px;
`;

const Wrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 50px 20px;
`;

const StyledForm = styled(Form)`
  background-color: #d6d9dd;
  padding: 30px 20px;
  border-radius: 10px;
  max-width: 580px;
  margin: 0 auto;
`;

const StyledCButton = styled(CButton)`
  background-color: #50c132 !important;
  outline: none;
`;

const StyledCInput = styled(CInput)`
  background-color: #fff !important;
`;

const Address = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledCTextarea = styled(CInput)`
  min-height: 200px;
  width: 100%;
  margin-bottom: 10px;
  padding-top: 20px !important;
  background-color: #fff !important;
`;

const CFileInput = styled.section`
  font-size: 17px !important;
  font-weight: 700 !important;
  padding: 0 20px !important;
  border: 0 !important;
  height: 60px !important;
  align-items: center;
  display: flex;
  
  background: #fff url('${PhotoImg}') no-repeat 95% 50%;
  margin-bottom: 20px;
  color: #858585;
`;

interface IProps {
  onChangeStep: (step: number) => void;
}

class Step2 extends Component<IProps> {
  render() {
    const { onChangeStep } = this.props;

    return (
      <Step2Body>
        <Title>Konfiguruj profil</Title>

        <Panel>
          <PanelHeader>
            <PanelHeaderDesc>
              <PanelHeaderTitle>
                2/3 Podaj podstawowe informacje
              </PanelHeaderTitle>
              <PanelHeaderSubtitle>
                Ważne, aby Twój profil był dobrze opisany. Użytkownicy Carly24,
                lubią przeczytaćna Twój temat, zanim zarezerwują termin.
              </PanelHeaderSubtitle>
            </PanelHeaderDesc>
            <StyledCButton onClick={() => onChangeStep(STEPS.THIRD)}>
              Dalej
            </StyledCButton>
          </PanelHeader>
          <PanelBody>
            <Wrapper>
              <Formik
                initialValues={{
                  email: '',
                  street: '',
                  street_number: '',
                  flat_number: '',
                  name: '',
                  about: '',
                  phone_number: '',
                  city: '',
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
                    <FormGroup>
                      <StyledCInput
                        placeholder="Nazwa firmy (wyświetlana dla użytkowników)"
                        type="text"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.name || ''}
                        name="name"
                      />
                    </FormGroup>
                    <FormGroup>
                      <StyledCTextarea
                        placeholder="Opis firmy"
                        type="text"
                        as="textarea"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.about || ''}
                        name="about"
                      />
                    </FormGroup>
                    <FormGroup>
                      <StyledCInput
                        placeholder="Numer telefonu"
                        type="text"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.phone_number || ''}
                        name="phone_number"
                      />
                    </FormGroup>
                    <FormGroup>
                      <StyledCInput
                        placeholder="Miejscowość"
                        type="text"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.city || ''}
                        name="ciity"
                      />
                    </FormGroup>
                    <FormGroup>
                      <StyledCInput
                        placeholder="Ulica"
                        type="text"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.street || ''}
                        name="street"
                      />
                    </FormGroup>
                    <Address>
                      <FormGroup>
                        <StyledCInput
                          placeholder="Numer"
                          type="text"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          value={props.values.street_number || ''}
                          name="street_number"
                        />
                      </FormGroup>
                      <FormGroup>
                        <StyledCInput
                          placeholder="Numer lokalu"
                          type="text"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          value={props.values.flat_number || ''}
                          name="flat_number"
                        />
                      </FormGroup>
                    </Address>

                    <Dropzone
                      onDrop={acceptedFiles => console.log(acceptedFiles)}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <section>
                          <CFileInput {...getRootProps()}>
                            <input {...getInputProps()} />
                            <div>Dodaj logo firmy</div>
                          </CFileInput>
                        </section>
                      )}
                    </Dropzone>

                    <Dropzone
                      onDrop={acceptedFiles => console.log(acceptedFiles)}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <section>
                          <CFileInput {...getRootProps()}>
                            <input {...getInputProps()} />
                            <div>Dodaj zdjęcie w tle</div>
                          </CFileInput>
                        </section>
                      )}
                    </Dropzone>

                    <Dropzone
                      onDrop={acceptedFiles => console.log(acceptedFiles)}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <section>
                          <CFileInput {...getRootProps()}>
                            <input {...getInputProps()} />
                            <div>Dodaj dodatkowe zdjęcie (1)</div>
                          </CFileInput>
                        </section>
                      )}
                    </Dropzone>

                    <Dropzone
                      onDrop={acceptedFiles => console.log(acceptedFiles)}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <section>
                          <CFileInput {...getRootProps()}>
                            <input {...getInputProps()} />
                            <div>Dodaj dodatkowe zdjęcie (2)</div>
                          </CFileInput>
                        </section>
                      )}
                    </Dropzone>
                  </StyledForm>
                )}
              />
            </Wrapper>
          </PanelBody>
        </Panel>
      </Step2Body>
    );
  }
}

export default Step2;
