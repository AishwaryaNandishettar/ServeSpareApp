// src/data/CanteenData.js

import chapatiImg from "../assets/chapati.JPG";
import chaatsImg from "../assets/Chaats.WEBP";
import coffeeImg from "../assets/Coffee.webp";
import dessertsImg from "../assets/Desserts.jpg";
import drinksImg from "../assets/Drinks.jpg";
import idliImg from "../assets/Idli.jpg";

import veg_thali from "../assets/Veg-Thali.jpg";
import pizza from "../assets/Pizza.PNG";
import burger from "../assets/Real_veggie.webp";
import IMG_0866 from "../assets/IMG_0866.jpeg";
import IMG_0890 from "../assets/IMG_0890.WEBP";
import IMG_0894 from "../assets/IMG_0894.JPG";
import IMG_0900 from "../assets/IMG_0900.WEBP";
import IMG_0798 from "../assets/IMG_0798.JPG"; // ✅ already correct

const CanteenData = {
  1: {
    name: "Main Canteen",
    link: "/canteen/1",
    items: [
      {
        name: "Veg Thali",
        price: 200,
        type: "veg",
        calories: 420,
        img: veg_thali,
        desc: "2 chapati, dal, rice, sabzi, dahi, papad",
        category: "Indian Main Course",
      },
      {
        name: "Pizza",
        price: 320,
        type: "veg",
        calories: 350,
        img: pizza,
        category: "Snacks",
      },
      {
        name: "Burger",
        price: 520,
        type: "veg",
        calories: 390,
        img: burger,
        category: "Snacks",
      },
      {
        name: "Chana Chaat",
        price: 120,
        type: "veg",
        calories: 260,
        img: chaatsImg,
        category: "Indian Starter",
      },
    ],
  },

  2: {
    name: "Food Court",
    link: "/canteen/2",
    items: [
      {
        name: "Pizza",
        price: 150,
        type: "veg",
        calories: 340,
        img: pizza,
        category: "Snacks",
      },
      {
        name: "Burger",
        price: 199,
        type: "nonveg",
        calories: 420,
        img: burger,
        category: "Snacks",
      },
      {
        name: "Noodles",
        price: 329,
        type: "nonveg",
        calories: 380,
        img: IMG_0798,
        category: "Chinese Main Course",
      },
    ],
  },

  3: {
    name: "North Indian Canteen",
    link: "/canteen/3",
    items: [
      {
        name: "Chats",
        price: 25,
        type: "veg",
        calories: 180,
        img: chaatsImg,
        category: "Snacks",
      },
      {
        name: "Noodles",
        price: 90,
        type: "veg",
        calories: 310,
        img: burger, // ✅ FIXED (was IMG_0862)
        category: "Chinese Main Course",
      },
      {
        name: "Burger",
        price: 290,
        type: "nonveg",
        calories: 410,
        img: burger,
        category: "Snacks",
      },
      {
        name: "Chole Bhature",
        price: 290,
        type: "veg",
        calories: 450,
        img: chapatiImg,
        category: "Indian Main Course",
      },
      {
        name: "Fried Rice",
        price: 160,
        type: "veg",
        calories: 330,
        img: IMG_0890,
        category: "Chinese Main Course",
      },
    ],
  },

  4: {
    name: "Campus Canteen",
    link: "/canteen/4",
    items: [
      {
        name: "Fried Rice",
        price: 225,
        type: "veg",
        calories: 340,
        img: IMG_0890,
        category: "Chinese Main Course",
      },
      {
        name: "Noodles",
        price: 190,
        type: "nonveg",
        calories: 360,
        img: IMG_0798,
        category: "Chinese Main Course",
      },
      {
        name: "Pizza",
        price: 299,
        type: "veg",
        calories: 370,
        img: pizza,
        category: "Snacks",
      },
      {
        name: "Chole Bhature",
        price: 190,
        type: "veg",
        calories: 430,
        img: chapatiImg,
        category: "Indian Main Course",
      },
    ],
  },
};

export default CanteenData;
