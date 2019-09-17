import * as React from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';
import Logo from '../../../assets/img/logo.png';
import CButton from '../../../_Components/Fields/CButton';
import { withTranslation } from 'react-i18next';
import Slider1 from '../img/slider1.jpg';

// import { H1, H2 } from "../../../_Components/Text/CHeadline";

const Area = styled.div`
  background: #ff0000;
  width: 100%;
  min-height: 550px;
  background: url(${Slider1}) 50% 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 26px 20px 76px;
  text-align: center;
  color: #fff;
`;

const H1 = styled.h1`
  font-size: 41px;
  line-height: 1.5;
  font-weight: 600;
  white-space: pre;
`;

const H2 = styled.h2`
  font-size: 18px;
  line-height: 1.6;
  font-weight: 400;
  white-space: pre;
`;

const CallToAction = styled.div`
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: 600;
`;

const Label = styled.span`
  display: block;
  margin: 0 25px;
`;

const NavBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  @media (max-width: 800px) {
    flex-direction: column;
  }
`;

const NavBarMenu = styled.div`
  min-width: 120px;
`;

const NavBarMenuItem = styled.div`
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  padding: 10px 0;
`;

export interface SliderProps {
  onActionCall: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Slider = ({ onActionCall, t }: SliderProps) => (
  <Area>
    <NavBar>
      <NavBarMenu />
      <Link to="/">
        <img src={Logo} alt="" />
      </Link>
      <NavBarMenu>
        <NavBarMenuItem>{/*Zarejestruj się*/}</NavBarMenuItem>
      </NavBarMenu>
    </NavBar>
    <header>
      <H1>{t('slider title')}</H1>
      <H2>{t('slider slogan')}</H2>
    </header>
    <CallToAction>
      <CButton onClick={onActionCall} className="btn-lg">
        {t('slider btn')}
      </CButton>
    </CallToAction>
  </Area>
);

export default withTranslation('businessLP')(Slider);
