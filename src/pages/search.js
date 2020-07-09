import Layout from "../components/layout"
import SEO from "../components/seo"

import React, { useState, useEffect } from "react"

const CheckBox = ({ item, selectedCat, handleCheck }) => {
  return (
    <div>
      <input className="details_inner"
        key={item.name}
        onChange={() => {
          handleCheck(item.name)
        }}
        type="checkbox"
        checked={selectedCat.includes(item.name)}
        value={item.name}
      />
      {item.name}
    </div>
  )
}

const IndexSearch = () => {
  const [categories, setCategories] = useState([])
  const [selectedCat, setSelectedCat] = useState([])

  useEffect(() => {
    ;(async () => {
      const allCategories = await fetch(
        `${process.env.GATSBY_FLOTIQ_BASE_URL}/api/v1/content/category?order_by=name`,
        {
          headers: { "x-auth-token": process.env.GATSBY_FLOTIQ_API_KEY },
        }
      ).then(res => res.json())
      setCategories(allCategories.data)
    })()
  }, [])

  const handleSelectCat = name => {
    let newSelections = [...selectedCat]
    if (newSelections.includes(name)) {
      let index = newSelections.indexOf(name)
      newSelections.splice(index, 1)
    } else {
      newSelections.push(name)
    }
    setSelectedCat(newSelections)
  }
  return (
    <div>
      <div className="text mt-5">
        <h2 className="with-underline">Categories</h2>
      </div>

      {categories.map(item => (
        <CheckBox
          item={item}
          selectedCat={[...selectedCat]}
          handleCheck={handleSelectCat}
        />
      ))}
    </div>
  )
}

class Search extends React.Component {
  render() {
    return (
      <Layout>
        <SEO title="About" keywords={[`gatsby`, `application`, `react`]} />
        <div className="site-About">
          <div className="container">
            <div className="row">
              <div className="col-sm-12">
                <div className="text-center mt-5">
                  <h1>QuickSearch</h1>
                </div>

                <IndexSearch />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}
export default Search
