const exercise1 = (numbers) => {
  return numbers
    .filter(num => num % 2 === 0)
    .sort((a, b) => a - b);
};

const numbers1 = [1, 7, 10, 9, 8, 2];
console.log("Exercice 1:", exercise1(numbers1));

const exercise2 = (numbers) => {
  return numbers.reduce((acc, current, index) => {
    if (index === 0) {
      return [current];
    } else {
      return [...acc, current * acc[index - 1]];
    }
  }, []);
};

const numbers2 = [1, 3, 4];
console.log("Exercice 2:", exercise2(numbers2));

const exercise3 = (text) => {
  return text
    .split('\n')
    .map(line => line.toUpperCase())
    .filter(line => line.includes('I'));
};

const text = "Voici un exemple de texte.\nCette lIgne contient un I.\nCette ligne n'a pas la lettre.";
console.log("Exercice 3:");
exercise3(text).forEach(line => console.log(line));

const exercise4 = (numbers) => {
  return numbers.reduce((max, current) => Math.max(max, current), numbers[0]);
};

const numbers4 = [1, 7, 10, 9, 8];
console.log("Exercice 4:", exercise4(numbers4));

const exercise5 = (products) => {
  return products
    .map(product => product.price * 1.25)
    .reduce((total, price) => total + price, 0);
};

const products = [
  { name: "Shirt", price: 20 },
  { name: "Shoes", price: 50 },
  { name: "Hat", price: 15 }
];
console.log("Exercice 5:", exercise5(products));

const filterByCategory = (products, category) => {
  return products.filter(product => product.category === category);
};

const calculateTotalPrice = (products) => {
  return products.reduce((total, product) => total + product.price, 0);
};

const findLowStockProducts = (products) => {
  return products.filter(product => product.stock < 5);
};

const sortByPrice = (products) => {
  return [...products].sort((a, b) => a.price - b.price);
};

const sortByStock = (products) => {
  return [...products].sort((a, b) => a.stock - b.stock);
};

const searchByName = (products, searchTerm) => {
  return products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

async function loadProductsData() {
  try {
    const response = await fetch('products.json');
    return await response.json();
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
    return [];
  }
}

const sampleProducts = [
  { name: 'Ordinateur portable', price: 999, category: 'Électronique', stock: 10 },
  { name: 'Smartphone', price: 699, category: 'Électronique', stock: 15 },
  { name: 'Casque audio', price: 149, category: 'Électronique', stock: 3 },
  { name: 'T-shirt', price: 19.99, category: 'Vêtements', stock: 50 },
  { name: 'Jeans', price: 59.99, category: 'Vêtements', stock: 25 },
  { name: 'Chaussures de sport', price: 89.99, category: 'Chaussures', stock: 4 }
];

console.log("Exercice 6:");
console.log("Produits électroniques:", filterByCategory(sampleProducts, 'Électronique'));
console.log("Prix total:", calculateTotalPrice(sampleProducts));
console.log("Produits en faible stock:", findLowStockProducts(sampleProducts));
console.log("Produits triés par prix:", sortByPrice(sampleProducts));
console.log("Produits triés par stock:", sortByStock(sampleProducts));
console.log("Recherche 'phone':", searchByName(sampleProducts, 'phone'));
