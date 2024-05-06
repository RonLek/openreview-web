import { useState, useEffect } from 'react'
import Chip from './Chip'
import Icon from './Icon'
import IconButton from './IconButton'
import IconStyles from '../styles/components/Icon.module.scss'
import { getInvitationColors } from '../lib/forum-utils'
import { prettyInvitationId } from '../lib/utils'

export default function ExpertiseSelectorv4({
  invitation,
  venueId,
  apiVersion,
  shouldReload,
}) {
  var [keyphrases, setKeyphrases] = useState({ active: [], inactive: [] })
  // var [includedKeyphrases, setIncludedKeyphrases] = useState(["automatic composing","bibliometric analysis","dialogue models","exploratory search","machine learning for physics and chemistry","named entity recognition","task oriented dialogue systems","topic modeling"])
  var [includedKeyphrases, setIncludedKeyphrases] = useState([])
  var [clickedKeyphrase, setClickedKeyphrase] = useState('')
  var [recommendedPapers, setRecommendedPapers] = useState([])
  var [activePapers, setActivePapers] = useState({})
  var [keyphraseColors, setKeyphraseColors] = useState({})
  var [paperWeights, setPaperWeights] = useState({})

  useEffect(() => {
    async function fetchKeyphrases() {
      try {
        const keyphraseResponse = await fetch(
          'https://retrievalapp-zso5o2q47q-uc.a.run.app/get_recommendations/smysore'
        )
        const jsonResponse = await keyphraseResponse.json()
        console.log(jsonResponse)
        setKeyphrases({
          active: Object.keys(jsonResponse['profilekp2selected']),
          inactive: [],
        })
        setIncludedKeyphrases(
          Object.keys(jsonResponse['profilekp2selected']).filter(
            (kp) => jsonResponse['profilekp2selected'][kp]
          )
        )
        setRecommendedPapers(jsonResponse['recommendations'])
        setActivePapers(jsonResponse['profilekp2user_papers'])
      } catch (error) {
        console.log('Error fetching', error)
      }
    }

    fetchKeyphrases()
  }, [])

  useEffect(() => {
    function buildPaperWeightDict(jsonResponse) {
      var paperWeightDict = {}
      Object.keys(jsonResponse['profilekp2user_papers']).forEach((kp) => {
        jsonResponse['profilekp2user_papers'][kp]['papers'].forEach((paper, index) => {
          if (paperWeightDict.hasOwnProperty(paper['title'])) {
            paperWeightDict[paper['title']] = [
              ...paperWeightDict[paper['title']],
              { [kp]: jsonResponse['profilekp2user_papers'][kp]['kp2paper_wts'][index] },
            ]
          } else {
            paperWeightDict[paper['title']] = [
              { [kp]: jsonResponse['profilekp2user_papers'][kp]['kp2paper_wts'][index] },
            ]
          }
        })
      })

      return paperWeightDict
    }
    async function fetchRecommendations() {
      const baseUrl =
        'https://retrievalapp-zso5o2q47q-uc.a.run.app/get_recommendations/smysore'
      // prepend selected_kps= to every kp in includedKeyphrases
      console.log(includedKeyphrases.length)
      const url =
        includedKeyphrases.length == 0
          ? baseUrl
          : baseUrl + '?selected_kps=' + includedKeyphrases.join('&selected_kps=')
      console.log('url = ', url)
      const keyphraseResponse = await fetch(url)
      const jsonResponse = await keyphraseResponse.json()
      setRecommendedPapers(jsonResponse['recommendations'])
      setActivePapers(jsonResponse['profilekp2user_papers'])
      console.log('Updated recommendations', jsonResponse)
      // in the future, paper weights should be set based on id instead of titles
      setPaperWeights(buildPaperWeightDict(jsonResponse))
      console.log('Paper weights = ', paperWeights)
    }
    fetchRecommendations()
  }, [includedKeyphrases])

  useEffect(() => {
    keyphrases &&
      setKeyphraseColors(
        keyphrases['active'].reduce((acc, kp) => {
          acc[kp] = stringToColor(kp)
          return acc
        }, {})
      )
  }, [keyphrases])

  function hashString(s) {
    let hash = 0
    for (let i = 0; i < s.length; i++) {
      let char = s.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash |= 0 // Convert to 32bit integer
    }
    return hash
  }

  function stringToColor(s, washOutIntensity = 0.3) {
    // Convert string to a unique number using hash function
    let hash = hashString(s) % 256 ** 3;

    // Convert the hash code to RGB values
    let r = (hash >> 16) & 0xff;
    let g = (hash >> 8) & 0xff;
    let b = hash & 0xff;

    // Increase the intensity of RGB values towards white to wash out the colors
    r = Math.floor(r + (255 - r) * washOutIntensity);
    g = Math.floor(g + (255 - g) * washOutIntensity);
    b = Math.floor(b + (255 - b) * washOutIntensity);

    // Convert RGB values to hex color
    let color = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

    return color; // Return the calculated color
}

  console.log('Included KPs = ', includedKeyphrases)
  console.log('Keyphrases = ', keyphrases)
  console.log('keyphrase color = ', keyphraseColors)
  console.log('active papers = ', activePapers)
  console.log('active papers for clicked keyphrase = ', activePapers[clickedKeyphrase])
  console.log('paper weights = ', paperWeights)

  return (
    <>
      <div
        className="container"
        // onMouseLeave={() => setClickedKeyphrase('')}
      >
        <div className="row" style={{ border: '1px solid black' }}>
          <div className="col-md-3">
            <h4 style={{ margin: '20px', textAlign: 'center' }}>Expertise Keyphrases</h4>
            <div style={{ margin: '20px 10px' }}>
              Personalized keyphrases indicating your expertise based on your authored papers
            </div>
            {/* {!keyphraseEditMode && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'start',
                  margin: '5px',
                }}
              >
                <strong
                  style={{
                    color: keyphrases !== includedKeyphrases ? '#4d8093' : 'gray',
                    cursor: 'pointer',
                  }}
                  onClick={() => setIncludedKeyphrases(keyphrases)}
                >
                  Select All
                </strong>{' '}
                |{' '}
                <strong
                  style={{
                    color: keyphrases === includedKeyphrases ? '#4d8093' : 'gray',
                    cursor: 'pointer',
                  }}
                  onClick={() => setIncludedKeyphrases([])}
                >
                  Clear All
                </strong>
              </div>
            )} */}
            <div>
              {keyphrases['active'].map((keyphrase, index) => {
                return (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: keyphraseColors[keyphrase],
                      padding: "10px"
                    }}
                  >
                    <div style={{display: "flex"}}>
                      <input
                        style={{margin: "0px"}}
                        type="checkbox"
                        className="checkbox-inline"
                        id={`keyphrase-${index}`}
                        checked={includedKeyphrases.includes(keyphrase)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setIncludedKeyphrases([...includedKeyphrases, keyphrase])
                          } else {
                            setIncludedKeyphrases(
                              includedKeyphrases.filter((k) => k !== keyphrase)
                            )
                          }
                        }}
                      />
                      <span
                        style={{
                          margin: '0 7px',
                          cursor: 'pointer',
                        }}
                        className="form-check-label"
                        onMouseEnter={() => setClickedKeyphrase(keyphrase)}
                      >
                        {keyphrase}
                      </span>
                    </div>
                    <Icon
                      extraClasses={IconStyles.clickable}
                      name="trash"
                      tooltip="Remove Keyphrase"
                      onClick={() => {
                        setKeyphrases({
                          active: keyphrases['active'].filter((k) => k !== keyphrase),
                          inactive: [...keyphrases['inactive'], keyphrase],
                        })
                        setIncludedKeyphrases(
                          includedKeyphrases.filter((k) => k !== keyphrase)
                        )
                      }}
                    />
                  </div>
                )
              })}
              {keyphrases['inactive'].map((keyphrase, index) => {
                return (
                  <div
                    style={{ display: 'flex', alignItems: 'center', justifyContent: "space-between", padding: "10px" }}
                  >
                    <div style={{display: "flex"}}>
                    <input
                      type="checkbox"
                      className="checkbox-inline"
                      id={`keyphrase-${index}`}
                      disabled
                    />
                    <span
                      style={{
                        margin: '0 7px',
                        color: 'gray',
                      }}
                      className="form-check-label"
                      // onMouseEnter={() => setClickedKeyphrase(keyphrase)}
                    >
                      <s>{keyphrase}</s>
                    </span>
                    </div>
                    <Icon
                      extraClasses={IconStyles.clickable}
                      name="plus"
                      tooltip="Add Keyphrase"
                      onClick={() => {
                        setKeyphrases({
                          active: [...keyphrases['active'], keyphrase],
                          inactive: keyphrases['inactive'].filter((k) => k !== keyphrase),
                        })
                        setIncludedKeyphrases([...includedKeyphrases, keyphrase])
                      }}
                    />
                  </div>
                )
              })}

              <div
                className="row"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: "20px",
                }}
              >
                <input
                  id="addkeyphrase"
                  type="text"
                  className="col-sm-7 form-control"
                  placeholder="Add Keyphrase"
                  style={{ width: '60%', margin: '0 5px' }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      setKeyphrases({
                        active: [...keyphrases['active'], e.target.value],
                        inactive: keyphrases['inactive'],
                      })
                      setIncludedKeyphrases([...includedKeyphrases, e.target.value])
                      e.target.value = ''
                    }
                  }}
                />
                <IconButton
                  text="Add"
                  name="plus"
                  tooltip="Add Keyphrase"
                  onClick={() => {
                    var keyphrase = document.getElementById('addkeyphrase').value
                    setKeyphrases({
                      active: [...keyphrases['active'], keyphrase],
                      inactive: keyphrases['inactive'],
                    })
                    setIncludedKeyphrases([...includedKeyphrases, keyphrase])
                    document.getElementById('addkeyphrase').value = ''
                  }}
                />
              </div>
            </div>
          </div>

          <div
            className="col-md-9"
            style={{ borderLeft: '1px solid black', position: 'relative' }}
          >
            <div
              className="row"
              style={{
                display: 'flex',
                margin: '20px',
                textAlign: 'center',
                alignItems: 'center',
              }}
            >
              <h4 className="col-sm-10" style={{ margin: '0px' }}>
                Potential Paper Assignments
              </h4>
              <IconButton
                className="col-sm-2"
                name="floppy-save"
                text="Save Expertise"
                onClick={() => alert('Expertise saved!')}
              />
            </div>
            <div style={{ margin: '20px 10px' }}>
              Potential assignments from papers accepted in machine learning conferences from
              2018 to 2023
            </div>

            {recommendedPapers.map((paper) => {
              return (
                <>
                  <div style={{ marginBottom: '10px' }}>
                    <a target="_blank" style={{ fontSize: '1.2em' }} href={paper['url']}>
                      <strong>{paper['title']}</strong>
                    </a>
                    <h6
                      style={{
                        color: '#777777',
                        marginBottom: '0px',
                        marginTop: '0px',
                        marginLeft: '20px',
                      }}
                    >
                      {paper['year']} | {paper['venue']}
                    </h6>
                    {/* <div style={{ height: '5px', display: 'flex', marginLeft: '20px' }}>
                      {includedKeyphrases.map((keyphrase) => {
                        return (
                          <div
                            style={{
                              backgroundColor: keyphraseColors[keyphrase],
                              width: `${(1 / includedKeyphrases.length) * 100}%`,
                              height: '100%',
                            }}
                          />
                        )
                      })}
                    </div> */}
                    <p style={{ marginLeft: '20px' }}>{paper['abstract'][0]}</p>
                  </div>
                </>
              )
            })}

            {clickedKeyphrase && (
              <div
                style={{
                  position: 'absolute',
                  zIndex: 999,
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: stringToColor(clickedKeyphrase, 0.8),
                  padding: '0px 15px',
                }}
              >
                <div
                  className="row"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    margin: '20px',
                    textAlign: 'center',
                  }}
                >
                  <IconButton
                    extraClasses="col-sm-3"
                    name="chevron-left"
                    text="Back"
                    onClick={() => setClickedKeyphrase('')}
                  />
                  <h4 style={{ margin: '0px' }} className="col-sm-10">
                    Authored Papers clustered under "{clickedKeyphrase}"
                  </h4>
                </div>
                {activePapers[clickedKeyphrase]['papers'].map((paper) => {
                  return (
                    <>
                      <div style={{ marginBottom: '5px' }}>
                        <a target="_blank" style={{ fontSize: '1.2em' }} href={paper['url']}>
                          <strong>{paper['title']}</strong>
                        </a>
                        {/*<h6
                          style={{
                            color: '#777777',
                            marginBottom: '0px',
                            marginTop: '0px',
                            marginLeft: '20px',
                          }}
                        >
                          {paper['author_names'].join(', ')} | {paper['year']} |{' '}
                          {paper['venue']}
                        </h6>*/}
                        <div style={{ height: '5px', display: 'flex', marginLeft: '20px' }}>
                          {paperWeights[paper['title']].map((kp_wt, index) => {
                            var wt_sum = 0 
                            paperWeights[paper['title']].map((kp_wt) => {
                              wt_sum += kp_wt[Object.keys(kp_wt)[0]]
                            }
                            )
                            // console.log("kp weight", paperWeights[paper['title']])
                            // console.log("sum = ",wt_sum)
                            // console.log(kp_wt)
                            // console.log(index)
                            return (
                              <div
                                style={{
                                  backgroundColor: keyphraseColors[Object.keys(kp_wt)[0]],
                                  width: `${
                                    (kp_wt[Object.keys(kp_wt)[0]] / wt_sum) * 100
                                  }%`,
                                  height: '100%',
                                }}
                              />
                            )
                          })}
                        </div>
                        <p style={{ marginLeft: '20px', marginBottom: '0px' }}>
                          {paper['abstract'][0]}
                        </p>
                      </div>
                    </>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
