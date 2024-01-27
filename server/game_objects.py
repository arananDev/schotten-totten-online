import random
from enum import Enum

class HandType(Enum):
    SUM = 1
    RUN = 2
    COLOR = 3
    THREE_OF_A_KIND = 4
    COLOR_RUN = 5

hand_type_dict = {
    HandType.SUM: "sum",
    HandType.RUN: "run",
    HandType.COLOR: "color",
    HandType.THREE_OF_A_KIND: "three of a kind",
    HandType.COLOR_RUN: "color run"
}

def check_color(cards):
    return all(card["color"] == cards[0]["color"] for card in cards)

def check_run(cards):
    sorted_numbers = sorted(card["number"] for card in cards)
    return all(sorted_numbers[i] == sorted_numbers[i - 1] + 1 for i in range(1, len(sorted_numbers)))

def check_three_of_a_kind(cards):
    return all(card["number"] == cards[0]["number"] for card in cards)

def sum_of_card_numbers(cards):
    card_numbers = (card["number"] for card in cards)
    total_sum = sum(card_numbers)
    return total_sum

def determine_hand_type(cards):
    if check_color(cards) and check_run(cards):
        return HandType.COLOR_RUN
    elif check_three_of_a_kind(cards):
        return HandType.THREE_OF_A_KIND
    elif check_color(cards):
        return HandType.COLOR
    elif check_run(cards):
        return HandType.RUN
    else:
        return HandType.SUM

def who_wins_hand(hands):
    results = {}
    for hand, cards in hands.items():
        results[hand] = (determine_hand_type(cards).value, sum_of_card_numbers(cards))

    winner = max(results, key=results.get)

    if all(result == results[winner] for result in results.values() if result != results[winner]):
        return "no_contest", hand_type_dict[HandType(results[winner][0])]
    else:
        return winner, hand_type_dict[HandType(results[winner][0])]
    
def find_adjacent_rock_winner(rocks):
    for i in range(len(rocks) - 2):
        if rocks[i].winner == rocks[i + 1].winner == rocks[i + 2].winner:
            return rocks[i].winner
    return None

def find_majority_rock_winner(rocks):
    rockWins = [rock.winner for rock in rocks]
    counts = {}
    for winner in rockWins:
        counts[winner] = counts.get(winner, 0) + 1
        if counts[winner] >= 5:
            return winner
    return None

def find_no_winner(rocks):
    rockWins = [rock.winner for rock in rocks]
    for winner in rockWins:
        if winner == None:
            return None
    else: return "No Contest"

class Deck:
    def __init__(self):
        self.cards = [{"number": number, "color": color} 
                      for color in ["red", "violet", "blue", "green", "orange", "yellow"] 
                      for number in range(1, 10)]

    def shuffle(self):
        random.shuffle(self.cards)
    
    def deal(self):
        return self.cards.pop() if self.cards else None

    def length(self):
        return len(self.cards)


class Rock:
    def __init__(self, player1, player2):
        self.hands = {player1: [], player2: []}
        self.winner = None

    def check_if_finished(self):
        finish_condition = all(len(self.hands[player]) >= 3 for player in self.hands)
        if finish_condition:
            winner, hand_type = who_wins_hand(self.hands)
            self.winner = winner
            return winner, hand_type
        else:
            return None, None

    def preemptive_finish(self, winner):
        self.winner = winner

    def add(self, player, card):
        self.hands[player].append(card)
        
class State:
    def __init__(self, player1, player2):
        # Initialize deck, shuffle, and deal cards
        self.deck = Deck()
        self.deck.shuffle()
        
        # Initialize players and deal initial cards
        self.players = {player: [self.deck.deal() for _ in range(6)] for player in [player1, player2]}
        self.currentPlayer = random.choice([player1, player2])

        # Initialize rocks
        self.rocks = [Rock(player1, player2) for _ in range(9)]
        
    def switchPlayer(self):
        self.currentPlayer = [player for player in self.players if player != self.currentPlayer][0]
        return self.currentPlayer
        
        
    def playTurn(self, rock_index, card_index):
        # Play card on rock
        card = self.players[self.currentPlayer].pop(card_index)
        self.rocks[rock_index].add(self.currentPlayer, card)
        ## See if rock has been claimed 
        winner, hand_type = self.rocks[rock_index].check_if_finished()
        new_card = None
        
        ## Deal a card if it's possible
        if self.deck.length() > 0:
            new_card = self.deck.deal()
            self.players[self.currentPlayer].append(new_card)
        return {
            self.currentPlayer: new_card,
            "rockIndex": rock_index,
            "rockWinner": winner,
            "handType": hand_type,
            "currentPLayer": self.switchPlayer()
        }
        
    def hasSomeoneWon(self):
            adjacent_winner = find_adjacent_rock_winner(self.rocks)
            majority_winner = find_majority_rock_winner(self.rocks)
            no_winner = find_no_winner(self.rocks)
            
            return adjacent_winner or majority_winner or no_winner