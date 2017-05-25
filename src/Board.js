// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var answer = rowIndex.reduce(function(a, b) {
        return a + b;
      });

      if (answer > 1) {
        return true;
      } else {
        return false;
      }
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var boardRows = this.rows();
      for (var i = 0; i < boardRows.length; i++) {
        var result = this.hasRowConflictAt(boardRows[i]);

        if (result === true) {
          return true;
        }
      }
      return false; // fixme
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var boardRows = this.rows();
      var columnValues = [];

      boardRows.forEach(function(row) {
        columnValues.push(row[colIndex]);
      });

      var answer = columnValues.reduce(function(a, b) {
        return a + b;
      });
      if (answer > 1) {
        return true;
      } else {
        return false;
      }// fixme
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var boardRows = this.rows();

      for (var i = 0; i < boardRows.length; i++) {
        var result = this.hasColConflictAt(i);
        if (result === true) {
          return true;
        }
      }
      return false; // fixme
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var boardRows = this.rows();
      var diagonals = [];

      //Loop through boardRows, and for each index
      for (var i = 0; i < boardRows.length; i++) {
        for (var j = 0; j < boardRows[i].length; j++) {
          var result = this._getFirstRowColumnIndexForMajorDiagonalOn(i, j);
          if (result === majorDiagonalColumnIndexAtFirstRow) {
            diagonals.push(boardRows[i][j]);
          }
        }
      }

      var value = diagonals.reduce(function(a, b) {
        return a + b;
      });


      if (value > 1) {
        return true;
      } else {
        return false;
      }
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var boardRows = this.rows();
      var diagonalInstances = {};
      var diagonalToCheck;
      var areConflicts = false;

      for (var i = 0; i < boardRows.length; i++) {
        for (var j = 0; j < boardRows[i].length; j++) {
          diagonalToCheck = this._getFirstRowColumnIndexForMajorDiagonalOn(i, j);
          if ((boardRows[i][j] === 1) && !(diagonalInstances.hasOwnProperty(diagonalToCheck))) {
            diagonalInstances[diagonalToCheck] = this.hasMajorDiagonalConflictAt(diagonalToCheck);
          }
        }
      }

      for (var diagonal in diagonalInstances) {
        if (diagonalInstances[diagonal] === true) {
          areConflicts = true;
          break;
        }
      }

      return areConflicts;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var boardRows = this.rows();
      var diagonals = [];

      //Loop through boardRows, and for each index
      for (var i = 0; i < boardRows.length; i++) {
        for (var j = boardRows[i].length - 1; j >= 0; j--) {
          var result = this._getFirstRowColumnIndexForMinorDiagonalOn(i, j);
          if (result === minorDiagonalColumnIndexAtFirstRow) {
            diagonals.push(boardRows[i][j]);
          }
        }
      }

      var value = diagonals.reduce(function(a, b) {
        return a + b;
      });


      if (value > 1) {
        return true;
      } else {
        return false;
      }
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var boardRows = this.rows();
      var diagonalInstances = {};
      var diagonalToCheck;
      var areConflicts = false;

      for (var i = 0; i < boardRows.length; i++) {
        for (var j = boardRows[i].length - 1; j >= 0; j--) {
          diagonalToCheck = this._getFirstRowColumnIndexForMinorDiagonalOn(i, j);
          if ((boardRows[i][j] === 1) && !(diagonalInstances.hasOwnProperty(diagonalToCheck))) {
            diagonalInstances[diagonalToCheck] = this.hasMinorDiagonalConflictAt(diagonalToCheck);
          }
        }
      }

      for (var diagonal in diagonalInstances) {
        if (diagonalInstances[diagonal] === true) {
          areConflicts = true;
          break;
        }
      }

      return areConflicts; // fixme
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
