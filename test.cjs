const fs = require('fs');
let code = fs.readFileSync('src/components/RecipeCard.tsx', 'utf8');

code = code.replace("import { Link } from 'react-router-dom';", "import { useNavigate } from 'react-router-dom';\nimport { AdMobService } from '../lib/admob';");
code = code.replace(/export function RecipeCard.*?{/, "export function RecipeCard({ recipe, featured }: RecipeCardProps) {\n  const navigate = useNavigate();");

code = code.replace(/<Link to=\{`\/recipe\/\$\{recipe\.id\}`\}/g, "<div onClick={async () => { await AdMobService.showInterstitialWithCap(); navigate(`/recipe/${recipe.id}`); }}");
code = code.replace(/<\/Link>/g, "</div>");

fs.writeFileSync('src/components/RecipeCard.tsx', code);
