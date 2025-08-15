import { recipes } from "../../../../data/recipes"; // adjust relative path

export async function GET(req, { params }) {
  const id = Number(params.id);
  const recipe = recipes.find(r => r.id === id);
  if (!recipe) {
    return new Response(JSON.stringify({ error: "Recipe not found" }), { status: 404 });
  }
  return new Response(JSON.stringify(recipe), { status: 200 });
}

export async function PUT(req, { params }) {
  const id = Number(params.id);
  const index = recipes.findIndex(r => r.id === id);
  if (index === -1) return new Response(JSON.stringify({ error: "Recipe not found" }), { status: 404 });

  const updatedData = await req.json();
  recipes[index] = { ...recipes[index], ...updatedData };

  return new Response(JSON.stringify(recipes[index]), { status: 200 });
}

export async function DELETE(req, { params }) {
  // params is available directly
  const id = Number(params.id);

  // Example: assuming you have a recipes array
  const index = recipes.findIndex(r => r.id === id);
  if (index === -1) {
    return new Response(JSON.stringify({ message: "Recipe not found" }), { status: 404 });
  }

  recipes.splice(index, 1); // remove the recipe

  return new Response(JSON.stringify({ message: "Recipe deleted" }), { status: 200 });
}
