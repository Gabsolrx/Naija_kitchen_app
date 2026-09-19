import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://sktwshsqlqtpfqtduheh.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrdHdzaHNxbHF0cGZxdGR1aGVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNjUwNjUsImV4cCI6MjEwMzg0MTA2NX0.Rh5nquXpCS7qp7eZw6eUaaksuBCtD8oWZDctTacYlCc');

const quickMeals = [
  {
    id: "qm1",
    name: "Indomie with Spices and Carrot",
    category: "Quick Meals",
    description: "A fast and delicious noodle meal enhanced with local spices, carrots, and eggs.",
    image_url: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: [
      "2 packs of Indomie Noodles",
      "1 medium carrot (diced)",
      "1 egg",
      "1 small onion (chopped)",
      "1 tablespoon vegetable oil",
      "Dry pepper or suya spice to taste"
    ],
    instructions: [
      "Boil water in a pot and add the noodles (without the seasoning).",
      "In a separate pan, heat the vegetable oil and fry the onions and diced carrots.",
      "Add the indomie seasoning and extra spices to the vegetables.",
      "Crack the egg into the pan and scramble.",
      "Drain the noodles and toss them into the pan with the vegetables and egg. Mix thoroughly and serve hot."
    ],
    preparation_time: 5,
    cooking_time: 10,
    servings: 1,
    difficulty: "Easy",
    tags: ["Indomie", "Noodles", "Fast", "Easy"],
    search_keywords: ["indomie", "noodles", "quick meal", "carrot"],
    timer_duration: 600
  },
  {
    id: "qm2",
    name: "Quick Bread and Egg Toast",
    category: "Quick Meals",
    description: "Simple pan-toasted bread with spicy Nigerian-style scrambled eggs.",
    image_url: "https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: [
      "4 slices of sliced bread",
      "2 eggs",
      "1 small onion (chopped)",
      "1 scotch bonnet pepper (atarodo, chopped)",
      "Pinch of salt and seasoning cube",
      "2 tablespoons butter or margarine"
    ],
    instructions: [
      "Whisk the eggs in a bowl with the chopped onions, pepper, salt, and a little seasoning.",
      "Heat a pan over medium heat and melt a little butter.",
      "Pour the egg mixture into the pan and fry until just set, then remove and set aside.",
      "Butter the bread slices and toast them in the same pan until golden brown.",
      "Serve the toast with the eggs."
    ],
    preparation_time: 5,
    cooking_time: 5,
    servings: 2,
    difficulty: "Easy",
    tags: ["Bread", "Egg", "Toast", "Breakfast"],
    search_keywords: ["bread", "egg", "toast", "quick meal"],
    timer_duration: 300
  },
  {
    id: "qm3",
    name: "Garri and Groundnut",
    category: "Quick Meals",
    description: "The classic, no-cook Nigerian quick fix. Refreshing and filling.",
    image_url: "https://images.unsplash.com/photo-1517093602195-b40af9688b46?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: [
      "1 cup Garri (cassava flakes)",
      "Cold water (and ice cubes if available)",
      "Sugar to taste",
      "Milk (optional)",
      "Roasted groundnuts (peanuts)"
    ],
    instructions: [
      "Pour the garri into a bowl and add a little water to wash away dirt. Pour out the first water.",
      "Add fresh cold water to the garri until it floats slightly.",
      "Add sugar, milk, and ice cubes.",
      "Top with a generous amount of roasted groundnuts and enjoy immediately."
    ],
    preparation_time: 2,
    cooking_time: 0,
    servings: 1,
    difficulty: "Easy",
    tags: ["Garri", "No Cook", "Fast"],
    search_keywords: ["garri", "groundnut", "quick meal", "cold"],
    timer_duration: 0
  },
  {
    id: "qm4",
    name: "Quick Spaghetti Stir-fry",
    category: "Quick Meals",
    description: "A 15-minute pasta meal using leftover stew or basic ingredients.",
    image_url: "https://images.unsplash.com/photo-1516100882582-96c3a05fe590?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: [
      "200g Spaghetti",
      "2 tablespoons vegetable oil",
      "1 small onion (sliced)",
      "1 scotch bonnet pepper (chopped)",
      "1 tablespoon tomato paste",
      "1 seasoning cube",
      "Leftover meat or sausage (sliced)"
    ],
    instructions: [
      "Boil the spaghetti in salted water until al dente. Drain.",
      "In a wide pan, heat the oil. Fry the onions, pepper, and tomato paste for 2 minutes.",
      "Add the sliced meat or sausage, and crumble in the seasoning cube.",
      "Toss the cooked spaghetti into the pan. Mix vigorously until the pasta is coated.",
      "Serve hot."
    ],
    preparation_time: 5,
    cooking_time: 10,
    servings: 2,
    difficulty: "Easy",
    tags: ["Spaghetti", "Pasta", "Stir-fry"],
    search_keywords: ["spaghetti", "pasta", "quick meal"],
    timer_duration: 600
  },
  {
    id: "qm5",
    name: "Plantain and Egg Sauce",
    category: "Quick Meals",
    description: "Fried ripe plantains served with a quick and savory egg sauce.",
    image_url: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: [
      "2 ripe plantains",
      "Vegetable oil (for frying)",
      "2 eggs",
      "1 tomato (chopped)",
      "1 small onion (chopped)",
      "Salt and seasoning to taste"
    ],
    instructions: [
      "Peel the plantains, cut into diagonal slices, and fry in hot oil until golden. Remove and set aside.",
      "Reduce the oil in the pan to about 1 tablespoon. Fry the chopped onions and tomatoes until soft.",
      "Whisk the eggs with a pinch of salt and seasoning.",
      "Pour the eggs over the tomato mixture. Let it set slightly, then scramble.",
      "Serve the fried plantain with the egg sauce."
    ],
    preparation_time: 5,
    cooking_time: 15,
    servings: 2,
    difficulty: "Medium",
    tags: ["Plantain", "Egg", "Dodo"],
    search_keywords: ["plantain", "egg", "dodo", "quick meal"],
    timer_duration: 900
  }
];

async function run() {
  for (const meal of quickMeals) {
    const { data, error } = await supabase
      .from('recipes')
      .upsert(meal, { onConflict: 'id' });
      
    if (error) {
      console.error('Error inserting', meal.name, error);
    } else {
      console.log('Successfully inserted', meal.name);
    }
  }
}
run();
