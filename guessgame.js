var gameInstance;

// Start menu code here
$('#start-btn').on('click', function(event) {
  $('#app').css('display', 'block');
  $('#start-menu').css('display', 'none');
  gameInstance = newGame();
})

addEventListener('keyup', function(event) {
  if (event.keyCode === 13) {
    submitGuess();
  }
})

$('#submit-guess-btn').on('click', function() {
  submitGuess();
})

$('#reset-btn').on('click', function() {
  $('#submit-guess-btn').attr('disabled', false);
  $('#hint-btn').attr('disabled', false);
  $('.submission-result').text("");

  if (gameInstance.pastGuesses.length) {
    for (var i = 0; i < gameInstance.pastGuesses.length; ++i) {
      $('.previous-guess-array').eq(i).text('-');
    }
  }
  $('.hint-para').text('');
  gameInstance = newGame();
})

$('#hint-btn').on('click', function() {
  var hint = gameInstance.provideHint();
  $('.hint-para').text('The number is one of these: ' + hint);
})

function submitGuess() {
  var guessResult = gameInstance.playersGuessSubmission($('#current-guess-input').val());
  $('.submission-result').text(guessResult);

  //update past guesses in the dom
  if (gameInstance.pastGuesses.length) {
    for (var i = 0; i < gameInstance.pastGuesses.length; ++i) {
      $('.previous-guess-array').eq(i).text(gameInstance.pastGuesses[i]);
    }
  }

  if (guessResult === 'You Win!') {
    $('#submit-guess-btn').attr('disabled', true);
    $('#hint-btn').attr('disabled', true);
  }
}

function generateWinningNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

function shuffle(array) {
  var length = array.length;
  var placeHolder;
  var indexToShuffle;

  while (length) {
    indexToShuffle = Math.floor(Math.random() * length--);
    placeHolder = array[length];
    array[length] = array[indexToShuffle];
    array[indexToShuffle] = placeHolder;
  }
  return array;
}

function newGame() {
  return new Game();
}

function Game() {
  this.playersGuess = null;
  this.pastGuesses = [];

  this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function() {
  return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function() {
  return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(num) {
  num = Number(num);
  if (num < 1 || num > 100 || isNaN(num)) {
    throw 'That is an invalid guess.';
  }
  this.playersGuess = num;
  return this.checkGuess();
}

Game.prototype.checkGuess = function() {
  var higherOrLower = (this.playersGuess > this.winningNumber) ? 'Lower!' : 'Higher.';

  if (this.playersGuess === this.winningNumber) {
    return 'You Win!';
  }
  if (this.pastGuesses.includes(this.playersGuess)) {
    return 'You have already guessed that number.';
  }

  this.pastGuesses.push(this.playersGuess);

  if (this.pastGuesses.length === 5) {
    return 'You Lose.'
  }
  if (this.difference() < 10) {
    return 'You\'re burning up! ' + higherOrLower;
  }
  if (this.difference() < 25) {
    return 'You\'re lukewarm. ' + higherOrLower;
  }
  if (this.difference() < 50) {
    return 'You\'re a bit chilly. ' + higherOrLower;
  }
  if (this.difference() < 100) {
    return 'You\'re ice cold! ' + higherOrLower;
  }
  return 'Not the correct number. ' + higherOrLower;
}

Game.prototype.provideHint = function() {
  var hintArray = [];
  hintArray.push(this.winningNumber);
  hintArray.push(generateWinningNumber());
  hintArray.push(generateWinningNumber());

  return shuffle(hintArray);
}
