import React, { Component } from 'react';
import { Button, Header, Icon, Table, Ref } from "semantic-ui-react";
import { DragDropContext, Droppable, DroppableProvided, DroppableStateSnapshot, Draggable } from "react-beautiful-dnd";

import styled from '@emotion/styled';
import memoizeOne from 'memoize-one';
import { colors } from '@atlaskit/theme';

let i = 1;
let filledArr = [...new Array(100)].map(() => ({ 'id': i++, "content": "Bob" }));

class DnDMultiDrag extends Component {
  state = {
    quotes: filledArr,
    reorderEnabled: false,
    selectedIds: [],
    draggingRowId: null,
  };

  componentDidMount () {
    window.addEventListener('click', this.onWindowClick);
    window.addEventListener('keydown', this.onWindowKeyDown);
    window.addEventListener('touchend', this.onWindowTouchEnd);
  }

  componentWillUnmount () {
    window.removeEventListener('click', this.onWindowClick);
    window.removeEventListener('click', this.onWindowClick);
    window.removeEventListener('click', this.onWindowClick);
  }

  getItemStyle = (isDragging, draggableStyle) => ({
    background: isDragging && ("lightblue"),
    ...draggableStyle,
  })

  reOrder = () => {
    const { reorderEnabled } = this.state

    this.setState({
      reorderEnabled: !reorderEnabled
    })
  }

  saveOrder = () => {
    const { quotes } = this.state;
    // Take new state of dispo group list and POST to endpoint
  }

  onDragEnd = result => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const quotes = Object.assign([], this.state.quotes);
    const quote = this.state.quotes[source.index];
    quotes.splice(source.index, 1);
    quotes.splice(destination.index, 0, quote);

    this.setState({
      quotes
    });
  }

  render() {
    const { getItemStyle, reOrder, saveOrder } = this;
    const { reorderEnabled } = this.state;

    return (
      <div style={{ padding: "30px" }}>
        <Header as="h1">Semantic UI React Table with React Beautiful DnD</Header>
        <Button onClick={reOrder}>{reorderEnabled ? "Cancel Reorder" : "Toggle Reorder"}</Button>
        <Button onClick={saveOrder}>Save New Order</Button>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Table>
            <Table.Header>
              <Table.Row>
                {reorderEnabled && (<Table.HeaderCell />)}
                <Table.HeaderCell>Id</Table.HeaderCell>
                <Table.HeaderCell>Content</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Droppable droppableId="tableBody">
              {(provided, snapshot) => (
                <Ref innerRef={provided.innerRef}>
                  <Table.Body {...provided.droppableProps}>
                    {this.state.quotes.map((quote, index) => (
                      <Draggable
                        draggableId={quote.id}
                        index={index}
                        key={quote.id}
                      >
                        {(provided, snapshot) => (
                          <Ref innerRef={provided.innerRef}>
                            <Table.Row
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={this.getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}
                            >
                              {reorderEnabled && (<Table.Cell>{
                                <Icon
                                  name="bars"
                                  color="grey"
                                  className="ds__DispoGroup__row-drag"
                                />
                              }</Table.Cell>)}
                              <Table.Cell>{quote.id}</Table.Cell>
                              <Table.Cell>{quote.content}</Table.Cell>
                            </Table.Row>
                          </Ref>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Table.Body>
                </Ref>
              )}
            </Droppable>
          </Table>
        </DragDropContext>
      </div>
    );
  }
}

export default DnDMultiDrag;
