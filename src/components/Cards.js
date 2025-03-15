const Cards = [
  // Spades (♠)
  { name: "♠Ace", effect: "Vízesés, balra", color: "black", src: "/CardImages/spades/1AceOfSpades.png" },
  { name: "♠2", effect: "Coinflip duel", color: "black", src: "/CardImages/spades/2OfSpades.png" },
  { name: "♠3", effect: "Igyál 3 kortyot", color: "black", src: "/CardImages/spades/3OfSpades.png" },
  { name: "♠4", effect: "Igyál 4 kortyot", color: "black", src: "/CardImages/spades/4OfSpades.png" },
  { name: "♠5", effect: "Igyál 5 kortyot", color: "black", src: "/CardImages/spades/5OfSpades.png" },
  { name: "♠6", effect: "Ha fiú húzza, kioszt 6-ot, ha lány húzza, iszik 6-ot", color: "black", src: "/CardImages/spades/6OfSpades.png" },
  { name: "♠7", effect: "Drink or dare", color: "black", src: "/CardImages/spades/7OfSpades.png" },
  { name: "♠8", effect: "D20", color: "black", src: "/CardImages/spades/8OfSpades.png" },
  { name: "♠9", effect: "Blood Brother", color: "black", src: "/CardImages/spades/9OfSpades.png" },
  { name: "♠10", effect: "Új szabály", color: "black", src: "/CardImages/spades/10OfSpades.png" },
  { name: "♠Jack", effect: "Annyi korty minden fiúnak, ahány fiú van", color: "black", src: "/CardImages/spades/11JackOfSpades.png" },
  { name: "♠Queen", effect: "Annyi korty minden lánynak, ahány lány van", color: "black", src: "/CardImages/spades/12QueenOfSpades.png" },
  { name: "♠King", effect: "Király", color: "black", src: "/CardImages/spades/13KingOfSpades.png" },

  // Hearts (♥)
  { name: "♥Ace", effect: "Vízesés, jobbra", color: "red", src: "/CardImages/hearts/1AceOfHearts.png" },
  { name: "♥2", effect: "Coinflip duel", color: "red", src: "/CardImages/hearts/2OfHearts.png" },
  { name: "♥3", effect: "Ossz ki 3 kortyot", color: "red", src: "/CardImages/hearts/3OfHearts.png" },
  { name: "♥4", effect: "Ossz ki 4 kortyot", color: "red", src: "/CardImages/hearts/4OfHearts.png" },
  { name: "♥5", effect: "Ossz ki 5 kortyot", color: "red", src: "/CardImages/hearts/5OfHearts.png" },
  { name: "♥6", effect: "Ha lány húzza, kioszt 6-ot, ha fiú húzza, iszik 6-ot", color: "red", src: "/CardImages/hearts/6OfHearts.png" },
  { name: "♥7", effect: "Drink or dare", color: "red", src: "/CardImages/hearts/7OfHearts.png" },
  { name: "♥8", effect: "D20", color: "red", src: "/CardImages/hearts/8OfHearts.png" },
  { name: "♥9", effect: "Blood Brother", color: "red", src: "/CardImages/hearts/9OfHearts.png" },
  { name: "♥10", effect: "Új szabály", color: "red", src: "/CardImages/hearts/10OfHearts.png" },
  { name: "♥Jack", effect: "Annyi korty minden fiúnak, ahány fiú van", color: "red", src: "/CardImages/hearts/11JackOfHearts.png" },
  { name: "♥Queen", effect: "Annyi korty minden lánynak, ahány lány van", color: "red", src: "/CardImages/hearts/12QueenOfHearts.png" },
  { name: "♥King", effect: "Király", color: "red", src: "/CardImages/hearts/13KingOfHearts.png" },

  // Diamonds (♦)
  { name: "♦Ace", effect: "Vízesés, jobbra", color: "red", src: "/CardImages/diamonds/1AceOfDiamonds.png" },
  { name: "♦2", effect: "Coinflip duel", color: "red", src: "/CardImages/diamonds/2OfDiamonds.png" },
  { name: "♦3", effect: "Ossz ki 3 kortyot", color: "red", src: "/CardImages/diamonds/3OfDiamonds.png" },
  { name: "♦4", effect: "Ossz ki 4 kortyot", color: "red", src: "/CardImages/diamonds/4OfDiamonds.png" },
  { name: "♦5", effect: "Ossz ki 5 kortyot", color: "red", src: "/CardImages/diamonds/5OfDiamonds.png" },
  { name: "♦6", effect: "Ha lány húzza, kioszt 6-ot, ha fiú húzza, iszik 6-ot", color: "red", src: "/CardImages/diamonds/6OfDiamonds.png" },
  { name: "♦7", effect: "Drink or dare", color: "red", src: "/CardImages/diamonds/7OfDiamonds.png" },
  { name: "♦8", effect: "D20", color: "red", src: "/CardImages/diamonds/8OfDiamonds.png" },
  { name: "♦9", effect: "Blood Brother", color: "red", src: "/CardImages/diamonds/9OfDiamonds.png" },
  { name: "♦10", effect: "Új szabály", color: "red", src: "/CardImages/diamonds/10OfDiamonds.png" },
  { name: "♦Jack", effect: "Annyi korty minden fiúnak, ahány fiú van", color: "red", src: "/CardImages/diamonds/11JackOfDiamonds.png" },
  { name: "♦Queen", effect: "Annyi korty minden lánynak, ahány lány van", color: "red", src: "/CardImages/diamonds/12QueenOfDiamonds.png" },
  { name: "♦King", effect: "Király", color: "red", src: "/CardImages/diamonds/13KingOfDiamonds.png" },

  // Clubs (♣)
  { name: "♣Ace", effect: "Vízesés, balra", color: "black", src: "/CardImages/clubs/1AceOfClubs.png" },
  { name: "♣2", effect: "Coinflip duel", color: "black", src: "/CardImages/clubs/2OfClubs.png" },
  { name: "♣3", effect: "Igyál 3 kortyot", color: "black", src: "/CardImages/clubs/3OfClubs.png" },
  { name: "♣4", effect: "Igyál 4 kortyot", color: "black", src: "/CardImages/clubs/4OfClubs.png" },
  { name: "♣5", effect: "Igyál 5 kortyot", color: "black", src: "/CardImages/clubs/5OfClubs.png" },
  { name: "♣6", effect: "Ha fiú húzza, kioszt 6-ot, ha lány húzza, iszik 6-ot", color: "black", src: "/CardImages/clubs/6OfClubs.png" },
  { name: "♣7", effect: "Drink or dare", color: "black", src: "/CardImages/clubs/7OfClubs.png" },
  { name: "♣8", effect: "D20", color: "black", src: "/CardImages/clubs/8OfClubs.png" },
  { name: "♣9", effect: "Blood Brother", color: "black", src: "/CardImages/clubs/9OfClubs.png" },
  { name: "♣10", effect: "Új szabály", color: "black", src: "/CardImages/clubs/10OfClubs.png" },
  { name: "♣Jack", effect: "Annyi korty minden fiúnak, ahány fiú van", color: "black", src: "/CardImages/clubs/11JackOfClubs.png" },
  { name: "♣Queen", effect: "Annyi korty minden lánynak, ahány lány van", color: "black", src: "/CardImages/clubs/12QueenOfClubs.png" },
  { name: "♣King", effect: "Király", color: "black", src: "/CardImages/clubs/13KingOfClubs.png" }
];

export default Cards;
