const Cards = [
  // Spades (♠)
  { id: 1, cardType: "French", name: "♠Ace", effect: "Vízesés, balra", color: "black", src: "/CardImages/spades/1AceOfSpades.png" },
  { id: 2, cardType: "French", name: "♠2", effect: "Coinflip duel", color: "black", src: "/CardImages/spades/2OfSpades.png" },
  { id: 3, cardType: "French", name: "♠3", effect: "Igyál 3 kortyot", color: "black", src: "/CardImages/spades/3OfSpades.png" },
  { id: 4, cardType: "French", name: "♠4", effect: "Igyál 4 kortyot", color: "black", src: "/CardImages/spades/4OfSpades.png" },
  { id: 5, cardType: "French", name: "♠5", effect: "Igyál 5 kortyot", color: "black", src: "/CardImages/spades/5OfSpades.png" },
  { id: 6, cardType: "French", name: "♠6", effect: "Ha fiú húzza, kioszt 6-ot, ha lány húzza, iszik 6-ot", color: "black", src: "/CardImages/spades/6OfSpades.png" },
  { id: 7, cardType: "French", name: "♠7", effect: "Drink or dare", color: "black", src: "/CardImages/spades/7OfSpades.png" },
  { id: 8, cardType: "French", name: "♠8", effect: "D20", color: "black", src: "/CardImages/spades/8OfSpades.png" },
  { id: 9, cardType: "French", name: "♠9", effect: "Blood Brother", color: "black", src: "/CardImages/spades/9OfSpades.png" },
  { id: 10, cardType: "French", name: "♠10", effect: "Új szabály", color: "black", src: "/CardImages/spades/10OfSpades.png" },
  { id: 11, cardType: "French", name: "♠Jack", effect: "Annyi korty minden fiúnak, ahány fiú van", color: "black", src: "/CardImages/spades/11JackOfSpades.png" },
  { id: 12, cardType: "French", name: "♠Queen", effect: "Annyi korty minden lánynak, ahány lány van", color: "black", src: "/CardImages/spades/12QueenOfSpades.png" },
  { id: 13, cardType: "French", name: "♠King", effect: "Király", color: "black", src: "/CardImages/spades/13KingOfSpades.png" },

  // Hearts (♥)
  { id: 14, cardType: "French", name: "♥Ace", effect: "Vízesés, jobbra", color: "red", src: "/CardImages/hearts/1AceOfHearts.png" },
  { id: 15, cardType: "French", name: "♥2", effect: "Coinflip duel", color: "red", src: "/CardImages/hearts/2OfHearts.png" },
  { id: 16, cardType: "French", name: "♥3", effect: "Ossz ki 3 kortyot", color: "red", src: "/CardImages/hearts/3OfHearts.png" },
  { id: 17, cardType: "French", name: "♥4", effect: "Ossz ki 4 kortyot", color: "red", src: "/CardImages/hearts/4OfHearts.png" },
  { id: 18, cardType: "French", name: "♥5", effect: "Ossz ki 5 kortyot", color: "red", src: "/CardImages/hearts/5OfHearts.png" },
  { id: 19, cardType: "French", name: "♥6", effect: "Ha lány húzza, kioszt 6-ot, ha fiú húzza, iszik 6-ot", color: "red", src: "/CardImages/hearts/6OfHearts.png" },
  { id: 20, cardType: "French", name: "♥7", effect: "Drink or dare", color: "red", src: "/CardImages/hearts/7OfHearts.png" },
  { id: 21, cardType: "French", name: "♥8", effect: "D20", color: "red", src: "/CardImages/hearts/8OfHearts.png" },
  { id: 22, cardType: "French", name: "♥9", effect: "Blood Brother", color: "red", src: "/CardImages/hearts/9OfHearts.png" },
  { id: 23, cardType: "French", name: "♥10", effect: "Új szabály", color: "red", src: "/CardImages/hearts/10OfHearts.png" },
  { id: 24, cardType: "French", name: "♥Jack", effect: "Annyi korty minden fiúnak, ahány fiú van", color: "red", src: "/CardImages/hearts/11JackOfHearts.png" },
  { id: 25, cardType: "French", name: "♥Queen", effect: "Annyi korty minden lánynak, ahány lány van", color: "red", src: "/CardImages/hearts/12QueenOfHearts.png" },
  { id: 26, cardType: "French", name: "♥King", effect: "Király", color: "red", src: "/CardImages/hearts/13KingOfHearts.png" },

  // Diamonds (♦)
  { id: 27, cardType: "French", name: "♦Ace", effect: "Vízesés, jobbra", color: "red", src: "/CardImages/diamonds/1AceOfDiamonds.png" },
  { id: 28, cardType: "French", name: "♦2", effect: "Coinflip duel", color: "red", src: "/CardImages/diamonds/2OfDiamonds.png" },
  { id: 29, cardType: "French", name: "♦3", effect: "Ossz ki 3 kortyot", color: "red", src: "/CardImages/diamonds/3OfDiamonds.png" },
  { id: 30, cardType: "French", name: "♦4", effect: "Ossz ki 4 kortyot", color: "red", src: "/CardImages/diamonds/4OfDiamonds.png" },
  { id: 31, cardType: "French", name: "♦5", effect: "Ossz ki 5 kortyot", color: "red", src: "/CardImages/diamonds/5OfDiamonds.png" },
  { id: 32, cardType: "French", name: "♦6", effect: "Ha lány húzza, kioszt 6-ot, ha fiú húzza, iszik 6-ot", color: "red", src: "/CardImages/diamonds/6OfDiamonds.png" },
  { id: 33, cardType: "French", name: "♦7", effect: "Drink or dare", color: "red", src: "/CardImages/diamonds/7OfDiamonds.png" },
  { id: 34, cardType: "French", name: "♦8", effect: "D20", color: "red", src: "/CardImages/diamonds/8OfDiamonds.png" },
  { id: 35, cardType: "French", name: "♦9", effect: "Blood Brother", color: "red", src: "/CardImages/diamonds/9OfDiamonds.png" },
  { id: 36, cardType: "French", name: "♦10", effect: "Új szabály", color: "red", src: "/CardImages/diamonds/10OfDiamonds.png" },
  { id: 37, cardType: "French", name: "♦Jack", effect: "Annyi korty minden fiúnak, ahány fiú van", color: "red", src: "/CardImages/diamonds/11JackOfDiamonds.png" },
  { id: 38, cardType: "French", name: "♦Queen", effect: "Annyi korty minden lánynak, ahány lány van", color: "red", src: "/CardImages/diamonds/12QueenOfDiamonds.png" },
  { id: 39, cardType: "French", name: "♦King", effect: "Király", color: "red", src: "/CardImages/diamonds/13KingOfDiamonds.png" },

  // Clubs (♣)
  { id: 40, cardType: "French", name: "♣Ace", effect: "Vízesés, balra", color: "black", src: "/CardImages/clubs/1AceOfClubs.png" },
  { id: 41, cardType: "French", name: "♣2", effect: "Coinflip duel", color: "black", src: "/CardImages/clubs/2OfClubs.png" },
  { id: 42, cardType: "French", name: "♣3", effect: "Igyál 3 kortyot", color: "black", src: "/CardImages/clubs/3OfClubs.png" },
  { id: 43, cardType: "French", name: "♣4", effect: "Igyál 4 kortyot", color: "black", src: "/CardImages/clubs/4OfClubs.png" },
  { id: 44, cardType: "French", name: "♣5", effect: "Igyál 5 kortyot", color: "black", src: "/CardImages/clubs/5OfClubs.png" },
  { id: 45, cardType: "French", name: "♣6", effect: "Ha fiú húzza, kioszt 6-ot, ha lány húzza, iszik 6-ot", color: "black", src: "/CardImages/clubs/6OfClubs.png" },
  { id: 46, cardType: "French", name: "♣7", effect: "Drink or dare", color: "black", src: "/CardImages/clubs/7OfClubs.png" },
  { id: 47, cardType: "French", name: "♣8", effect: "D20", color: "black", src: "/CardImages/clubs/8OfClubs.png" },
  { id: 48, cardType: "French", name: "♣9", effect: "Blood Brother", color: "black", src: "/CardImages/clubs/9OfClubs.png" },
  { id: 49, cardType: "French", name: "♣10", effect: "Új szabály", color: "black", src: "/CardImages/clubs/10OfClubs.png" },
  { id: 50, cardType: "French", name: "♣Jack", effect: "Annyi korty minden fiúnak, ahány fiú van", color: "black", src: "/CardImages/clubs/11JackOfClubs.png" },
  { id: 51, cardType: "French", name: "♣Queen", effect: "Annyi korty minden lánynak, ahány lány van", color: "black", src: "/CardImages/clubs/12QueenOfClubs.png" },
  { id: 52, cardType: "French", name: "♣King", effect: "Király", color: "black", src: "/CardImages/clubs/13KingOfClubs.png" }
];

export default Cards;
