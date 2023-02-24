import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  return (
    <button
      className='square'
      onClick={props.onClick}>
        {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
    />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class MovesList extends React.Component {

  render() {
    const history = this.props.history;
    const moves = history.map((step, move) => {
      const desc =  move 
      ? `Go to move # ${move} (${history[move].location})` 
      : 'Go to game start';

      return (
        <li key={move}>
          <button onClick={() => this.props.onClick(move)}>
            <span style={{fontWeight: history.length-1 === move ? 'bold' : 'normal'}}>{desc}</span>
          </button>
        </li>
      )
    });

    return this.props.isAsc ? moves : moves.reverse()
  }

}

class Game extends React.Component {
  /*
  history = [
    // Before first move
    {
      squares: [
        null, null, null,
        null, null, null,
        null, null, null,
      ]
    },
    // After first move
    {
      squares: [
        null, null, null,
        null, 'X', null,
        null, null, null,
      ]
    },
    // After second move
    {
      squares: [
        null, null, null,
        null, 'X', null,
        null, null, 'O',
      ]
    },
    // ...
  ]*/

  constructor(props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        location: Array(1).fill([null, null]),
      }],
      stepNumber: 0,
      xIsNext: true,
      isAsc: true,
    }
    this.handleSort = this.handleSort.bind(this)
  }

  handleClick(i) {
    const locations = [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 0],
      [1, 1],
      [1, 2],
      [2, 0],
      [2, 1],
      [2, 2]
    ];
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X': 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        location: locations[i],
      }]), 
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  handleSort() {
    this.setState({
      isAsc: !this.state.isAsc,
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    let status;

    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X': 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div><button onClick={this.handleSort}>{this.state.isAsc ? 'Ascending' : 'Descending'}</button></div>
          <ol>
            <MovesList 
              isAsc={this.state.isAsc}
              history={history} 
              onClick={(step) => this.jumpTo(step)}
              />
          </ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}