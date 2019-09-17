import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import { withTranslation } from 'react-i18next';
import gql from 'graphql-tag';
import { withLayout } from '../_Components/Layout';
import { getTokenId } from '../_Components/utils/getToken';
import CButton from '../_Components/Fields/CButton';
import { toastr } from 'react-redux-toastr';
import styled from 'styled-components';
import StarList from '../_Components/Fields/StarList';
import * as moment from 'moment';
import UserLayout from '../_Components/Layout/UserLayout/UserLayout';
import { Link } from 'gatsby';

// service {
//   id
//   name
// }

const ORDERS_QUERY = gql`
  query OrdersQuery($where: JSON) {
    orders(where: $where) {
      id
      name
      order_date
      status
      rating
      business {
        id
        name
      }
      calendarevent {
        id
        start_date
        end_date
      }
      servicedetail {
        name
      }
    }
  }
`;

const UPDATE_ORDER_QUERY = gql`
  mutation($input: updateOrderInput) {
    updateOrder(input: $input) {
      order {
        id
        name
      }
    }
  }
`;

const StyledCButton = styled(CButton)`
  padding: 8px 15px !important;
  font-weight: 400 !important;
`;

class OrdersPage extends React.Component<{}, {}> {
  resign = id => {
    const { updateOrderQuery } = this.props;
    updateOrderQuery({
      variables: {
        input: { data: { status: 'anulowane' }, where: { id } },
      },
    }).then(res => {
      toastr.success('Rezerwacja została anulowana');
      this.props.ordersQuery.refetch();
    });
  };

  componentDidMount(): void {
    this.props.ordersQuery.refetch();
  }

  onRate = (rating, id) => {
    console.warn(rating);
    const { updateOrderQuery } = this.props;
    updateOrderQuery({
      variables: {
        input: {
          data: {
            rating,
          },
          where: { id },
        },
      },
    });
  };

  render() {
    const {
      ordersQuery: { orders },
    } = this.props;
    return getTokenId() ? (
      <UserLayout>
        <br />
        <br />
        <Table style={{ width: '100%' }}>
          <tr>
            <th>ID</th>
            <th>Tytuł</th>
            <th>Firma</th>
            <th>Usługa</th>
            <th>Data wizyty</th>
            <th>Data złożenia</th>
            <th>Status</th>
            <th />

            <th>Ocena</th>
          </tr>
          {orders &&
            orders.map(
              ({
                id,
                name,
                business,
                rating,
                status, // service,
                servicedetail,
                order_date,
                calendarevent,
              }) => {
                const isDone =
                  new Date() >
                  new Date(calendarevent && calendarevent.start_date);
                return (
                  <React.Fragment>
                    <tr style={{ background: isDone && '#d8ffd3' }}>
                      <td>#{id}</td>
                      <td>{name}</td>
                      <td>
                        {business && (
                          <Link to={'/business?id=' + business.id}>
                            {business.name}
                          </Link>
                        )}
                      </td>
                      {/*<td>{service && service.name}</td>*/}
                      <td>{servicedetail && servicedetail.name}</td>
                      <td>
                        {moment(
                          calendarevent && calendarevent.start_date,
                        ).format('DD.MM.YYYY HH:mm')}
                      </td>
                      <td>{moment(order_date).format('DD.MM.YYYY HH:mm')}</td>
                      <td>{status}</td>
                      <td>
                        {(status === 'oplacone' || status === 'nieoplacone') &&
                          moment(calendarevent && calendarevent.start_date) >
                            moment()
                              .startOf('day')
                              .subtract(1, 'day') && (
                            <StyledCButton onClick={() => this.resign(id)}>
                              Odwołaj
                            </StyledCButton>
                          )}
                      </td>
                      <td
                        style={{ width: '150px' }}
                        title={
                          !isDone && 'Wystawienie oceny możliwe po wizycie'
                        }
                      >
                        <StarList
                          rate={rating}
                          ratingChanged={rate => this.onRate(rate, id)}
                          edit={isDone}
                        />
                      </td>
                    </tr>
                  </React.Fragment>
                );
              },
            )}
        </Table>
      </UserLayout>
    ) : (
      <React.Fragment>Brak uprawnień</React.Fragment>
    );
  }
}

export default compose(
  graphql(ORDERS_QUERY, {
    name: 'ordersQuery',
    options: { variables: { where: { user: getTokenId() } } },
  }),
  graphql(UPDATE_ORDER_QUERY, {
    name: 'updateOrderQuery',
  }),
)(withTranslation('homePage')(OrdersPage));
