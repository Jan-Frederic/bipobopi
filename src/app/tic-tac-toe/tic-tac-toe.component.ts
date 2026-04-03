import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';

type Cell = 'X' | 'O' | null;

@Component({
  selector: 'app-tic-tac-toe',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="game">
      <h2>Tic-Tac-Toe</h2>
      <div class="board">
        @for (row of board(); track $index; let rowIndex = $index) {
          <div class="row">
            @for (cell of row; track $index; let colIndex = $index) {
              <button class="cell" (click)="makeMove(rowIndex, colIndex)" [disabled]="cell || winner()">{{ cell || '' }}</button>
            }
          </div>
        }
      </div>
      @if (winner()) {
        <p>Winner: {{ winner() }}</p>
      } @else if (isDraw()) {
        <p>It's a draw!</p>
      } @else {
        <p>Current player: {{ currentPlayer() }}</p>
      }
      <button (click)="reset()">Reset</button>
    </div>
  `,
  styles: []
})
export class TicTacToeComponent {
  board = signal<Cell[][]>(Array(3).fill(null).map(() => Array(3).fill(null)));
  currentPlayer = signal<'X' | 'O'>('X');

  winner = computed(() => this.checkWinner(this.board()));
  isDraw = computed(() => !this.winner() && this.board().every(row => row.every(cell => cell !== null)));

  makeMove(row: number, col: number) {
    if (this.board()[row][col] || this.winner()) return;
    this.board.update(b => {
      const newBoard = b.map(r => [...r]);
      newBoard[row][col] = this.currentPlayer();
      return newBoard;
    });
    this.currentPlayer.update(p => p === 'X' ? 'O' : 'X');
  }

  reset() {
    this.board.set(Array(3).fill(null).map(() => Array(3).fill(null)));
    this.currentPlayer.set('X');
  }

  private checkWinner(board: Cell[][]): 'X' | 'O' | null {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
        return board[i][0];
      }
    }
    // Check columns
    for (let i = 0; i < 3; i++) {
      if (board[0][i] && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
        return board[0][i];
      }
    }
    // Check diagonals
    if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
      return board[0][0];
    }
    if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
      return board[0][2];
    }
    return null;
  }
}