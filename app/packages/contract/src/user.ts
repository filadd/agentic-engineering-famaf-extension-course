import * as Schema from "effect/Schema";

import { Ulid } from "./ulid.ts";

// The English key of every animal an avatar can be, in the order the avatar
// picker shows them. Only the web maps a key to its emoji and Spanish name.
export const animals = [
  "fox",
  "panda",
  "frog",
  "koala",
  "lion",
  "tiger",
  "bear",
  "polar-bear",
  "rabbit",
  "dog",
  "cat",
  "monkey",
  "gorilla",
  "orangutan",
  "mouse",
  "hamster",
  "wolf",
  "raccoon",
  "skunk",
  "badger",
  "otter",
  "sloth",
  "kangaroo",
  "hedgehog",
  "cow",
  "pig",
  "boar",
  "horse",
  "unicorn",
  "zebra",
  "giraffe",
  "elephant",
  "rhinoceros",
  "hippopotamus",
  "camel",
  "llama",
  "deer",
  "bison",
  "goat",
  "sheep",
  "bat",
  "beaver",
  "squirrel",
  "owl",
  "eagle",
  "duck",
  "swan",
  "flamingo",
  "peacock",
  "parrot",
  "penguin",
  "chicken",
  "chick",
  "turkey",
  "dove",
  "dodo",
  "octopus",
  "squid",
  "crab",
  "lobster",
  "shrimp",
  "tropical-fish",
  "blowfish",
  "fish",
  "dolphin",
  "whale",
  "shark",
  "seal",
  "turtle",
  "crocodile",
  "lizard",
  "snake",
  "dinosaur",
  "t-rex",
  "dragon",
  "bee",
  "ladybug",
  "butterfly",
  "snail",
  "caterpillar",
  "ant",
  "spider",
  "scorpion",
  "beetle",
] as const;

export const Animal = Schema.Literals(animals);

export type Animal = typeof Animal.Type;

export const Role = Schema.Literals(["teacher", "student"]);

export type Role = typeof Role.Type;

export const Email = Schema.String.check(
  Schema.isMaxLength(254),
  Schema.isPattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
);

export type Email = typeof Email.Type;

export const UserName = Schema.String.check(Schema.isMinLength(1), Schema.isMaxLength(40));

export const Me = Schema.Struct({
  id: Ulid,
  email: Schema.String,
  name: Schema.NullOr(Schema.String),
  avatar: Schema.NullOr(Animal),
  role: Role,
});

export type Me = typeof Me.Type;

export const User = Schema.Struct({
  ...Me.fields,
  hasAccess: Schema.Boolean,
});

export type User = typeof User.Type;

// Without 0, O, 1 and I, which read alike when the code is typed by hand. Its
// 32 characters divide 256, so taking a random byte modulo the length keeps
// every character equally likely.
export const enrollmentAlphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export const enrollmentCodeLength = 5;

export const EnrollmentCode = Schema.Struct({
  code: Schema.String.check(
    Schema.isPattern(new RegExp(`^[${enrollmentAlphabet}]{${enrollmentCodeLength}}$`)),
  ),
  url: Schema.String,
});

export type EnrollmentCode = typeof EnrollmentCode.Type;
