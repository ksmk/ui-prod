import styled from 'styled-components';
import Button from 'react-bootstrap/Button';

const CButton = styled(Button)`
  background-color: #f5606d !important;
  font-size: 17px !important;
  font-weight: 600 !important;
  padding: 17px 38px !important;
  border: 0 !important;

  &:hover {
    background-color: #de505d !important;
  }
`;

export default CButton;
