import type { Product } from "../types/product";

export const categorias: string[] = ["Hamburguesas", "Pizzas", "Papas Fritas", "Bebidas"];

export const productos: Product[] = [
    {
        id: 1,
        nombre: "Hamburguesa Simple",
        precio: 10000,
        imagen: "/img/hamburguesaSimple.png",
        categoria: "Hamburguesas"
    },
    {
        id: 2,
        nombre: "Hamburrguesa Doble",
        precio: 12000,
        imagen: "/img/hamburguesaDoble.png",
        categoria: "Hamburguesas"
    },
    {
        id: 3,
        nombre: "Hamburguesa Triple",
        precio: 14000,
        imagen: "/img/hamburguesaTriple.png",
        categoria: "Hamburguesas"
    },
    {
        id: 4,
        nombre: "Hamburguesa LyT",
        precio: 13000,
        imagen: "/img/hamburguesaTomate.png",
        categoria: "Hamburguesas"
    },
    {
        id: 5,
        nombre: "Hamburguesa Con Huevo",
        precio: 13000,
        imagen: "/img/hamburguesaHuevo.png",
        categoria: "Hamburguesas"
    },
    {
        id: 6,
        nombre: "Pizza Muzzarella",
        precio: 10000,
        imagen: "/img/pizzaMuzza.png",
        categoria: "Pizzas"
    },
    {
        id: 7,
        nombre: "Pizza Napolitana",
        precio: 13000,
        imagen: "/img/pizzaNapo.png",
        categoria: "Pizzas"
    },
    {
        id: 8,
        nombre: "Pizza Peperoni",
        precio: 15000,
        imagen: "/img/pizzaPep.png",
        categoria: "Pizzas"
    },
    {
        id: 9,
        nombre: "Pizza Jamon y Morron",
        precio: 12000,
        imagen: "/img/pizzaJyM.png",
        categoria: "Pizzas"
    },
    {
        id: 10,
        nombre: "Pizza Rucula",
        precio: 11000,
        imagen: "/img/pizzaRucula.png",
        categoria: "Pizzas"
    },
    {
        id: 11,
        nombre: "Papas Fritas con Cheddar",
        precio: 10000,
        imagen: "/img/papasCheddar.png",
        categoria: "Papas Fritas"
    },
    {
        id: 12,
        nombre: "Papas Fritas con Bacon",
        precio: 11000,
        imagen: "/img/papasBecon.png",
        categoria: "Papas Fritas"
    },
    {
        id: 13,
        nombre: "Coca Cola",
        precio: 2500,
        imagen: "/img/cocacola.png",
        categoria: "Bebidas"
    },
    {
        id: 14,
        nombre: "Sprite",
        precio: 2500,
        imagen: "/img/sprite.png",
        categoria: "Bebidas"
    },
    {
        id: 15,
        nombre: "Agua Mineral",
        precio: 1500,
        imagen: "/img/agua.png",
        categoria: "Bebidas"
    }
];