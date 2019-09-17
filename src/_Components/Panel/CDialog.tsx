import * as React from 'react';
// @ts-ignore
import { Field, Formik } from 'formik';
import CTitle from '../Text/CTitle';
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

class CDialog extends React.Component<
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
    const { children, className } = this.props;
    const { form } = this.state;
    return (
      <StyledModal
        className={className}
        show={this.state.modalIsOpen}
        onHide={this.closeModal}
      >
        <Modal.Body>{children}</Modal.Body>
      </StyledModal>
    );
  }
}

export default CDialog;
