import styled from "styled-components";

export default styled.span`
  color: #f5606d;
  cursor: pointer;
  ${({ mode }) => mode === "bold" && `font-weight: bold`};
`;
