import * as React from 'react';
import PropTypes from 'prop-types';
// @ts-expect-error need to migrate helpers to TypeScript
import { createClientRender, ErrorBoundary } from 'test/utils';
import { useFakeTimers } from 'sinon';
import { expect } from 'chai';
import { DataGrid } from '@material-ui/data-grid';
import { getColumnValues } from 'test/utils/helperFn';

describe('<DataGrid />', () => {
  const render = createClientRender();

  const defaultProps = {
    rows: [
      {
        id: 0,
        brand: 'Nike',
      },
      {
        id: 1,
        brand: 'Adidas',
      },
      {
        id: 2,
        brand: 'Puma',
      },
    ],
    columns: [{ field: 'brand', width: 100 }],
  };

  describe('layout', () => {
    before(function beforeHook() {
      if (/jsdom/.test(window.navigator.userAgent)) {
        // Need layouting
        this.skip();
      }
    });

    // Adapation of describeConformance()
    describe('Material-UI component API', () => {
      it(`attaches the ref`, () => {
        const ref = React.createRef<HTMLDivElement>();
        const { container } = render(
          <div style={{ width: 300, height: 300 }}>
            <DataGrid {...defaultProps} ref={ref} />
          </div>,
        );
        expect(ref.current).to.be.instanceof(window.HTMLDivElement);
        expect(ref.current).to.equal(container.firstChild.firstChild.firstChild);
      });

      function randomStringValue() {
        return `r${Math.random().toString(36).slice(2)}`;
      }

      it('applies the className to the root component', () => {
        const className = randomStringValue();

        const { container } = render(
          <div style={{ width: 300, height: 300 }}>
            <DataGrid {...defaultProps} className={className} />
          </div>,
        );

        expect(document.querySelector(`.${className}`)).to.equal(
          container.firstChild.firstChild.firstChild,
        );
      });

      it('should apply the page prop correctly', (done) => {
        const rows = [
          {
            id: 0,
            brand: 'Nike',
          },
          {
            id: 1,
            brand: 'Addidas',
          },
          {
            id: 2,
            brand: 'Puma',
          },
        ];
        render(
          <div style={{ width: 300, height: 300 }}>
            <DataGrid {...defaultProps} rows={rows} page={2} pageSize={1} />
          </div>,
        );
        setTimeout(() => {
          const cell = document.querySelector('[role="cell"][aria-colindex="0"]')!;
          expect(cell).to.have.text('Addidas');
          done();
        }, 50);
      });
    });

    describe('warnings', () => {
      let clock;

      beforeEach(() => {
        clock = useFakeTimers();
      });

      afterEach(() => {
        clock.restore();
      });

      it('should warn if the container has no intrinsic height', () => {
        expect(() => {
          render(
            <div style={{ width: 300, height: 0 }}>
              <DataGrid {...defaultProps} />
            </div>,
          );
          clock.tick(100);
          // @ts-expect-error need to migrate helpers to TypeScript
        }).toWarnDev(
          'Material-UI: useResizeContainer - The parent of the grid has an empty height.',
        );
      });

      it('should warn if the container has no intrinsic width', () => {
        expect(() => {
          render(
            <div style={{ width: 0 }}>
              <div style={{ width: '100%', height: 300 }}>
                <DataGrid {...defaultProps} />
              </div>
            </div>,
          );
          clock.tick(100);
          // @ts-expect-error need to migrate helpers to TypeScript
        }).toWarnDev(
          'Material-UI: useResizeContainer - The parent of the grid has an empty width.',
        );
      });
    });

    describe('column width', () => {
      it('should set the columns width to 100px by default', () => {
        const rows = [
          {
            id: 1,
            username: 'John Doe',
            age: 30,
          },
        ];

        const columns = [
          {
            field: 'id',
          },
          {
            field: 'name',
          },
          {
            field: 'age',
          },
        ];

        const { getAllByRole } = render(
          <div style={{ width: 300, height: 300 }}>
            <DataGrid columns={columns} rows={rows} />
          </div>,
        );

        getAllByRole('columnheader').forEach((col) => {
          // @ts-expect-error need to migrate helpers to TypeScript
          expect(col).toHaveInlineStyle({ width: '100px' });
        });
      });

      it('should set the columns width value to what is provided', () => {
        const rows = [
          {
            id: 1,
            username: 'John Doe',
            age: 30,
          },
        ];

        const colWidthValues = [50, 50, 200];
        const columns = [
          {
            field: 'id',
            width: colWidthValues[0],
          },
          {
            field: 'name',
            width: colWidthValues[1],
          },
          {
            field: 'age',
            width: colWidthValues[2],
          },
        ];

        const { getAllByRole } = render(
          <div style={{ width: 300, height: 300 }}>
            <DataGrid columns={columns} rows={rows} />
          </div>,
        );

        getAllByRole('columnheader').forEach((col, index) => {
          // @ts-expect-error need to migrate helpers to TypeScript
          expect(col).toHaveInlineStyle({ width: `${colWidthValues[index]}px` });
        });
      });

      it('should set the first column to be twice as wide as the second one', () => {
        const rows = [
          {
            id: 1,
            username: 'John Doe',
            age: 30,
          },
        ];

        const columns = [
          {
            field: 'id',
            flex: 1,
          },
          {
            field: 'name',
            flex: 0.5,
          },
        ];

        render(
          <div style={{ width: 200, height: 300 }}>
            <DataGrid columns={columns} rows={rows} />
          </div>,
        );

        const firstColumn = document.querySelector('[role="columnheader"][aria-colindex="1"]');
        const secondColumn: HTMLElement | null = document.querySelector(
          '[role="columnheader"][aria-colindex="2"]',
        );
        const secondColumnWidthVal = secondColumn!.style.width.split('px')[0];
        // @ts-expect-error need to migrate helpers to TypeScript
        expect(firstColumn).toHaveInlineStyle({
          width: `${2 * parseInt(secondColumnWidthVal, 10)}px`,
        });
      });
    });

    describe('state', () => {
      it('should allow to control the state using useState', async () => {
        function GridStateTest({ direction, sortedRows }) {
          const gridState = {
            sorting: { sortModel: [{ field: 'brand', sort: direction }], sortedRows },
          };

          return (
            <div style={{ width: 300, height: 500 }}>
              <DataGrid {...defaultProps} state={gridState} />
            </div>
          );
        }

        const { setProps } = render(<GridStateTest direction={'desc'} sortedRows={[2, 0, 1]} />);
        expect(getColumnValues()).to.deep.equal(['Puma', 'Nike', 'Adidas']);
        setProps({ direction: 'asc', sortedRows: [1, 0, 2] });
        expect(getColumnValues()).to.deep.equal(['Puma', 'Nike', 'Adidas'].reverse());
      });
    });
  });

  describe('warnings', () => {
    before(() => {
      PropTypes.resetWarningCache();
    });

    it('should raise a warning if trying to use an enterprise feature', () => {
      expect(() => {
        PropTypes.checkPropTypes(
          // @ts-ignore
          DataGrid.Naked.propTypes,
          {
            pagination: false,
          },
          'prop',
          'MockedDataGrid',
        );
        // @ts-expect-error need to migrate helpers to TypeScript
      }).toErrorDev('Material-UI: `<DataGrid pagination={false} />` is not a valid prop.');
    });

    it('should throw if the rows has no id', function test() {
      // TODO is this fixed?
      if (!/jsdom/.test(window.navigator.userAgent)) {
        // can't catch render errors in the browser for unknown reason
        // tried try-catch + error boundary + window onError preventDefault
        this.skip();
      }

      const rows = [
        {
          brand: 'Nike',
        },
      ];

      const errorRef = React.createRef();
      expect(() => {
        render(
          <ErrorBoundary ref={errorRef}>
            {/* @ts-expect-error missing id */}
            <DataGrid {...defaultProps} rows={rows} />
          </ErrorBoundary>,
        );
        // @ts-expect-error need to migrate helpers to TypeScript
      }).toErrorDev([
        'The data grid component requires all rows to have a unique id property',
        'The above error occurred in the <ForwardRef(GridComponent)> component',
        'The above error occurred in the <ForwardRef(GridComponent)> component',
      ]);
      expect((errorRef.current as any).errors).to.have.length(1);
      expect((errorRef.current as any).errors[0].toString()).to.include(
        'The data grid component requires all rows to have a unique id property',
      );
    });
  });
});
