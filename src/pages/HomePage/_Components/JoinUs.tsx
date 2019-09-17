import * as React from 'react';
import styled from 'styled-components';
import CButton from '../../../_Components/Fields/CButton';
import { withTranslation } from 'react-i18next';

const Area = styled.div`
  display: flex;
  align-items: center;
  background-color: #f3f5fa;
  padding: 30px 35px;
  border-radius: 16px;
  max-width: 940px;
  margin: 50px auto 0;

  @media (max-width: 800px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Content = styled.p`
  margin: 10px 10px 0 0;
  color: #2b2b2b;
  font-weight: 600;
  flex: 1 1 100%;
`;

const StyledCButton = styled(CButton)`
  white-space: nowrap;
  margin: 10px 0;
`;

export interface JoinUsProps {
  onActionCall: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const JoinUs = ({ onActionCall, t }: JoinUsProps) => (
  <Area>
    <Content>{t('Join us title')}</Content>
    <StyledCButton onClick={onActionCall}>{t('Join us btn')}</StyledCButton>
  </Area>
);

export default withTranslation('businessLP')(JoinUs);
