import * as React from 'react';
import { Component } from 'react';
import styled from 'styled-components';
import CButton from '../../_Components/Fields/CButton';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import CInput from '../../_Components/Fields/CInput';
import { STEPS } from '../../pages/kroki';

const Step1Body = styled.div`
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

const SelectList = styled.div`
  display: grid;
  grid-column-gap: 30px;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
`;

const SelectBox = styled.div<{ active: boolean }>`
  cursor: pointer;
  min-height: 120px;
  padding: 20px 10px;
  border: 4px solid #d6d9dd;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  box-shadow: 5px 5px 8px #d6d9dd;

  ${({ active }) => active && `background-color: #d6d9dd;`}
`;

const InputBox = styled.div`
  background-color: #d6d9dd;
  display: flex;
  border: 10px solid transparent;
  border-radius: 10px;
  margin-top: 35px;
  align-items: center;
`;

const InputBoxTitle = styled.div`
  font-size: 15px;

  font-weight: 600;
  padding: 0 30px;
`;

const StyledCInput = styled(CInput)`
  background-color: #fff !important;
`;

const StyledCButton = styled(CButton)`
  background-color: #50c132 !important;
  outline: none;
`;

interface IProps {
  selectedCatId: number;
  onCatSelect: (id: number) => void;
  customCatName: string;
  onChangeStep: (step: number) => void;
}

const CAT_QUERY = gql`
  query CatQuery {
    categories {
      id
      name
      slug
    }
  }
`;

class Step1 extends Component<IProps> {
  render() {
    const {
      catQuery,
      selectedCatId,
      customCatName,
      onCatSelect,
      onCatInputChange,
      onChangeStep,
    } = this.props;
    const categories = (catQuery && catQuery.categories) || [];

    return (
      <Step1Body>
        <Title>Konfiguruj profil</Title>

        <Panel>
          <PanelHeader>
            <PanelHeaderDesc>
              <PanelHeaderTitle>1/3 Wybierz kategorię</PanelHeaderTitle>
              <PanelHeaderSubtitle>Wybierz swoją kategorię</PanelHeaderSubtitle>
            </PanelHeaderDesc>
            <StyledCButton onClick={() => onChangeStep(STEPS.SECOND)}>
              Dalej
            </StyledCButton>
          </PanelHeader>
          <PanelBody>
            <Wrapper>
              <SelectList>
                {categories.map(({ id, name }) => (
                  <SelectBox
                    active={selectedCatId === id}
                    onClick={() => onCatSelect(id)}
                  >
                    {name}
                  </SelectBox>
                ))}

                <SelectBox
                  onClick={() => onCatSelect(null)}
                  active={selectedCatId === null}
                >
                  Inne
                </SelectBox>
              </SelectList>

              {selectedCatId === null && (
                <InputBox>
                  <InputBoxTitle>Wpisz</InputBoxTitle>
                  <StyledCInput
                    name="customCat"
                    value={customCatName}
                    onChange={onCatInputChange}
                    placeholder="Zakład tuningowy"
                  />
                </InputBox>
              )}
            </Wrapper>
          </PanelBody>
        </Panel>
      </Step1Body>
    );
  }
}

export default graphql(CAT_QUERY, {
  name: 'catQuery',
})(Step1);
