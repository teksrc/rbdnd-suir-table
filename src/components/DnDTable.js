import React, { Component } from 'react';
import { Button, Header, Icon, Table, Ref } from "semantic-ui-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "react-beautiful-dnd";
import invariant from 'tiny-invariant';

let i = 1;
let filledArr = [...new Array(100)].map(() => ({ 'id': i++, "content": "Bob" }));

 const getHomeColumn = (entities, rowId) => {
  const columnId = entities.columnOrder.find(id => {
    const column = entities.columns[id];
    return column.taskIds.includes(rowId);
  });

  invariant(columnId, 'Count not find row for table');

  return entities.columns[columnId];
};

const multiSelect = (
  entities,
  selectedRowIds,
  newRowId,
) => {
  // Nothing already selected
  if (!selectedRowIds.length) {
    return [newRowId];
  }

  const columnOfNew = getHomeColumn(entities, newRowId);
  const indexOfNew = columnOfNew.rowIds.indexOf(newRowId);
  const lastSelected = selectedRowIds[selectedRowIds.length - 1];
  const columnOfLast = getHomeColumn(entities, lastSelected);
  const indexOfLast = columnOfLast.rowIds.indexOf(lastSelected);

  // multi selecting to another column
  // select everything up to the index of the current item
  if (columnOfNew !== columnOfLast) {
    return columnOfNew.rowIds.slice(0, indexOfNew + 1);
  }

  // multi selecting in the same column
  // need to select everything between the last index and the current index inclusive

  // nothing to do here
  if (indexOfNew === indexOfLast) {
    return null;
  }

  const isSelectingForwards = indexOfNew > indexOfLast;
  const start = isSelectingForwards ? indexOfLast : indexOfNew;
  const end = isSelectingForwards ? indexOfNew : indexOfLast;

  const inBetween = columnOfNew.rowIds.slice(start, end + 1);

  // everything inbetween needs to have it's selection toggled.
  // with the exception of the start and end values which will always be selected

  const toAdd = inBetween.filter(
    (taskId) => {
      // if already selected: then no need to select it again
      if (selectedRowIds.includes(taskId)) {
        return false;
      }
      return true;
    },
  );

  const sorted = isSelectingForwards ? toAdd : [...toAdd].reverse();
  const combined = [...selectedRowIds, ...sorted];

  return combined;
};

class DnDTable extends Component {
  state = {
    entities: filledArr,
    reorderEnabled: false,
    selectedRowIds: [],
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
    // const { entities } = this.state;
    // Take new state of dispo group list and POST to endpoint
  }

  onDragStart = start => {
    const id = start.draggableId;
    const selected = this.state.selectedRowIds.find(selectedId => selectedId === id);

    // If dragging an item that is not selected, unselect all items
    if (!selected) {
      this.unselectAll();
    }

    this.setState({
      draggingRowId: start.draggableId,
    });
  }

  onDragEnd = result => {
    const { destination, source, reason } = result;

    // Not a thing to do...
    if (!destination || reason === 'CANCEL') {
      this.setState({
        draggingRowId: null,
      });
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const entities = Object.assign([], this.state.entities);
    const quote = this.state.entities[source.index];
    entities.splice(source.index, 1);
    entities.splice(destination.index, 0, quote);

    this.setState({
      entities
    });
  }

  unselect = () => {
    this.unselectAll();
  }

  unselectAll = () => {
    this.setState({
      selectedRowIds: [],
    });
  }

  multiSelectTo = newRowId => {
    const updated = multiSelect(
      this.state.entities,
      this.state.selectedRowIds,
      newRowId,
    );

    if (updated == null) {
      return;
    }

    this.setState({
      selectedRowIds: updated,
    });
  }

  onWindowKeyDown = event => {
    if (event.defaultPrevented) {
      this.unselectAll();
    }

    if (event.key === `Escape`) {
      this.unselectAll();
    }
  }

  onWindowClick = event => {
    if (event.defaultPrevented) {
      return;
    }
    this.unselectAll();
  }

  onWindowTouchEnd = event => {
    if (event.defaultPrevented) {
      return;
    }
    this.unselectAll();
  }

  toggleSelection = rowId => () => {
    const selectedRowIds = this.state.selectedRowIds;
    const wasSelected = selectedRowIds.includes(rowId);

    const newRowIds = (() => {
      // Row was not previously selected, now will be the only selected row
      if (!wasSelected) {
        return [rowId];
      }
      // Row was part of a selected group of rows, will now become the only selected row
      if (selectedRowIds.length > 1) {
        return [rowId];
      }
      // Row was previously selected but not in a group, will now clear the selection
      return [];
    })();

    this.setState({
      selectedRowIds: newRowIds,
    });
  }

  toggleSelectionInGroup = rowId => {
    const selectedRowIds = this.state.selectedRowIds;
    const index = selectedRowIds.indexOf(rowId);

    // If not selected, add it to the selected rows
    if (index === -1) {
      this.setState({
        selectedRowIds: [...selectedRowIds, rowId],
      });
      return;
    }
    // If row was previously selected, now it needs to be removed from the group
    const shallow = [...selectedRowIds];
    shallow.splice(index, 1);
    this.setState({
      selectedRowIds: shallow,
    });
  }

  render() {
    const { reOrder, saveOrder } = this;
    const { entities, selectedRowIds, reorderEnabled } = this.state;
    const selected = selectedRowIds;

    return (
      <div style={{ padding: "30px" }}>
        <Header as="h1">Semantic UI React Table with React Beautiful DnD</Header>
        <Button onClick={reOrder}>{reorderEnabled ? "Cancel Reorder" : "Toggle Reorder"}</Button>
        <Button onClick={saveOrder}>Save New Order</Button>
        <DragDropContext
          onDragStart={this.onDragStart}
          onDragEnd={this.onDragEnd}
        >
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
                    {this.state.entities.map((entity, index) => (
                      <Draggable
                        draggableId={entity.id}
                        index={index}
                        key={entity.id}
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
                              <Table.Cell>{entity.id}</Table.Cell>
                              <Table.Cell>{entity.content}</Table.Cell>
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

export default DnDTable;
