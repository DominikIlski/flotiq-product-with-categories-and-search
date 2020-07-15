import Layout from "../components/layout"
import SEO from "../components/seo"
import styles from "../css/search.module.css"
import Img from "gatsby-image"
import React, { useState, useEffect } from "react"
import Spinner from "react-bootstrap/Spinner"

const contentType = "content_type[]=product"
const basicQuerryString = `${process.env.GATSBY_FLOTIQ_BASE_URL}/api/v1/search?${contentType}&q=`

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
        `${process.env.GATSBY_FLOTIQ_BASE_URL}/api/v1/content/category?order_by=name`,
        {
          headers: { "x-auth-token": process.env.GATSBY_FLOTIQ_API_KEY },
        }
      ).then(res => res.json())
      setCategories(allCategories.data)
    })()
  }, [setCategories])

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
      <h2 className="with-underline">Categories</h2>

      {categories[0] ? (
        categories.map(item => (
          <CheckBox
            item={item}
            selectedCat={selectedCat}
            handleCheck={handleSelectCat}
          />
        ))
      ) : (
        <div>
          <Spinner className="center" animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      )}
    </div>
  )
}

const Items = ({ categories, pageData }) => {
  if (pageData)
    return (
      <div className="row product-main">
        {pageData &&
          pageData.data &&
          pageData.data.map(item => (
            <div
              className="Catalogue__item col-sm-12 col-md-6 col-lg-4"
              key={item.item.id}
            >
              <a
                href={`${
                  categories.find(
                    category =>
                      category.id ===
                      item.item.category[0].dataUrl.split("/")[5]
                  ).slug
                }/${item.item.slug}`}
              >
                <div className="details_List">
                  {item.item.productImage && item.item.productImage[0] ? (
                    <Img
                      sizes={{
                        src: `${
                          process.env.GATSBY_FLOTIQ_BASE_URL
                        }/image/1920x0/${
                          item.item.productImage[0].dataUrl.split("/")[5]
                        }.jpg`,
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
                    <div className="row">
                      <div className="col-sm-4 align-self-center">
                        <span className="price">${item.item.price}</span>
                      </div>
                      <div className="col-sm-8 text-right align-self-center">
                        <a
                          href={`${
                            categories.find(
                              category =>
                                category.id ===
                                item.item.category[0].dataUrl.split("/")[5]
                            ).slug
                          }`}
                          className="Product snipcart-add-item"
                          data-item-id={item.item.slug}
                          data-item-price={item.item.price}
                          data-item-image={
                            item.item.productImage && item.item.productImage[0]
                              ? `${
                                  process.env.GATSBY_FLOTIQ_BASE_URL
                                }/image/1920x0/${
                                  item.item.productImage[0].dataUrl.split(
                                    "/"
                                  )[5]
                                }.jpg`
                              : ""
                          }
                          data-item-name={item.item.name}
                          data-item-url={`${
                            categories.find(
                              category =>
                                category.id ===
                                item.item.category[0].dataUrl.split("/")[5]
                            ).slug
                          }`}
                        >
                          <i className="fas fa-shopping-bag" />
                          Add to Cart
                        </a>
                      </div>
                    </div>
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
  useEffect(() => {
    const selectedIds = categories
      .filter(item => selectedCat.includes(item.name))
      .map(item => `"${item.id}"`)

    if (selectedIds.length === 0) selectedIds.push("*")
    ;(async () => {
      const data = await fetch(
        `${basicQuerryString}${selectedIds.toString().replace(/,/g, " ")}`,
        {
          headers: { "x-auth-token": process.env.GATSBY_FLOTIQ_API_KEY },
        }
      ).then(res => res.json())
      setPageDate(data)
    })()
  }, [selectedCat, categories])

  return (
    <Layout>
      <SEO title="About" keywords={[`gatsby`, `application`, `react`]} />
      <div className="site-About">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div className={styles.row}>
                <div className={styles.left}>
                  <IndexSearch
                    categories={categories}
                    setCategories={setCategories}
                    selectedCat={selectedCat}
                    setSelectedCat={setSelectedCat}
                  />
                </div>
                {pageData.data ? (
                  <div className={styles.right}>
                    <Items categories={categories} pageData={pageData} />
                  </div>
                ) : (
                  <div className={styles.rightCenter}>
                    <Spinner animation="border" role="status">
                      <span className="sr-only">Loading...</span>
                    </Spinner>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default Search
