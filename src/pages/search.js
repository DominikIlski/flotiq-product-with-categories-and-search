import Layout from "../components/layout"
import SEO from "../components/seo"
import styles from "../css/search.module.css"
import Link from "gatsby"
import Img from "gatsby-image"
import React, { useState, useEffect } from "react"

const CheckBox = ({ item, selectedCat, handleCheck }) => {
  return (
    <div>
      <input
        className="details_inner"
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

const IndexSearch = ({
  categories,
  setCategories,
  selectedCat,
  setSelectedCat,
}) => {
  useEffect(() => {
    ;(async () => {
      const allCategories = await fetch(
        `${process.env.GATSBY_FLOTIQ_BASE_URL}/api/v1/content/coffeecat?order_by=name`,
        {
          headers: { "x-auth-token": process.env.GATSBY_FLOTIQ_API_KEY },
        }
      ).then(res => res.json())
      setCategories(allCategories.data)
    })()
  }, [])

  const handleSelectCat = name => {
    const newSelections = [...selectedCat]
    if (newSelections.includes(name)) {
      const index = newSelections.indexOf(name)
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

const Items = ({ pageData }) => {
  console.log("items")
  console.log(pageData)
  console.log(pageData.data)
  if(pageData.data)
    console.log(`${process.env.GATSBY_FLOTIQ_BASE_URL}/image/1920x0${pageData.data}`)
  return (
    <div className="row product-main">
      {pageData &&
        pageData.data &&
        pageData.data.map(item => (
          <div
            className="Catalogue__item col-sm-12 col-md-6 col-lg-4"
            key={item.item.id}
          >
            <a href={`/${item.item.slug}`}>
              <div className="details_List">
                {item.item.image && item.item.image[0] ? (
                  <Img
                    sizes={{
                      src: `${process.env.GATSBY_FLOTIQ_BASE_URL}/image/1920x0${item.item.productImage[0].dataUrl.split('/')[4]}`,
                      aspectRatio: 1.77,
                      sizes: "",
                      srcSet: "",
                    }}
                  />
                ) : (
                  <div className="no-image">No Image</div>
                )}

                <div className="details_inner">
                  
                <h2>{item.item.name}</h2>
                  
                </div>
              </div>
            </a>
          </div>
        ))}
    </div>
  )
}

const Search = () => {
  const [categories, setCategories] = useState([])
  const [selectedCat, setSelectedCat] = useState([])
  const [pageData, setPageDate] = useState({})
  const contentType = "content_type[]=coffee"
  const basicQuerryString = `${process.env.GATSBY_FLOTIQ_BASE_URL}/api/v1/search?${contentType}&q=`
  useEffect(() => {

    const selectedIds = categories
      .filter(item => selectedCat.includes(item.name))
      .map(item => `"${item.id}"`);
    
    if (selectedIds.length === 0) selectedIds.push("*")
    ;(async () => {
      const data = await fetch(
        `${basicQuerryString}${selectedIds.toString().replace(/,/g, " ")}`,
        {
          headers: { "x-auth-token": process.env.GATSBY_FLOTIQ_API_KEY },
        }
      ).then(res => res.json())
      console.log("after featch")
      console.log(data)
      setPageDate(data)
    })()
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
                <div className={styles.right}>
                  <Items pageData={pageData}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default Search
