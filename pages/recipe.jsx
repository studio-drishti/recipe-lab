import fetch from 'isomorphic-unfetch'

import { API_URL } from '../config';
import Layout from '../components/Layout'
import Recipe from "../components/Recipe"

const Page = ({recipe}) => (
  <Layout>
    <h1>{recipe.title}</h1>
    <h2>By {recipe.author.name}</h2>
    <p>{recipe.description}</p>
    <Recipe recipe={recipe} />
  </Layout>
)

Page.getInitialProps = async function(context) {
  const { id } = context.query
  const res = await fetch(`${API_URL}/api/recipes/${id}`)
  const recipe = await res.json()
  console.log(recipe)
  return {
    recipe
  }
}

export default Page;
