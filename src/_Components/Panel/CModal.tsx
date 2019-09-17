import * as React from 'react';
// @ts-ignore
import { Field, Formik } from 'formik';
import CTitle from '../Text/CTitle';
import { toastr } from 'react-redux-toastr';
import { Button, Form, FormGroup, FormText, Modal } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import styled from 'styled-components';
import CButton from '../Fields/CButton';
import CInput from '../Fields/CInput';
import CSelect from '../Fields/CSelect';
import CCheckbox from '../Fields/CCheckbox';
import { Link } from 'gatsby';

export interface CModalProps {
  active: boolean;
  onClose?: Function;
}

const StyledModal = styled(Modal)`
  & > .modal-dialog {
    width: 600px;
    max-width: 100%;
    padding: 0.5rem;
  }
  & > .modal-dialog > .modal-content {
    background: rgba(255, 255, 255, 0.995);
    text-align: center;
    padding-top: 2rem !important;
    padding-bottom: 2rem !important;
  }
`;

const StyledForm = styled(Form)`
  display: block;
  max-width: 450px;
  margin: 0 auto;
`;

const Content = styled.p`
  color: #2b2b2b;
  font-size: 14px;
`;

const StyledCButton = styled(CButton)`
  padding: 10px 20px;
`;

const LegalNotice = styled.div`
  font-size: 12px;
  color: #777777;
  text-align: left;
`;

const LegalApproveLabel = styled.p`
  padding-left: 35px;
`;

const StyledLink = styled(Link)`
  color: #f5606d;
  padding-left: 5px;
`;

class CModal extends React.Component<
  CModalProps,
  {
    modalIsOpen: boolean;
  }
> {
  constructor(props: CModalProps) {
    super(props);
    this.state = {
      modalIsOpen: false,
    };
  }

  componentDidUpdate(prevProps: CModalProps) {
    if (prevProps.active !== this.props.active) {
      this.setState({ modalIsOpen: this.props.active });
    }
  }

  afterOpenModal = (): void => {};

  closeModal = (): void => this.props.onClose && this.props.onClose();

  render() {
    const { form } = this.state;
    return (
      <div>
        <StyledModal show={this.state.modalIsOpen} onHide={this.closeModal}>
          <Modal.Body>
            <CTitle>Dołącz za darmo do Carly24</CTitle>
            <br />
            <Content>
              Zostaw nam dane do kontaktu. Wkrótce odezwiemy się do Ciebie.
            </Content>

            <Formik
              initialValues={{
                name: '',
                customerName: '',
                trade: '-1',
                contactInfo: '',
                legal: false,
                legal2: false,
                legal3: false,
              }}
              onSubmit={(values, { resetForm, setSubmitting }) => {
                setTimeout(() => {
                  fetch('https://www.fiemastudio.pl/mail2/mail.php', {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                  });
                  resetForm({});
                  setSubmitting(false);
                }, 1000);
                toastr.success('Dziękujemy', 'Wiadomość została wysłana');
              }}
              render={props => (
                <StyledForm onSubmit={props.handleSubmit}>
                  <FormGroup>
                    <CInput
                      placeholder="Imię i nazwisko"
                      type="text"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.name || ''}
                      name="name"
                    />
                  </FormGroup>
                  <FormGroup>
                    <CInput
                      placeholder="Nazwa serwisu / zakładu"
                      type="text"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.customerName || ''}
                      name="customerName"
                    />
                  </FormGroup>
                  <Form.Group controlId="exampleForm.ControlSelect1">
                    <CSelect
                      type="select"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.trade || '-1'}
                      name="trade"
                      as="select"
                    >
                      <option disabled value="-1" key="-1">
                        Branża
                      </option>
                      <option>Warsztat samochodowy</option>
                      <option>Stacja kontroli pojazdów</option>
                      <option>Auto SPA / myjnia samochodowa</option>
                      <option>Zakład wulkanizacji</option>
                      <option>Serwis tuningowy</option>
                      <option>Inne</option>
                    </CSelect>
                  </Form.Group>
                  <FormGroup>
                    <CInput
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.contactInfo || ''}
                      name="contactInfo"
                      placeholder="E-mail / nr telefonu"
                    />
                  </FormGroup>
                  <Row>
                    <Col className="text-left">
                      <Field
                        name="legal"
                        value={props.values.legal}
                        render={({ field, form }) => (
                          <CCheckbox
                            id="legal"
                            type="checkbox"
                            onChange={e => {
                              props.handleChange(e);
                              console.warn(form);
                              form.setFieldValue('legal2', true);
                              form.setFieldValue('legal3', true);
                            }}
                            onBlur={props.handleBlur}
                            value={props.values.legal}
                            name="legal"
                            required
                          >
                            Akceptuję{' '}
                            <StyledLink to="/regulamin">
                              Regulamin Portalu
                            </StyledLink>
                            *<br />
                            <br />
                          </CCheckbox>
                        )}
                      />
                      <LegalApproveLabel>
                        Wyrażam zgodę na otrzymywanie od UmawiajOnline.
                        informacji marketingowych przedstawianych za
                        pośrednictwem:
                      </LegalApproveLabel>
                      <CCheckbox
                        id="legal2"
                        type="checkbox"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.legal2}
                        name="legal2"
                      >
                        E-mail
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
                      >
                        Połączeń telefonicznych
                        <br />
                        <br />
                      </CCheckbox>
                    </Col>
                    <Col md="auto">
                      <StyledCButton type="submit">Wyślij</StyledCButton>
                    </Col>
                  </Row>
                  {props.errors.name && (
                    <div id="feedback">{props.errors.name}</div>
                  )}

                  <LegalNotice>
                    <p>Administratorem danych osobowych jest *** </p>

                    <p>
                      Podanie danych jest dobrowolne i jest warunkiem udzielenia
                      odpowiedzi na przesłane zapytanie, a ich niepodanie
                      uniemożliwi udzielenie odpowiedzi. Dane będą przetwarzane
                      w celu udzielenia odpowiedzi na przesłane zapytanie
                      (podstawa prawna: prawnie uzasadniony interes
                      administratora) oraz ustalania i dochodzenia ewentualnych
                      roszczeń (podstawa prawna: prawnie uzasadniony interes
                      administratora).
                    </p>
                  </LegalNotice>
                </StyledForm>
              )}
            />
          </Modal.Body>
        </StyledModal>
      </div>
    );
  }
}

export default CModal;
