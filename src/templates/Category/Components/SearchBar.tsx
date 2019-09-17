import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Formik } from 'formik';
import { toastr } from 'react-redux-toastr';
import { Modal } from 'react-bootstrap/Modal';
import styled from 'styled-components';
import { DatePicker, InlineDatePicker } from 'material-ui-pickers';
import CSelect from '../../../_Components/Panel/CModal';
import * as moment from 'moment';
import { withTranslation } from 'react-i18next';

const StyledForm = styled.form`
  margin-left: -8px;
`;

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

class SearchBar extends React.Component {
  state = {
    age: '',
    name: 'hai',
    labelWidth: 0,
    selectedDate: new Date('2014-08-18T21:11:54'),
  };

  handleChange = selectedDate => {
    console.warn(selectedDate);
  };

  render() {
    const { classes, t } = this.props;
    return (
      <Formik
        initialValues={{
          date: '',
          timeOfDay: '',
        }}
        onSubmit={(values, { resetForm, setSubmitting }) => {}}
        render={props => (
          <StyledForm onSubmit={props.handleSubmit}>
            <FormControl variant="filled" className={classes.formControl}>
              <InlineDatePicker
                keyboard
                clearable
                variant="filled"
                label={t('Select date')}
                format="DD.MM.YYYY"
                onChange={value => props.setFieldValue('date', value)}
                onBlur={props.handleBlur}
                value={props.values.date || new Date()}
                name="date"
              />
            </FormControl>
            <FormControl variant="filled" className={classes.formControl}>
              <InputLabel htmlFor="filled-time-of-day">
                {t('Time of day')}
              </InputLabel>
              <Select
                input={<FilledInput name="timeOfDay" id="filled-time-of-day" />}
                type="select"
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                value={props.values.timeOfDay || 'allDay'}
                name="timeOfDay"
                as="select"
              >
                <MenuItem value="allDay">
                  <em>{t('All day')}</em>
                </MenuItem>
                <MenuItem value="morning">{t('Morning')}</MenuItem>
                <MenuItem value="afternoon">{t('Afternoon')}</MenuItem>
                <MenuItem value="evening">{t('Evening')}</MenuItem>
              </Select>
            </FormControl>
          </StyledForm>
        )}
      />
    );
  }
}

export default withStyles(styles)(withTranslation('category')(SearchBar));
