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
  renderSquare(i, pos) {
    return (
      <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i, pos)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0, '0,0')}
          {this.renderSquare(1, '0,1')}
          {this.renderSquare(2, '0,2')}
        </div>
        <div className="board-row">
          {this.renderSquare(3, '1,0')}
          {this.renderSquare(4, '1,1')}
          {this.renderSquare(5, '1,2')}
        </div>
        <div className="board-row">
          {this.renderSquare(6, '2,0')}
          {this.renderSquare(7, '2,1')}
          {this.renderSquare(8, '2,2')}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  // history = [
  //   // Before first move
  //   {
  //     squares: [
  //       ['0,1', null], ['0,2', null], null,
  //       null, null, null,
  //       null, null, null,
  //     ]
  //   },
  //   // After first move
  //   {
  //     squares: [
  //       null, null, null,
  //       null, 'X', null,
  //       null, null, null,
  //     ]
  //   },
  //   // After second move
  //   {
  //     squares: [
  //       null, null, null,
  //       null, 'X', null,
  //       null, null, 'O',
  //     ]
  //   },
  //   // ...
  // ]

  constructor(props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill([null, null])
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(i, pos) {
    console.log('handleClick i:', i);
    console.log('handleClick pos:', pos);
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    console.log('history:', history);
    console.log('squares[i][1]:', squares)
    // if (calculateWinner(squares) || squares[i]) {
    //   return;
    // }
    squares[i][1] = this.state.xIsNext ? 'X': 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
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

    const moves = history.map((step, move) => {
      const desc = move 
        ? 'Go to move #' + move 
        : 'Go to game start';
      return (
        <li key={move} className={step}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    });

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
            onClick={(i, pos) => this.handleClick(i, pos)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
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