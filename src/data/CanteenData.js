// src/data/CanteenData.js

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
        img: "/image/veg_thali.JPG",
        desc: "2 chapati, dal, rice, sabzi, dahi, papad",
      },
      {
        name: "Pizza",
        price: 320,
        type: "veg",
        calories: 350,
        img: "/image/paneer.JPG",
      },
      {
        name: "Burger",
        price: 520,
        type: "veg",
        calories: 390,
        img: "/image/paneer.JPG",
      },
      {
        name: "Chana Chaat",
        price: 120,
        type: "veg",
        calories: 260,
        img: "/image/paneer.JPG",
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
        img: "/image/IMG_0969.WEBP",
      },
      {
        name: "Burger",
        price: 199,
        type: "nonveg",
        calories: 420,
        img: "/image/Burger.WEBP",
      },
      {
        name: "Noodles",
        price: 329,
        type: "nonveg",
        calories: 380,
        img: "/image/Burger.WEBP",
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
        img: "/image/chapati.JPG",
      },
      {
        name: "Noodles",
        price: 90,
        type: "veg",
        calories: 310,
        img: "/image/curry.JPG",
      },
      {
        name: "Burger",
        price: 290,
        type: "nonveg",
        calories: 410,
        img: "/image/curry.JPG",
      },
      {
        name: "Chole Bhature",
        price: 290,
        type: "veg",
        calories: 450,
        img: "/image/curry.JPG",
      },
      {
        name: "Fried Rice",
        price: 160,
        type: "veg",
        calories: 330,
        img: "/image/chapati.JPG",
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
        img: "/image/chapati.JPG",
      },
      {
        name: "Noodles",
        price: 190,
        type: "nonveg",
        calories: 360,
        img: "/image/curry.JPG",
      },
      {
        name: "Pizza",
        price: 299,
        type: "veg",
        calories: 370,
        img: "/image/curry.JPG",
      },
      {
        name: "Chole Bhature",
        price: 190,
        type: "veg",
        calories: 430,
        img: "/image/curry.JPG",
      },
    ],
  },
};

export default CanteenData;
