import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { Table, Ref } from "semantic-ui-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

class App extends Component {
  state = {
    quotes: [
      {
        id: 1,
        content: "The first money I ever earned was for drawing stone tools."
      },
      {
        id: 2,
        content: "The first money I ever earned was for drawing stone tools."
      },
      {
        id: 3,
        content: "The first money I ever earned was for drawing stone tools."
      },
      {
        id: 4,
        content: "The first money I ever earned was for drawing stone tools."
      },
      {
        id: 5,
        content: "The first money I ever earned was for drawing stone tools."
      },
      {
        id: 6,
        content: "The first money I ever earned was for drawing stone tools."
      },
      {
        id: 7,
        content: "The first money I ever earned was for drawing stone tools."
      },
      {
        id: 8,
        content: "The first money I ever earned was for drawing stone tools."
      },
      {
        id: 9,
        content: "The first money I ever earned was for drawing stone tools."
      }
    ]
  };

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
    return (
      <div style={{ padding: "50px", width: "80%" }}>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Table>
            <Table.Header>
              <Table.Row>
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
                            >
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
      // <div className="App">
      //   <header className="App-header">
      //     <img src={logo} className="App-logo" alt="logo" />
      //     <p>
      //       Edit <code>src/App.js</code> and save to reload.
      //     </p>
      //     <a
      //       className="App-link"
      //       href="https://reactjs.org"
      //       target="_blank"
      //       rel="noopener noreferrer"
      //     >
      //       Learn React
      //     </a>
      //   </header>
      // </div>
    );
  }
}

export default App;
