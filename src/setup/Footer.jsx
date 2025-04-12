import './Footer.css'

function Footer () {
    return (
        <footer className="footer">
            <div className='seperator'></div>
            <div className="footer-container">
                <div className="social">
                    <a href="https://facebook.com">
                        <img src="/social-facebook.svg" alt="" />
                    </a>
                    <a href="https://instagram.com">
                        <img src="/social-instagram.svg" alt="" />
                    </a>
                    <a href="https://youtube.com">
                        <img src="/social-youtube.svg" alt="" />
                    </a>
                    <a href="https://twitter.com">
                        <img src="/social-twitter.svg" alt="" />
                    </a>
                </div>

                <p className="copyright">© {new Date().getFullYear()} Vietnamese Tax Calculator. All rights reserved.</p>

            </div>
        </footer>
    )
}

export default Footer
