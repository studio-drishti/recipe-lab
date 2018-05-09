import fetch from 'isomorphic-unfetch'

import { API_URL } from '../config';
import Layout from '../components/Layout'
import Recipe from "../components/Recipe"

const Page = ({recipe}) => (
  <Layout>
    <h1>{recipe.title}</h1>
    <p>{recipe.description}</p>
    <Recipe recipe={recipe} />
  </Layout>
)

Page.getInitialProps = async function() {
  const res = await fetch(`${API_URL}/api/recipes/0`)
  const data = await res.json()

  console.log(`Show data fetched. Count: ${data.length}`)

  return {
    recipe: data
  }
}

export default Page;
