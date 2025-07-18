"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Search,
  Filter,
  Clock,
  Users,
  Star,
  Heart,
  Utensils,
  ChefHat,
  Leaf,
  Zap,
  TrendingDown,
  Home,
  ArrowLeft,
  Download,
  BookOpen,
  Target,
  Activity,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import MyMedLogo from "@/components/mymed-logo"
import PoweredByFooter from "@/components/powered-by-footer"

interface Recipe {
  id: string
  name: string
  category: string
  cuisine: string
  difficulty: "Easy" | "Medium" | "Hard"
  prepTime: number
  cookTime: number
  servings: number
  calories: number
  carbs: number
  protein: number
  fat: number
  fiber: number
  sugar: number
  sodium: number
  glycemicIndex: "Low" | "Medium" | "High"
  glycemicLoad: number
  bloodSugarImpact: "Minimal" | "Low" | "Moderate" | "High"
  diabeticFriendly: boolean
  ingredients: Array<{
    item: string
    quantity: string
    notes?: string
  }>
  instructions: string[]
  tips: string[]
  nutritionNotes: string
  tags: string[]
  image: string
  rating: number
  reviews: number
  healthBenefits: string[]
  warnings?: string[]
}

const diabeticRecipes: Recipe[] = [
  {
    id: "1",
    name: "Quinoa Vegetable Upma",
    category: "Breakfast",
    cuisine: "Indian",
    difficulty: "Easy",
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    calories: 185,
    carbs: 28,
    protein: 7,
    fat: 5,
    fiber: 4,
    sugar: 3,
    sodium: 320,
    glycemicIndex: "Low",
    glycemicLoad: 12,
    bloodSugarImpact: "Minimal",
    diabeticFriendly: true,
    ingredients: [
      { item: "Quinoa", quantity: "1 cup", notes: "Rinsed and drained" },
      { item: "Mixed vegetables", quantity: "1 cup", notes: "Carrots, peas, beans - finely chopped" },
      { item: "Onion", quantity: "1 medium", notes: "Finely chopped" },
      { item: "Ginger-garlic paste", quantity: "1 tsp" },
      { item: "Green chilies", quantity: "2", notes: "Slit lengthwise" },
      { item: "Curry leaves", quantity: "8-10" },
      { item: "Mustard seeds", quantity: "1 tsp" },
      { item: "Turmeric powder", quantity: "1/2 tsp" },
      { item: "Coconut oil", quantity: "2 tsp" },
      { item: "Salt", quantity: "To taste" },
      { item: "Fresh coriander", quantity: "2 tbsp", notes: "Chopped" },
      { item: "Lemon juice", quantity: "1 tbsp" },
    ],
    instructions: [
      "Dry roast quinoa in a pan for 2-3 minutes until fragrant. Set aside.",
      "Heat coconut oil in a heavy-bottomed pan. Add mustard seeds and let them splutter.",
      "Add curry leaves, green chilies, and ginger-garlic paste. Sauté for 30 seconds.",
      "Add chopped onions and cook until translucent (3-4 minutes).",
      "Add mixed vegetables and cook for 5 minutes until slightly tender.",
      "Add turmeric powder and roasted quinoa. Mix well.",
      "Add 2 cups of hot water and salt. Bring to a boil.",
      "Reduce heat, cover, and simmer for 15 minutes until quinoa is cooked and water is absorbed.",
      "Turn off heat and let it rest for 5 minutes.",
      "Garnish with fresh coriander and lemon juice before serving.",
    ],
    tips: [
      "Rinse quinoa thoroughly to remove bitter coating",
      "Use a 1:2 ratio of quinoa to water for perfect texture",
      "Add vegetables of your choice - bell peppers, cauliflower work well",
      "Serve hot with coconut chutney or plain yogurt",
    ],
    nutritionNotes:
      "High in protein and fiber, low glycemic index makes it perfect for blood sugar control. Quinoa provides complete amino acids.",
    tags: ["High Protein", "High Fiber", "Gluten-Free", "Vegan", "Low GI"],
    image: "/placeholder.svg?height=300&width=400&text=Quinoa+Upma",
    rating: 4.8,
    reviews: 156,
    healthBenefits: [
      "Helps stabilize blood sugar levels",
      "Rich in complete proteins",
      "High fiber aids digestion",
      "Contains essential minerals like magnesium and iron",
    ],
    warnings: ["Monitor portion size", "Check blood sugar 2 hours after eating"],
  },
  {
    id: "2",
    name: "Grilled Salmon with Roasted Vegetables",
    category: "Dinner",
    cuisine: "Continental",
    difficulty: "Medium",
    prepTime: 20,
    cookTime: 25,
    servings: 2,
    calories: 320,
    carbs: 12,
    protein: 35,
    fat: 18,
    fiber: 5,
    sugar: 6,
    sodium: 280,
    glycemicIndex: "Low",
    glycemicLoad: 4,
    bloodSugarImpact: "Minimal",
    diabeticFriendly: true,
    ingredients: [
      { item: "Salmon fillets", quantity: "2 pieces (150g each)", notes: "Skin-on, bones removed" },
      { item: "Broccoli", quantity: "1 cup", notes: "Cut into florets" },
      { item: "Bell peppers", quantity: "1 cup", notes: "Mixed colors, sliced" },
      { item: "Zucchini", quantity: "1 medium", notes: "Sliced into rounds" },
      { item: "Cherry tomatoes", quantity: "1 cup", notes: "Halved" },
      { item: "Olive oil", quantity: "3 tbsp", notes: "Extra virgin" },
      { item: "Lemon", quantity: "1", notes: "Juiced and zested" },
      { item: "Garlic", quantity: "3 cloves", notes: "Minced" },
      { item: "Fresh herbs", quantity: "2 tbsp", notes: "Dill or parsley, chopped" },
      { item: "Black pepper", quantity: "1/2 tsp", notes: "Freshly ground" },
      { item: "Sea salt", quantity: "To taste" },
    ],
    instructions: [
      "Preheat oven to 200°C (400°F).",
      "Pat salmon fillets dry and season with salt, pepper, and half the lemon juice.",
      "Toss vegetables with 2 tbsp olive oil, minced garlic, salt, and pepper.",
      "Arrange vegetables on a baking sheet and roast for 15 minutes.",
      "Heat remaining olive oil in an oven-safe skillet over medium-high heat.",
      "Place salmon skin-side up and cook for 4 minutes without moving.",
      "Flip salmon and transfer skillet to oven for 6-8 minutes.",
      "Remove vegetables and salmon from oven.",
      "Drizzle salmon with remaining lemon juice and sprinkle with fresh herbs.",
      "Serve immediately with roasted vegetables.",
    ],
    tips: [
      "Don't overcook salmon - it should flake easily but still be moist",
      "Use a meat thermometer - internal temperature should reach 63°C (145°F)",
      "Let salmon rest at room temperature for 10 minutes before cooking",
      "Choose wild-caught salmon for better omega-3 content",
    ],
    nutritionNotes:
      "Excellent source of omega-3 fatty acids and high-quality protein. Very low in carbohydrates, making it ideal for blood sugar management.",
    tags: ["High Protein", "Low Carb", "Omega-3", "Heart Healthy", "Keto-Friendly"],
    image: "/placeholder.svg?height=300&width=400&text=Grilled+Salmon",
    rating: 4.9,
    reviews: 203,
    healthBenefits: [
      "Rich in omega-3 fatty acids for heart health",
      "High-quality protein supports muscle maintenance",
      "Anti-inflammatory properties",
      "Supports brain health and cognitive function",
    ],
  },
  {
    id: "3",
    name: "Moong Dal Chilla (Lentil Pancakes)",
    category: "Breakfast",
    cuisine: "Indian",
    difficulty: "Easy",
    prepTime: 10,
    cookTime: 15,
    servings: 3,
    calories: 145,
    carbs: 18,
    protein: 9,
    fat: 4,
    fiber: 6,
    sugar: 2,
    sodium: 250,
    glycemicIndex: "Low",
    glycemicLoad: 8,
    bloodSugarImpact: "Low",
    diabeticFriendly: true,
    ingredients: [
      { item: "Yellow moong dal", quantity: "1 cup", notes: "Soaked for 4 hours" },
      { item: "Ginger", quantity: "1 inch piece", notes: "Peeled" },
      { item: "Green chilies", quantity: "2", notes: "Adjust to taste" },
      { item: "Onion", quantity: "1 small", notes: "Finely chopped" },
      { item: "Tomato", quantity: "1 small", notes: "Finely chopped" },
      { item: "Spinach", quantity: "1/2 cup", notes: "Finely chopped" },
      { item: "Coriander leaves", quantity: "2 tbsp", notes: "Chopped" },
      { item: "Cumin seeds", quantity: "1/2 tsp" },
      { item: "Turmeric powder", quantity: "1/4 tsp" },
      { item: "Salt", quantity: "To taste" },
      { item: "Coconut oil", quantity: "2 tsp", notes: "For cooking" },
    ],
    instructions: [
      "Drain the soaked moong dal and grind with ginger and green chilies to a smooth paste.",
      "Add a little water if needed to make a thick batter consistency.",
      "Transfer to a bowl and add chopped onion, tomato, spinach, and coriander.",
      "Add cumin seeds, turmeric powder, and salt. Mix well.",
      "Let the batter rest for 10 minutes.",
      "Heat a non-stick pan and brush with a little coconut oil.",
      "Pour a ladle of batter and spread it into a thin circle.",
      "Cook on medium heat for 2-3 minutes until the bottom is golden.",
      "Flip and cook the other side for 2 minutes.",
      "Serve hot with mint chutney or plain yogurt.",
    ],
    tips: [
      "Soak dal for at least 4 hours for easy grinding",
      "Batter should be thick enough to spread but not too thick",
      "Add vegetables of your choice - grated carrots, bell peppers work well",
      "Cook on medium heat to ensure even cooking",
    ],
    nutritionNotes:
      "High in plant-based protein and fiber. Moong dal is easily digestible and has a low glycemic index, making it excellent for diabetes management.",
    tags: ["High Protein", "High Fiber", "Gluten-Free", "Vegetarian", "Low GI"],
    image: "/placeholder.svg?height=300&width=400&text=Moong+Dal+Chilla",
    rating: 4.7,
    reviews: 189,
    healthBenefits: [
      "Excellent source of plant-based protein",
      "High fiber content aids in blood sugar control",
      "Rich in folate and magnesium",
      "Easy to digest and light on stomach",
    ],
  },
  {
    id: "4",
    name: "Cauliflower Rice Biryani",
    category: "Lunch",
    cuisine: "Indian",
    difficulty: "Medium",
    prepTime: 30,
    cookTime: 40,
    servings: 4,
    calories: 220,
    carbs: 15,
    protein: 12,
    fat: 14,
    fiber: 8,
    sugar: 7,
    sodium: 380,
    glycemicIndex: "Low",
    glycemicLoad: 6,
    bloodSugarImpact: "Low",
    diabeticFriendly: true,
    ingredients: [
      { item: "Cauliflower", quantity: "1 large head", notes: "Grated to rice-like texture" },
      { item: "Chicken breast", quantity: "300g", notes: "Cut into pieces (optional for vegetarian)" },
      { item: "Basmati rice", quantity: "1/2 cup", notes: "Soaked for 30 minutes" },
      { item: "Onions", quantity: "2 large", notes: "Thinly sliced" },
      { item: "Yogurt", quantity: "1/2 cup", notes: "Greek yogurt preferred" },
      { item: "Ginger-garlic paste", quantity: "2 tbsp" },
      { item: "Biryani masala", quantity: "2 tsp" },
      { item: "Red chili powder", quantity: "1 tsp" },
      { item: "Turmeric powder", quantity: "1/2 tsp" },
      { item: "Garam masala", quantity: "1 tsp" },
      { item: "Saffron", quantity: "Pinch", notes: "Soaked in 2 tbsp warm milk" },
      { item: "Mint leaves", quantity: "1/4 cup", notes: "Chopped" },
      { item: "Coriander leaves", quantity: "1/4 cup", notes: "Chopped" },
      { item: "Ghee", quantity: "3 tbsp" },
      { item: "Salt", quantity: "To taste" },
    ],
    instructions: [
      "Marinate chicken with yogurt, ginger-garlic paste, red chili powder, turmeric, and salt for 30 minutes.",
      "Deep fry sliced onions until golden brown and crispy. Drain and set aside.",
      "In the same oil, cook marinated chicken until 80% done. Set aside.",
      "Boil water with whole spices and cook soaked basmati rice until 70% done. Drain.",
      "Heat ghee in a heavy-bottomed pot. Add cauliflower rice and sauté for 5 minutes.",
      "Layer the cauliflower rice, then chicken, then partially cooked basmati rice.",
      "Sprinkle fried onions, mint, coriander, and saffron milk on top.",
      "Cover with aluminum foil, then place the lid tightly.",
      "Cook on high heat for 3 minutes, then reduce to low heat for 45 minutes.",
      "Turn off heat and let it rest for 10 minutes before opening.",
      "Gently mix and serve hot with raita and boiled eggs.",
    ],
    tips: [
      "Use a food processor to grate cauliflower into rice-like texture",
      "Don't skip the resting time - it helps flavors meld together",
      "For vegetarian version, replace chicken with paneer or mixed vegetables",
      "Adjust spice levels according to your preference",
    ],
    nutritionNotes:
      "Significantly lower in carbs than traditional biryani due to cauliflower rice substitution. High in protein and fiber while maintaining authentic flavors.",
    tags: ["Low Carb", "High Protein", "High Fiber", "Keto-Friendly", "Traditional"],
    image: "/placeholder.svg?height=300&width=400&text=Cauliflower+Biryani",
    rating: 4.6,
    reviews: 142,
    healthBenefits: [
      "Lower carbohydrate content than traditional biryani",
      "High in antioxidants from cauliflower",
      "Good source of lean protein",
      "Rich in vitamins C and K",
    ],
  },
  {
    id: "5",
    name: "Greek Salad with Grilled Chicken",
    category: "Lunch",
    cuisine: "Mediterranean",
    difficulty: "Easy",
    prepTime: 15,
    cookTime: 12,
    servings: 2,
    calories: 285,
    carbs: 8,
    protein: 28,
    fat: 16,
    fiber: 4,
    sugar: 6,
    sodium: 420,
    glycemicIndex: "Low",
    glycemicLoad: 3,
    bloodSugarImpact: "Minimal",
    diabeticFriendly: true,
    ingredients: [
      { item: "Chicken breast", quantity: "2 pieces (120g each)", notes: "Boneless, skinless" },
      { item: "Cucumber", quantity: "1 large", notes: "Diced" },
      { item: "Cherry tomatoes", quantity: "1 cup", notes: "Halved" },
      { item: "Red onion", quantity: "1/4 cup", notes: "Thinly sliced" },
      { item: "Kalamata olives", quantity: "1/4 cup", notes: "Pitted" },
      { item: "Feta cheese", quantity: "60g", notes: "Crumbled" },
      { item: "Extra virgin olive oil", quantity: "3 tbsp" },
      { item: "Lemon juice", quantity: "2 tbsp", notes: "Fresh" },
      { item: "Dried oregano", quantity: "1 tsp" },
      { item: "Fresh parsley", quantity: "2 tbsp", notes: "Chopped" },
      { item: "Salt and pepper", quantity: "To taste" },
    ],
    instructions: [
      "Season chicken breasts with salt, pepper, and 1 tsp oregano.",
      "Heat 1 tbsp olive oil in a grill pan over medium-high heat.",
      "Cook chicken for 6 minutes on each side until internal temperature reaches 74°C.",
      "Let chicken rest for 5 minutes, then slice into strips.",
      "In a large bowl, combine cucumber, tomatoes, red onion, and olives.",
      "Whisk together remaining olive oil, lemon juice, oregano, salt, and pepper.",
      "Pour dressing over vegetables and toss gently.",
      "Top with sliced chicken and crumbled feta cheese.",
      "Garnish with fresh parsley and serve immediately.",
    ],
    tips: [
      "Don't overcook chicken - use a meat thermometer for accuracy",
      "Let vegetables sit with dressing for 10 minutes to absorb flavors",
      "Use authentic Greek feta for best flavor",
      "Serve chilled for a refreshing meal",
    ],
    nutritionNotes:
      "Very low in carbohydrates and high in protein. Rich in healthy monounsaturated fats from olive oil. Perfect for blood sugar management.",
    tags: ["Low Carb", "High Protein", "Mediterranean", "Heart Healthy", "Gluten-Free"],
    image: "/placeholder.svg?height=300&width=400&text=Greek+Salad+Chicken",
    rating: 4.8,
    reviews: 167,
    healthBenefits: [
      "Rich in healthy monounsaturated fats",
      "High-quality lean protein",
      "Antioxidants from fresh vegetables",
      "Supports heart health",
    ],
  },
  {
    id: "6",
    name: "Chia Seed Pudding with Berries",
    category: "Snack",
    cuisine: "International",
    difficulty: "Easy",
    prepTime: 10,
    cookTime: 0,
    servings: 2,
    calories: 165,
    carbs: 12,
    protein: 6,
    fat: 11,
    fiber: 10,
    sugar: 8,
    sodium: 45,
    glycemicIndex: "Low",
    glycemicLoad: 4,
    bloodSugarImpact: "Minimal",
    diabeticFriendly: true,
    ingredients: [
      { item: "Chia seeds", quantity: "4 tbsp" },
      { item: "Unsweetened almond milk", quantity: "1 cup" },
      { item: "Vanilla extract", quantity: "1/2 tsp" },
      { item: "Stevia", quantity: "1-2 drops", notes: "Or sugar substitute of choice" },
      { item: "Mixed berries", quantity: "1/2 cup", notes: "Blueberries, strawberries, raspberries" },
      { item: "Chopped almonds", quantity: "2 tbsp" },
      { item: "Cinnamon powder", quantity: "Pinch" },
      { item: "Fresh mint", quantity: "For garnish" },
    ],
    instructions: [
      "In a bowl, whisk together chia seeds, almond milk, vanilla extract, and stevia.",
      "Whisk vigorously for 2 minutes to prevent clumping.",
      "Cover and refrigerate for at least 4 hours or overnight.",
      "Stir the pudding after 30 minutes to break up any clumps.",
      "Before serving, stir the pudding again.",
      "Divide into serving bowls or glasses.",
      "Top with mixed berries and chopped almonds.",
      "Sprinkle with cinnamon powder and garnish with mint.",
      "Serve chilled.",
    ],
    tips: [
      "Stir the mixture several times in the first hour to prevent clumping",
      "Adjust sweetness according to your preference",
      "Can be made up to 3 days in advance",
      "Try different milk alternatives like coconut or oat milk",
    ],
    nutritionNotes:
      "Extremely high in fiber and omega-3 fatty acids. The high fiber content helps slow sugar absorption, making it ideal for diabetics.",
    tags: ["High Fiber", "Omega-3", "Vegan", "Make-Ahead", "Low GI"],
    image: "/placeholder.svg?height=300&width=400&text=Chia+Pudding",
    rating: 4.5,
    reviews: 98,
    healthBenefits: [
      "Extremely high in fiber for blood sugar control",
      "Rich in omega-3 fatty acids",
      "Good source of plant-based protein",
      "Contains antioxidants from berries",
    ],
  },
  {
    id: "7",
    name: "Palak Paneer (Low-Fat Version)",
    category: "Dinner",
    cuisine: "Indian",
    difficulty: "Medium",
    prepTime: 20,
    cookTime: 25,
    servings: 4,
    calories: 195,
    carbs: 9,
    protein: 14,
    fat: 12,
    fiber: 5,
    sugar: 4,
    sodium: 340,
    glycemicIndex: "Low",
    glycemicLoad: 3,
    bloodSugarImpact: "Minimal",
    diabeticFriendly: true,
    ingredients: [
      { item: "Fresh spinach", quantity: "500g", notes: "Washed and chopped" },
      { item: "Low-fat paneer", quantity: "200g", notes: "Cut into cubes" },
      { item: "Onion", quantity: "1 medium", notes: "Finely chopped" },
      { item: "Tomatoes", quantity: "2 medium", notes: "Chopped" },
      { item: "Ginger-garlic paste", quantity: "1 tbsp" },
      { item: "Green chilies", quantity: "2", notes: "Slit lengthwise" },
      { item: "Cumin seeds", quantity: "1 tsp" },
      { item: "Garam masala", quantity: "1/2 tsp" },
      { item: "Turmeric powder", quantity: "1/4 tsp" },
      { item: "Red chili powder", quantity: "1/2 tsp" },
      { item: "Olive oil", quantity: "2 tbsp" },
      { item: "Low-fat cream", quantity: "2 tbsp", notes: "Optional" },
      { item: "Salt", quantity: "To taste" },
    ],
    instructions: [
      "Blanch spinach in boiling water for 2 minutes. Drain and blend to a smooth puree.",
      "Heat 1 tbsp oil in a non-stick pan and lightly sauté paneer cubes until golden. Set aside.",
      "In the same pan, heat remaining oil and add cumin seeds.",
      "Add chopped onions and cook until translucent.",
      "Add ginger-garlic paste and green chilies. Cook for 1 minute.",
      "Add chopped tomatoes and cook until they break down completely.",
      "Add turmeric, red chili powder, and garam masala. Cook for 2 minutes.",
      "Add spinach puree and mix well. Cook for 5 minutes.",
      "Add sautéed paneer cubes and simmer for 3-4 minutes.",
      "Add low-fat cream if using, and adjust salt.",
      "Garnish with fresh cream and serve hot with cauliflower rice or small portion of brown rice.",
    ],
    tips: [
      "Don't overcook spinach to retain its vibrant green color",
      "Use low-fat paneer to reduce overall calorie content",
      "Blanching spinach helps remove any bitterness",
      "Adjust spice levels according to your preference",
    ],
    nutritionNotes:
      "High in iron, protein, and vitamins while being low in carbohydrates. The modified recipe reduces fat content while maintaining authentic flavors.",
    tags: ["High Protein", "Iron Rich", "Low Carb", "Vegetarian", "Traditional"],
    image: "/placeholder.svg?height=300&width=400&text=Palak+Paneer",
    rating: 4.7,
    reviews: 134,
    healthBenefits: [
      "Rich in iron and folate from spinach",
      "High-quality protein from paneer",
      "Low in carbohydrates",
      "Contains antioxidants and vitamins A, C, K",
    ],
  },
  {
    id: "8",
    name: "Baked Cod with Herbs",
    category: "Dinner",
    cuisine: "Continental",
    difficulty: "Easy",
    prepTime: 10,
    cookTime: 18,
    servings: 2,
    calories: 165,
    carbs: 2,
    protein: 32,
    fat: 3,
    fiber: 1,
    sugar: 1,
    sodium: 220,
    glycemicIndex: "Low",
    glycemicLoad: 1,
    bloodSugarImpact: "Minimal",
    diabeticFriendly: true,
    ingredients: [
      { item: "Cod fillets", quantity: "2 pieces (150g each)", notes: "Fresh or thawed" },
      { item: "Lemon", quantity: "1", notes: "Juiced and zested" },
      { item: "Fresh dill", quantity: "2 tbsp", notes: "Chopped" },
      { item: "Fresh parsley", quantity: "2 tbsp", notes: "Chopped" },
      { item: "Garlic", quantity: "2 cloves", notes: "Minced" },
      { item: "Olive oil", quantity: "1 tbsp" },
      { item: "Paprika", quantity: "1/2 tsp" },
      { item: "Black pepper", quantity: "1/4 tsp", notes: "Freshly ground" },
      { item: "Sea salt", quantity: "1/2 tsp" },
      { item: "Cherry tomatoes", quantity: "1 cup", notes: "Halved" },
    ],
    instructions: [
      "Preheat oven to 200°C (400°F).",
      "Pat cod fillets dry with paper towels.",
      "In a small bowl, mix lemon juice, lemon zest, dill, parsley, and minced garlic.",
      "Place cod fillets in a baking dish and drizzle with olive oil.",
      "Season with salt, pepper, and paprika.",
      "Spread the herb mixture over the fish fillets.",
      "Arrange cherry tomatoes around the fish.",
      "Bake for 15-18 minutes until fish flakes easily with a fork.",
      "Internal temperature should reach 63°C (145°F).",
      "Serve immediately with steamed vegetables or a side salad.",
    ],
    tips: [
      "Don't overcook cod as it can become dry and flaky",
      "Choose thick fillets for even cooking",
      "Fresh herbs make a significant difference in flavor",
      "Serve with lemon wedges for extra zing",
    ],
    nutritionNotes:
      "Extremely low in carbohydrates and calories while being very high in protein. Cod is a lean fish that's perfect for diabetes management.",
    tags: ["Very Low Carb", "High Protein", "Low Calorie", "Heart Healthy", "Quick"],
    image: "/placeholder.svg?height=300&width=400&text=Baked+Cod",
    rating: 4.6,
    reviews: 89,
    healthBenefits: [
      "Very high in lean protein",
      "Low in calories and carbohydrates",
      "Good source of vitamin B12 and selenium",
      "Supports muscle maintenance and weight management",
    ],
  },
]

export default function DiabeticRecipesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedCuisine, setSelectedCuisine] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [selectedGI, setSelectedGI] = useState("All")
  const [maxCarbs, setMaxCarbs] = useState(50)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)

  const categories = ["All", "Breakfast", "Lunch", "Dinner", "Snack"]
  const cuisines = ["All", "Indian", "Continental", "Mediterranean", "International"]
  const difficulties = ["All", "Easy", "Medium", "Hard"]
  const glycemicIndexes = ["All", "Low", "Medium", "High"]

  const filteredRecipes = useMemo(() => {
    return diabeticRecipes.filter((recipe) => {
      const matchesSearch =
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        recipe.ingredients.some((ing) => ing.item.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "All" || recipe.category === selectedCategory
      const matchesCuisine = selectedCuisine === "All" || recipe.cuisine === selectedCuisine
      const matchesDifficulty = selectedDifficulty === "All" || recipe.difficulty === selectedDifficulty
      const matchesGI = selectedGI === "All" || recipe.glycemicIndex === selectedGI
      const matchesCarbs = recipe.carbs <= maxCarbs

      return matchesSearch && matchesCategory && matchesCuisine && matchesDifficulty && matchesGI && matchesCarbs
    })
  }, [searchTerm, selectedCategory, selectedCuisine, selectedDifficulty, selectedGI, maxCarbs])

  const generateRecipePDF = (recipe: Recipe) => {
    const pdfContent = `
<!DOCTYPE html>
<html>
<head>
  <title>MyMedi.ai - ${recipe.name} Recipe</title>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Arial', sans-serif; 
      font-size: 12px;
      line-height: 1.4;
      color: #333;
      background: white;
      padding: 20px;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #10b981;
      padding-bottom: 15px;
      margin-bottom: 20px;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      padding: 20px;
      border-radius: 10px;
    }
    .recipe-title {
      font-size: 24px;
      margin-bottom: 8px;
      font-weight: 700;
    }
    .recipe-meta {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 15px;
      margin: 20px 0;
      padding: 15px;
      background: #f0fdf4;
      border-radius: 8px;
      border: 2px solid #bbf7d0;
    }
    .nutrition-info {
      background: linear-gradient(135deg, #fef3c7, #fde68a);
      padding: 15px;
      border-radius: 8px;
      margin: 15px 0;
      border: 2px solid #fbbf24;
    }
    .section {
      margin: 20px 0;
      padding: 15px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
    }
    .section h3 {
      color: #10b981;
      margin-bottom: 10px;
      font-size: 16px;
    }
    .ingredients-list, .instructions-list {
      list-style: none;
      padding: 0;
    }
    .ingredients-list li {
      padding: 5px 0;
      border-bottom: 1px solid #f3f4f6;
    }
    .instructions-list li {
      padding: 8px 0;
      border-bottom: 1px solid #f3f4f6;
      counter-increment: step-counter;
    }
    .instructions-list {
      counter-reset: step-counter;
    }
    .instructions-list li::before {
      content: counter(step-counter) ". ";
      font-weight: bold;
      color: #10b981;
    }
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 10px 0;
    }
    .tag {
      background: #10b981;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 10px;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding: 15px;
      background: #f9fafb;
      border-radius: 8px;
      font-size: 10px;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="recipe-title">${recipe.name}</div>
    <p>${recipe.cuisine} ${recipe.category} • ${recipe.difficulty} Level</p>
    <p>Diabetic-Friendly Recipe from MyMedi.ai</p>
  </div>

  <div class="recipe-meta">
    <div><strong>Prep Time:</strong> ${recipe.prepTime} min</div>
    <div><strong>Cook Time:</strong> ${recipe.cookTime} min</div>
    <div><strong>Servings:</strong> ${recipe.servings}</div>
    <div><strong>Difficulty:</strong> ${recipe.difficulty}</div>
  </div>

  <div class="nutrition-info">
    <h3>🍎 Nutritional Information (Per Serving)</h3>
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px; margin-top: 10px;">
      <div><strong>Calories:</strong> ${recipe.calories}</div>
      <div><strong>Carbs:</strong> ${recipe.carbs}g</div>
      <div><strong>Protein:</strong> ${recipe.protein}g</div>
      <div><strong>Fat:</strong> ${recipe.fat}g</div>
      <div><strong>Fiber:</strong> ${recipe.fiber}g</div>
      <div><strong>Sugar:</strong> ${recipe.sugar}g</div>
      <div><strong>Sodium:</strong> ${recipe.sodium}mg</div>
      <div><strong>GI:</strong> ${recipe.glycemicIndex}</div>
    </div>
    <div style="margin-top: 10px;">
      <strong>Blood Sugar Impact:</strong> ${recipe.bloodSugarImpact} • 
      <strong>Glycemic Load:</strong> ${recipe.glycemicLoad}
    </div>
  </div>

  <div class="section">
    <h3>🛒 Ingredients</h3>
    <ul class="ingredients-list">
      ${recipe.ingredients
        .map(
          (ing) => `
        <li><strong>${ing.quantity}</strong> ${ing.item}${ing.notes ? ` <em>(${ing.notes})</em>` : ""}</li>
      `,
        )
        .join("")}
    </ul>
  </div>

  <div class="section">
    <h3>👨‍🍳 Instructions</h3>
    <ol class="instructions-list">
      ${recipe.instructions.map((instruction) => `<li>${instruction}</li>`).join("")}
    </ol>
  </div>

  <div class="section">
    <h3>💡 Chef's Tips</h3>
    <ul>
      ${recipe.tips.map((tip) => `<li>• ${tip}</li>`).join("")}
    </ul>
  </div>

  <div class="section">
    <h3>🏥 Health Benefits</h3>
    <ul>
      ${recipe.healthBenefits.map((benefit) => `<li>• ${benefit}</li>`).join("")}
    </ul>
  </div>

  <div class="section">
    <h3>📊 Diabetes Management Notes</h3>
    <p>${recipe.nutritionNotes}</p>
    ${
      recipe.warnings
        ? `
      <div style="background: #fef2f2; padding: 10px; border-radius: 5px; margin-top: 10px; border: 1px solid #fecaca;">
        <strong>⚠️ Important Notes:</strong>
        <ul style="margin-top: 5px;">
          ${recipe.warnings.map((warning) => `<li>• ${warning}</li>`).join("")}
        </ul>
      </div>
    `
        : ""
    }
  </div>

  <div class="tags">
    ${recipe.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
  </div>

  <div class="footer">
    <p><strong>MyMedi.ai</strong> - Your AI-Powered Diabetic Recipe Companion</p>
    <p>Generated on ${new Date().toLocaleDateString()} | Recipe Rating: ${recipe.rating}/5 ⭐</p>
    <p>🌐 www.mymedi.ai | 📧 recipes@mymedi.ai</p>
    <p><em>Always consult your healthcare provider for personalized dietary advice</em></p>
  </div>
</body>
</html>
    `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(pdfContent)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
      }, 1000)
    }
  }

  if (selectedRecipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
        <header className="bg-white/95 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <MyMedLogo size="lg" />
            <div className="flex items-center gap-4">
              <Button
                onClick={() => generateRecipePDF(selectedRecipe)}
                variant="outline"
                size="sm"
                className="bg-white text-green-600 hover:bg-green-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Recipe
              </Button>
              <Button
                onClick={() => setSelectedRecipe(null)}
                variant="outline"
                size="sm"
                className="bg-white text-green-600 hover:bg-green-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Recipes
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Recipe Header */}
            <Card className="border-green-200 shadow-xl mb-6">
              <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle className="text-2xl lg:text-3xl font-bold mb-2">{selectedRecipe.name}</CardTitle>
                    <div className="flex flex-wrap items-center gap-4 text-green-100">
                      <span className="flex items-center">
                        <ChefHat className="w-4 h-4 mr-1" />
                        {selectedRecipe.cuisine}
                      </span>
                      <span className="flex items-center">
                        <Utensils className="w-4 h-4 mr-1" />
                        {selectedRecipe.category}
                      </span>
                      <span className="flex items-center">
                        <Target className="w-4 h-4 mr-1" />
                        {selectedRecipe.difficulty}
                      </span>
                      <span className="flex items-center">
                        <Star className="w-4 h-4 mr-1" />
                        {selectedRecipe.rating} ({selectedRecipe.reviews} reviews)
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className="bg-green-500 text-white">
                      <Heart className="w-3 h-3 mr-1" />
                      Diabetic Friendly
                    </Badge>
                    <Badge variant="outline" className="bg-white text-green-700">
                      {selectedRecipe.bloodSugarImpact} Impact
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <Clock className="w-5 h-5 mx-auto mb-1 text-green-600" />
                    <div className="text-sm font-medium text-green-800">Prep Time</div>
                    <div className="text-lg font-bold text-green-600">{selectedRecipe.prepTime} min</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Clock className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                    <div className="text-sm font-medium text-blue-800">Cook Time</div>
                    <div className="text-lg font-bold text-blue-600">{selectedRecipe.cookTime} min</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <Users className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                    <div className="text-sm font-medium text-purple-800">Servings</div>
                    <div className="text-lg font-bold text-purple-600">{selectedRecipe.servings}</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <TrendingDown className="w-5 h-5 mx-auto mb-1 text-orange-600" />
                    <div className="text-sm font-medium text-orange-800">Glycemic Load</div>
                    <div className="text-lg font-bold text-orange-600">{selectedRecipe.glycemicLoad}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedRecipe.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-300">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Nutrition Information */}
            <Card className="border-yellow-200 bg-yellow-50 mb-6">
              <CardHeader className="p-4">
                <CardTitle className="flex items-center text-yellow-700">
                  <Activity className="w-5 h-5 mr-2" />
                  Nutritional Information (Per Serving)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{selectedRecipe.calories}</div>
                    <div className="text-xs text-yellow-700">Calories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{selectedRecipe.carbs}g</div>
                    <div className="text-xs text-red-700">Carbs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedRecipe.protein}g</div>
                    <div className="text-xs text-blue-700">Protein</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{selectedRecipe.fat}g</div>
                    <div className="text-xs text-purple-700">Fat</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{selectedRecipe.fiber}g</div>
                    <div className="text-xs text-green-700">Fiber</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-600">{selectedRecipe.sugar}g</div>
                    <div className="text-xs text-pink-700">Sugar</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600">{selectedRecipe.sodium}mg</div>
                    <div className="text-xs text-gray-700">Sodium</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-600">{selectedRecipe.glycemicIndex}</div>
                    <div className="text-xs text-orange-700">GI</div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Blood Sugar Impact:</strong> {selectedRecipe.bloodSugarImpact} •
                    <strong> Glycemic Load:</strong> {selectedRecipe.glycemicLoad} •<strong> Diabetic Friendly:</strong>{" "}
                    {selectedRecipe.diabeticFriendly ? "Yes" : "No"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Ingredients */}
              <Card className="border-blue-200">
                <CardHeader className="p-4 bg-blue-50">
                  <CardTitle className="flex items-center text-blue-700">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Ingredients
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <ul className="space-y-3">
                    {selectedRecipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start p-2 bg-blue-50 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-blue-800">{ingredient.quantity}</span>{" "}
                          <span className="text-blue-700">{ingredient.item}</span>
                          {ingredient.notes && (
                            <div className="text-xs text-blue-600 italic mt-1">{ingredient.notes}</div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Health Benefits */}
              <Card className="border-green-200">
                <CardHeader className="p-4 bg-green-50">
                  <CardTitle className="flex items-center text-green-700">
                    <Heart className="w-5 h-5 mr-2" />
                    Health Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <ul className="space-y-2">
                    {selectedRecipe.healthBenefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <Leaf className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-green-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 p-3 bg-green-100 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Diabetes Management:</strong> {selectedRecipe.nutritionNotes}
                    </p>
                  </div>
                  {selectedRecipe.warnings && (
                    <Alert className="mt-4 border-yellow-200 bg-yellow-50">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-800">
                        <strong>Important Notes:</strong>
                        <ul className="mt-2 space-y-1">
                          {selectedRecipe.warnings.map((warning, index) => (
                            <li key={index} className="text-xs">
                              • {warning}
                            </li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Instructions */}
            <Card className="border-purple-200 mt-6">
              <CardHeader className="p-4 bg-purple-50">
                <CardTitle className="flex items-center text-purple-700">
                  <ChefHat className="w-5 h-5 mr-2" />
                  Cooking Instructions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ol className="space-y-4">
                  {selectedRecipe.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 leading-relaxed">{instruction}</p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            {/* Chef's Tips */}
            <Card className="border-orange-200 mt-6">
              <CardHeader className="p-4 bg-orange-50">
                <CardTitle className="flex items-center text-orange-700">
                  <Zap className="w-5 h-5 mr-2" />
                  Chef's Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ul className="space-y-2">
                  {selectedRecipe.tips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <Zap className="w-4 h-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-orange-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <PoweredByFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      <header className="bg-white/95 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <MyMedLogo size="lg" />
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm" className="bg-white text-green-600 hover:bg-green-50">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Diabetic Recipe Database</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Discover delicious, diabetic-friendly recipes with complete nutritional information, glycemic index ratings,
            and blood sugar impact analysis.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <span className="flex items-center">
              <Heart className="w-4 h-4 mr-1 text-red-500" />
              {diabeticRecipes.length} Diabetic-Friendly Recipes
            </span>
            <span className="flex items-center">
              <TrendingDown className="w-4 h-4 mr-1 text-green-500" />
              Low Glycemic Index Focus
            </span>
            <span className="flex items-center">
              <Activity className="w-4 h-4 mr-1 text-blue-500" />
              Complete Nutritional Data
            </span>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="border-green-200 shadow-lg mb-8">
          <CardHeader className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search recipes, ingredients, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>
          </CardHeader>
          {showFilters && (
            <CardContent className="p-4 border-t">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Cuisine</Label>
                  <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {cuisines.map((cuisine) => (
                        <SelectItem key={cuisine} value={cuisine}>
                          {cuisine}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Difficulty</Label>
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map((difficulty) => (
                        <SelectItem key={difficulty} value={difficulty}>
                          {difficulty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Glycemic Index</Label>
                  <Select value={selectedGI} onValueChange={setSelectedGI}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {glycemicIndexes.map((gi) => (
                        <SelectItem key={gi} value={gi}>
                          {gi}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Max Carbs: {maxCarbs}g</Label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={maxCarbs}
                    onChange={(e) => setMaxCarbs(Number(e.target.value))}
                    className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <Card
              key={recipe.id}
              className="border-green-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => setSelectedRecipe(recipe)}
            >
              <div className="relative">
                <img
                  src={recipe.image || "/placeholder.svg"}
                  alt={recipe.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <Badge className="bg-green-500 text-white">{recipe.glycemicIndex} GI</Badge>
                  <Badge variant="outline" className="bg-white text-green-700">
                    {recipe.bloodSugarImpact}
                  </Badge>
                </div>
                <div className="absolute bottom-2 left-2">
                  <Badge className="bg-black/70 text-white">{recipe.category}</Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">{recipe.name}</h3>
                  <div className="flex items-center ml-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{recipe.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {recipe.cuisine} • {recipe.difficulty}
                </p>

                <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="font-bold text-green-600">{recipe.calories}</div>
                    <div className="text-green-700">Cal</div>
                  </div>
                  <div className="text-center p-2 bg-red-50 rounded">
                    <div className="font-bold text-red-600">{recipe.carbs}g</div>
                    <div className="text-red-700">Carbs</div>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="font-bold text-blue-600">{recipe.protein}g</div>
                    <div className="text-blue-700">Protein</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {recipe.prepTime + recipe.cookTime} min
                  </span>
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {recipe.servings} servings
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {recipe.tags.slice(0, 3).map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs bg-green-50 text-green-700 border-green-300"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {recipe.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600">
                      +{recipe.tags.length - 3}
                    </Badge>
                  )}
                </div>

                <Alert className="border-green-200 bg-green-50">
                  <Info className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-xs text-green-800">
                    <strong>Blood Sugar Impact:</strong> {recipe.bloodSugarImpact} •<strong> GL:</strong>{" "}
                    {recipe.glycemicLoad}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No recipes found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>

      <PoweredByFooter />
    </div>
  )
}
