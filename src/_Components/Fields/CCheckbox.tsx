import * as React from "react";
import styled from "styled-components";
import { Form } from "react-bootstrap";

const Checkbox = styled(Form.Check.Input)`
  color: #2b2b2b;
  padding: 10px !important;
  opacity: 0;
  position: absolute;
  
  ~ .checkmark {
    background-color: #eff1f2;
    height: 25px;
    width: 25px;
    margin-right: 10px;
    border-radius: 8px;
  }
  
  &:checked ~ .checkmark {
    background-color: #f5606d;
    
    &::after {
        position: absolute;
        content: '',
        left: 10px;
        top: 6px;
        width: 7px;
        height: 12px;
        border: solid white;
        border-width: 0 3px 3px 0;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
    }
  }
`;

const StyledFormCheck = styled(Form.Check)`
  padding-left: 0 !important;
`;

const StyledFormCheckLabel = styled(Form.Check.Label)`
  font-size: 17px;
  color: #2b2b2b !important;
  display: flex;
`;

export default ({ value, children, id, ...props }) => (
  <StyledFormCheck>
    <StyledFormCheckLabel id={id}>
      <Checkbox checked={!!value} value={value} {...props} />
      <span className="checkmark" />
      {children}
    </StyledFormCheckLabel>
  </StyledFormCheck>
);
