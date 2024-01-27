// Array to store card objects (each card is a dictionary with color and number)
const initialDeck = [];

// Define the colors array
const colors = ["red", "violet", "blue", "green", "orange", "yellow"];

// Populate the initialDeck array with card objects
for (const color of colors) {
  for (let number = 1; number <= 9; number++) {
    const card = { "color": color, "number": number };
    initialDeck.push(card);
  }
}

// Enum definition for HandType
const HandType = {
  SUM: 1,
  RUN: 2,
  COLOR: 3,
  THREE_OF_A_KIND: 4,
  COLOR_RUN: 5,
};

// Dictionary mapping HandType values to strings
const hand_type_dict = {
  [HandType.SUM]: "sum",
  [HandType.RUN]: "run",
  [HandType.COLOR]: "color",
  [HandType.THREE_OF_A_KIND]: "three of a kind",
  [HandType.COLOR_RUN]: "color run",
};

// Function to check if all cards have the same color
function checkColor(cards) {
  return cards.every(card => card.color === cards[0].color);
}

// Function to check if the card numbers form a run
function checkRun(cards) {
  const sortedNumbers = cards.map(card => card.number).sort((a, b) => a - b);
  return sortedNumbers.every((num, index) => index === 0 || num === sortedNumbers[index - 1] + 1);
}

// Function to check if all cards have the same number (three of a kind)
function checkThreeOfAKind(cards) {
  return cards.every(card => card.number === cards[0].number);
}

// Function to calculate the sum of card numbers
function sumOfCardNumbers(cards) {
  const cardNumbers = cards.map(card => card.number);
  return cardNumbers.reduce((sum, num) => sum + num, 0);
}

// Function to determine the type of hand based on card combinations
function determineHandType(cards) {
  if (checkColor(cards) && checkRun(cards)) {
    return HandType.COLOR_RUN;
  } else if (checkThreeOfAKind(cards)) {
    return HandType.THREE_OF_A_KIND;
  } else if (checkColor(cards)) {
    return HandType.COLOR;
  } else if (checkRun(cards)) {
    return HandType.RUN;
  } else {
    return HandType.SUM;
  }
}

// Function to determine the winner among different hands
function whoWinsHand(hands) {
  const results = {};

  for (const hand in hands) {
    const cards = hands[hand];
    results[hand] = [determineHandType(cards).value, sumOfCardNumbers(cards)];
  }

  const winner = Object.keys(results).reduce((a, b) => (results[a] > results[b] ? a : b));

  if (Object.values(results).every(result => result.toString() === results[winner].toString())) {
    return "no_contest";
  } else {
    return [winner, hand_type_dict[HandType[results[winner][0]]]];
  }
}

// Exporting the initialDeck array and whoWinsHand function
export { initialDeck, whoWinsHand };
