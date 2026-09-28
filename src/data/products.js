import loopChair from "../assets/images/optimized/products/chair/01-loop-chair.webp";
import voidLounge from "../assets/images/optimized/products/chair/02-void-lounge.webp";
import blobChair from "../assets/images/optimized/products/chair/03-blob-chair.webp";

import orbitLamp from "../assets/images/optimized/products/light/04-orbit-lamp.webp";
import stemFloorLight from "../assets/images/optimized/products/light/05-stem-floor-light.webp";
import blockLight from "../assets/images/optimized/products/light/06-block-light.webp";

import bendTable from "../assets/images/optimized/products/table/07-bend-table.webp";
import liquidTable from "../assets/images/optimized/products/table/08-liquid-table.webp";
import archTable from "../assets/images/optimized/products/table/09-arch-table.webp";

import waveVase from "../assets/images/optimized/products/object/10-wave-vase.webp";
import meltMirror from "../assets/images/optimized/products/object/11-melt-mirror.webp";
import stackObject from "../assets/images/optimized/products/object/12-stack-object.webp";



const products = [
  {
    id: 1,
    name: "LOOP CHAIR",
    category: "chair",
    color: "Signal Red",
    price: 890000,
    image: loopChair,
    description: "A chair with an independent spirit. Signal Red brings a vivid accent to everyday seating, inviting a new conversation between furniture and space.",
  },
  {
    id: 2,
    name: "VOID LOUNGE",
    category: "chair",
    color: "Chrome",
    price: 1480000,
    image: voidLounge,
    description: "A lounge piece with a quiet presence. The Chrome colorway offers a contrasting note within MORPH’s collection of expressive seating.",
  },
  {
    id: 3,
    name: "BLOB CHAIR",
    category: "chair",
    color: "Cobalt Blue",
    price: 920000,
    image: blobChair,
    description: "An expressive approach to everyday seating. Cobalt Blue makes BLOB CHAIR a focal point, whether standing alone or in dialogue with other objects.",
  },
  {
    id: 4,
    name: "ORBIT LAMP",
    category: "light",
    color: "Orange",
    price: 390000,
    image: orbitLamp,
    description: "Light as part of the composition. ORBIT LAMP brings an Orange accent to the collection, adding a warm visual note to a personal corner.",
  },
  {
    id: 5,
    name: "STEM FLOOR LIGHT",
    category: "light",
    color: "Chrome + White",
    price: 620000,
    image: stemFloorLight,
    description: "A floor light in Chrome + White. STEM FLOOR LIGHT explores the place of lighting within a room, beyond its everyday function.",
  },
  {
    id: 6,
    name: "BLOCK LIGHT",
    category: "light",
    color: "Acid Green",
    price: 340000,
    image: blockLight,
    description: "A small statement in Acid Green. BLOCK LIGHT treats lighting as an object in its own right, introducing an unexpected color to familiar surroundings.",
  },
  {
    id: 7,
    name: "BEND TABLE",
    category: "table",
    color: "Cobalt Blue",
    price: 680000,
    image: bendTable,
    description: "An everyday meeting point in Cobalt Blue. BEND TABLE brings a strong color presence to the spaces where objects and people come together.",
  },
  {
    id: 8,
    name: "LIQUID TABLE",
    category: "table",
    color: "Chrome",
    price: 1250000,
    image: liquidTable,
    description: "A table in the Chrome colorway, selected for a different kind of presence. LIQUID TABLE offers a restrained counterpoint to MORPH’s saturated colors.",
  },
  {
    id: 9,
    name: "ARCH TABLE",
    category: "table",
    color: "Signal Red",
    price: 720000,
    image: archTable,
    description: "A table with a vivid point of view. Signal Red gives ARCH TABLE a distinctive place in the room and in the MORPH collection.",
  },
  {
    id: 10,
    name: "WAVE VASE",
    category: "object",
    color: "Glass + Cobalt",
    price: 280000,
    image: waveVase,
    description: "A vase in Glass + Cobalt, conceived as part of an everyday composition. WAVE VASE invites attention with or without an arrangement.",
  },
  {
    id: 11,
    name: "MELT MIRROR",
    category: "object",
    color: "Chrome",
    price: 590000,
    image: meltMirror,
    description: "A mirror treated as an object. The Chrome colorway places MELT MIRROR between an everyday essential and a visual accent for the home.",
  },
  {
    id: 12,
    name: "STACK OBJECT",
    category: "object",
    color: "Orange + Red + Blue",
    price: 190000,
    image: stackObject,
    description: "Orange, Red and Blue in one expressive object. STACK OBJECT brings the collection’s playful approach to color into a personal composition.",
  },
];

export default products;
