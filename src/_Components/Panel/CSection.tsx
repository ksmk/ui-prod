import * as React from 'react';
import styled from 'styled-components';
import CTitle from '../Text/CTitle';

const Wrapper = styled.div<{ direction: string }>`
  display: flex;
  align-items: flex-start;
  ${({ direction }) => direction === 'rtl' && 'flex-direction: row-reverse;'}
  max-width: 1190px;
  padding: 0 30px;
  margin: 50px auto 0;

  @media (max-width: 800px) {
    flex-direction: initial;
    text-align: center;
  }
`;

const Content = styled.div`
  padding: 0 60px 0;
`;

const Banner = styled.img`
  @media (max-width: 800px) {
    display: none;
  }
`;

export interface CSectionProps {
  title: string;
  direction?: string;
  imgSrc: any;
  content?: Function;
}

const CSection = ({
  title,
  direction = 'ltr',
  imgSrc,
  content,
}: CSectionProps) => (
  <Wrapper direction={direction}>
    <Content>
      {!content && [<br />, <br />]}
      <CTitle>{title}</CTitle>
    </Content>
    <Banner src={imgSrc} alt="banner" />
  </Wrapper>
);

export default CSection;
