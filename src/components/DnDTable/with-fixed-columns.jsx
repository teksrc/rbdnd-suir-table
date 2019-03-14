// @flow
import React, { Component, Fragment } from 'react';
import styled from '@emotion/styled';
import { colors } from '@atlaskit/theme';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import reorder from './reorder';
import { grid } from './constants';

const Table = styled.table`
  width: 500px;
  margin: 0 auto;
  table-layout: ${props => props.layout};
`;

const TBody = styled.tbody`
  border: 0;
`;

const THead = styled.thead`
  border: 0;
  border-bottom: none;
  background-color: ${colors.N50};
`;

const Row = styled.tr`
  /* stylelint-disable comment-empty-line-before */
  ${props =>
    props.isDragging
      ? `
    background: ${colors.G100};

    /* maintain cell width while dragging */
    display: table;
  `
      : ''} /* stylelint-enable */;
`;

const Cell = styled.td`
  box-sizing: border-box;
  padding: ${grid}px;

  /* locking the width of the cells */
  width: 50%;
`;

class TableRow extends Component {
  render() {
    const { snapshot, quote, provided } = this.props;
    return (
      <Row
        ref={provided.innerRef}
        isDragging={snapshot.isDragging}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        <Cell>{quote.author.name}</Cell>
        <Cell>{quote.content}</Cell>
      </Row>
    );
  }
}

const Header = styled.header`
  display: flex;
  flex-direction: column;
  width: 500px;
  margin: 0 auto;
  margin-bottom: ${grid * 2}px;
`;

/* stylelint-disable block-no-empty */
const LayoutControl = styled.div``;

const CopyTableButton = styled.button``;
/* stylelint-enable */


export default class TableApp extends Component {
  // eslint-disable-next-line react/sort-comp
  tableRef;

  state = {
    quotes: this.props.initial,
    layout: 'auto',
  };

  onDragEnd = (result) => {
    // dropped outside the list
    if (
      !result.destination ||
      result.destination.index === result.source.index
    ) {
      return;
    }

    // no movement
    if (result.destination.index === result.source.index) {
      return;
    }

    const quotes = reorder(
      this.state.quotes,
      result.source.index,
      result.destination.index,
    );

    this.setState({
      quotes,
    });
  };

  toggleTableLayout = () => {
    this.setState({
      layout: this.state.layout === 'auto' ? 'fixed' : 'auto',
    });
  };

  copyTableToClipboard = () => {
    const tableRef = this.tableRef;
    if (tableRef == null) {
      return;
    }

    const range = document.createRange();
    range.selectNode(tableRef);
    window.getSelection().addRange(range);

    const wasCopied = (() => {
      try {
        const result = document.execCommand('copy');
        return result;
      } catch (e) {
        return false;
      }
    })();

    // eslint-disable-next-line no-console
    console.log('was copied?', wasCopied);

    // clear selection
    window.getSelection().removeAllRanges();
  };

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Fragment>
          <Header>
            <LayoutControl>
              Current layout: <code>{this.state.layout}</code>
              <button type="button" onClick={this.toggleTableLayout}>
                Toggle
              </button>
            </LayoutControl>
            <div>
              Copy table to clipboard:
              <CopyTableButton onClick={this.copyTableToClipboard}>
                Copy
              </CopyTableButton>
            </div>
          </Header>
          <Table layout={this.state.layout}>
            <THead>
              <tr>
                <th>Author</th>
                <th>Content</th>
              </tr>
            </THead>
            <Droppable droppableId="table">
              {(droppableProvided) => (
                <TBody
                  ref={(ref) => {
                    this.tableRef = ref;
                    droppableProvided.innerRef(ref);
                  }}
                  {...droppableProvided.droppableProps}
                >
                  {this.state.quotes.map((quote, index) => (
                    <Draggable
                      draggableId={quote.id}
                      index={index}
                      key={quote.id}
                    >
                      {(
                        provided,
                        snapshot,
                      ) => (
                        <TableRow
                          provided={provided}
                          snapshot={snapshot}
                          quote={quote}
                        />
                      )}
                    </Draggable>
                  ))}
                </TBody>
              )}
            </Droppable>
          </Table>
        </Fragment>
      </DragDropContext>
    );
  }
}
