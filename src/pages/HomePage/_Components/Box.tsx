import styled from 'styled-components';

export const BoxHeader = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  font-size: 16px;
  color: #2b2b2b;
  font-weight: 600;
  padding: 15px 0;
`;

export const BoxContent = styled.p`
  color: #2b2b2b;
  font-size: 14px !important;
  text-align: justify;
`;

export const BoxImage = styled.div<{ empty?: boolean }>`
  display: flex;
  height: 110px;
  width: 100%;
  align-items: center;
  & > img {
    margin: 0 auto;
    max-width: 100%;
    max-height: 100%;
  }

  ${({ empty }) =>
    empty &&
    `
    &::after {
        content: '';
        display: block;
        margin: 0 auto;
        width: 50px;
        height: 50px;
        border-radius: 50px;
        background-color: #f3f5fa;
    }`}
`;

export default styled.div``;
