import Link from 'next/link'

const FooterMinimal = () => (
  <footer className="container minimal">
    <div className="row">
      <div className="col-xs-12">
        <p className="text-center">
          &copy; 2019 OpenReview.net &nbsp;&bull;&nbsp;
          <Link href="/terms"><a>Terms &amp; Conditions</a></Link> &nbsp;&bull;&nbsp;
          <Link href="/privacy"><a>Privacy Policy</a></Link>
        </p>
      </div>
    </div>
  </footer>
)

export default FooterMinimal
