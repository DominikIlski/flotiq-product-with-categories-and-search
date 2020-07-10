import Layout from "../components/layout"
import SEO from "../components/seo"
import styles from "../css/search.module.css"
import React, { useState, useEffect } from "react"

const CheckBox = ({ item, selectedCat, handleCheck }) => {
  return (
    <div>
      <input
        className="details_inner"
        key={item.Name}
        onChange={() => {
          handleCheck(item.Name)
        }}
        type="checkbox"
        checked={selectedCat.includes(item.Name)}
        value={item.Name}
      />
      {item.Name}
    </div>
  )
}

const IndexSearch = ({
  categories,
  setCategories,
  selectedCat,
  setSelectedCat,
}) => {
  useEffect(() => {
    ;(async () => {
      const allCategories = await fetch(
        `${process.env.GATSBY_FLOTIQ_BASE_URL}/api/v1/content/coffeecat?order_by=Name`,
        {
          headers: { "x-auth-token": process.env.GATSBY_FLOTIQ_API_KEY },
        }
      ).then(res => res.json())
      setCategories(allCategories.data)
    })()
  })

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
          selectedCat={selectedCat}
          handleCheck={handleSelectCat}
        />
      ))}
    </div>
  )
}

const Search = () => {
  const [categories, setCategories] = useState([])
  const [selectedCat, setSelectedCat] = useState([])

  const basicQuerryString = `${process.env.GATSBY_FLOTIQ_BASE_URL}/api/v1/search?q=`
  let data
  useEffect(() => {
    let selectedIds = []
    for (let i = 0; i < selectedCat.length; i++) {
      selectedIds.push(categories.find(item => item.Name === selectedCat[i]).id)
    }
    ;(async () => {
      {
        data = await fetch(
          `${basicQuerryString}${selectedIds.toString().replace(/,/g, " ")}`,
          {
            headers: { "x-auth-token": process.env.GATSBY_FLOTIQ_API_KEY },
          }
        ).then(res => res.json())
        console.log(data)

      }
    })()
    console.log(data)
  }, [selectedCat])

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

              <div className={styles.row}>
                <div className={styles.left}>
                  <IndexSearch
                    categories={categories}
                    setCategories={setCategories}
                    selectedCat={selectedCat}
                    setSelectedCat={setSelectedCat}
                  />
                </div>
                <div className={styles.right}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default Search
