import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import Base from './Base';

describe('Base', () => {
  const view = {
    get: '/get',
    update: '/update',
    delete: '/delete',
    query: {},
    object: 'example',
  };

  const appProps = {
    viewData: [],
    currentViewProps: [],
  };

  const onChangeAppProps = jest.fn();

  const props = {
    view,
    appProps,
    onChangeAppProps,
  };


  test('renders table after data is fetched', async () => {
    const viewData = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
    jest.spyOn(global, 'fetch').mockImplementation(() => {
      return Promise.resolve({
        json: () => Promise.resolve(viewData),
      });
    });

    const { getByText } = render(<Base {...props} appProps={{ ...appProps, viewData }} />);
    await waitFor(() => expect(getByText('Alice')).toBeInTheDocument());
    expect(getByText('Bob')).toBeInTheDocument();

    global.fetch.mockRestore();
  });

});