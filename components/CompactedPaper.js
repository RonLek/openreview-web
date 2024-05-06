const CompactedPaper = ({ title, abstract, author_names, url, year, venue }) => (
  <div>
   <a href={url}><h2>{title}</h2></a>
   <h4>{author_names}, {year}, {venue}</h4>
    <p>{abstract}</p>
  </div>
)


export default CompactedPaper
