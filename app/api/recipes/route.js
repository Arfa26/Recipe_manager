// In-memory storage for recipes
let recipes = []; 

export async function GET(req) {
  return new Response(
    JSON.stringify({ recipes }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

export async function POST(req) {
  try {
    const newRecipe = await req.json(); 
    const recipeWithId = { id: Date.now(), ...newRecipe };
    recipes.push(recipeWithId);

    return new Response(
      JSON.stringify({ success: true, recipe: recipeWithId }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
