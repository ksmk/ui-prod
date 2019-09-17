import * as React from 'react';
import { Component } from 'react';
import { withLayout } from '../_Components/Layout';
import styled from 'styled-components';
import UserLayout from '../_Components/Layout/UserLayout/UserLayout';
import Step1 from '../_Routes/Kroki/Step1';
import Step2 from '../_Routes/Kroki/Step2';
import Step3 from '../_Routes/Kroki/Step3';

const KrokiBody = styled.div``;

interface IProps {}

interface IState {
  step: number;
  selectedCatId: number;
  customCatName: string;
}

export enum STEPS {
  FIRST,
  SECOND,
  THIRD,
}

class Kroki extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      step: STEPS.FIRST,
      selectedCatId: null,
      customCatName: '',
    };
  }

  onChangeStep = (step: number) => this.setState({ step });

  options = {
    [STEPS.FIRST]: () => {
      const onCatSelect = (selectedCatId: number) =>
        this.setState({ selectedCatId });

      const onCatInputChange = ({ target: { value } }) =>
        this.setState({ customCatName: value });
      const { selectedCatId, customCatName } = this.state;
      return (
        <Step1
          customCatName={customCatName}
          selectedCatId={selectedCatId}
          onCatSelect={onCatSelect}
          onCatInputChange={onCatInputChange}
          onChangeStep={this.onChangeStep}
        />
      );
    },
    [STEPS.SECOND]: () => {
      return <Step2 onChangeStep={this.onChangeStep} />;
    },
    [STEPS.THIRD]: () => {
      const onCatSelect = (selectedCatId: number) =>
        this.setState({ selectedCatId });

      const onCatInputChange = ({ target: { value } }) =>
        this.setState({ customCatName: value });
      const { selectedCatId, customCatName } = this.state;
      return (
        <Step3
          customCatName={customCatName}
          selectedCatId={selectedCatId}
          onCatSelect={onCatSelect}
          onCatInputChange={onCatInputChange}
          onChangeStep={this.onChangeStep}
        />
      );
    },
  };

  render() {
    const { step } = this.state;
    return <UserLayout>{this.options[step]()}</UserLayout>;
  }
}

export default Kroki;
